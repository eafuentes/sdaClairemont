import type { ContentImage, Leader } from '@/types/content'

const ASSETS = '/images/pastor-website-assets'

export const pastoralTeamPhoto: ContentImage = {
  src: `${ASSETS}/pastor-team.webp`,
  alt: 'Pastor Robert Berry and Pastor London L. Lee standing together in the Clairemont sanctuary, the baptistry and piano behind them.',
  width: 1149,
  height: 1400,
  provenance: 'church-photo',
}

export const leadership: Leader[] = [
  {
    name: 'London L. Lee',
    slug: 'london-lee',
    role: 'Senior Pastor',
    roleCategory: 'pastoral',
    image: {
      src: `${ASSETS}/pastor-portrait-London-2.webp`,
      alt: 'Pastor London L. Lee in the Clairemont sanctuary, wearing glasses and a grey suit, smiling toward the camera.',
      width: 1049,
      height: 1400,
      provenance: 'church-photo',
    },
    bio: [
      'Pastor London L. Lee was born in Loma Linda, California, to God-fearing Christian parents. Although he grew up in a loving Christian home, Pastor Lee experienced what he likes to call “The Prodigal Son Syndrome.” During this season of his life, he became estranged from his Heavenly Father.',
      'Remembering the biblical teachings of his youth and realizing that, no matter what he had done, God would welcome him home, he returned to the loving care of his Heavenly Father, who received him with open arms. Like the prodigal son, Pastor Lee had squandered much of his mental, physical, and spiritual capital. Yet, in spite of it all, God not only accepted him but also placed within him a burning desire to share the matchless love of Christ with all who will listen.',
      'In August 2000, God led Pastor Lee to Osaka, Japan, where he served as a missionary. While in Japan, he met and married his lovely wife, Nikisha, who shares his passion for soul-winning and missionary work. Pastor and Mrs. Lee have been blessed with two children, Selah and Anthony.',
      'Together, the Lee family has had the privilege of traveling to more than 18 countries, teaching and preaching the Everlasting Gospel.',
    ],
  },
  {
    name: 'Robert Berry',
    slug: 'robert-berry',
    role: 'Associate Pastor',
    roleCategory: 'pastoral',
    image: {
      src: `${ASSETS}/pastor-portrait-Berry-2.webp`,
      alt: 'Pastor Robert Berry in the Clairemont sanctuary, wearing a grey suit and blue tie, smiling toward the camera.',
      width: 1400,
      height: 933,
      provenance: 'church-photo',
    },
    bio: [
      'Pastor Robert Berry was born and raised in Southern California. From a young age, God placed within him a love for ministry and a desire to help others know Jesus personally. As that calling grew, God led him to Southern Adventist University, where he earned a degree in Theology and prepared for pastoral ministry.',
      'Today, Pastor Berry serves as Associate Pastor of Clairemont Seventh-day Adventist Church. He has a special passion for reaching young adults, teaching the Bible, making disciples, and developing the next generation of Christian leaders. His greatest desire is to help people discover biblical truth, experience an authentic relationship with Christ, and use their lives in service to Him.',
      'Outside of ministry, Pastor Berry enjoys motorcycles, traveling, spending time outdoors, and being with friends and family. He considers it a privilege to serve God’s church and share the hope of Jesus with others.',
    ],
  },
]
