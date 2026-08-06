import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { AppShell } from '@/components/app-shell'
import './globals.css'
import Script from 'next/script'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Apex — Triathlon Coaching Engine',
  description:
    'Goal-driven, feedback-adaptive triathlon coaching. Plan, track and analyze swim, bike and run training.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfbfd' },
    { media: '(prefers-color-scheme: dark)', color: '#15161c' },
  ],
}

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('apex-theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`} suppressHydrationWarning>

<body className="font-sans antialiased">

<Script
  id="theme-script"
  strategy="beforeInteractive"
  dangerouslySetInnerHTML={{ __html: themeScript }}
/>

<ThemeProvider>
  <AppShell>{children}</AppShell>
</ThemeProvider>

{process.env.NODE_ENV === 'production' && <Analytics />}

</body>

</html>
  )
}
