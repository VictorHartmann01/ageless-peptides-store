import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgeLess Peptides Store',
  description: 'AgeLess Peptides Store — products, research intelligence and content operations.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
