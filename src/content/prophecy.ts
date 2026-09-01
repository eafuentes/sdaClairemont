import type { ProphecyPageContent, PropheticDate } from '@/types/content'

const autumn457: PropheticDate = {
  era: 'bc',
  year: 457,
  season: 'autumn',
  display: '457 BC',
}

const rebuilt408: PropheticDate = {
  era: 'bc',
  year: 408,
  display: '408 BC',
}

const autumn27: PropheticDate = {
  era: 'ad',
  year: 27,
  season: 'autumn',
  display: 'Autumn AD 27',
}

const spring31: PropheticDate = {
  era: 'ad',
  year: 31,
  season: 'spring',
  display: 'Spring AD 31',
}

const autumn34: PropheticDate = {
  era: 'ad',
  year: 34,
  season: 'autumn',
  display: 'Autumn AD 34',
}

const autumn1844: PropheticDate = {
  era: 'ad',
  year: 1844,
  season: 'autumn',
  display: '1844',
}

/**
 * Fixture for the prophecy timeline. Used until the Sanity singleton `prophecyPage`
 * is published. See docs/PROPHECY-TIMELINE.md.
 *
 * Tone is evidentiary: the angel named a length of time; here is the arithmetic.
 * Historicist identifications are stated as what this church believes, with the
 * usual objections opened rather than hidden.
 */
