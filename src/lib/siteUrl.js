const FALLBACK_SITE_URL = 'https://criaderopasoreal.com';

const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

export const getSiteUrl = () => {
  const configured = import.meta.env.VITE_SITE_URL;
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return trimTrailingSlash(configured.trim());
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimTrailingSlash(window.location.origin);
  }

  return FALLBACK_SITE_URL;
};
