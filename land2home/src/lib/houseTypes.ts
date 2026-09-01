import type { HouseType } from './types';

export const HOUSE_TYPES: HouseType[] = [
  {
    key: 'A',
    name: 'Type A — Starter',
    tagline: 'A complete first home, built to grow into.',
    built_up_sq_ft: 900,
    bedrooms: 2,
    bathrooms: 1,
    indicative_price: 168000,
    suits: 'Couples, small families, or a first build on family land.',
    min_land_sq_ft: 3000,
    highlights: [
      'Single storey, level entry throughout',
      'Kitchen and wet area planned for a later extension',
      'Roof and structure sized for a third bedroom in future',
    ],
  },
  {
    key: 'B',
    name: 'Type B — Family',
    tagline: 'The most chosen plan. Room for a household of five.',
    built_up_sq_ft: 1280,
    bedrooms: 3,
    bathrooms: 2,
    indicative_price: 238000,
    suits: 'Families who want the full house finished in one build.',
    min_land_sq_ft: 4000,
    highlights: [
      'Three bedrooms with a separate family area',
      'Covered porch and rear service yard',
      'Wiring and plumbing run for an upstairs addition',
    ],
  },
  {
    key: 'C',
    name: 'Type C — Extended',
    tagline: 'For multi-generation households under one roof.',
    built_up_sq_ft: 1750,
    bedrooms: 4,
    bathrooms: 3,
    indicative_price: 322000,
    suits: 'Larger or multi-generation families, or homes with a work space.',
    min_land_sq_ft: 5500,
    highlights: [
      'Ground floor bedroom with its own bathroom',
      'Two living areas so households can share comfortably',
      'Wider frontage for two vehicles',
    ],
  },
  {
    key: 'CUSTOM',
    name: 'Custom',
    tagline: 'Your own plan, assessed and quoted by EGMH.',
    built_up_sq_ft: null,
    bedrooms: null,
    bathrooms: null,
    indicative_price: null,
    suits: 'Members with an existing plan, an unusual site, or a specific need.',
    min_land_sq_ft: 0,
    highlights: [
      'Bring your own drawings, or describe what you need',
      'EGMH visits the site before any price is given',
      'Quotation issued after the site assessment, not before',
    ],
  },
];

export const houseType = (key: string | undefined) =>
  HOUSE_TYPES.find((h) => h.key === key);
