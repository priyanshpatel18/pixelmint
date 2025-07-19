import { AppLayout } from '@/components/AppLayout'
import { AppProviders } from '@/components/AppProvdiders'
import { siteConfig } from '@/config/siteConfig'
import React from 'react'
import './globals.css'

export const metadata = siteConfig;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <AppProviders>
          <AppLayout>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  )
}
// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
