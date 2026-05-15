export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="h-3 w-24 bg-white/10 rounded-full mx-auto mb-4 animate-pulse" />
        <div className="h-12 w-64 bg-white/10 rounded-xl mx-auto animate-pulse" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 bg-white/10 rounded-2xl border border-white/10 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
