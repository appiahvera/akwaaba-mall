'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogOut, Package, ShieldCheck, Star, Truck } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { formatPrice, useStore } from '@/lib/store'

const regions = ['Greater Accra', 'Ashanti', 'Northern', 'Western', 'Eastern', 'Central', 'Volta', 'Bono', 'Ahafo', 'Bono East', 'Upper East', 'Upper West', 'Oti', 'Savannah', 'North East', 'Western North']

export default function AccountPage() {
  const { user, login, register, logout, orders, releaseOrder } = useStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', region: 'Greater Accra' })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (mode === 'login') {
      const ok = login(form.email, form.password)
      if (!ok) setError('No account matches those details. Try registering first.')
    } else {
      register({ name: form.name, email: form.email, password: form.password, phone: form.phone, region: form.region, role: 'buyer' })
    }
  }

  const myOrders = user ? orders.filter((order) => order.buyerEmail === user.email) : []

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {!user ? (
        <section className="mx-auto grid max-w-md px-4 py-12 lg:px-8">
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold text-primary">Welcome to Akwaaba</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">{mode === 'login' ? 'Log in to your account' : 'Create your account'}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Track orders, release escrow and leave reviews.</p>
          </div>

          <div className="mb-5 grid grid-cols-2 rounded-xl bg-muted p-1">
            <button type="button" onClick={() => { setMode('login'); setError('') }} className={`rounded-lg py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>Log in</button>
            <button type="button" onClick={() => { setMode('register'); setError('') }} className={`rounded-lg py-2 text-sm font-semibold transition ${mode === 'register' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>Register</button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-3">
            {mode === 'register' && (
              <>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Full name" />
                <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Ghana phone number (e.g. 024 123 4567)" />
                <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                  {regions.map((region) => <option key={region}>{region}</option>)}
                </select>
              </>
            )}
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Email address" />
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Password" />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <button type="submit" className="mt-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">{mode === 'login' ? 'Log in' : 'Create account'}</button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">Your session stays active on this device until you log out.</p>
        </section>
      ) : (
        <section className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">{user.name.charAt(0).toUpperCase()}</span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                <p className="text-sm text-muted-foreground">{user.email} • {user.region}</p>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted"><LogOut className="size-4" /> Log out</button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5"><Package className="size-5 text-primary" /><p className="mt-3 text-2xl font-bold">{myOrders.length}</p><p className="text-sm text-muted-foreground">Total orders</p></div>
            <div className="rounded-2xl border border-border bg-card p-5"><ShieldCheck className="size-5 text-primary" /><p className="mt-3 text-2xl font-bold">{myOrders.filter((o) => o.status === 'held').length}</p><p className="text-sm text-muted-foreground">Held in escrow</p></div>
            <div className="rounded-2xl border border-border bg-card p-5"><Truck className="size-5 text-primary" /><p className="mt-3 text-2xl font-bold">{myOrders.filter((o) => o.status === 'released').length}</p><p className="text-sm text-muted-foreground">Completed</p></div>
          </div>

          <h2 className="mt-10 text-lg font-bold">Order history</h2>
          {myOrders.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center">
              <p className="text-sm text-muted-foreground">You have no orders yet.</p>
              <Link href="/" className="mt-3 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Start shopping</Link>
            </div>
          ) : (
            <div className="mt-4 grid gap-4">
              {myOrders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{order.reference}</p>
                      <p className="text-xs text-muted-foreground">{order.date} • Deliver to {order.region}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.status === 'held' ? 'bg-accent/20 text-accent-foreground' : 'bg-primary/10 text-primary'}`}>{order.status === 'held' ? 'Held in escrow' : 'Funds released'}</span>
                  </div>
                  <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between gap-2">
                        <Link href={`/product/${item.productId}`} className="hover:text-primary">{item.name} × {item.qty}</Link>
                        <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-sm text-muted-foreground">Total (item price)</span>
                    <span className="font-bold">{formatPrice(order.total)}</span>
                  </div>
                  {order.status === 'held' ? (
                    <button onClick={() => releaseOrder(order.id)} className="mt-4 w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-accent-foreground">Confirm delivery received (release funds)</button>
                  ) : (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-primary/5 p-3 text-sm">
                      <span className="font-medium text-primary">Delivery confirmed — vendor paid</span>
                      <Link href={`/product/${order.items[0].productId}`} className="flex items-center gap-1 font-semibold text-primary"><Star className="size-4" /> Leave a review</Link>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}
