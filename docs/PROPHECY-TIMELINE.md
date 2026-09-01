# The Prophecy Timeline

A scroll-driven, interactive presentation of the prophetic timeline of Daniel and Revelation. Planned as a Phase 4 flagship page alongside Pathfinders, not part of the homepage.

The reference the church brought is [50-jahre-hitparade.ch](https://50-jahre-hitparade.ch/), a WebGL experience plotting fifty years of Swiss chart data in 3D space. What follows takes the ambition from it and rejects the technique, for reasons set out in section 3.

---

## 1. Who it is for, and the tension in that

**Primary audience: someone who has never heard of the 2300 days.** Not a member reviewing doctrine — a visitor who found the page because a friend shared it, or because they were searching after a sermon.

The church also asked for the full scope: Daniel 2, 7, 8 and 11, plus Revelation 12, 13, 17, the seven seals, the seven trumpets and the seven churches. Those two answers pull against each other, and pretending otherwise would produce a page that serves neither. The complete parallel chart is dense expert material; a stranger needs one thread they can follow.

**The resolution is progressive disclosure, not two pages.** There is one spine — the chain from the decree of Artaxerxes to 1844 — which a visitor can follow start to finish without opening anything. Everything else is depth layered onto that spine: additional prophetic lanes that can be revealed, and detail panels on each event. A member studying gets the whole chart. A stranger gets a story. Neither is a degraded version of the other.

The spine, in the order a first-time reader meets it:

| Date         | Event                                          | Source         |
| ------------ | ---------------------------------------------- | -------------- |
| 457 BC       | Decree of Artaxerxes to restore Jerusalem      | Ezra 7         |
| 408 BC       | Jerusalem rebuilt — 7 weeks                    | Daniel 9:25    |
| Autumn AD 27 | Baptism of Jesus — 69 weeks, 483 years         | Daniel 9:25    |
| Spring AD 31 | The crucifixion — "in the midst of the week"   | Daniel 9:26–27 |
| Autumn AD 34 | Stephen stoned; the gospel goes to the nations | Daniel 9:24    |
| 1844         | End of the 2300 years                          | Daniel 8:14    |

---

## 2. The idea worth building

The music-chart site needed three dimensions because its data had four — year, rank, valence, tempo — and no natural reading order. This material is the opposite, and the church's own source spreadsheet already shows why: it is a grid of **parallel columns over one shared time axis**. Daniel 2 beside Daniel 7 beside Daniel 8 beside Daniel 11 beside Revelation 13.

That is the "repeat and expand" principle stated as a layout. And it means the striking thing here is not depth. It is **convergence**.

Four prophecies, written centuries apart and in different symbolic vocabularies, independently naming the same four empires in the same order:

| Empire      | Daniel 2        | Daniel 7                  | Daniel 8           |
| ----------- | --------------- | ------------------------- | ------------------ |
| Babylon     | Head of gold    | Lion with eagle's wings   | —                  |
| Medo-Persia | Chest of silver | Bear raised on one side   | Ram with two horns |
| Greece      | Belly of brass  | Leopard with four wings   | Goat with one horn |
| Rome        | Legs of iron    | Dreadful beast, ten horns | The little horn    |

Scrolling that alignment — watching four independent lanes name the same transition at the same moment on a shared axis — **is the argument**. It does not need explaining in a caption; it is visible. That is the single strongest reason to build this at all, and it is achievable in ordinary DOM and SVG.

The second visual argument is arithmetic. The 490 years are drawn nested inside the 2300 years, **to true scale**, so a reader sees that the 490 is cut off from the beginning of the longer period rather than reading a sentence saying so. The remaining 1810 years are the visible remainder.

---

## 3. Why not WebGL

The reference site states its own disqualifying flaw in its opening banner:

> This 3D web experience uses WebGL and isn't accessible to screen readers. Please hop over to Hitparade Website to browse those songs and get additional info.

They built the beautiful thing, discovered it excluded people, and shipped a second plain version. It also requires landscape orientation and attempts to autoplay audio, which browsers block.

For this project that is disqualifying three times over:

**It contradicts the message.** The homepage says "There's a place for you here." A page about scripture that announces it is not for blind visitors says something else, on the page most likely to be shared with someone genuinely searching.

**The content is text.** This is dated events with scripture references and explanation. Rendering text into a WebGL canvas destroys selection, find-on-page, translation, zoom and screen-reader access, and returns nothing that DOM cannot do here.

**The budget.** The homepage sits at 193.6 KB gzipped against a 196 KB ceiling. A 3D engine is several times the remaining headroom. This page would carry its own route budget regardless, but the question is what the weight buys — and for a timeline, it buys nothing that SVG does not already do.

None of that rules out ambition. The hero already runs scroll-linked springs at three depth rates; the same system drives this.

---

## 4. The scale problem, and the rule that governs it

A true linear axis from 605 BC to the present spends most of its length on empty centuries. Events cluster hard at both ends — 457 BC, 408 BC, AD 27, AD 31, AD 34 at one end; 1798, 1833, 1840, 1844 at the other — with a long quiet stretch between AD 34 and 1798 broken mainly by 538.

The obvious fix is a compressed or logarithmic scale. It is also a trap, and the reason is specific to this page:

> **This page's entire claim is that the dates are exact. A visualization that silently distorts scale while arguing for arithmetic precision undermines itself.**

So the rule: **compression is always shown, never hidden.** Where the axis compresses, it is marked with an explicit visual break and a label saying how many years were folded. A reader can always see where the scale changed and by how much. Piecewise-linear with declared breaks, not a smooth curve that quietly lies.

The two prophetic periods themselves — 2300 years and 490 years — are drawn on a strictly linear scale with no breaks, because their proportion is the argument.

---

## 5. Structure

**The spine.** A continuous vertical scroll. Each event on the spine is a pinned moment: the date, what happened, the scripture, and the arithmetic where there is any. The calculations animate as they resolve — 457 BC, plus 483 years, reaching autumn AD 27 — because watching a sum land is more persuasive than reading its result.

**The lanes.** Parallel tracks beside the spine, one per prophetic passage, each with its own symbolic vocabulary. Collapsed to a single summary lane by default. Opening them is what turns the page from a story into the chart, and the convergence at each empire transition is the payoff.

**The detail panels.** Each event opens to the fuller treatment: the passage in full, the historical sourcing, and the objections. The Amazing Facts guide's handling of Antiochus Epiphanes and of the seven-year gap theory belongs here — a page that presents only the case for its own reading is less persuasive to a thoughtful stranger, not more.

**Tone.** The strongest move in the source material is evidentiary, not accusatory: _the angel said 483 years would reach the Messiah — did it? Yes, and here is the arithmetic._ That is what a seeker responds to. The historicist identifications are stated plainly as what this church believes and why, with sources, and without polemic. Confidence reads as credible; heat reads as an axe being ground, and loses exactly the reader this page is for.

---

## 6. Accessibility

Not a fallback. The same content, differently presented.

Underneath the visualization the document is what it actually is: an ordered sequence of dated events, each with a heading, a date in a `<time>` element, its scripture references, and its explanation. The visual layer positions and animates that markup; it does not replace it.

- **Screen readers** get the full chronology in reading order, including the arithmetic as text.
- **Reduced motion** gets a static infographic — the complete argument, composed as a still.
- **Keyboard** reaches every event and every disclosure, in document order.
- **No JavaScript** still renders the whole timeline as a readable document.
- **Zoom and translation** work, because it is real text.

The contrast gate applies here as everywhere: every date, label and rule is checked by `pnpm check:contrast`.

---

## 7. Implementation notes

- **Its own route** — `/prophecy` or similar — with its own JavaScript budget, recorded in `check:bundle` the same way the homepage is. Nothing here touches the homepage bundle.
- **SVG for the axis, connectors and period bars.** DOM for all text. No canvas.
- **One scroll source.** Like `ChapterAtmosphere` on the homepage, the lanes read from a single shared scroll value rather than each registering a listener.
- **Content lives in Sanity.** Singleton `prophecyPage` (desk: Prophecy timeline). Staff edit dates, copy, objections, and empire alignments. The constellation is derived from those dates — never from x/y/z fields. Until the singleton is published, the page falls back to `src/content/prophecy.ts`.
- **Dates need care.** There is no year zero, dates are BC/AD rather than ISO, and several are seasonal ("autumn AD 27") rather than exact. The `propheticDate` object holds era, year, optional season and a display string.

---

## 8. Status

Built as `/prophecy`. The opening is a scroll flight through the years — SVG constellation, native scroll, a long sticky track so wheel motion is travel through time rather than paging the site. The same chronology remains a document underneath. Staff edit the singleton in Studio; positions are never editorial.
