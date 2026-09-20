import type { ContentImage } from '@/types/content'

/**
 * Church-life photographs used by pathway tiles and interior sections.
 *
 * One place so a swap of foyer or sanctuary does not get retyped in three files.
 */
export const lifePhotos = {
  foyer: {
    src: '/images/life/foyer-welcome.webp',
    alt: 'The Clairemont foyer: three bulletin boards on a brick wall, a Welcome To Church sign, and an open Bible on a carved wooden table.',
    width: 1024,
    height: 682,
    provenance: 'church-photo',
  },
  congregation: {
    src: '/images/life/congregation.webp',
    alt: 'The Clairemont congregation seated in the pews during the service, photographed from behind.',
    width: 1024,
    height: 682,
    provenance: 'church-photo',
  },
  sanctuary: {
    src: '/images/life/sanctuary-service.webp',
    alt: 'Pastor London L. Lee preaching from the platform in the Clairemont sanctuary, the congregation in the pews in the foreground.',
    width: 1024,
    height: 682,
    provenance: 'church-photo',
  },
  bible: {
    src: '/images/life/open-bible.webp',
    alt: 'A study Bible open to Romans, held in the pew during worship.',
    width: 768,
    height: 1024,
    provenance: 'church-photo',
  },
  kitchen: {
    src: '/images/life/fellowship-kitchen.webp',
    alt: 'Clairemont members gathered around the fellowship kitchen island after the service.',
    width: 1024,
    height: 682,
    provenance: 'church-photo',
  },
  flowers: {
    src: '/images/life/altar-flowers.webp',
    alt: 'A pink and white floral arrangement in a wooden box on the Clairemont sanctuary platform, the pulpit behind it.',
    width: 1024,
    height: 682,
    provenance: 'church-photo',
  },
} satisfies Record<string, ContentImage>
