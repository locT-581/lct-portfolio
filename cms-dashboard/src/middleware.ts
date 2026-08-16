import { defineMiddleware } from "astro:middleware";

/**
 * Astro Middleware to dynamically synchronize Collection entries into Dropdown options:
 * 1. `ec_project_types` -> `projects.project_type`
 * 2. `ec_skill_categories` -> `skills.category`
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // Automatically keep Dropdown options in sync on any admin or manifest interaction
  if (url.pathname.startsWith("/_emdash/")) {
    const emdash = (context.locals as { emdash?: { db?: unknown } }).emdash;
    if (emdash?.db) {
      try {
        const db = emdash.db as {
          executeQuery: (query: unknown) => Promise<unknown>;
        };

        // 1. Sync Project Types -> Projects.project_type
        await db.executeQuery({
          query: {
            kind: "RawNode",
            sqlFragments: [
              `UPDATE _emdash_fields
               SET 
                 validation = NULL,
                 options = (
                   SELECT json_group_array(json_object('value', slug, 'label', name))
                   FROM ec_project_types
                   WHERE locale = 'en' AND status = 'published' AND deleted_at IS NULL
                   ORDER BY order_index ASC
                 )
               WHERE slug = 'project_type';`,
            ],
            parameters: [],
          },
        });

        // 2. Sync Skill Categories -> Skills.category
        await db.executeQuery({
          query: {
            kind: "RawNode",
            sqlFragments: [
              `UPDATE _emdash_fields
               SET 
                 validation = NULL,
                 options = (
                   SELECT json_group_array(json_object('value', slug, 'label', name))
                   FROM ec_skill_categories
                   WHERE locale = 'en' AND status = 'published' AND deleted_at IS NULL
                   ORDER BY order_index ASC
                 )
               WHERE slug = 'category' 
                 AND collection_id = (SELECT id FROM _emdash_collections WHERE slug = 'skills');`,
            ],
            parameters: [],
          },
        });
      } catch {
        // Ignore errors during initial startup or pre-setup
      }
    }
  }

  return next();
});
