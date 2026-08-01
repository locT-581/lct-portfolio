import assert from "node:assert/strict";
import { test } from "node:test";
import { constructMetadata, constructUrl, getSiteUrl } from "./seo.ts";

test("getSiteUrl returns process.env.NEXT_PUBLIC_SITE_URL or fallback without trailing slash", () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    assert.strictEqual(getSiteUrl(), "https://loct.dev");

    process.env.NEXT_PUBLIC_SITE_URL = "https://custom-domain.com/";
    assert.strictEqual(getSiteUrl(), "https://custom-domain.com");
  } finally {
    process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
  }
});

test("constructUrl builds correct locale path URLs without duplicate slashes", () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    process.env.NEXT_PUBLIC_SITE_URL = "https://loct.dev";
    assert.strictEqual(constructUrl("en", ""), "https://loct.dev/en");
    assert.strictEqual(constructUrl("vi", "/projects/"), "https://loct.dev/vi/projects");
    assert.strictEqual(constructUrl("en", "blog/my-article"), "https://loct.dev/en/blog/my-article");
  } finally {
    process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
  }
});

test("constructMetadata returns metadata object with canonical and hreflang alternates", () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    process.env.NEXT_PUBLIC_SITE_URL = "https://loct.dev";
    const meta = constructMetadata({
      locale: "en",
      path: "projects",
      title: "Projects",
      description: "My work",
    });

    assert.strictEqual(meta.title, "Projects");
    assert.strictEqual(meta.description, "My work");
    assert.strictEqual(meta.alternates?.canonical, "https://loct.dev/en/projects");
    
    const languages = meta.alternates?.languages as Record<string, string>;
    assert.strictEqual(languages?.en, "https://loct.dev/en/projects");
    assert.strictEqual(languages?.vi, "https://loct.dev/vi/projects");
    assert.strictEqual(languages?.["x-default"], "https://loct.dev/en/projects");
  } finally {
    process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
  }
});
