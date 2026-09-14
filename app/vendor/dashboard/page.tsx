'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Boxes, ImagePlus, Package, Plus, Star, TrendingUp, X } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { formatPrice, useStore } from '@/lib/store'

const categories = ['Fragrances & Beauty', 'Fashion & Bags', 'Phones & Tablets', 'Electronics', 'Home & Kitchen', 'Groceries & Provisions', 'Health & Personal Care', 'Baby, Kids & Toys', 'General Items']

export default function VendorDashboardPage() {
  const { products, addProduct, orders, ratingFor } = useStore()
  const [form, setForm] = useState({ name: '', price: '', category: categories[0], description: '', image: '' })
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [imageName, setImageName] = useState('')

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const price = Number.parseFloat(form.price)
    if (!form.name || Number.isNaN(price) || price <= 0) return
    const product = addProduct({ name: form.name, price, category: form.category, description: form.description, image: form.image })
    setJustAdded(product.name)
    setForm({ name: '', price: '', category: categories[0], description: '', image: '' })
    setImageName('')
  }

  const stats = useMemo(() => {
    const orderedItems = orders.flatMap((order) => order.items)
    const unitsSold = orderedItems.reduce((sum, item) => sum + item.qty, 0)
    const revenue = orderedItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    return { listings: products.length, unitsSold, revenue, orders: orders.length }
  }, [orders, products.length])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Vendor portal</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Command center</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your listings and track sales across Ghana.</p>
          </div>
          <Link href="/vendor" className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-muted">Store settings</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5"><Boxes className="size-5 text-primary" /><p className="mt-3 text-2xl font-bold">{stats.listings}</p><p className="text-sm text-muted-foreground">Active listings</p></div>
          <div className="rounded-2xl border border-border bg-card p-5"><Package className="size-5 text-primary" /><p className="mt-3 text-2xl font-bold">{stats.orders}</p><p className="text-sm text-muted-foreground">Orders</p></div>
          <div className="rounded-2xl border border-border bg-card p-5"><TrendingUp className="size-5 text-primary" /><p className="mt-3 text-2xl font-bold">{stats.unitsSold}</p><p className="text-sm text-muted-foreground">Units sold</p></div>
          <div className="rounded-2xl border border-border bg-card p-5"><span className="text-sm font-bold text-primary">GH&#8373;</span><p className="mt-3 text-2xl font-bold">{stats.revenue.toLocaleString('en-GH')}</p><p className="text-sm text-muted-foreground">Gross revenue</p></div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="h-fit rounded-3xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold"><Plus className="size-5 text-primary" /> List a new product</h2>
            <form onSubmit={handleAdd} className="mt-5 grid gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="name">Item name</label>
                <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Handwoven Basket" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="price">Price (GH&#8373;)</label>
                <input id="price" type="number" min="1" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="150" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="category">Category</label>
                <select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium" htmlFor="product-image">Product photo</label>
                  {imageName && <button type="button" onClick={() => { setForm({ ...form, image: '' }); setImageName('') }} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"><X className="size-3" /> Remove</button>}
                </div>
                <label htmlFor="product-image" className="flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input bg-background transition hover:border-primary hover:bg-primary/5">
                  {form.image ? <img src={form.image} alt="Selected product preview" className="h-40 w-full object-cover" /> : <span className="flex h-32 flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground"><ImagePlus className="size-6 text-primary" /> Choose a clear product photo</span>}
                </label>
                <input id="product-image" type="file" accept="image/*" className="sr-only" onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => { if (typeof reader.result === 'string') { setForm({ ...form, image: reader.result }); setImageName(file.name) } }
                  reader.readAsDataURL(file)
                }} />
                {imageName && <p className="mt-1.5 truncate text-xs text-muted-foreground">{imageName}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" htmlFor="description">Description</label>
                <textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-24 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Tell buyers what makes this item special." />
              </div>
              <button type="submit" className="rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Publish item</button>
              {justAdded && <p className="rounded-xl bg-primary/10 p-3 text-sm font-medium text-primary">&ldquo;{justAdded}&rdquo; is now live on Akwaaba Mall.</p>}
            </form>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold"><Package className="size-5 text-primary" /> Your listings</h2>
            <div className="mt-5 divide-y divide-border">
              {products.map((product) => {
                const rating = ratingFor(product.id)
                return (
                  <div key={product.id} className="flex items-center gap-4 py-4">
                    <img src={product.image || "/placeholder.svg"} alt={product.name} className="size-14 shrink-0 rounded-xl bg-secondary object-cover" />
                    <div className="min-w-0 flex-1">
                      <Link href={`/product/${product.id}`} className="line-clamp-1 text-sm font-semibold hover:text-primary">{product.name}</Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">{product.category}</p>
                      {rating.count > 0 && <p className="mt-1 flex items-center gap-1 text-xs"><Star className="size-3 fill-accent text-accent" /> {rating.average} ({rating.count})</p>}
                    </div>
                    <span className="shrink-0 text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
