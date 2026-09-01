import type { HouseType } from './types';

/* The four EGMH delivery paths. The keys stay A/B/C/CUSTOM so existing
   projects, applications and demo data keep resolving; only the presented
   identity changed when the catalogue moved to EGMH's own design language. */

export const HOUSE_TYPES: HouseType[] = [
  {
    key: 'A',
    name: 'The Serena',
    series: 'Essential Series',
    character: 'Essential modern living',
    tagline: 'A confident starter home, designed for repeatable delivery.',
    image: '/egmh/serena-sunset.jpg',
    image_alt:
      'The Serena at dusk: a single-storey contemporary home with a flat roofline, stone feature wall and a warmly lit timber entrance.',
    built_up_sq_ft: 1050,
    bedrooms: 3,
    bathrooms: 2,
    indicative_price: 198000,
    suits: 'First builds, younger families, and members who want a complete home now.',
    min_land_sq_ft: 3500,
    highlights: [
      'Three bedrooms and two bathrooms on one level',
      'Covered entrance porch and a rear service yard',
      'Structure sized so a fourth room can be added later',
    ],
  },
  {
    key: 'B',
    name: 'The Harmoni',
    series: 'Family Series',
    character: 'Contemporary family home',
    tagline: 'Warm, practical architecture for cooperative families who expect more.',
    image: '/egmh/harmoni.jpg',
    image_alt:
      'The Harmoni: a contemporary family home with a dark pitched metal roof, brick detailing and a deep covered porch.',
    built_up_sq_ft: 1280,
    bedrooms: 4,
    bathrooms: 3,
    indicative_price: 238000,
    suits: 'Households of four to six who want the whole house finished in one build.',
    min_land_sq_ft: 4000,
    highlights: [
      'Four bedrooms with a separate family living area',
      'Covered porch, utility yard and generous storage',
      'Wiring and plumbing run ready for an upstairs addition',
    ],
  },
  {
    key: 'C',
    name: 'The Artisan',
    series: 'Signature Series',
    character: 'Signature resort character',
    tagline: 'A distinctive profile for escapade, resort and custom-living demand.',
    image: '/egmh/artisan.jpg',
    image_alt:
      'The Artisan: a signature residence with a steep gable roof, timber soffits and a sheltered double carport.',
    built_up_sq_ft: 1850,
    bedrooms: 4,
    bathrooms: 3,
    indicative_price: 352000,
    suits: 'Multi-generation households, homestay income, or a statement family home.',
    min_land_sq_ft: 5500,
    highlights: [
      'Ground-floor bedroom with its own bathroom',
      'Two living areas so households can share comfortably',
      'Double carport and a wider frontage',
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
