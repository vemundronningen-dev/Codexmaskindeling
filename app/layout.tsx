import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maskinoversikt',
  description: 'Enkel maskinoversikt med roller, prosjekter og tildeling.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
