'use client'

import Link from 'next/link'
import { ShoppingBag, UserRound, Store, Truck, ShieldCheck } from 'lucide-react'
import { useStore } from '@/lib/store'

const categories = [
  { label: 'Fashion', href: '/#categories' },
  { label: 'Beauty', href: '/#categories' },
  { label: 'Electronics', href: '/#categories' },
  { label: 'Groceries', href: '/#categories' },
  { label: 'Home', href: '/#categories' },
]

export function SiteNav() {
  const { cartCount, user } = useStore()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="hidden border-b border-border/60 bg-muted/40 sm:block">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-1.5 text-xs text-muted-foreground lg:px-8">
          <span className="flex items-center gap-1.5">
            <Truck className="size-3.5 text-primary" />
            Nationwide delivery
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" />
            Escrow-protected payments
          </span>
          <Link href="/vendor" className="ml-auto flex items-center gap-1.5 font-medium text-foreground transition hover:text-primary">
            <Store className="size-3.5" />
            Sell on Akwaaba
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 lg:px-8">
        <Link href="/" className="mr-auto flex items-center gap-2" aria-label="Akwaaba Mall home">
          <img src="/icon.png" alt="Akwaaba Mall" className="size-9 rounded-xl object-cover" />
          <span className="text-lg font-bold tracking-tight">Akwaaba<span className="text-primary"> Mall</span></span>
        </Link>
        <nav className="flex items-center gap-1 text-sm" aria-label="Primary">
          <Link href="/vendor" className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-muted-foreground transition hover:text-foreground sm:hidden">
            <Store className="size-5" />
            <span className="sr-only">Sell on Akwaaba</span>
          </Link>
          <Link href="/account" className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium transition hover:text-primary">
            <UserRound className="size-5" />
            <span className="hidden sm:inline">{user ? user.name.split(' ')[0] : 'Account'}</span>
          </Link>
          <Link href="/checkout" className="relative rounded-lg p-2 transition hover:text-primary" aria-label={`Checkout with ${cartCount} items`}>
            <ShoppingBag className="size-5" />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{cartCount}</span>}
          </Link>
        </nav>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 text-sm lg:px-8">
          {categories.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
