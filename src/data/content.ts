// ─────────────────────────────────────────────────────────────
// All invitation text lives here, in English (default) and Hindi.
// Edit names, dates and venues in this one file without touching layout code.
// Both languages share the same shape, so components just pick one.
// ─────────────────────────────────────────────────────────────

export type Lang = 'en' | 'hi';

// Wedding ceremony start (IST). Drives Save the Date + Countdown.
export const WEDDING_DATE_ISO = '2026-12-02T19:30:00+05:30';

const RESIDENCE_MAP = 'https://www.google.com/maps/search/?api=1&query=Deendayal+Puram+Chhindwara';
const VENUE_MAP =
  'https://www.google.com/maps/place/Swagat+marriage+garden/@22.2035729,78.6927566,17z/data=!3m1!4b1!4m6!3m5!1s0x3bd57f0074e2ce01:0xaf6ab2a9d9583f8d!8m2!3d22.2035729!4d78.6927566!16s%2Fg%2F11xdm7w5tl';

const EVENT_TIMES = {
  mehndi: '2026-11-30T12:00:00+05:30',
  haldi: '2026-12-01T13:00:00+05:30',
  sangeet: '2026-12-01T20:30:00+05:30',
  wedding: WEDDING_DATE_ISO,
};

export interface WeddingEvent {
  number: string;
  title: string;
  startISO: string; // IST start, used for display + calendar
  description: string;
  venue: string;
  directionsUrl: string;
  dressCode?: string;
}

// ── Date helpers (always shown in India time, whatever the guest's device zone) ──
const TZ = 'Asia/Kolkata';
const fmtEn = {
  date: (iso: string) =>
    new Intl.DateTimeFormat('en-IN', { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date(iso))
      .replace(/^(\d+) (\w+) (\d+)$/, '$2 $1, $3'),
  weekday: (iso: string) => new Intl.DateTimeFormat('en-IN', { timeZone: TZ, weekday: 'long' }).format(new Date(iso)),
  weekdayShort: (iso: string) => new Intl.DateTimeFormat('en-IN', { timeZone: TZ, weekday: 'short' }).format(new Date(iso)),
  time: (iso: string) =>
    new Intl.DateTimeFormat('en-IN', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true })
      .format(new Date(iso))
      .toUpperCase(),
};

const istParts = (iso: string) => {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .format(new Date(iso))
    .split(':')
    .map(Number);
  return { h: p[0], m: p[1] };
};
const fmtHi = {
  // "2 दिसंबर 2026" — Hindi month names, regular digits for easy reading
  date: (iso: string) =>
    new Intl.DateTimeFormat('hi-IN-u-nu-latn', { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)),
  weekday: (iso: string) => new Intl.DateTimeFormat('hi-IN', { timeZone: TZ, weekday: 'long' }).format(new Date(iso)),
  weekdayShort: (iso: string) => new Intl.DateTimeFormat('hi-IN', { timeZone: TZ, weekday: 'short' }).format(new Date(iso)),
  // "शाम 7:30 बजे" — time of day the way it's said in Hindi
  time: (iso: string) => {
    const { h, m } = istParts(iso);
    const part = h >= 4 && h < 12 ? 'सुबह' : h >= 12 && h < 16 ? 'दोपहर' : h >= 16 && h < 20 ? 'शाम' : 'रात';
    const h12 = h % 12 || 12;
    return `${part} ${h12}:${String(m).padStart(2, '0')} बजे`;
  },
};

// ───────────────────────────── ENGLISH ─────────────────────────────
const RESIDENCE_EN = 'Our Residence, Deendayal Puram, Chhindwara';

