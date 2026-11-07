// ─────────────────────────────────────────────────────────────
// All invitation text lives here — edit names, dates and venues
// in this one file without touching any layout code.
// ─────────────────────────────────────────────────────────────

export const COUPLE = {
  bride: 'Aditi',
  groom: 'Jeet',
  monogram: ['A', 'J'] as const,
  brideParents: 'D/o Mr. Amit & Mrs. Bhavana Chourasia',
  groomParents: 'S/o Mr. Mahesh & Mrs. Sangeeta Chourasia',
};

export const INVITATION = {
  invocation: '|| Shree Ganeshaya Namah ||',
  intro: [
    'With the blessings of the Almighty,',
    'we solicit your gracious presence',
    'on the marriage of',
  ],
  closingLines: ['Two hearts, two families.', 'One beautiful blessing & a chapter waiting to unfold.'],
};

// Wedding ceremony start (IST). Drives Save the Date + Countdown.
export const WEDDING_DATE_ISO = '2026-12-02T19:30:00+05:30';

const RESIDENCE = 'Our Residence, Deendayal Puram, Chhindwara';
const RESIDENCE_MAP = 'https://www.google.com/maps/search/?api=1&query=Deendayal+Puram+Chhindwara';

export const WEDDING_VENUE = {
  name: 'Swagat Lawn, Eklehra',
  mapUrl:
    'https://www.google.com/maps/place/Swagat+marriage+garden/@22.2035729,78.6927566,17z/data=!3m1!4b1!4m6!3m5!1s0x3bd57f0074e2ce01:0xaf6ab2a9d9583f8d!8m2!3d22.2035729!4d78.6927566!16s%2Fg%2F11xdm7w5tl',
};

export const FAMILY = {
  heading: 'The Family Behind the Love',
  inLovingMemory: 'Late Smt. Rama Chourasia',
  blessings: [
    'Shri Narayan Prasad Chourasia Ji',
    'Smt. Rajni Devi Prasad Chourasia Ji',
    'Smt. Bhavna Amit Chourasia',
    'Smt. Sandhya Vineet Chourasia',
    'Smt. Kanchan Sapanraj Chourasia',
    'Smt. Mansee Paritosh Chourasia',
    'Mr. Piyush Chourasia (Bittu)',
  ],
  siblings: ['Aanchal Chourasia', 'Adhiraj Chourasia', 'Abhiraj Chourasia', 'Anantraj Chourasia'],
  kids: ['Neeva', 'Jeeva', 'Pavit'],
  tagline: ['Apno ki ore se, apno ke liye.', 'Aap aaiye, baki hum sambhal lenge.'],
};

export const PROGRAMME = {
  eyebrow: 'Different Rituals, Same Joy',
  heading: 'Wedding Timeline',
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

export const WEDDING_EVENTS: WeddingEvent[] = [
  {
    number: '01',
    title: 'Mehndi Ceremony',
    startISO: '2026-11-30T12:00:00+05:30',
    description: 'Beautiful details, happy hearts & endless conversations.',
    venue: RESIDENCE,
    directionsUrl: RESIDENCE_MAP,
  },
  {
    number: '02',
    title: 'Haldi Ceremony',
    startISO: '2026-12-01T13:00:00+05:30',
    description: 'Sunshine, laughter & a little bit of yellow.',
    venue: RESIDENCE,
    directionsUrl: RESIDENCE_MAP,
  },
  {
    number: '03',
    title: 'Sangeet Night',
    startISO: '2026-12-01T20:30:00+05:30',
    description: 'Music on, heels off, let the dance begin.',
    venue: RESIDENCE,
    directionsUrl: RESIDENCE_MAP,
  },
  {
    number: '04',
    title: 'The Wedding',
    startISO: WEDDING_DATE_ISO,
    description: 'Two beautiful souls, one incredible journey. The AJ story begins.',
    venue: WEDDING_VENUE.name,
    directionsUrl: WEDDING_VENUE.mapUrl,
  },
];

export const CLOSING = {
  giftNote: 'Your blessings are the only gift we wish for.',
  regardsHeading: 'Warm Regards',
  regardsFrom: 'Chourasia Family',
  message: 'We can’t wait to celebrate with you',
  footer: 'Sita Ram',
};

// ── Date helpers (always shown in India time, whatever the guest's device zone) ──
const TZ = 'Asia/Kolkata';
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: TZ, day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date(iso))
    .replace(/^(\d+) (\w+) (\d+)$/, '$2 $1, $3');
export const formatWeekday = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: TZ, weekday: 'long' }).format(new Date(iso));
export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true })
    .format(new Date(iso))
    .toUpperCase();
