import type { Metadata } from 'next'

/** Title and optional description for an interior page. */
export function pageMetadata(title: string, description?: string): Metadata {
  return {
    title,
    ...(description ? { description } : {}),
  }
}