const en = {
  COUPLE: {
    bride: 'Aditi',
    groom: 'Jeet',
    monogram: ['A', 'J'] as [string, string],
    brideParents: 'D/o Mrs. Bhavana Amit Chourasia',
    groomParents: 'S/o Mrs. Sangeeta Mahesh Chourasia',
  },
  INVITATION: {
    invocation: '|| Shree Ganeshaya Namah ||',
    intro: ['With the blessings of the Almighty,', 'we solicit your gracious presence', 'on the marriage of'],
    closingLines: ['Two hearts, two families.', 'One beautiful blessing & a chapter waiting to unfold.'],
  },
  WEDDING_VENUE: { name: 'Swagat Lawn, Eklehra', mapUrl: VENUE_MAP },
  FAMILY: {
    heading: 'The Family Behind the Love',
    inLovingMemory: 'Late Smt. Rama Chourasia',
    blessings: [
      'Shri Narayan Prasad Chourasia',
      'Smt. Rajni Devi Prasad Chourasia',
      'Smt. Bhavana Amit Chourasia',
      'Smt. Sandhya Vineet Chourasia',
      'Smt. Kanchan Sapanraj Chourasia',
      'Smt. Mansee Paritosh Chourasia',
      'Mr. Piyush Chourasia (Bittu)',
    ],
    siblings: ['Aanchal Chourasia', 'Adhiraj Chourasia', 'Abhiraj Chourasia', 'Anantraj Chourasia'],
    kids: ['Neeva', 'Jeeva', 'Pavit'],
    tagline: ['Apno ki ore se, apno ke liye.', 'Aap aaiye, baki hum sambhal lenge.'],
  },
  PROGRAMME: { eyebrow: 'Different Rituals, Same Joy', heading: 'Wedding Timeline' },
  WEDDING_EVENTS: [
    {
      number: '01',
      title: 'Mehndi Ceremony',
      startISO: EVENT_TIMES.mehndi,
      description: 'Beautiful details, happy hearts & endless conversations.',
      venue: RESIDENCE_EN,
      directionsUrl: RESIDENCE_MAP,
    },
    {
      number: '02',
      title: 'Haldi Ceremony',
      startISO: EVENT_TIMES.haldi,
      description: 'Sunshine, laughter & a little bit of yellow.',
      venue: RESIDENCE_EN,
      directionsUrl: RESIDENCE_MAP,
    },
    {
      number: '03',
      title: 'Sangeet Night',
      startISO: EVENT_TIMES.sangeet,
      description: 'Music on, heels off, let the dance begin.',
      venue: RESIDENCE_EN,
      directionsUrl: RESIDENCE_MAP,
    },
    {
      number: '04',
      title: 'The Wedding',
      startISO: EVENT_TIMES.wedding,
      description: 'Two beautiful souls, one incredible journey. The AJ story begins.',
      venue: 'Swagat Lawn, Eklehra',
      directionsUrl: VENUE_MAP,
    },
  ] as WeddingEvent[],
  CLOSING: {
    giftNote: 'Your blessings are the only gift we wish for.',
    regardsHeading: 'Warm Regards',
    regardsFrom: 'Chourasia Family',
    message: 'We can’t wait to celebrate with you',
    footer: 'Sita Ram',
  },
  UI: {
    cordiallyInvited: 'You Are Cordially Invited',
    tapToOpen: 'Tap to Open',
    tapToOpenAria: 'Tap to open invitation',
    saveTheDate: 'Save the Date',
    scratchTitle: 'Scratch to Reveal',
    scratchSub: 'THE DATE',
    scratchAria: (date: string) => `Scratch to reveal the date. The date is ${date}.`,
    scratchStart: 'Scratch the card with your finger',
    keepGoing: (p: number) => `Keep going… ${p}%`,
    halfway: (p: number) => `Halfway there… ${p}%`,
    almost: (p: number) => `Almost there! ${p}%`,
    countingDown: 'Counting Down to Forever',
    celebrationBegun: 'The Celebration Has Begun',
    scratchToStart: 'Scratch the card above to start the countdown',
    units: ['Days', 'Hours', 'Minutes', 'Seconds'],
    inLovingMemory: 'In Loving Memory of',
    withBlessings: 'With the Blessings of',
    siblings: 'Siblings',
    littleOnes: 'Little Ones',
    and: '&',
    familySignature: 'The Chourasia Family',
    event: 'Event',
    today: 'Today',
    concluded: 'Concluded',
    onwards: (time: string) => `${time} onwards`,
    addToCalendar: 'Add to Calendar',
    directions: 'Directions',
    weddingVenue: 'The Wedding Venue',
    getDirections: 'Get Directions',
    playMusic: 'Play music',
    pauseMusic: 'Pause music',
    shareInvite: 'Share the Invitation',
    shareWhatsApp: 'WhatsApp',
    copyLink: 'Copy link',
    linkCopied: 'Link copied!',
    shareText: 'You are cordially invited to the wedding of Aditi & Jeet 💌 Open the invitation and scratch to reveal the date:',
  },
  fmt: fmtEn,
};

export type Content = typeof en;

// ───────────────────────────── हिन्दी ─────────────────────────────
const RESIDENCE_HI = 'हमारा निवास, दीनदयाल पुरम, छिंदवाड़ा';

