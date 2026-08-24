# Product Vision

San Diego Clairemont Seventh-day Adventist Church — new website and digital experience.

This is a greenfield project. The existing site at `sdaclairemont.net` is consulted only as a source of factual information (service times, ministries, contacts, external destinations). Nothing about its structure, styling, or platform carries forward.

---

## 1. Verified church facts

These facts are the factual spine of the site. Everything here was confirmed against the current website and the Adventist Organizational Directory. Anything marked **needs confirmation** must be verified with church staff before launch.

- **Full name:** San Diego Clairemont Seventh-day Adventist Church
- **Address:** 4125 Hathaway St, San Diego, CA 92111-3429
- **Coordinates:** 32.8185, -117.1670
- **Phone:** 858-569-6735
- **Email:** info@sdaclairemont.net
- **Senior pastor:** London L. Lee — 423-486-0080, london.lee@seccsda.org
- **Assistant pastor:** Robert David Berry
- **Membership:** approximately 274
- **Conference:** Southeastern California Conference (SECC), Pacific Union Conference, North American Division
- **Language:** English
- **Directions:** From I-5 to I-805, exit Balboa Avenue and turn west; turn south at the first light onto Hathaway; the church is on the left, across from an elementary school.

### Service times

- **Sabbath School (Bible study):** Saturday 9:30–10:35 AM
- **Divine Worship:** Saturday 10:45 AM
- **Prayer Meeting:** Wednesday 6:30 PM _(from the Adventist directory; needs confirmation that it is still current)_

### Mission statement (current wording)

> Our Mission is to glorify our Creator Jesus Christ, to bring people to Him and into His family, inspiring them to faithfulness by allowing the Holy Spirit to bring about a Christ-like transformation within, through prayer, the study of the Scriptures and the Spirit of Prophecy thus equipping them for discipleship.

The current tagline is _"Developing a loving relationship with Christ and our community."_ This is worth keeping — it is warm, specific, and already theirs.

### Ministries

- **Adventurers** — Pre-K through grade 4, with families. Meets twice monthly on Sundays during the school year. Registered with SECC as a club (San Diego County Adventurers area), main meeting listed as Saturday 9:00 AM. Director: Ron Zecha _(needs confirmation)_.
- **Pathfinders** — grades 5–12. International uniformed organization, run by trained volunteers. Eight classes: Friend, Companion, Explorer, Ranger, Voyager, Guide, Pioneer, Navigator. Director: Jonatan Lopez _(needs confirmation)_. Has a "Safe Kid Policy" — all children's ministry volunteers are screened, trained, and background-checked.
- **Sabbath School** — adult and children's classes, Sabbath 9:30–10:35 AM. Divisions: Beginner (birth–2), Kindergarten (3–4), Primary (5–9), Junior/Youth PowerPoints (10–14), Real Time Faith (13–14), Cornerstone Connections. Zoom option and daily lesson study links exist.
- **CARE Group** — non-denominational young adult Bible study fellowship supported by the church. Free to join. Weekly Bible studies, friendship, community.
- **VBS** — Vacation Bible School. No detail on the current site; content needs to be gathered.

### External destinations to preserve

