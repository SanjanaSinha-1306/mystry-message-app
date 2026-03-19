'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'

function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/10 bg-slate-950/70 backdrop-blur">
      {/* Container keeps elements in corners while maintaining clean spacing */}
      <div className="mx-auto max-w-[1400px] px-8 py-3 flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-6">
          {/* Logo: Slightly larger but clean tracking */}
          <Link href="/" className="text-xl font-bold text-white tracking-tight uppercase italic">
            Mystery Message
          </Link>
          
          <div className="hidden sm:flex items-center gap-4 text-md font-medium text-slate-300">
            <Link className="hover:text-white transition-colors" href="/">
              Home
            </Link>
            <span className="text-slate-700">/</span>
            <Link className="hover:text-white transition-colors" href="/dashboard">
              Dashboard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              {/* Professional Welcome Message */}
              <span className="hidden sm:inline text-sm text-slate-300">
                Welcome, <span className="text-white font-medium">{user.username || user.email}</span>
              </span>
              
              <Link href="/dashboard">
                <Button variant="secondary" className="text-sm font-semibold px-5">
                  Dashboard
                </Button>
              </Link>

              {/* Professional Logout: Vine Red / Deep Bordeaux color */}
              <Button 
                onClick={() => signOut()} 
                className="bg-[#630d0d] hover:bg-[#4a0a0a] text-red-100 text-sm font-semibold px-6 transition-colors border border-[#851414]/30"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="secondary" className="text-sm font-semibold px-6">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-white text-black hover:bg-slate-200 text-sm font-semibold px-6">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar