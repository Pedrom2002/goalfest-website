import { Suspense } from 'react'
import UnsubscribeContent from './UnsubscribeContent'

export default function UnsubscribePage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-6">
      <Suspense fallback={<p className="text-[#9ca3af] text-sm">Loading…</p>}>
        <UnsubscribeContent />
      </Suspense>
    </main>
  )
}
