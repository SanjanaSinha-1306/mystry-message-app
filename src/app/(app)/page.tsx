'use client'


import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-slate-950 text-white">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Get honest messages — <br className="hidden sm:block" />
          without revealing identities.
        </h1>
        <p className="text-sm md:text-lg text-slate-400 max-w-lg mx-auto">
          Create your page, share your unique link, and let friends send you anonymous messages. 
          You can toggle when you want to receive messages.
        </p>
      </section>

      {/* Buttons: Stacked on mobile, side-by-side on big screens */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <Link href="/sign-up" className="w-full sm:w-auto">
          <Button className="w-full sm:px-8 bg-blue-600 hover:bg-blue-700">
            Create your inbox
          </Button>
        </Link>
        <Link href="/sign-in" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:px-8 border-slate-700 text-slate-200">
            Login
          </Button>
        </Link>
      </div>

      {/* How it works section - Responsive Grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          { step: "1", title: "Sign up & verify", desc: "Create an account and verify your email to get started." },
          { step: "2", title: "Share your link", desc: "Post your unique URL on social media or send it to friends." },
          { step: "3", title: "Read messages", desc: "View incoming anonymous feedback directly in your dashboard." }
        ].map((item) => (
          <div key={item.step} className="p-6 rounded-xl border border-slate-800 bg-slate-900/40">
            <div className="text-blue-500 font-bold mb-2">Step {item.step}</div>
            <h3 className="font-semibold mb-1">{item.title}</h3>
            <p className="text-xs text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}