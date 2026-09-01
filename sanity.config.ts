'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'

import { presentationDocuments, presentationLocations } from '@/sanity/presentation'
import { SINGLETON_TYPES, schemaTypes } from '@/sanity/schemaTypes'
import { structure } from '@/sanity/structure'

/*
 * Read directly rather than through `sanityEnv()`, which throws on missing values.
 * This module is imported by the Studio route at build time, and a clean checkout with
 * no .env.local has to keep building — the same reason environment validation is lazy
 * and grouped in src/env.ts. The Studio itself fails visibly if these are wrong, which
 * is the right place for that failure.
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-01-01'

/**
 * Sanity Studio, mounted at /studio inside this app.
 *
 * Same origin as the site, which is what makes Presentation and Visual Editing work
 * without a second deployment to configure and hand over. A dedicated studio subdomain
 * stays available later without touching this file.
 */
export default defineConfig({
  name: 'sdaClairemont',
  title: 'San Diego Clairemont SDA Church',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      resolve: {
        mainDocuments: presentationDocuments,
        locations: presentationLocations,
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    /*
     * Singletons are removed from the global "create" menu. Without this an editor can
     * make a second Site Settings from the plus button, and from then on the site reads
     * one document while someone edits the other — a failure that looks like the CMS
     * silently not saving.
     */
    templates: (previous) => previous.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    /*
     * And the matching half: no duplicating or deleting the only copy. Publish and
     * discard-changes stay, because those are the actions an editor legitimately needs.
     */
    actions: (previous, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? previous.filter(
            ({ action }) => action && !['duplicate', 'delete', 'unpublish'].includes(action),
          )
        : previous,
  },
})
