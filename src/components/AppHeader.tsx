import { WalletButton } from './solana/SolanaProvider'
import { ThemeSelect } from './ThemeSelect'
import Link from 'next/link'
import { Sparkles, Rocket, Home, Menu } from 'lucide-react'

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-muted rounded-xl p-2 relative overflow-hidden">
              <Sparkles className="h-5 w-5 text-yellow-300 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              PixelMint
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <Link 
              href="/" 
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Marketplace</span>
            </Link>

            <Link 
              href="/launchpad" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-background font-semibold shadow hover:from-yellow-300 hover:to-orange-300 transition-all"
            >
              <Rocket className="h-4 w-4 animate-pulse" />
              <span>Launch NFT</span>
            </Link>
          </nav>

          {/* Wallet + Theme */}
          <div className="flex items-center gap-3">
            <ThemeSelect />
            <WalletButton />
          </div>

          {/* Mobile Nav Toggle (optional functionality) */}
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
