import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.ageless-peptides.store';
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: base + '/shop', changeFrequency: 'daily', priority: 0.9 },
  ];
}
