'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

export type Product = {
  id: number
  name: string
  price: number
  category: string
  seller: string
  sellerWhatsapp: string
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
  role: 'buyer' | 'vendor'
  storeName?: string
  whatsapp?: string
}

export const PLATFORM_FEE_RATE = 0.05

function mapMarketplaceProduct(record: Record<string, unknown>): Product | null {
  const id = Number(record.id ?? record.product_id)
  const name = String(record.name ?? record.title ?? '').trim()
  const price = Number(record.price ?? record.amount)
  if (!Number.isFinite(id) || !name || !Number.isFinite(price)) return null

  return {
    id,
    name,
    price,
    category: String(record.category ?? record.category_name ?? 'General Items'),
    seller: String(record.seller ?? record.vendor ?? record.seller_name ?? 'Akwaaba Vendor'),
    sellerWhatsapp: String(record.sellerWhatsapp ?? record.seller_whatsapp ?? record.whatsapp ?? record.phone ?? ''),
    image: String(record.image ?? record.image_url ?? record.photo ?? '/placeholder.svg?height=480&width=480'),
    description: String(record.description ?? `Quality ${String(record.category ?? 'general item').toLowerCase()} listed by a trusted Ghanaian vendor on Akwaaba Mall.`),
  }
}

export function formatPrice(price: number) {
  return `GH\u20B5 ${price.toLocaleString('en-GH')}`
}

export function whatsappLink(number: string | undefined, text: string) {
  const digits = (number || '').replace(/\D/g, '')
  const intl = digits.startsWith('233')
    ? digits
    : digits.startsWith('0')
      ? `233${digits.slice(1)}`
      : digits
        ? `233${digits}`
        : '233500000000'
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`
}

type StoreValue = {
  products: Product[]
  productsLoading: boolean
  productsError: string | null
  reviews: Review[]
  orders: Order[]
  cart: CartLine[]
  user: User | null
  addProduct: (input: { name: string; price: number; category: string; seller?: string; description?: string; image?: string }) => Promise<Product>
  addReview: (input: { productId: number; rating: number; text: string }) => void
  reviewsFor: (productId: number) => Review[]
  ratingFor: (productId: number) => { average: number; count: number }
  addToCart: (productId: number, qty?: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
  cartCount: number
  placeOrder: (input: { region: string }) => Order
  releaseOrder: (orderId: string) => void
  register: (input: User & { password: string }) => void
  login: (email: string, password: string) => boolean
  loginWithGoogle: (role: 'buyer' | 'vendor') => void
  logout: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [cart, setCart] = useState<CartLine[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [accounts, setAccounts] = useState<(User & { password: string })[]>([])

  const [hydrated, setHydrated] = useState(false)
  const localProductsLoaded = useRef(false)

  useEffect(() => {
    try {
      const savedProducts = window.localStorage.getItem('akwaaba-products')
      const savedReviews = window.localStorage.getItem('akwaaba-reviews')
      const savedOrders = window.localStorage.getItem('akwaaba-orders')
      const savedUser = window.localStorage.getItem('account_session_active')
      const savedAccounts = window.localStorage.getItem('akwaaba-accounts')
      if (savedProducts) setProducts(JSON.parse(savedProducts))
      localProductsLoaded.current = true
      if (savedReviews) setReviews(JSON.parse(savedReviews))
      if (savedOrders) setOrders(JSON.parse(savedOrders))
      if (savedUser) setUser(JSON.parse(savedUser))
      if (savedAccounts) setAccounts(JSON.parse(savedAccounts))
    } catch {
      window.localStorage.removeItem('akwaaba-products')
      window.localStorage.removeItem('akwaaba-reviews')
      window.localStorage.removeItem('akwaaba-orders')
      window.localStorage.removeItem('account_session_active')
      window.localStorage.removeItem('akwaaba-accounts')
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    let active = true
    async function fetchMarketplaceProducts() {
      if (!supabase) {
        if (active) {
          setProductsError('Marketplace connection is not configured.')
          setProductsLoading(false)
        }
        return
      }

      // Keep the current list visible while the database request is in flight.
      // In particular, do not abort a slow first request and replace a populated
      // local cache with an empty state before Supabase has answered.
      try {
        const { data, error } = await supabase
          .from('Marketplace products')
          .select('*')
        if (!active) return

        if (error) {
          setProductsError('We could not refresh marketplace listings right now. Showing available listings.')
          return
        }

        const remoteProducts = (data ?? []).map(mapMarketplaceProduct).filter((product): product is Product => product !== null)
        // The database is authoritative for synced products, while locally cached
        // listings remain visible if the request returns no rows or is unavailable.
        setProducts((current) => {
          const remoteIds = new Set(remoteProducts.map((product) => product.id))
          const localProducts = current.filter((product) => !remoteIds.has(product.id))
          return [...remoteProducts, ...localProducts]
        })
        setProductsError(null)
      } catch {
        if (active) setProductsError('We could not refresh marketplace listings right now. Showing available listings.')
      } finally {
        if (active) setProductsLoading(false)
      }
    }

    void fetchMarketplaceProducts()
    return () => { active = false }
  }, [hydrated])

  useEffect(() => {
    if (hydrated && localProductsLoaded.current) {
      window.localStorage.setItem('akwaaba-products', JSON.stringify(products))
    }
  }, [products, hydrated])
  useEffect(() => { if (hydrated) window.localStorage.setItem('akwaaba-reviews', JSON.stringify(reviews)) }, [reviews, hydrated])
  useEffect(() => { if (hydrated) window.localStorage.setItem('akwaaba-orders', JSON.stringify(orders)) }, [orders, hydrated])
  useEffect(() => {
    if (!hydrated) return
    if (user) window.localStorage.setItem('account_session_active', JSON.stringify(user))
    else window.localStorage.removeItem('account_session_active')
  }, [user, hydrated])
  useEffect(() => { if (hydrated) window.localStorage.setItem('akwaaba-accounts', JSON.stringify(accounts)) }, [accounts, hydrated])

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
      productsLoading,
      productsError,
      reviews,
      orders,
      cart,
      user,
      addProduct: async ({ name, price, category, seller, description, image }) => {
        const sellerName = seller || user?.storeName || user?.name || 'Akwaaba Vendor'
        const sellerWhatsapp = user?.whatsapp || user?.phone || ''
        const productInput = {
          name,
          price,
          category,
          seller: sellerName,
          seller_whatsapp: sellerWhatsapp,
          image: image || '/placeholder.svg?height=480&width=480',
          description: description || `Quality ${category.toLowerCase()} listed by a trusted Ghanaian vendor on Akwaaba Mall.`,
        }

        if (!supabase) throw new Error('Marketplace connection is not configured.')
        const { data, error } = await supabase.from('Marketplace products').insert(productInput).select('*').single()
        if (error) throw new Error('We could not publish this listing right now.')

        const product = mapMarketplaceProduct(data)
        if (!product) throw new Error('The published listing returned an invalid product record.')
        setProducts((prev) => [product, ...prev.filter((item) => item.id !== product.id)])
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
      placeOrder: ({ region }) => {
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
          region,
          total: subtotal,
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
        const account = { ...input, role: input.role ?? 'buyer' }
        setAccounts((prev) => [...prev.filter((a) => a.email !== input.email), account])
        setUser({ name: input.name, email: input.email, phone: input.phone, region: input.region, role: account.role, storeName: input.storeName, whatsapp: input.whatsapp })
      },
      login: (email, password) => {
        const match = accounts.find((a) => a.email === email && a.password === password)
        if (match) {
          setUser({ name: match.name, email: match.email, phone: match.phone, region: match.region, role: match.role ?? 'buyer', storeName: match.storeName, whatsapp: match.whatsapp })
          return true
        }
        return false
      },
      loginWithGoogle: (role) => {
        const googleUser: User = {
          name: role === 'vendor' ? 'Akwaaba Vendor' : 'Akwaaba Shopper',
          email: role === 'vendor' ? 'vendor@gmail.com' : 'shopper@gmail.com',
          phone: '',
          region: 'Greater Accra',
          role,
        }
        setAccounts((prev) => [...prev.filter((a) => a.email !== googleUser.email), { ...googleUser, password: `google-${Date.now()}` }])
        setUser(googleUser)
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
