import type { SchemaTypeDefinition } from 'sanity'

import { announcement } from './documents/announcement'
import { event } from './documents/event'
import { gallery } from './documents/gallery'
import { homePage } from './documents/home-page'
import { ministry } from './documents/ministry'
import { page } from './documents/page'
import { person } from './documents/person'
import { resource } from './documents/resource'
import { sabbathProgram } from './documents/sabbath-program'
import { sermon } from './documents/sermon'
import { siteSettings } from './documents/site-settings'
import { testimonial } from './documents/testimonial'
import { address } from './objects/address'
import { blockContent } from './objects/block-content'
import { imageWithAlt } from './objects/image-with-alt'
import { cta, link } from './objects/link'
import {
  meetingSchedule,
  pathfinderClass,
  statistic,
  timelineEntry,
} from './objects/ministry-details'
import { scriptureRef } from './objects/scripture-ref'
import { seo } from './objects/seo'
import { serviceTime } from './objects/service-time'
import { videoRef } from './objects/video-ref'

/** Types an editor creates directly. Everything else is nested inside one of these. */
export const documentTypes = [
  siteSettings,
  homePage,
  sabbathProgram,
  event,
  ministry,
  sermon,
  person,
  announcement,
  gallery,
  testimonial,
  page,
  resource,
]

/** Reusable objects. Never created on their own; always a field on something. */
export const objectTypes = [
  imageWithAlt,
  blockContent,
  seo,
  link,
  cta,
  serviceTime,
  address,
  scriptureRef,
  meetingSchedule,
  videoRef,
  statistic,
  timelineEntry,
  pathfinderClass,
]

/** The two documents that must exist exactly once, pinned in the desk structure. */
export const SINGLETON_TYPES = new Set(['siteSettings', 'homePage'])

export const schemaTypes: SchemaTypeDefinition[] = [...documentTypes, ...objectTypes]
