'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.session) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      // Check if it's a rate limit error
      if (err.message?.toLowerCase().includes('rate limit')) {
        setError('Too many login attempts. Please wait a few minutes and try again.')
      } else {
        setError(err.message || 'Failed to sign in')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Take a seat.
              </h1>
              <p className="text-slate-600">
                You're about to manage an unreasonable number of chairs.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  placeholder="you@theofficecompany.eu"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-900 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Brand/Image section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden rounded-l-[3rem]">
        {/* Background image */}
        <Image
          src="/bg-image.jpeg"
          alt="Office furniture"
          fill
          className="object-cover"
          priority
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

        {/* Logo in top right */}
        <div className="absolute top-8 right-8">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
          <svg width="42" height="45" viewBox="0 0 42 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.4687 5.75379C25.0664 4.80344 22.4686 4.40135 19.8659 4.57705C17.2633 4.75275 14.7219 5.50178 12.4284 6.76914C10.1348 8.0365 8.14737 9.79002 6.61188 11.901C5.07639 14.0119 4.03187 16.4267 3.55499 18.968L9.0101 19.8645C9.33533 18.1313 10.0477 16.4844 11.0949 15.0447C12.1421 13.6051 13.4976 12.4091 15.0618 11.5448C16.626 10.6804 18.3593 10.1696 20.1343 10.0498C21.9093 9.92995 23.681 10.2042 25.3194 10.8523L27.4687 5.75379Z" fill="white"/>
<path d="M14.2928 38.6967C16.7046 39.6416 19.3147 40.0366 21.9313 39.8528C24.5479 39.669 27.1047 38.9111 29.4139 37.6347C31.723 36.3583 33.726 34.5959 35.2758 32.4767C36.8255 30.3575 37.8826 27.9355 38.3696 25.3884L32.8889 24.5066C32.5568 26.2437 31.8359 27.8956 30.7789 29.3409C29.722 30.7862 28.3559 31.9882 26.7811 32.8587C25.2062 33.7292 23.4625 34.2461 21.6779 34.3714C19.8934 34.4968 18.1133 34.2274 16.4684 33.583L14.2928 38.6967Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M22.9227 25.5744C24.798 24.4918 25.4405 22.0939 24.3578 20.2187C23.2751 18.3434 20.8773 17.7009 19.002 18.7836C17.1268 19.8663 16.4843 22.2641 17.5669 24.1394C18.6496 26.0146 21.0475 26.6571 22.9227 25.5744ZM25.9077 30.7445C30.6383 28.0133 32.2591 21.9643 29.5279 17.2337C26.7967 12.5031 20.7477 10.8823 16.0171 13.6135C11.2865 16.3447 9.66563 22.3937 12.3968 27.1243C15.1281 31.8549 21.1771 33.4757 25.9077 30.7445Z" fill="white"/>
</svg>

          </div>
        </div>

        {/* Tagline at bottom */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-5xl xl:text-6xl font-bold leading-relaxed">
            The Office Co.<br />
            <span className="font-extrabold">We take seating very seriously.</span>
          </h2>
        </div>
      </div>
    </div>
  )
}
