import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 text-xs text-slate-300">
              Anonymous messages • Verified accounts • AI prompts
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Get honest messages — without revealing identities.
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Create your page, share your unique link, and let friends send you anonymous messages.
              You can toggle when you want to receive messages, and keep everything in one dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-3 font-semibold"
              >
                Create your inbox
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 px-5 py-3 font-semibold"
              >
                Login
              </Link>
              <Link
                href="/u/demo"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 hover:bg-slate-900 px-5 py-3 font-semibold"
              >
                View demo page
              </Link>
            </div>
            <div className="text-sm text-slate-400">
              People can send you messages without logging in. Only you need an account.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-2xl">
            <div className="space-y-4">
              <div className="text-sm text-slate-300">How it works</div>
              <div className="grid gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="font-semibold">1) Sign up + verify email</div>
                  <div className="text-sm text-slate-400">We send an OTP to confirm it’s you.</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="font-semibold">2) Share your unique URL</div>
                  <div className="text-sm text-slate-400">Like <span className="text-slate-200">/u/yourname</span>.</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="font-semibold">3) Receive messages in dashboard</div>
                  <div className="text-sm text-slate-400">Toggle accepting messages anytime.</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Built for fun, honesty, and good vibes.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
