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
      setError(err.message || 'Failed to sign in')
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
                Login
              </h1>
              <p className="text-slate-600">
                Enter your credentials to get in
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
                  placeholder="dimerpaix@email.com"
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
            <svg width="24" height="26" viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.0935 3.58066C15.5986 2.98926 13.982 2.73905 12.3624 2.84839C10.7428 2.95772 9.16133 3.42383 7.73409 4.21249C6.30685 5.00116 5.07008 6.09235 4.11456 7.40596C3.15905 8.71957 2.50905 10.2222 2.2123 11.8037L5.60694 12.3616C5.80933 11.283 6.25263 10.2582 6.9043 9.36229C7.55596 8.46639 8.39945 7.72219 9.37284 7.18432C10.3462 6.64645 11.4248 6.32856 12.5294 6.25399C13.6339 6.17942 14.7365 6.35007 15.756 6.7534L17.0935 3.58066Z" fill="white"/>
              <path d="M8.89425 24.0806C10.3951 24.6686 12.0193 24.9144 13.6476 24.8001C15.2759 24.6857 16.8669 24.2141 18.3039 23.4198C19.7409 22.6255 20.9873 21.5287 21.9517 20.21C22.9161 18.8913 23.5739 17.3841 23.8769 15.799L20.4664 15.2503C20.2597 16.3313 19.8111 17.3592 19.1534 18.2586C18.4957 19.158 17.6456 19.906 16.6656 20.4477C15.6855 20.9894 14.6004 21.3111 13.4899 21.3891C12.3794 21.4671 11.2717 21.2994 10.2481 20.8984L8.89425 24.0806Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M14.2646 15.9146C15.4315 15.2409 15.8314 13.7488 15.1576 12.5818C14.4839 11.4149 12.9917 11.0151 11.8248 11.6888C10.6579 12.3625 10.258 13.8547 10.9318 15.0216C11.6055 16.1886 13.0977 16.5884 14.2646 15.9146ZM16.1221 19.1319C19.0659 17.4323 20.0745 13.6681 18.3749 10.7243C16.6753 7.78052 12.9111 6.7719 9.9673 8.4715C7.0235 10.1711 6.01488 13.9353 7.71448 16.8791C9.41408 19.8229 13.1783 20.8315 16.1221 19.1319Z" fill="white"/>
            </svg>
          </div>
        </div>

        {/* Tagline at bottom */}
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-5xl xl:text-6xl font-bold leading-tight">
            Welcome to<br />
            <span className="font-extrabold">The Office Company</span>
          </h2>
        </div>
      </div>
    </div>
  )
}
