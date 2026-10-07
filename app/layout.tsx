import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgeLess | Longevity, Peptide & Research',
  description: 'AgeLess verbindet Longevity, Peptide und wissenschaftlich orientierte Produktwelten mit transparenter Research- und Compliance-Einordnung.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
