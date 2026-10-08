import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ageless-peptides.store'),
  title: {
    default: 'AgeLess | Longevity, Peptide & Research',
    template: '%s | AgeLess',
  },
  description: 'AgeLess verbindet Longevity, Peptide und wissenschaftlich orientierte Produktwelten mit transparenter Research- und Compliance-Einordnung.',
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://www.ageless-peptides.store',
    siteName: 'AgeLess',
    title: 'AgeLess | Longevity, Peptide & Research',
    description: 'Longevity, Peptide und Research mit transparenter Einordnung zu Evidenz, Qualität und Compliance.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgeLess | Longevity, Peptide & Research',
    description: 'Longevity, Peptide und Research mit transparenter Einordnung zu Evidenz, Qualität und Compliance.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