- **AdventistGiving** — the church's official giving portal. This is the secure payment system; we link out and never process payments ourselves. Exact URL **needs confirmation** from staff.
- **Facebook** — facebook.com/Clairemont-SDA-Church-201001569921760/
- **YouTube channel** — **needs confirmation** (required for the Watch experience and livestream).
- Sabbath School lesson study resources (Adult, and the children's divisions) on the General Conference / SECC properties.
- Pathfinder and Adventurer registration forms — currently external; may move into Supabase later.

---

## 2. Who this site is for

Ordered by how much the design should bend toward them.

1. **The person who has never walked in.** Searching "adventist church near me" or "church in Clairemont." They need, within five seconds: is this a real, warm, active congregation, when do they meet, and what will happen if I show up? They are often nervous. The site's primary emotional job is to lower the cost of a first visit.
2. **Parents of children and teens.** Evaluating Adventurers, Pathfinders, and VBS. They want to see actual kids doing actual things, plus safety credibility (the Safe Kid Policy is a genuine asset — surface it, do not bury it).
3. **Current members, ~274 of them.** They come for practical reasons: what is happening this Sabbath, who is preaching, what is the bulletin, when is the next event. Speed and clarity matter more than atmosphere for this group. Many are long-time members; the site must be legible and comfortable, not fashionable.
4. **Young adults.** The CARE Group audience. They judge institutional credibility partly on design quality. This is the group most likely to be lost to a dated website.
5. **Ministry leaders and staff.** They need to publish content without asking a developer. If updating "This Sabbath" is hard, it will stop happening in three weeks, and the site's most valuable feature will rot.

---

## 3. What the experience should feel like

The requested adjectives — welcoming, spiritual, peaceful, cinematic, warm, modern, human, hopeful, interactive, intentionally designed — resolve into four design commitments.

**Light, not darkness.** The church's center of gravity is Sabbath morning. The site's dominant register is morning light on warm paper. Darkness is used deliberately and sparingly, and it means something (see the vespers motif in `DESIGN-SYSTEM.md`).

**Photography carries the emotion; typography carries the meaning.** Motion carries neither. Motion only reveals, sequences, and gives depth. If every animation were removed, the site would still be beautiful — it would just be still. That is the test.

**Human, not institutional.** Real faces, real names, first-person voice. "We'd love to meet you" rather than "Visitors are welcome." No stock-photo handshakes, no abstract crosses floating on gradients.

**Quiet confidence.** Restraint reads as spiritual seriousness. A single hairline rule and a well-set paragraph communicate more care than a glowing card. The site should feel like it was made by someone who loves this church, not assembled from a template.

---

## 4. Explicit non-goals

- Not a SaaS, fintech, crypto, or AI-startup landing page. No dark hero with a glowing gradient orb, no bento grids, no "Trusted by" logo wall.
- Not a generic church template. No stacked identical rounded cards, no three-column "Connect / Grow / Serve" icon row, no full-width scripture-over-a-blurred-sunset banner.
- Not a corporate nonprofit site. No impact-statistics dashboard as the emotional centerpiece.
- **No payment processing.** Giving explains and links to AdventistGiving. We never touch card data.
- **No public account registration** at launch. Accounts are invitation-only.
- No public video hosting in our own infrastructure. YouTube carries the video; Sanity carries the metadata; we control presentation.
- No scroll hijacking, no cursor-following pets, no sound on load, no autoplaying audio, no entrance animation on every element.
- No custom admin UI that duplicates what Sanity Studio already does well.

---

## 5. Success criteria

**Experiential.** A first-time visitor can find service time, address, and what to expect without scrolling past the first two chapters. A parent can find Pathfinders and see real photos of the club within two clicks. Removing all motion leaves a site that still looks intentional.

**Editorial.** A non-technical staff member can update "This Sabbath" — speaker, sermon title, scripture, bulletin, livestream link — in under five minutes, with no deployment, and see it live. This is the single most important operational outcome. A dynamic Sabbath block that nobody updates is worse than a static one.

**Technical.** Lighthouse mobile performance 90+, LCP under 2.5s on a mid-tier phone over 4G, CLS under 0.05, INP under 200ms. WCAG 2.1 AA. Every route usable with keyboard only and with `prefers-reduced-motion: reduce`.

**Ownership.** At handover the church controls the GitHub repository, Vercel project, Supabase project, Sanity project, domain, and analytics. No credential, URL, or ID is hardcoded anywhere in the source. Migration is documented and rehearsable.

---

## 6. Known open questions

Tracked here so they do not get lost. None of them block Phase 1.

- Exact AdventistGiving URL for this congregation.
- Official YouTube channel and whether livestreams are scheduled there.
- Whether Wednesday 6:30 PM prayer meeting is still current, and whether it is in person, Zoom, or both.
- Current Pathfinder and Adventurer director names and contact preferences.
- VBS details: dates, ages, registration flow.
- Whether the church wants a Spanish-language version. Not in scope now, but it affects whether Sanity is configured for internationalization early. Cheaper to decide before content entry than after.
- Whether `sdaclairemont.net` is the domain to keep, and who currently controls its DNS.
- Whether staff want in-app registration for Pathfinders/Adventurers or prefer to keep using external forms.
