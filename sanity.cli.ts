import { defineCliConfig } from 'sanity/cli'

/**
 * Config for the Sanity CLI — schema validation, typegen, and dataset management.
 *
 * Separate from `sanity.config.ts`, which configures the Studio itself. This one is read
 * by command-line tooling that runs outside the browser, which is why it holds no
 * plugins or schema.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
  // The Studio is served by Next at /studio, not built or deployed by the Sanity CLI.
  studioHost: undefined,
})
