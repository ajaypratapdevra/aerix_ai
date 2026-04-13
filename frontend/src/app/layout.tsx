import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AERIX AI — Aerospace Intelligence for Emerging India',
  description: 'Pioneering AI-powered education, safety technology, and aerospace innovation for schools and institutions across India.',
  keywords: 'AERIX AI, aerospace education, AI workshops, NAARIX safety band, school AI programs, India',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'AERIX AI',
    description: 'Aerospace & AI Based Solutions for Emerging India',
    type: 'website',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-brand-navy text-slate-300 font-body antialiased">
        {children}
      </body>
    </html>
  );
}
