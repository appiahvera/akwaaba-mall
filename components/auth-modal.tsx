'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Eye, EyeOff, Chrome } from 'lucide-react'
import { useStore } from '@/lib/store'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
  initialRole?: 'buyer' | 'vendor'
}

export function AuthModal({ isOpen, onClose, initialMode = 'login', initialRole = 'buyer' }: AuthModalProps) {
  const router = useRouter()
  const { register, login, loginWithGoogle } = useStore()
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [role, setRole] = useState<'buyer' | 'vendor'>(initialRole)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    storeName: '',
    whatsapp: '',
    region: 'Greater Accra',
    plan: 'basic' as 'basic' | 'pro' | 'gold',
  })

  const vendorPlans = [
    { id: 'basic', name: 'Basic', price: 0, commission: 8 },
    { id: 'pro', name: 'Pro', price: 50, commission: 5 },
    { id: 'gold', name: 'Gold', price: 100, commission: 3 },
  ]

  const handleRoleChange = (newRole: 'buyer' | 'vendor') => {
    setRole(newRole)
    setError('')
  }

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setError('')
    setForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      storeName: '',
      whatsapp: '',
      region: 'Greater Accra',
      plan: 'basic',
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleGoogleSignIn = () => {
    setError('')
    loginWithGoogle(role)
    onClose()
    router.push(role === 'vendor' ? '/vendor/dashboard' : '/account')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const success = login(form.email, form.password)
        if (!success) {
          setError('Invalid email or password. Please try again.')
          setLoading(false)
          return
        }
        onClose()
        if (role === 'vendor') {
          router.push('/vendor/dashboard')
        } else {
          router.push('/account')
        }
      } else {
        if (!form.name || !form.email || !form.password || !form.phone) {
          setError('Please fill in all fields.')
          setLoading(false)
          return
        }
        if (role === 'vendor' && (!form.storeName || !form.whatsapp)) {
          setError('Store name and WhatsApp number are required for vendors.')
          setLoading(false)
          return
        }
        register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          region: form.region,
          role,
          storeName: role === 'vendor' ? form.storeName : undefined,
          whatsapp: role === 'vendor' ? form.whatsapp : undefined,
        })
        onClose()
        if (role === 'vendor') {
          router.push('/vendor/dashboard')
        } else {
          router.push('/account')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-background p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Welcome to Akwaaba</p>
            <h2 id="auth-title" className="mt-1 text-xl font-bold">
              {mode === 'login' ? 'Log in to your account' : 'Create your account'}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close account dialog" className="rounded-lg p-1 hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-xl bg-muted p-1">
          <button
            type="button"
            onClick={() => handleRoleChange('buyer')}
            className={`rounded-lg py-2 text-sm font-semibold transition ${role === 'buyer' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Buyer Account
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('vendor')}
            className={`rounded-lg py-2 text-sm font-semibold transition ${role === 'vendor' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Vendor Account
          </button>
        </div>

        <button type="button" onClick={handleGoogleSignIn} className="mt-5 w-full rounded-xl border border-input bg-muted/50 px-4 py-3 text-sm font-semibold transition hover:bg-muted flex items-center justify-center gap-2">
          <Chrome className="size-4" />
          Continue with Google
        </button>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-muted-foreground">or use email</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleInputChange}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-xs font-medium text-muted-foreground">
                  Ghana phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleInputChange}
                  pattern="(?:\\+233|0)[2-5][0-9]{8}"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. 024 123 4567"
                />
              </div>

              {role === 'vendor' && (
                <>
                  <div>
                    <label htmlFor="storeName" className="text-xs font-medium text-muted-foreground">
                      Store name
                    </label>
                    <input
                      id="storeName"
                      type="text"
                      name="storeName"
                      required
                      value={form.storeName}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="e.g. Ama's Beauty Store"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="text-xs font-medium text-muted-foreground">
                      WhatsApp number
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      name="whatsapp"
                      required
                      value={form.whatsapp}
                      onChange={handleInputChange}
                      pattern="(?:\\+233|0)[2-5][0-9]{8}"
                      className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="e.g. 024 123 4567"
                    />
                    <p className="mt-1 text-[11px] text-muted-foreground">Buyers will reach you here via the &ldquo;Chat on WhatsApp&rdquo; button.</p>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="region" className="text-xs font-medium text-muted-foreground">
                  Region / Location
                </label>
                <select
                  id="region"
                  name="region"
                  value={form.region}
                  onChange={handleInputChange}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {[
                    'Greater Accra',
                    'Ashanti',
                    'Central',
                    'Eastern',
                    'North East',
                    'Northern',
                    'Bono',
                    'Bono East',
                    'Ahafo',
                    'Oti',
                    'Savannah',
                    'Upper East',
                    'Upper West',
                    'Volta',
                    'Western',
                    'Western North',
                  ].map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleInputChange}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={() => {
                    setError('Password reset is coming soon.')
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={form.password}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && role === 'vendor' && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Membership plan</label>
              <div className="mt-2 grid gap-2">
                {vendorPlans.map((plan) => (
                  <label
                    key={plan.id}
                    className={`relative flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition ${
                      form.plan === plan.id ? 'border-primary bg-primary/5' : 'border-input hover:border-input/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={form.plan === plan.id}
                      onChange={handleInputChange}
                      className="size-4 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {plan.name} — GHS {plan.price}/month
                      </p>
                      <p className="text-xs text-muted-foreground">{plan.commission}% commission rate</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
              className="font-semibold text-primary hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
