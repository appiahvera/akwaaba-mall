'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, Lock, ShieldCheck, Trash2 } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { formatPrice, PLATFORM_FEE_RATE, REGION_FEES, useStore, type Order } from '@/lib/store'

type Phase = 'cart' | 'paying' | 'held' | 'released'

export default function CheckoutPage() {
  const { cart, products, removeFromCart, placeOrder, releaseOrder, user } = useStore()
  const [region, setRegion] = useState(user?.region ?? 'Greater Accra')
  const [phase, setPhase] = useState<Phase>('cart')
  const [order, setOrder] = useState<Order | null>(null)

  const deliveryFee = REGION_FEES.find((item) => item.name === region)?.fee ?? 30

  const lines = useMemo(
    () => cart.map((line) => ({ ...line, product: products.find((p) => p.id === line.productId)! })).filter((line) => line.product),
    [cart, products],
  )
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0)
  const total = subtotal + deliveryFee

  const handlePay = () => {
    if (lines.length === 0) return
    setPhase('paying')
    setTimeout(() => {
      const placed = placeOrder({ region, deliveryFee })
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

            <div className="mt-4 border-t border-border pt-4">
              <label className="mb-1.5 block text-sm font-medium" htmlFor="region">Delivery region</label>
              <select id="region" value={region} onChange={(e) => setRegion(e.target.value)} disabled={phase !== 'cart'} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60">
                {REGION_FEES.map((item) => <option key={item.name} value={item.name}>{item.name} — {formatPrice(item.fee)} delivery</option>)}
              </select>
            </div>
          </div>

          <div className="h-fit rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-medium">{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery ({region})</dt><dd className="font-medium">{formatPrice(deliveryFee)}</dd></div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
            </dl>

            {phase === 'cart' && (
              <button onClick={handlePay} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"><Lock className="size-4" /> Pay with Paystack</button>
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
