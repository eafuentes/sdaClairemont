/**
 * Primary navigation as a small tree, not a flat list.
 *
 * The top-level labels match `siteSettings.primaryNav` so the bar and the CMS
 * stay in the same order. Children and the drawer intros live here because they
 * are information architecture, not something staff should retype in Studio.
 */
export interface NavLinkItem {
  label: string
  href: string
  /** One short line in the drawer, under the name. */
  hint?: string
  external?: boolean
}

export interface NavSection {
  label: string
  href: string
  /** A sentence that belongs to this section of the church, not a marketing blurb. */
  intro: string
  links: NavLinkItem[]
}

export const primaryNav: NavSection[] = [
  {
    label: 'Visit',
    href: '/visit',
    intro: 'Come on a Saturday morning. You do not need to know anyone yet.',
    links: [
      { label: 'Plan your visit', href: '/visit', hint: 'Times, parking, and what to expect.' },
      { label: 'This Sabbath', href: '/this-sabbath', hint: 'Who is speaking, and when we gather.' },
      { label: 'Share a prayer request', href: '/prayer', hint: 'It goes to a small team, not this website.' },
    ],
  },
  {
    label: 'About',
    href: '/about',
    intro: 'A congregation on Hathaway Street, across from the elementary school.',
    links: [
      { label: 'About us', href: '/about', hint: 'Who we are, in our own words.' },
      { label: 'Leadership', href: '/about/leadership', hint: 'Pastor Lee and Pastor Berry.' },
      { label: 'What we believe', href: '/about/beliefs', hint: 'Sabbath, Scripture, and the hope we wait for.' },
      { label: 'The years, drawn to scale', href: '/prophecy', hint: 'Daniel and Revelation, without the spectacle.' },
    ],
  },
  {
    label: 'Ministries',
    href: '/ministries',
    intro: 'There is somewhere here for your whole family.',
    links: [
      { label: 'Pathfinders', href: '/ministries/pathfinders', hint: 'Grades 5–12. Camping, service, skill.' },
      { label: 'Adventurers', href: '/ministries/adventurers', hint: 'Pre-K through grade 4, with families.' },
      { label: 'Sabbath School', href: '/ministries/sabbath-school', hint: 'Bible study, every age, 9:30 AM.' },
      { label: 'CARE Group', href: '/ministries/care-group', hint: 'Young adults. Open to anyone.' },
      { label: 'Vacation Bible School', href: '/ministries/vacation-bible-school', hint: 'One week each summer.' },
      { label: 'All ministries', href: '/ministries' },
    ],
  },
  {
    label: 'Events',
    href: '/events',
    intro: 'Lunch after worship, and the things that gather us between Sabbaths.',
    links: [
      { label: 'What’s coming', href: '/events', hint: 'The next few weeks, as a list.' },
    ],
  },
  {
    label: 'Watch',
    href: '/watch',
    intro: 'If you cannot be here, be here anyway.',
    links: [
      { label: 'Messages', href: '/watch', hint: 'The recent sermons, to watch back.' },
      { label: 'This Sabbath', href: '/this-sabbath', hint: 'The program for this week.' },
    ],
  },
]
