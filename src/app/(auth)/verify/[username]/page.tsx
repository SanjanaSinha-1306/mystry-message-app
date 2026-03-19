'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { ApiResponse } from '@/src/types/ApiResponse'
import { verifySchema } from '@/src/schemas/verifySchema'

function VerifyAccountPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: '' },
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/verify-code', {
        username: params.username,
        code: data.code,
      })
      toast.success(response.data.message || 'Account verified successfully')
      setIsVerified(true)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError?.response?.data?.message || 'Error verifying account')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Verify your email</h1>
          <p className="text-slate-300 text-lg">
            Enter the 6-digit code we sent to your email
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
          {isVerified ? (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-green-300">
                <CheckCircle2 size={20} />
                <div className="font-semibold">Verification complete</div>
              </div>
              <p className="text-slate-300 text-sm">
                Your account is verified. Next, login to open your dashboard and get your unique link.
              </p>
              <button
                onClick={() => router.replace('/sign-in')}
                className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
              >
                Continue to login
              </button>
              <p className="text-center text-slate-400 text-xs">
                Tip: after you login, you’ll see your share link like <span className="text-slate-200">/u/{params.username}</span>
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Verification code
                  </label>
                  <input
                    {...form.register('code')}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  {form.formState.errors.code && (
                    <p className="text-xs text-red-400 mt-1">
                      {form.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-2 rounded-lg transition duration-200 mt-6 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </button>
              </form>

              <p className="text-center text-slate-300 mt-6">
                Back to{' '}
                <Link
                  href="/sign-in"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition"
                >
                  login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyAccountPage

