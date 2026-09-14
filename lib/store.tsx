'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Product = {
  id: number
  name: string
  price: number
  category: string
  seller: string
  image: string
  description: string
}

export type Review = {
  id: string
  productId: number
  author: string
  rating: number
  text: string
  date: string
}

export type CartLine = { productId: number; qty: number }

export type OrderStatus = 'held' | 'released'

export type Order = {
  id: string
  reference: string
  items: { productId: number; name: string; price: number; qty: number }[]
  subtotal: number
  deliveryFee: number
  region: string
  total: number
  status: OrderStatus
  date: string
  buyerEmail: string
}

export type User = {
  name: string
  email: string
  phone: string
  region: string
}

const seededProducts: Product[] = [
  { id: 1, name: 'Glow Radiance Body Mist', category: 'Fragrances & Beauty', price: 185, seller: 'Nana Beauty Hub', image: '/placeholder.svg?height=480&width=480', description: 'A long-lasting, lightweight body mist with warm floral notes, bottled by a trusted Accra beauty vendor.' },
  { id: 2, name: 'Samsung Galaxy A15 128GB', category: 'Phones & Tablets', price: 2499, seller: 'Tech Junction GH', image: '/placeholder.svg?height=480&width=480', description: 'Brand-new sealed Galaxy A15 with 128GB storage, 6.5-inch display and a full local warranty.' },
  { id: 3, name: 'Kente Print Everyday Tote', category: 'Fashion & Bags', price: 145, seller: 'Adwoa Finds', image: '/placeholder.svg?height=480&width=480', description: 'A durable everyday tote made with authentic kente print fabric and reinforced handles.' },
  { id: 4, name: 'Premium Baby Diapers • Size 4', category: 'Baby, Kids & Toys', price: 210, seller: 'Little Sprouts', image: '/placeholder.svg?height=480&width=480', description: 'Soft, highly absorbent size 4 diapers, gentle on delicate skin for all-day comfort.' },
  { id: 5, name: 'Non-stick Cookware Set', category: 'Home & Kitchen', price: 680, seller: 'Home Comfort GH', image: '/placeholder.svg?height=480&width=480', description: 'A complete non-stick cookware set built for busy Ghanaian kitchens, easy to clean and long lasting.' },
  { id: 6, name: 'Natural Shea Butter • 500g', category: 'Health & Personal Care', price: 78, seller: 'Savanna Naturals', image: '/placeholder.svg?height=480&width=480', description: 'Raw, unrefined shea butter sourced from the north of Ghana, perfect for skin and hair.' },
]

const seededReviews: Review[] = [
  { id: 'r1', productId: 1, author: 'Ama K.', rating: 5, text: 'Smells amazing and lasts all day. Delivery to Kumasi was fast!', date: '2026-08-02' },
  { id: 'r2', productId: 1, author: 'Kojo M.', rating: 4, text: 'Good value, packaging could be better but the product is great.', date: '2026-08-10' },
  { id: 'r3', productId: 2, author: 'Yaw D.', rating: 5, text: 'Genuine sealed phone, escrow made me feel safe paying online.', date: '2026-07-21' },
  { id: 'r4', productId: 6, author: 'Efua A.', rating: 5, text: 'Pure shea butter, exactly like the ones from home. Will reorder.', date: '2026-08-15' },
]

export const REGION_FEES: { name: string; fee: number }[] = [
  { name: 'Greater Accra', fee: 30 },
  { name: 'Ashanti', fee: 45 },
  { name: 'Western', fee: 50 },
  { name: 'Central', fee: 40 },
  { name: 'Eastern', fee: 40 },
  { name: 'Volta', fee: 45 },
  { name: 'Northern', fee: 60 },
  { name: 'Upper East', fee: 65 },
  { name: 'Upper West', fee: 65 },
  { name: 'Bono', fee: 50 },
  { name: 'Bono East', fee: 55 },
  { name: 'Ahafo', fee: 55 },
  { name: 'Oti', fee: 50 },
  { name: 'North East', fee: 60 },
  { name: 'Savannah', fee: 60 },
  { name: 'Western North', fee: 55 },
]

export const PLATFORM_FEE_RATE = 0.05

export function formatPrice(price: number) {
  return `GH\u20B5 ${price.toLocaleString('en-GH')}`
}

type StoreValue = {
  products: Product[]
  reviews: Review[]
  orders: Order[]
  cart: CartLine[]
  user: User | null
  addProduct: (input: { name: string; price: number; category: string; seller?: string; description?: string; image?: string }) => Product
  addReview: (input: { productId: number; rating: number; text: string }) => void
  reviewsFor: (productId: number) => Review[]
  ratingFor: (productId: number) => { average: number; count: number }
  addToCart: (productId: number, qty?: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  cartCount: number
  placeOrder: (input: { region: string; deliveryFee: number }) => Order
  releaseOrder: (orderId: string) => void
  register: (input: User & { password: string }) => void
  login: (email: string, password: string) => boolean
  logout: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [cart, setCart] = useState<CartLine[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [accounts, setAccounts] = useState<(User & { password: string })[]>([])

  useEffect(() => {
    try {
      const savedProducts = window.localStorage.getItem('akwaaba-products')
      const savedUser = window.localStorage.getItem('akwaaba-user')
      const savedAccounts = window.localStorage.getItem('akwaaba-accounts')
      if (savedProducts) setProducts(JSON.parse(savedProducts))
      if (savedUser) setUser(JSON.parse(savedUser))
      if (savedAccounts) setAccounts(JSON.parse(savedAccounts))
    } catch {
      window.localStorage.removeItem('akwaaba-products')
      window.localStorage.removeItem('akwaaba-user')
      window.localStorage.removeItem('akwaaba-accounts')
    }
  }, [])

  useEffect(() => { window.localStorage.setItem('akwaaba-products', JSON.stringify(products)) }, [products])
  useEffect(() => {
    if (user) window.localStorage.setItem('akwaaba-user', JSON.stringify(user))
    else window.localStorage.removeItem('akwaaba-user')
  }, [user])
  useEffect(() => { window.localStorage.setItem('akwaaba-accounts', JSON.stringify(accounts)) }, [accounts])

  const value = useMemo<StoreValue>(() => {
    const findProduct = (id: number) => products.find((p) => p.id === id)

    const reviewsFor = (productId: number) => reviews.filter((r) => r.productId === productId)

    const ratingFor = (productId: number) => {
      const list = reviewsFor(productId)
      if (list.length === 0) return { average: 0, count: 0 }
      const average = list.reduce((sum, r) => sum + r.rating, 0) / list.length
      return { average: Math.round(average * 10) / 10, count: list.length }
    }

    return {
      products,
      reviews,
      orders,
      cart,
      user,
      addProduct: ({ name, price, category, seller, description, image }) => {
        const product: Product = {
          id: Date.now(),
          name,
          price,
          category,
          seller: seller || user?.name || 'Akwaaba Vendor',
          image: image || '/placeholder.svg?height=480&width=480',
          description: description || `Quality ${category.toLowerCase()} listed by a trusted Ghanaian vendor on Akwaaba Mall.`,
        }
        setProducts((prev) => [product, ...prev])
        return product
      },
      addReview: ({ productId, rating, text }) => {
        const review: Review = {
          id: `r-${Date.now()}`,
          productId,
          author: user?.name || 'Verified buyer',
          rating,
          text,
          date: new Date().toISOString().slice(0, 10),
        }
        setReviews((prev) => [review, ...prev])
      },
      reviewsFor,
      ratingFor,
      addToCart: (productId, qty = 1) => {
        setCart((prev) => {
          const existing = prev.find((line) => line.productId === productId)
          if (existing) return prev.map((line) => (line.productId === productId ? { ...line, qty: line.qty + qty } : line))
          return [...prev, { productId, qty }]
        })
      },
      removeFromCart: (productId) => setCart((prev) => prev.filter((line) => line.productId !== productId)),
      clearCart: () => setCart([]),
      cartCount: cart.reduce((sum, line) => sum + line.qty, 0),
      placeOrder: ({ region, deliveryFee }) => {
        const items = cart.map((line) => {
          const product = findProduct(line.productId)!
          return { productId: line.productId, name: product.name, price: product.price, qty: line.qty }
        })
        const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
        const order: Order = {
          id: `o-${Date.now()}`,
          reference: `AKW-${Date.now()}`,
          items,
          subtotal,
          deliveryFee,
          region,
          total: subtotal + deliveryFee,
          status: 'held',
          date: new Date().toISOString().slice(0, 10),
          buyerEmail: user?.email || 'guest@akwaaba.gh',
        }
        setOrders((prev) => [order, ...prev])
        setCart([])
        return order
      },
      releaseOrder: (orderId) => setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: 'released' } : order))),
      register: (input) => {
        setAccounts((prev) => [...prev.filter((a) => a.email !== input.email), input])
        setUser({ name: input.name, email: input.email, phone: input.phone, region: input.region })
      },
      login: (email, password) => {
        const match = accounts.find((a) => a.email === email && a.password === password)
        if (match) {
          setUser({ name: match.name, email: match.email, phone: match.phone, region: match.region })
          return true
        }
        return false
      },
      logout: () => setUser(null),
    }
  }, [products, reviews, orders, cart, user, accounts])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within a StoreProvider')
  return context
}
