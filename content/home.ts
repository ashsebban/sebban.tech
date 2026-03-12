// Home page data layer — groups homepage-specific constants from lib/constants.ts
// lib/constants.ts remains the single source of truth; this file re-exports as a structured object.
import {
  WORK_PILLARS,
  PRODUCT_THINKING,
  TOOLKIT,
  SITE_TAGLINE,
  HERO_SUBTITLE,
  HERO_CREDIBILITY,
  QUICK_ACTIONS,
  SITE_NAME,
} from "@/lib/constants";

export const homeContent = {
  hero: {
    name: SITE_NAME,
    tagline: SITE_TAGLINE,
    subtitle: HERO_SUBTITLE,
    credibility: HERO_CREDIBILITY,
    actions: QUICK_ACTIONS,
  },
  pillars: WORK_PILLARS,
  productThinking: PRODUCT_THINKING,
  toolkit: TOOLKIT,
};
