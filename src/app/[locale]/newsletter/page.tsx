import type { Metadata } from 'next'
import SignupForm from './SignupForm'

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Stay in the loop. No spam, just signal.',
  robots: { index: false, follow: false },
}

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full text-center">
          <div className="inline-block mb-8">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FFD700] border border-[#FFD700]/30 px-3 py-1 rounded-full">
              Newsletter
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#f5f5f5] leading-tight mb-5">
            Stay ahead of{' '}
            <span className="text-[#FFD700]">the curve.</span>
          </h1>

          <p className="text-[#9ca3af] text-lg leading-relaxed mb-10">
            Curated updates delivered straight to your inbox.
            <br className="hidden sm:block" />
            No noise. Unsubscribe any time.
          </p>

          <SignupForm />

          <p className="mt-8 text-xs text-[#555]">
            We respect your privacy. No spam, ever.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] px-6 py-5 text-center">
        <p className="text-xs text-[#444]">
          &copy; {new Date().getFullYear()} Goalfest. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
