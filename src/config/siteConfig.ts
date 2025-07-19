import { Metadata } from 'next'

const { title, description, ogImage, baseURL } = {
  title: 'PixelMint – NFT Marketplace on Solana',
  description:
    'PixelMint is a next-gen NFT marketplace on Solana, offering fast, secure, and user-friendly digital collectibles trading for creators and collectors.',
  baseURL: 'https://pixelmint.priyanshpatel.com',
  ogImage: `https://pixelmint.priyanshpatel.com/open-graph.png`,
}

export const siteConfig: Metadata = {
  title,
  description,
  metadataBase: new URL(baseURL),
  openGraph: {
    title,
    description,
    images: [ogImage],
    url: baseURL,
    siteName: 'PixelMint – NFT Marketplace',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ogImage,
    creator: '@priyansh_ptl18',
    site: '@priyansh_ptl18',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  applicationName: 'PixelMint – NFT Marketplace',
  alternates: {
    canonical: baseURL,
  },
  keywords: [
    'PixelMint',
    'NFT Marketplace',
    'Solana',
    'NFTs',
    'Web3',
    'Digital Collectibles',
    'Crypto Art',
    'Priyansh Patel',
    'Solana NFTs',
    'NFT trading',
  ],
  authors: [
    {
      name: 'Priyansh Patel',
      url: 'https://priyanshpatel.com',
    },
  ],
  creator: 'Priyansh Patel',
  publisher: 'Priyansh Patel',
}
