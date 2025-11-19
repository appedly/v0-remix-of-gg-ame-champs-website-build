import type { Metadata } from 'next'
import { Inter, Rajdhani, Press_Start_2P } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const rajdhani = Rajdhani({ 
  subsets: ["latin"], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani' 
});
const pressStart2P = Press_Start_2P({ 
  subsets: ["latin"], 
  weight: ['400'],
  variable: '--font-minecraft' 
});

export const metadata: Metadata = {
  title: "GGamechamps : Your Clips are worth more than you think",
  description: "Competitive tournaments for the clips that deserve recognition.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${rajdhani.variable} ${pressStart2P.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