const hi: Content = {
  COUPLE: {
    bride: 'अदिति',
    groom: 'जीत',
    monogram: ['अ', 'ज'],
    brideParents: 'सुपुत्री श्रीमती भावना अमित चौरसिया',
    groomParents: 'सुपुत्र श्रीमती संगीता महेश चौरसिया',
  },
  INVITATION: {
    invocation: '|| श्री गणेशाय नमः ||',
    intro: ['ईश्वर की असीम कृपा से,', 'आपको सपरिवार सादर आमंत्रित करते हैं', 'शुभ विवाह के पावन अवसर पर'],
    closingLines: ['दो दिल, दो परिवार।', 'एक सुंदर आशीर्वाद और एक नई कहानी की शुरुआत।'],
  },
  WEDDING_VENUE: { name: 'स्वागत लॉन, एकलहरा', mapUrl: VENUE_MAP },
  FAMILY: {
    heading: 'प्रेम की डोर से बंधा परिवार',
    inLovingMemory: 'स्व. श्रीमती रमा चौरसिया',
    blessings: [
      'श्री नारायण प्रसाद चौरसिया',
      'श्रीमती रजनी देवी प्रसाद चौरसिया',
      'श्रीमती भावना अमित चौरसिया',
      'श्रीमती संध्या विनीत चौरसिया',
      'श्रीमती कंचन सपनराज चौरसिया',
      'श्रीमती मानसी परितोष चौरसिया',
      'श्री पीयूष चौरसिया (बिट्टू)',
    ],
    siblings: ['आँचल चौरसिया', 'अधिराज चौरसिया', 'अभिराज चौरसिया', 'अनंतराज चौरसिया'],
    kids: ['नीवा', 'जीवा', 'पवित'],
    tagline: ['अपनों की ओर से, अपनों के लिए।', 'आप आइए, बाकी हम संभाल लेंगे।'],
  },
  PROGRAMME: { eyebrow: 'रस्में अनेक, खुशी एक', heading: 'विवाह कार्यक्रम' },
  WEDDING_EVENTS: [
    {
      number: '01',
      title: 'मेहंदी की रस्म',
      startISO: EVENT_TIMES.mehndi,
      description: 'सुंदर नक्काशी, खुश दिल और ढेर सारी बातें।',
      venue: RESIDENCE_HI,
      directionsUrl: RESIDENCE_MAP,
    },
    {
      number: '02',
      title: 'हल्दी की रस्म',
      startISO: EVENT_TIMES.haldi,
      description: 'धूप, हँसी और थोड़ा-सा पीला रंग।',
      venue: RESIDENCE_HI,
      directionsUrl: RESIDENCE_MAP,
    },
    {
      number: '03',
      title: 'संगीत संध्या',
      startISO: EVENT_TIMES.sangeet,
      description: 'संगीत शुरू, फ़िक्र दूर — चलो नाचें!',
      venue: RESIDENCE_HI,
      directionsUrl: RESIDENCE_MAP,
    },
    {
      number: '04',
      title: 'शुभ विवाह',
      startISO: EVENT_TIMES.wedding,
      description: 'दो सुंदर आत्माएँ, एक अनोखा सफ़र — अदिति और जीत की कहानी का शुभारंभ।',
      venue: 'स्वागत लॉन, एकलहरा',
      directionsUrl: VENUE_MAP,
    },
  ],
  CLOSING: {
    giftNote: 'आपका आशीर्वाद ही हमारे लिए सबसे अनमोल उपहार है।',
    regardsHeading: 'स्नेहाकांक्षी',
    regardsFrom: 'चौरसिया परिवार',
    message: 'आपके साथ उत्सव मनाने की प्रतीक्षा है',
    footer: 'सीता राम',
  },
  UI: {
    cordiallyInvited: 'आप सादर आमंत्रित हैं',
    tapToOpen: 'खोलने के लिए छुएँ',
    tapToOpenAria: 'निमंत्रण खोलने के लिए छुएँ',
    saveTheDate: 'शुभ तिथि',
    scratchTitle: 'खुरचें और देखें',
    scratchSub: 'शुभ तिथि',
    scratchAria: (date: string) => `तिथि देखने के लिए कार्ड खुरचें। तिथि है ${date}।`,
    scratchStart: 'उँगली से कार्ड को खुरचें',
    keepGoing: (p: number) => `खुरचते रहें… ${p}%`,
    halfway: (p: number) => `आधा हो गया… ${p}%`,
    almost: (p: number) => `बस थोड़ा और! ${p}%`,
    countingDown: 'शुभ घड़ी की प्रतीक्षा',
    celebrationBegun: 'उत्सव आरंभ हो गया',
    scratchToStart: 'उलटी गिनती शुरू करने के लिए ऊपर कार्ड खुरचें',
    units: ['दिन', 'घंटे', 'मिनट', 'सेकंड'],
    inLovingMemory: 'स्मृति शेष',
    withBlessings: 'शुभाशीष',
    siblings: 'भाई-बहन',
    littleOnes: 'बाल मनुहार',
    and: 'और',
    familySignature: 'चौरसिया परिवार',
    event: 'कार्यक्रम',
    today: 'आज',
    concluded: 'संपन्न',
    onwards: (time: string) => `${time} से`,
    addToCalendar: 'कैलेंडर में जोड़ें',
    directions: 'रास्ता देखें',
    weddingVenue: 'विवाह स्थल',
    getDirections: 'रास्ता देखें',
    playMusic: 'संगीत चलाएँ',
    pauseMusic: 'संगीत रोकें',
    shareInvite: 'निमंत्रण साझा करें',
    shareWhatsApp: 'व्हाट्सऐप',
    copyLink: 'लिंक कॉपी करें',
    linkCopied: 'लिंक कॉपी हो गया!',
    shareText: 'अदिति और जीत के शुभ विवाह में आप सादर आमंत्रित हैं 💌 निमंत्रण खोलें और तिथि जानने के लिए कार्ड खुरचें:',
  },
  fmt: fmtHi,
};

export const CONTENT: Record<Lang, Content> = { en, hi };
