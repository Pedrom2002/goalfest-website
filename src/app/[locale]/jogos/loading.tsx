export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="h-3 w-24 bg-white/10 rounded-full mx-auto mb-4 animate-pulse" />
        <div className="h-12 w-72 bg-white/10 rounded-xl mx-auto mb-3 animate-pulse" />
        <div className="h-4 w-48 bg-white/10 rounded-full mx-auto animate-pulse" />
      </div>
      <div className="flex justify-center gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-8 w-24 bg-white/10 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-bg-surface/60 overflow-hidden animate-pulse">
            <div className="h-10 bg-white/5 border-b border-white/8" />
            <div className="p-4 space-y-3">
              <div className="h-8 bg-white/5 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
