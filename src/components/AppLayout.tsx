'use client'

import { ThemeProvider } from './ThemeProvider'
import { Toaster } from './ui/sonner'
import AppHeader from '@/components/AppHeader'
import React from 'react'
import { ClusterChecker } from '@/components/cluster/cluster-ui'
import { AccountChecker } from '@/components/account/account-ui'

export function AppLayout({
  children
}: {
  children: React.ReactNode
  links: { label: string; path: string }[]
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main>
          <ClusterChecker>
            <AccountChecker />
          </ClusterChecker>
          {children}
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
