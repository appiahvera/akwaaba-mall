'use client'

import Link from 'next/link'
import { ShoppingBag, UserRound } from 'lucide-react'
import { useStore } from '@/lib/store'

export function SiteNav() {
  const { cartCount, user } = useStore()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 lg:px-8">
        <Link href="/" className="mr-auto flex items-center gap-2" aria-label="Akwaaba Mall home">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">A</span>
          <span className="text-lg font-bold tracking-tight">Akwaaba<span className="text-primary"> Mall</span></span>
        </Link>
        <nav className="flex items-center gap-1 text-sm" aria-label="Primary">
          <Link href="/vendor" className="hidden rounded-lg px-3 py-2 font-medium text-muted-foreground transition hover:text-foreground sm:block">Sell</Link>
          <Link href="/account" className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium">
            <UserRound className="size-5" />
            <span className="hidden sm:inline">{user ? user.name.split(' ')[0] : 'Account'}</span>
          </Link>
          <Link href="/checkout" className="relative rounded-lg p-2" aria-label={`Checkout with ${cartCount} items`}>
            <ShoppingBag className="size-5" />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}
