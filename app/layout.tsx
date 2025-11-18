import type { Metadata } from 'next'
import { Inter, Rajdhani } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const rajdhani = Rajdhani({ 
  subsets: ["latin"], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-rajdhani' 
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
      <body className={`${inter.variable} ${rajdhani.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
