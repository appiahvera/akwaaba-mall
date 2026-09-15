'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, Lock, ShieldCheck, Trash2 } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { formatPrice, PLATFORM_FEE_RATE, useStore, type Order } from '@/lib/store'

type Phase = 'cart' | 'paying' | 'held' | 'released'

export default function CheckoutPage() {
  const { cart, products, removeFromCart, placeOrder, releaseOrder, user } = useStore()
  const region = user?.region ?? 'Greater Accra'
  const [phase, setPhase] = useState<Phase>('cart')
  const [order, setOrder] = useState<Order | null>(null)

  const lines = useMemo(
    () => cart.map((line) => ({ ...line, product: products.find((p) => p.id === line.productId)! })).filter((line) => line.product),
    [cart, products],
  )
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0)
  const total = subtotal

  const handlePay = () => {
    if (lines.length === 0) return
    setPhase('paying')
    setTimeout(() => {
      const placed = placeOrder({ region })
      setOrder(placed)
      setPhase('held')
    }, 1600)
  }

  const handleRelease = () => {
    if (!order) return
    releaseOrder(order.id)
    setPhase('released')
  }

  if (phase === 'cart' && lines.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Your bag is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">Add items from the shop to check out with secure escrow payment.</p>
          <Link href="/" className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Browse products</Link>
        </div>
      </main>
    )
  }

  const vendorPayout = order ? Math.round(order.subtotal * (1 - PLATFORM_FEE_RATE)) : 0
  const platformFee = order ? order.subtotal - vendorPayout : 0

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4 text-primary" /> Payments are held in escrow until you confirm delivery.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Your items</h2>
            <div className="mt-4 divide-y divide-border">
              {lines.map((line) => (
                <div key={line.productId} className="flex items-center gap-4 py-4">
                  <img src={line.product.image || "/placeholder.svg"} alt={line.product.name} className="size-16 shrink-0 rounded-xl bg-secondary object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${line.productId}`} className="line-clamp-1 text-sm font-semibold hover:text-primary">{line.product.name}</Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">{line.product.seller} • Qty {line.qty}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold">{formatPrice(line.product.price * line.qty)}</span>
                  {phase === 'cart' && (
                    <button onClick={() => removeFromCart(line.productId)} className="shrink-0 rounded-lg p-2 text-muted-foreground transition hover:text-destructive" aria-label={`Remove ${line.product.name}`}><Trash2 className="size-4" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="h-fit rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Item price</dt><dd className="font-medium">{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
            </dl>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Delivery cost is negotiable and arranged directly with the seller during or after chat.</p>

            {phase === 'cart' && (
              <>
                <div className="mt-5 flex items-start gap-2 rounded-2xl border border-primary/20 bg-primary/5 p-3 text-xs leading-5 text-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p><span className="font-semibold">⚠️ Security Notice:</span> Pay directly inside Akwaaba Mall. Never send money outside the app or share your PIN.</p>
                </div>
                <button onClick={handlePay} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"><Lock className="size-4" /> Pay Now</button>
              </>
            )}
            {phase === 'paying' && (
              <p className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-muted py-3 text-sm font-semibold text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Connecting to Paystack…</p>
            )}

            {(phase === 'held' || phase === 'released') && order && (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm">
                  <p className="flex items-center gap-2 font-semibold text-primary"><ShieldCheck className="size-4" /> {phase === 'held' ? 'Paid — held in escrow' : 'Funds released to vendor'}</p>
                  <p className="mt-1 text-muted-foreground">Reference: {order.reference}</p>
                </div>

                {phase === 'held' ? (
                  <button onClick={handleRelease} className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground">Confirm delivery received</button>
                ) : (
                  <div className="rounded-2xl bg-muted/50 p-4 text-sm">
                    <p className="flex items-center gap-2 font-semibold text-primary"><CheckCircle2 className="size-4" /> Order complete</p>
                    <dl className="mt-3 space-y-1.5 text-muted-foreground">
                      <div className="flex justify-between"><dt>Vendor payout (95%)</dt><dd className="font-medium text-foreground">{formatPrice(vendorPayout)}</dd></div>
                      <div className="flex justify-between"><dt>Platform fee (5%)</dt><dd className="font-medium text-foreground">{formatPrice(platformFee)}</dd></div>
                    </dl>
                    <Link href="/account" className="mt-4 block rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground">View in my account</Link>
                  </div>
                )}
              </div>
            )}
            <p className="mt-4 text-center text-xs text-muted-foreground">Simulated Paystack flow for demonstration.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
