import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";

/**
 * Astro Middleware to handle Lighthouse JSON report extraction & upload optimizations
 */
interface ExtractedMetrics {
  lighthouseScore: number | null;
  metricLcp: string | null;
  metricCls: string | null;
  metricTtfb: string | null;
  auditMetadata: {
    testedAt: string;
    device: string;
    network: string;
    engine: string;
    location: string;
  };
}

function extractLighthouseMetrics(
  parsed: Record<string, unknown>,
): ExtractedMetrics | null {
  if (!parsed || typeof parsed !== "object") return null;

  // 1. Performance Score (0 - 100)
  const categories = parsed.categories as
    | Record<string, { score?: number | null }>
    | undefined;
  const perfCategory = categories?.performance;
  const lighthouseScore =
    typeof perfCategory?.score === "number"
      ? Math.round(perfCategory.score * 100)
      : null;

  const audits = parsed.audits as
    | Record<
        string,
        { displayValue?: string; numericValue?: number; score?: number }
      >
    | undefined;

  // 2. Largest Contentful Paint (LCP)
  const lcpAudit = audits?.["largest-contentful-paint"];
  const metricLcp =
    typeof lcpAudit?.numericValue === "number"
      ? `${(lcpAudit.numericValue / 1000).toFixed(1)}s`
      : lcpAudit?.displayValue || null;

  // 3. Cumulative Layout Shift (CLS)
  const clsAudit = audits?.["cumulative-layout-shift"];
  const metricCls =
    typeof clsAudit?.numericValue === "number"
      ? clsAudit.numericValue.toFixed(2)
      : clsAudit?.displayValue || null;

  // 4. Time to First Byte (TTFB) / Server Response Time
  const ttfbAudit =
    audits?.["server-response-time"] || audits?.["time-to-first-byte"];
  const metricTtfb =
    typeof ttfbAudit?.numericValue === "number"
      ? `${Math.round(ttfbAudit.numericValue)}ms`
      : ttfbAudit?.displayValue || null;

  // 5. Audit Metadata
  const testedAt = parsed.fetchTime
    ? String(parsed.fetchTime).split("T")[0]
    : new Date().toISOString().split("T")[0];

  const configSettings = parsed.configSettings as
    | {
        formFactor?: string;
        throttlingMethod?: string;
        throttling?: { rttMs?: number; throughputKbps?: number };
      }
    | undefined;

  const isDesktop = configSettings?.formFactor === "desktop";
  const device = isDesktop
    ? "Emulated Desktop (Chrome)"
    : "Emulated Mobile (Moto G4)";

  const throttlingMethod = configSettings?.throttlingMethod || "simulate";
  const rtt = configSettings?.throttling?.rttMs;
  const network = isDesktop
    ? `Desktop Broadband (${throttlingMethod}${rtt ? `, ${rtt}ms RTT` : ""})`
    : `Mobile Network (${throttlingMethod}${rtt ? `, ${rtt}ms RTT` : ""})`;

  const version = parsed.lighthouseVersion
    ? `v${parsed.lighthouseVersion}`
    : "v13.x";

  const auditMetadata = {
    testedAt,
    device,
    network,
    engine: `Google Lighthouse ${version}`,
    location: "Global Edge Server (Cloudflare)",
  };

  return {
    lighthouseScore,
    metricLcp,
    metricCls,
    metricTtfb,
    auditMetadata,
  };
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // 0. Handle CORS preflight for all media / API requests (needed for Lighthouse Viewer, PageSpeed, etc.)
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // 1. Direct serve JSON media files with public CORS and inline disposition
  if (
    context.request.method === "GET" &&
    (url.pathname.includes("/api/media") || url.pathname.endsWith(".json"))
  ) {
    const storageKey = url.pathname.split("/").pop();
    if (storageKey?.endsWith(".json")) {
      try {
        const cloudflareEnv = env as unknown as {
          MEDIA?: {
            get: (
              key: string,
            ) => Promise<{
              body: ReadableStream;
            } | null>;
          };
        };

        if (cloudflareEnv?.MEDIA) {
          const r2Obj = await cloudflareEnv.MEDIA.get(storageKey);
          if (r2Obj) {
            return new Response(r2Obj.body, {
              status: 200,
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Cache-Control": "public, max-age=31536000, immutable",
                "Content-Disposition": "inline",
              },
            });
          }
        }
      } catch (r2Err) {
        console.error("[Media Serve Error]", r2Err);
      }
    }
  }

  // 2. Intercept .json media uploads to bypass restrictive MIME checks and save directly to R2
  if (
    (url.pathname === "/_emdash/api/media" ||
      url.pathname.endsWith("/api/media")) &&
    context.request.method === "POST"
  ) {
    try {
      const clonedRequest = context.request.clone();
      const formData = await clonedRequest.formData();
      const fileEntry = formData.get("file");
      const file = fileEntry instanceof File ? fileEntry : null;

      if (
        file &&
        (file.name.toLowerCase().endsWith(".json") ||
          file.type === "application/json" ||
          file.type === "text/json")
      ) {
        const emdash = (
          context.locals as unknown as {
            emdash?: {
              storage?: {
                upload: (params: {
                  key: string;
                  body: Uint8Array;
                  contentType: string;
                }) => Promise<unknown>;
              };
              handleMediaCreate?: (params: {
                filename: string;
                mimeType: string;
                size: number;
                storageKey: string;
                contentHash: string;
              }) => Promise<Record<string, unknown>>;
            };
          }
        ).emdash;

        if (emdash?.storage && emdash?.handleMediaCreate) {
          const buffer = new Uint8Array(await file.arrayBuffer());

          // Compute SHA-256 hash
          const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const contentHash = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

          // Generate storage key
          const id = crypto.randomUUID().replace(/-/g, "");
          const storageKey = `${id}.json`;

          // Upload raw original file to R2 storage
          await emdash.storage.upload({
            key: storageKey,
            body: buffer,
            contentType: "application/json",
          });

          // Register in media database
          const createdItem = await emdash.handleMediaCreate({
            filename: file.name.toLowerCase().endsWith(".json")
              ? file.name
              : `${file.name}.json`,
            mimeType: "application/json",
            size: buffer.byteLength,
            storageKey,
            contentHash,
          });

          const urlPath = `/api/media/${storageKey}`;
          const itemWithUrl = { ...createdItem, url: urlPath };

          return new Response(
            JSON.stringify({
              success: true,
              data: {
                item: itemWithUrl,
                deduplicated: false,
              },
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }
    } catch (err) {
      console.error("[Middleware JSON Upload Error]", err);
    }
  }

  // 2. Safely hook into EmDash runtime if available
  try {
    const emdashObj = (context.locals as unknown as Record<string, unknown>)
      ?.emdash as
      | {
          handleContentUpdate?: (...args: unknown[]) => Promise<unknown>;
          __lighthouse_hooked?: boolean;
        }
      | undefined;

    if (
      emdashObj &&
      typeof emdashObj.handleContentUpdate === "function" &&
      !emdashObj.__lighthouse_hooked
    ) {
      emdashObj.__lighthouse_hooked = true;
      const origUpdate = emdashObj.handleContentUpdate;

      emdashObj.handleContentUpdate = async function (
        this: unknown,
        ...args: unknown[]
      ) {
        try {
          const collection = args[0] as string | undefined;
          const body = args[2] as
            | { data?: Record<string, unknown> }
            | undefined;

          if (collection === "projects" && body?.data?.lighthouse_report_file) {
            const fileVal = body.data.lighthouse_report_file;
            let storageKey: string | null = null;

            if (typeof fileVal === "string" && fileVal.includes(".json")) {
              storageKey = fileVal
                .replace("/_emdash/api/media/file/", "")
                .replace("/api/media/", "");
            } else if (typeof fileVal === "object" && fileVal !== null) {
              const obj = fileVal as {
                storageKey?: string;
                meta?: { storageKey?: string };
              };
              storageKey = obj.meta?.storageKey || obj.storageKey || null;
            }

            if (storageKey) {
              let jsonText = "";
              try {
                const cloudflareEnv = env as unknown as {
                  MEDIA?: {
                    get: (
                      key: string,
                    ) => Promise<{ text: () => Promise<string> } | null>;
                  };
                };

                if (cloudflareEnv?.MEDIA) {
                  const r2Obj = await cloudflareEnv.MEDIA.get(storageKey);
                  if (r2Obj) {
                    jsonText = await r2Obj.text();
                  }
                }
              } catch {
                // Ignore R2 read error
              }

              if (jsonText) {
                const parsedReport = JSON.parse(jsonText) as Record<
                  string,
                  unknown
                >;
                const extracted = extractLighthouseMetrics(parsedReport);

                if (extracted) {
                  body.data.lighthouse_score = extracted.lighthouseScore;
                  body.data.metric_lcp = extracted.metricLcp;
                  body.data.metric_cls = extracted.metricCls;
                  body.data.metric_ttfb = extracted.metricTtfb;
                  body.data.audit_metadata = extracted.auditMetadata;
                }
              }
            }
          }
        } catch (hookErr) {
          console.error("[Lighthouse Hook Error]", hookErr);
        }

        return origUpdate.apply(this, args);
      };
    }
  } catch (err) {
    console.error("[Middleware Runtime Setup Error]", err);
  }

  // 3. Automatically keep Dropdown options in sync for Project Types & Skill Categories
  if (
    url.pathname.startsWith("/_emdash/admin") ||
    url.pathname.includes("/_emdash/api/content") ||
    url.pathname.includes("/_emdash/manifest")
  ) {
    try {
      const cloudflareEnv = env as unknown as {
        DB?: {
          prepare: (query: string) => {
            run: () => Promise<unknown>;
          };
        };
      };

      if (cloudflareEnv?.DB) {
        // 1. Sync Project Types -> projects.project_type
        await cloudflareEnv.DB.prepare(`
          UPDATE _emdash_fields
          SET 
            validation = NULL,
            options = (
              SELECT json_group_array(json_object('value', slug, 'label', name))
              FROM ec_project_types
              WHERE locale = 'en' AND status = 'published' AND deleted_at IS NULL
              ORDER BY order_index ASC
            )
          WHERE slug = 'project_type';
        `).run();

        // 2. Sync Skill Categories -> skills.category
        await cloudflareEnv.DB.prepare(`
          UPDATE _emdash_fields
          SET 
            validation = NULL,
            options = (
              SELECT json_group_array(json_object('value', slug, 'label', name))
              FROM ec_skill_categories
              WHERE locale = 'en' AND status = 'published' AND deleted_at IS NULL
              ORDER BY order_index ASC
            )
          WHERE slug = 'category' 
            AND collection_id = (SELECT id FROM _emdash_collections WHERE slug = 'skills');
        `).run();
      }
    } catch (syncErr) {
      console.error("[Dropdown Sync Error]", syncErr);
    }
  }

  return next();
});
