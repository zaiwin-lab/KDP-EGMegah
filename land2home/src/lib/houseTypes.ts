import type { HouseType } from './types';

/* EG Megah Holdings' standard models, taken from the official brochures.
   Names, prices, floor areas and room counts are reproduced exactly as
   published; do not adjust them here. Prices are "harga bermula dari"
   (starting from) and, per the brochures, remain subject to land
   conditions, finishes and specification at the time of construction.

   Keys stay A/B/C/CUSTOM so existing projects and applications keep
   resolving regardless of how the catalogue is presented. */

export const HOUSE_TYPES: HouseType[] = [
  {
    key: 'A',
    name: 'The Serena 02',
    series: 'Model Standard',
    character: 'Kejuruteraan Pintar. Ketenangan Abadi.',
    tagline:
      'Smart engineering, lasting calm. A complete starter home built with lightweight aircrete and a modular formwork system.',
    image: '/egmh/serena.jpg',
    image_alt:
      'The Serena 02: a compact single-storey home with a dark hipped metal roof, a brick feature column and a timber-louvred entrance door.',
    built_up_sq_ft: 690,
    bedrooms: 3,
    bathrooms: 2,
    indicative_price: 158000,
    suits: 'A first home, a younger family, or a well-built house on a modest lot.',
    min_land_sq_ft: 3000,
    highlights: [
      'Three bedrooms and two bathrooms on one level',
      'Aircrete walls: 4-hour fire resistance with no toxic gas',
      'Thermal insulation of 0.259 W/mK and 51 dB sound reduction',
    ],
  },
  {
    key: 'C',
    name: 'The Artisan',
    series: 'Model Standard',
    character: 'Kejuruteraan pintar, untuk masa depan.',
    tagline:
      'Smart engineering for the future. A distinctive single-storey profile with a covered carport and a sheltered entrance.',
    image: '/egmh/artisan.jpg',
    image_alt:
      'The Artisan: a single-storey home with a steep dark gable roof, a brick feature wall, timber screening and a covered carport.',
    built_up_sq_ft: 836,
    bedrooms: 3,
    bathrooms: 2,
    indicative_price: 193800,
    suits: 'Families who want a covered carport and a little more room than the Serena.',
    min_land_sq_ft: 3500,
    highlights: [
      'Three bedrooms, two bathrooms and a covered carport',
      'Living and dining of 17ft × 18ft, main bedroom 10ft × 12ft',
      'Around 30% saved on electricity through aircrete insulation',
    ],
  },
  {
    key: 'B',
    name: 'The Harmoni',
    series: 'Model Standard',
    character: 'Kejuruteraan Pintar. Ketenangan Abadi.',
    tagline:
      'The largest standard model. Four bedrooms and three bathrooms for a household that wants the whole house finished in one build.',
    image: '/egmh/harmoni.jpg',
    image_alt:
      'The Harmoni: the entrance of a contemporary single-storey home, with a flat roofline, vertical timber screening, a stone feature wall and a timber double door.',
    built_up_sq_ft: 1216,
    bedrooms: 4,
    bathrooms: 3,
    indicative_price: 243000,
    suits: 'Larger or multi-generation households, on a plot of 38ft × 32ft or more.',
    min_land_sq_ft: 4000,
    highlights: [
      'Four bedrooms and three bathrooms across 38ft × 32ft',
      'Living and dining of 5.5m × 6.0m, main bedroom 3.5m × 4.0m',
      'Same aircrete structure: fire, damp and sound resistant',
    ],
  },
  {
    key: 'CUSTOM',
    name: 'Private Collection',
    series: 'Bespoke',
    character: 'Tailored premium residence',
    tagline: 'A flexible design pathway for high-value and custom requirements.',
    image: '/egmh/signature.jpg',
    image_alt:
      'Private Collection: a tailored single-storey residence with a flat roofline, vertical timber screening, stone feature walls and a sheltered entrance.',
    built_up_sq_ft: null,
    bedrooms: null,
    bathrooms: null,
    indicative_price: null,
    suits: 'Members with their own plan, an unusual site, or a specific brief.',
    min_land_sq_ft: 0,
    highlights: [
      'Bring your own drawings, or describe what you need',
      'EGMH assesses the site before any price is given',
      'Quotation issued after the site assessment, not before',
    ],
  },
];

export const houseType = (key: string | undefined) =>
  HOUSE_TYPES.find((h) => h.key === key);

/* Shared across every standard model, from the brochures. */
export const EGMH_BUILD_SYSTEM = {
  headline: 'Dinding aircrete cast in-situ, dengan sistem acuan modular',
  summary:
    'Lightweight aircrete poured on site into high-precision modular formwork, giving a monolithic wall with millions of micro air pockets.',
  specs: [
    { value: '4 jam', label: 'Fire resistance, with no toxic gas' },
    { value: '0.259 W/mK', label: 'Thermal insulation' },
    { value: '51 dB', label: 'Sound reduction' },
    { value: '±30%', label: 'Saved on the electricity bill' },
  ],
  certifications: ['SIRIM', 'Jabatan Bomba', 'CIDB', 'SMETA ethical audit'],
  sustainability: [
    'Zero plywood waste',
    'Formwork from 50% recycled plastic, reusable more than 200 times',
  ],
};

/* The four steps EGMH publishes in every brochure. */
export const EGMH_STEPS = [
  { n: '01', title: 'Pilih lot tanah anda', en: 'Choose your land. EGMH can build on any suitable lot.' },
  { n: '02', title: 'Ukur & sahkan asas tapak', en: 'Engineers visit and confirm the ground conditions.' },
  { n: '03', title: 'Pembinaan bermula dalam 30 hari', en: 'Construction starts within 30 days.' },
  { n: '04', title: 'Kunci diserahkan dalam 90 hari', en: 'Keys handed over in 90 days, after CIDB quality inspection.' },
];
