import type { Metadata } from 'next'
import { Geist, Geist_Mono, EB_Garamond } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// Add serif fonts for hero and features typography
const ebGaramond = EB_Garamond({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-eb-garamond"
});

export const metadata: Metadata = {
  title: 'GGamechamps : Your Clips are worth more than you think',
  description: 'Turn your gaming clips into glory. Join tournaments, showcase your skills, and compete for real prizes.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${ebGaramond.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
