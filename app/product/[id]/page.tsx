'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, MessageCircle, ShoppingBag, Star } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { formatPrice, useStore, whatsappLink } from '@/lib/store'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { products, reviewsFor, ratingFor, addToCart, addReview, user } = useStore()
  const product = products.find((item) => item.id === Number(id))

  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState('')
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/" className="mt-4 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Back to shop</Link>
        </div>
      </main>
    )
  }

  const reviews = reviewsFor(product.id)
  const { average, count } = ratingFor(product.id)
  const whatsApp = whatsappLink(product.sellerWhatsapp, `Hi! I'm interested in buying ${product.name} (${formatPrice(product.price)}) on Akwaaba Mall.`)

  const handleAddToCart = () => {
    addToCart(product.id)
    setAdded(true)
  }

  const handleReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!text.trim()) return
    addReview({ productId: product.id, rating, text: text.trim() })
    setText('')
    setRating(5)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"><ChevronLeft className="size-4" /> Back</button>

        <div className="grid gap-8 md:grid-cols-2">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="aspect-square w-full rounded-3xl bg-secondary object-cover" />
          <div>
            <p className="text-sm font-semibold text-primary">{product.seller}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2 text-sm">
              {count > 0 ? (
                <>
                  <span className="flex items-center gap-1"><Star className="size-4 fill-accent text-accent" /> <span className="font-semibold">{average}</span></span>
                  <span className="text-muted-foreground">({count} {count === 1 ? 'review' : 'reviews'})</span>
                </>
              ) : (
                <span className="text-muted-foreground">No reviews yet</span>
              )}
            </div>
            <p className="mt-5 text-3xl font-bold">{formatPrice(product.price)}</p>
            <p className="mt-4 leading-7 text-muted-foreground">{product.description}</p>
            <div className="mt-7 grid gap-3">
              <button onClick={handleAddToCart} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"><ShoppingBag className="size-4" /> Add to shopping bag</button>
              {added && <Link href="/checkout" className="text-center text-sm font-semibold text-primary">Added — go to checkout</Link>}
              <a href={whatsApp} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary"><MessageCircle className="size-4" /> Chat on WhatsApp</a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-border pt-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-xl font-bold">Ratings &amp; reviews</h2>
            {count > 0 ? (
              <div className="mt-4 flex items-center gap-4">
                <p className="text-4xl font-bold">{average}</p>
                <div>
                  <div className="flex" aria-label={`${average} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`size-4 ${star <= Math.round(average) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />)}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Based on {count} verified {count === 1 ? 'purchase' : 'purchases'}</p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Be the first to review this product.</p>
            )}

            <form onSubmit={handleReview} className="mt-6 rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold">Write a review</p>
              <div className="mt-3 flex gap-1" aria-label="Choose a rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} aria-label={`${star} star${star > 1 ? 's' : ''}`}>
                    <Star className={`size-7 transition ${star <= (hover || rating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} required className="mt-3 min-h-24 w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="How was the item quality and delivery speed?" />
              <button type="submit" className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Submit review{user ? '' : ' as guest'}</button>
            </form>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews to show yet.</p>
            ) : (
              reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{review.author}</p>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="mt-1 flex" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`size-3.5 ${star <= review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`} />)}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{review.text}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
