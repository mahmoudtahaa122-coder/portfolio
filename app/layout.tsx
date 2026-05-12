import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: "--font-geist-sans"
})
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: "--font-geist-mono"
})

export const metadata: Metadata = {
  title: 'Mahmoud Taha | Network Engineer & Python Automation',
  description: 'Network Engineer with hands-on experience in Cisco-based ISP environments. Skilled in TCP/IP, DNS, DHCP, switching, routing, and Python automation.',
  keywords: ['Network Engineer', 'Cisco', 'Python', 'Automation', 'TCP/IP', 'ISP', 'Netmiko'],
  authors: [{ name: 'Mahmoud Taha' }],
  creator: 'Mahmoud Taha',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://mahmoudtahasalama.vercel.app',
    title: 'Mahmoud Taha | Network Engineer & Python Automation',
    description: 'Network Engineer graduate from Helwan University with hands-on experience in Cisco-based ISP environments at Telecom Egypt and the Ministry of Communications.',
    images: [
      {
        url: 'https://mahmoudtahasalama.vercel.app/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Mahmoud Taha - Network Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Mahmoud Taha | Network Engineer & Python Automation',
    description: 'Network Engineer with hands-on experience in Cisco-based ISP environments. Skilled in TCP/IP, routing, switching, and Python automation.',
    images: ['https://mahmoudtahasalama.vercel.app/icon-512x512.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="overflow-x-hidden font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6DPP8B4KNE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6DPP8B4KNE');
          `}
        </Script>
      </body>
    </html>
  )
}
