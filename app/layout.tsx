import type {Metadata, Viewport} from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0d0d0d',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://ovelzya.com'),
  title: {
    default: 'OVELZYA — Haute Joaillerie & Maroquinerie d\'Exception | Bijoux Acier 316L & Or 18K PVD',
    template: '%s | Maison Ovelzya Joaillerie',
  },
  description:
    'Maison Ovelzya : Joaillerie d\'exception en acier chirurgical 316L sublimé d\'or véritable 18 carats par procédé PVD inaltérable, oxyde de zirconium 5A et nacre naturelle. Bijoux 100% hypoallergéniques et étanches. Livraison partout au Maroc (Casablanca, Rabat, Marrakech) et paiement à la livraison (COD).',
  keywords: [
    'Ovelzya',
    'bijoux maroc',
    'haute joaillerie casablanca',
    'bijoux acier chirurgical 316L',
    'bijoux or 18k pvd',
    'bijoux waterproof maroc',
    'bijoux hypoallergéniques',
    'colliers femme or',
    'bagues solitaires zirconium',
    'bracelets jonc luxe',
    'boucles d\'oreilles or 18k',
    'nacre naturelle bijouterie',
    'zirconium 5A haute brillance',
    'bijouterie en ligne maroc',
    'cadeau femme luxe maroc',
    'paiement à la livraison bijoux',
  ],
  authors: [{ name: 'Maison Ovelzya', url: 'https://ovelzya.com' }],
  creator: 'Maison Ovelzya',
  publisher: 'Maison Ovelzya',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/?lang=fr',
      'ar-MA': '/?lang=ar',
      'en-US': '/?lang=en',
    },
  },
  openGraph: {
    title: 'OVELZYA — Haute Joaillerie & Maroquinerie d\'Exception',
    description:
      'Maison Ovelzya : Bijoux inaltérables en acier 316L et or 18K PVD. Résistants à l\'eau, hypoallergéniques et garantis 24 mois. Livraison express partout au Maroc avec paiement à la réception.',
    url: 'https://ovelzya.com',
    siteName: 'Maison Ovelzya',
    locale: 'fr_FR',
    alternateLocale: ['ar_MA', 'en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OVELZYA — Haute Joaillerie & Maroquinerie d\'Exception',
    description:
      'Bijoux inaltérables en acier chirurgical 316L et or 18 carats PVD. Brillance diamant zirconium 5A, étanches et hypoallergéniques.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'JewelryStore',
      '@id': 'https://ovelzya.com/#jewelrystore',
      name: 'Maison Ovelzya',
      alternateName: 'Ovelzya Haute Joaillerie',
      url: 'https://ovelzya.com',
      logo: 'https://ovelzya.com/logo.png',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
      description:
        'Haute Joaillerie en acier chirurgical 316L et or 18K PVD inaltérable. Pierres zirconium 5A et nacre naturelle d\'exception.',
      telephone: '+212522000000',
      priceRange: '$$',
      currenciesAccepted: 'MAD, EUR, USD',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer, Apple Pay',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Boulevard d\'Anfa',
        addressLocality: 'Casablanca',
        postalCode: '20000',
        addressCountry: 'MA',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 33.589886,
        longitude: -7.632517,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:00',
          closes: '19:30',
        },
      ],
      sameAs: [
        'https://www.instagram.com/ovelzya_officiel',
        'https://www.tiktok.com/@ovelzya_joaillerie',
        'https://www.facebook.com/ovelzya',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://ovelzya.com/#website',
      url: 'https://ovelzya.com',
      name: 'Ovelzya Joaillerie',
      description: 'Boutique en ligne officielle de Haute Joaillerie et Maroquinerie Maison Ovelzya.',
      inLanguage: ['fr-FR', 'ar-MA', 'en-US'],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Quels sont les matériaux utilisés dans les bijoux Ovelzya ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Les bijoux Maison Ovelzya sont confectionnés en acier inoxydable chirurgical 316L enrichi en molybdène, revêtu d\'or véritable 18 carats par dépôt physique en phase vapeur (PVD sous vide à 400°C), sertis d\'oxydes de zirconium 5A et de nacre naturelle d\'huître perlière.',
          },
        },
        {
          '@type': 'Question',
          name: 'Les bijoux en acier 316L résistent-ils à l\'eau et à la mer ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Oui, nos bijoux sont 100% étanches et inoxydables. Grâce au molybdène présent dans l\'acier 316L et à la liaison atomique PVD, ils ne rouillent pas, ne noircissent jamais et résistent à l\'eau de mer, au chlore de piscine, au savon et aux parfums.',
          },
        },
        {
          '@type': 'Question',
          name: 'Les bijoux provoquent-ils des allergies ou des traces vertes ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Absolument pas. L\'acier 316L est le même alliage utilisé pour les implants chirurgicaux et les prothèses médicales. Il respecte rigoureusement la norme européenne EN 1811 et le règlement REACH avec zéro migration de nickel sur la peau.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;500;600;700;800&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
