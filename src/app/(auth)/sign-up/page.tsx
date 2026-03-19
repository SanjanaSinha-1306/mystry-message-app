/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useMemo } from 'react'
import * as z from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/src/types/ApiResponse'
import { signUpSchema } from '@/src/schemas/signUpSchema'
import { Eye, EyeOff } from 'lucide-react'

function Page() {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  const username = form.watch('username')
  const password = form.watch('password')
  const [debouncedUsername] = useDebounceValue(username, 400)

  const passwordChecks = useMemo(() => {
    const p = password ?? ''
    return [
      { label: 'At least 8 characters', ok: p.length >= 8 },
      { label: 'One lowercase letter', ok: /[a-z]/.test(p) },
      { label: 'One uppercase letter', ok: /[A-Z]/.test(p) },
      { label: 'One number', ok: /[0-9]/.test(p) },
      { label: 'One special character', ok: /[^a-zA-Z0-9]/.test(p) },
    ]
  }, [password])

  useEffect(() => {
    let abortController: AbortController | null = null
    const checkUsernameUnique = async () => {
      const clean = (debouncedUsername ?? '').trim()

      // Don’t call backend while invalid/incomplete (prevents spam).
      if (clean.length < 2) {
        setUsernameMessage('')
        setIsCheckingUsername(false)
        return
      }
      if (!/^[a-zA-Z0-9]+$/.test(clean)) {
        setUsernameMessage('Username must contain only letters and numbers.')
        setIsCheckingUsername(false)
        return
      }

      if (!isSubmitting) {
        setIsCheckingUsername(true)
        setUsernameMessage('')

        try {
          abortController?.abort()
          abortController = new AbortController()
          const response = await axios.get(
            `/api/check-username-unique?username=${encodeURIComponent(clean)}`,
            { signal: abortController.signal }
          )
          setUsernameMessage(response.data.message)
        } catch (e) {
          // Ignore cancellations; don’t spam toast while typing.
          if ((e as any)?.name === 'CanceledError') return
          if ((e as any)?.code === 'ERR_CANCELED') return
          setUsernameMessage('Unable to check username right now.')
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()

    return () => {
      abortController?.abort()
    }
  }, [debouncedUsername, isSubmitting])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast.success(response.data.message)
      router.replace(`/verify/${username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError?.response?.data?.message || 'Error signing up'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔮 Mystery Messages
          </h1>
          <p className="text-slate-300 text-lg">
            Join now and start your anonymous adventure
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Username
              </label>
              <input
                {...form.register('username')}
                type="text"
                placeholder="Enter your anonymous username"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {isCheckingUsername && (
                <p className="text-xs text-blue-400 mt-1">
                  ⏳ Checking username...
                </p>
              )}
              {usernameMessage && (
                <p className={`text-xs mt-1 ${
                  usernameMessage.includes('available')
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {usernameMessage}
                </p>
              )}
              {form.formState.errors.username && (
                <p className="text-xs text-red-400 mt-1">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Email
              </label>
              <input
                {...form.register('email')}
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-400 mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...form.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pr-20 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {passwordChecks.map((c) => (
                  <div
                    key={c.label}
                    className={`text-xs ${
                      !password
                        ? 'text-slate-500'
                        : c.ok
                          ? 'text-green-400'
                          : 'text-red-400'
                    }`}
                  >
                    {c.ok ? '✓' : '•'} {c.label}
                  </div>
                ))}
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isCheckingUsername}
              className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-2 rounded-lg transition duration-200 mt-6 flex items-center justify-center gap-2"
            >
              {isSubmitting ? '🔄 Creating Account...' : '🚀 Start Your Adventure'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-slate-600"></div>
            <span className="px-3 text-slate-400 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-600"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-slate-300">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="text-blue-400 hover:text-blue-300 font-semibold transition"
            >
              Login here
            </Link>
          </p>
        </div>

        {/* Footer Message */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Keep your identity secret, share your thoughts freely 🎭
        </p>
      </div>
    </div>
  )
}

export default Page