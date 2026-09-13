'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, ShieldCheck, Store, TrendingUp, Wallet } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'

const regions = ['Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 'Volta', 'Northern', 'Upper East', 'Upper West']
const categories = ['Fragrances & Beauty', 'Fashion & Bags', 'Phones & Tablets', 'Electronics', 'Home & Kitchen', 'Groceries & Provisions', 'Health & Personal Care', 'Baby, Kids & Toys', 'General Items']

export default function VendorRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ businessName: '', phone: '', region: 'Greater Accra', category: 'Fragrances & Beauty' })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push('/vendor/dashboard')
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex w-fit items-center gap-2 rounded-full bg-accent/20 px-3 py-1.5 text-xs font-semibold text-accent-foreground"><Store className="size-3.5" /> Sell on Akwaaba Mall</div>
          <h1 className="text-balance text-4xl font-bold tracking-tight lg:text-5xl">Open your free storefront in minutes.</h1>
          <p className="mt-4 max-w-md text-pretty leading-7 text-muted-foreground">Reach shoppers across all 16 regions, manage your inventory, and get paid securely through escrow after every delivery.</p>
          <ul className="mt-8 grid gap-4">
            <li className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Wallet className="size-4.5" /></span><div><p className="text-sm font-semibold">Mobile Money payouts</p><p className="text-sm text-muted-foreground">Funds land in your MoMo wallet once buyers confirm delivery.</p></div></li>
            <li className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="size-4.5" /></span><div><p className="text-sm font-semibold">Escrow protection</p><p className="text-sm text-muted-foreground">Every order is backed by secure held-in-escrow payments.</p></div></li>
            <li className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><TrendingUp className="size-4.5" /></span><div><p className="text-sm font-semibold">Sales insights</p><p className="text-sm text-muted-foreground">Track listings, orders and revenue from one dashboard.</p></div></li>
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold">Create your vendor account</h2>
          <p className="mt-1 text-sm text-muted-foreground">No listing fees. Start selling today.</p>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="businessName">Shop / business name</label>
              <input id="businessName" required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Adwoa Finds" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="phone">Ghana phone number (Mobile Money)</label>
              <input id="phone" required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="024 123 4567" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="region">Primary region</label>
              <select id="region" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                {regions.map((region) => <option key={region}>{region}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="category">Product category</label>
              <select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <button type="submit" className="mt-2 flex items-center justify-center gap-1 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Create vendor account <ChevronRight className="size-4" /></button>
            <p className="text-center text-sm text-muted-foreground">Already selling? <Link href="/vendor/dashboard" className="font-semibold text-primary">Go to dashboard</Link></p>
          </form>
        </div>
      </section>
    </main>
  )
}