export const prophecyPage: ProphecyPageContent = {
  title: 'Unto two thousand and three hundred days.',
  eyebrow: 'Daniel 8:14',
  lede: 'An angel named a length of time. This page draws that length to scale — from a Persian king’s decree to 1844 — so you can see the proportion rather than only read it.',
  scripture: {
    reference: 'Daniel 8:14',
    translation: 'KJV',
    text: 'And he said unto me, Unto two thousand and three hundred days; then shall the sanctuary be cleansed.',
  },
  intro: [
    'A first-time reader does not need the whole chart of Daniel and Revelation. They need one thread they can follow. That thread is here: seventy weeks cut from the start of twenty-three hundred years, ending when the Messiah appears, and the longer period ending in 1844.',
    'This is the historicist reading this congregation holds. The dates are treated as exact, so the drawing is too. Where the page has to fold empty centuries, the fold is labeled. The two prophetic periods themselves are never folded.',
  ],
  periods: [
    {
      id: '2300',
      label: '2,300 years',
      years: 2300,
      start: autumn457,
      end: autumn1844,
    },
    {
      id: '490',
      label: '490 years',
      years: 490,
      start: autumn457,
      end: autumn34,
      nestedIn: '2300',
    },
  ],
  spine: [
    {
      id: 'decree',
      date: autumn457,
      title: 'The decree that starts the clock',
      scripture: { reference: 'Ezra 7', translation: 'KJV' },
      summary:
        'Artaxerxes I sends Ezra to restore Jerusalem. Adventists read this autumn 457 BC decree as the beginning of both the 2,300 years and the 70 weeks cut from them.',
      explanation: [
        'Daniel 9 says the seventy weeks begin with “the going forth of the commandment to restore and to build Jerusalem.” Three Persian decrees touch that work. The one that actually funds and authorizes the restoration of the city and its worship is Ezra 7, issued in the seventh year of Artaxerxes — 457 BC.',
        'From this autumn the two periods run together: 2,300 years to 1844, and 490 years — seventy weeks of years — to the Messiah.',
      ],
    },
    {
      id: 'rebuilt',
      date: rebuilt408,
      title: 'Jerusalem rebuilt — seven weeks',
      scripture: { reference: 'Daniel 9:25', translation: 'KJV' },
      summary:
        'Seven weeks, forty-nine years, from the decree to a rebuilt city. 457 BC plus 49 years is 408 BC.',
      arithmetic: {
        from: '457 BC',
        plus: '49 years',
        result: '408 BC',
        note: 'Seven weeks of years. The street and the wall are rebuilt, even in troublous times.',
      },
      explanation: [
        'Gabriel splits the sixty-nine weeks that reach the Messiah: seven, then sixty-two. The first seven are the rebuilding. They are not a metaphor for a later age. They are forty-nine years on the same clock that started in 457.',
      ],
    },
    {
      id: 'baptism',
      date: autumn27,
      title: 'The baptism of Jesus — sixty-nine weeks',
      scripture: { reference: 'Daniel 9:25', translation: 'KJV' },
      summary:
        'Sixty-nine weeks, 483 years, from the decree reach the Anointed One. There is no year zero: 457 plus 483 is autumn AD 27.',
      arithmetic: {
        from: '457 BC',
        plus: '483 years',
        result: 'Autumn AD 27',
        note: 'Sixty-nine weeks of years. No year zero, so the sum lands on 27, not 26.',
      },
      explanation: [
        '“Unto the Messiah the Prince shall be seven weeks, and threescore and two weeks.” Four hundred and eighty-three years from autumn 457 BC is autumn AD 27. That is the year this church reads as Jesus’ baptism in the Jordan, when He was anointed by the Spirit and the seventy-first week of years began.',
        'The question a seeker can test is not a slogan. The angel said 483 years would reach the Messiah. Did they? The arithmetic says yes.',
      ],
    },
    {
      id: 'crucifixion',
      date: spring31,
      title: 'The crucifixion — in the midst of the week',
      scripture: { reference: 'Daniel 9:26–27', translation: 'KJV' },
      summary:
        'Three and a half years after the baptism, in the midst of the seventieth week, Messiah is cut off. Spring AD 31.',
      arithmetic: {
        from: 'Autumn AD 27',
        plus: '3½ years',
        result: 'Spring AD 31',
        note: '“In the midst of the week he shall cause the sacrifice and the oblation to cease.”',
      },
      explanation: [
        'The seventieth week is seven years. Its midpoint is three and a half years after the baptism — the spring of AD 31, at Passover. This church reads the crucifixion there: the true sacrifice ends the meaning of the temple offerings, not by a later antichrist, but by Christ Himself.',
      ],
      objections: [
        {
          title: 'What about a gap before a future seven-year tribulation?',
          paragraphs: [
            'A common reading inserts a gap of two thousand years between the sixty-ninth week and the seventieth, and places that last week at the end of time. Gabriel does not mention a gap. The seventy weeks are “determined” — cut off as one period — from the same decree that starts the 2,300 years.',
            'If the seventieth week is delayed, the crucifixion leaves the prophecy, and the “midst of the week” has to be reassigned to someone else. This church keeps the week intact: AD 27 to AD 34, with the cross in the middle, because that is where the arithmetic already points.',
          ],
        },
      ],
    },
    {
      id: 'stephen',
      date: autumn34,
      title: 'The gospel goes to the nations',
      scripture: { reference: 'Daniel 9:24', translation: 'KJV' },
      summary:
        'The seventieth week closes in autumn AD 34. Stephen is stoned; the exclusive work for Israel ends; the remaining 1,810 years of the 2,300 continue.',
      arithmetic: {
        from: 'Autumn AD 27',
        plus: '7 years',
        result: 'Autumn AD 34',
        note: 'The seventy weeks, 490 years, are complete. 2,300 − 490 leaves 1,810.',
      },
      explanation: [
        'Seventy weeks were given “to finish the transgression” for Daniel’s people. This church reads the stoning of Stephen and the gospel’s turn to the nations as that close. The shorter period is finished. The longer one is not. From this autumn, 1,810 years remain.',
      ],
    },
    {
      id: 'sanctuary',
      date: autumn1844,
      title: 'The sanctuary cleansed',
      scripture: { reference: 'Daniel 8:14', translation: 'KJV' },
      summary:
        'Autumn 457 BC plus 2,300 years is autumn 1844. The remaining 1,810 years after AD 34 end here.',
      arithmetic: {
        from: '457 BC',
        plus: '2,300 years',
        result: '1844',
        note: 'The same clock. No year zero. The 490 were cut from the beginning, not added on at the end.',
      },
      explanation: [
        'Daniel 8 asked how long the little horn would trample the sanctuary. The answer was 2,300 evenings and mornings, then the sanctuary would be cleansed. Using the day-for-a-year reading this church holds with the rest of Daniel 8 and 9, that span runs from the 457 BC decree to 1844.',
        'Adventists do not read 1844 as the end of the world. They read it as the beginning of a work in heaven — the cleansing of the heavenly sanctuary, the judgment that precedes Christ’s return. The disappointment of those who expected Jesus to appear on earth that year is part of our own story. The date was right. The event was larger than a sky they could see.',
      ],
      objections: [
        {
          title: 'Was the little horn only Antiochus Epiphanes?',
          paragraphs: [
            'A careful preterist reading applies Daniel 8’s little horn to Antiochus IV, who desecrated the Jerusalem temple in the 160s BC. He is a real tyrant, and he belongs in the Greek story. This church does not think he exhausts the vision.',
            'The ram and the goat are named as Medo-Persia and Greece. The little horn comes out of their aftermath and becomes “exceeding great” toward the south, the east, and the pleasant land — greater than Alexander, which Antiochus was not. The 2,300 days, if they are ordinary days, do not match his roughly three-year persecution. The vision is said to belong to “the time of the end.”',
            'So the historicist reading continues the horn through pagan Rome and then the medieval papacy, and lets the 2,300 years run their full length to 1844. Antiochus is a type. He is not the whole.',
          ],
        },
      ],
    },
  ],
  fold: {
    beforeEventId: 'sanctuary',
    yearsFolded: 1810,
    label: '1,810 years folded here',
    explanation:
      'From autumn AD 34 to autumn 1844 the spine has no event. Drawn linearly, those years would leave this page. They are folded, and the fold is marked, because a page that argues from exact dates cannot quietly change scale.',
  },
  empires: [
    {
      empire: 'Babylon',
      span: '605–539 BC',
      start: { era: 'bc', year: 605, display: '605 BC' },
      end: { era: 'bc', year: 539, display: '539 BC' },
      daniel2: 'Head of gold',
      daniel7: 'Lion with eagle’s wings',
      daniel8: '—',
      daniel11: 'The first king',
      revelation: '—',
    },
    {
      empire: 'Medo-Persia',
      span: '539–331 BC',
      start: { era: 'bc', year: 539, display: '539 BC' },
      end: { era: 'bc', year: 331, display: '331 BC' },
      daniel2: 'Chest of silver',
      daniel7: 'Bear raised on one side',
      daniel8: 'Ram with two horns',
      daniel11: 'Three more kings, then a richer fourth',
      revelation: '—',
    },
    {
      empire: 'Greece',
      span: '331–168 BC',
      start: { era: 'bc', year: 331, display: '331 BC' },
      end: { era: 'bc', year: 168, display: '168 BC' },
      daniel2: 'Belly of brass',
      daniel7: 'Leopard with four wings',
      daniel8: 'Goat with one horn, then four',
      daniel11: 'A mighty king, then four toward the winds',
      revelation: '—',
    },
    {
      empire: 'Rome',
      span: '168 BC–AD 476',
      start: { era: 'bc', year: 168, display: '168 BC' },
      end: { era: 'ad', year: 476, display: 'AD 476' },
      daniel2: 'Legs of iron',
      daniel7: 'Dreadful beast, ten horns',
      daniel8: 'The little horn',
      daniel11: 'The king who magnifies himself',
      revelation: 'The sea beast',
    },
  ],
  close: {
    headline: 'The angel said it would reach. It did.',
    body: 'That is the whole case, offered without heat. If you want to hear it preached rather than drawn, come on Saturday, or watch a message. Questions are welcome. A page is not a conversation.',
  },
}
