/**
 * Language-independent profile data, verified against the resume (links taken from the PDF itself).
 * The mobile number and home address in the resume are intentionally not published.
 */
export const profile = {
  email: 'Shiri.f90@gmail.com',
  linkedin: 'https://www.linkedin.com/in/fateme-shiri-90062a78',
  linkedinLabel: 'linkedin.com/in/fateme-shiri-90062a78',
} as const;

/** The four funnel stages in page order. The ids are used as URL hashes, so keep them stable. */
export const sectionIds = ['about', 'expertise', 'results', 'contact'] as const;
export type SectionId = (typeof sectionIds)[number];
