'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-8">
      <p className="text-red-pt font-display text-7xl font-black">Erro</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-text-primary text-2xl font-bold uppercase tracking-wide">Algo correu mal</h1>
        <p className="text-text-muted text-sm">Ocorreu um erro inesperado. Por favor tenta novamente.</p>
      </div>
      <button
        onClick={reset}
        className="border border-green-pt text-green-pt hover:bg-green-pt hover:text-bg-primary font-bold px-8 py-3 rounded uppercase tracking-wide transition-all duration-200"
      >
        Tentar novamente
      </button>
    </main>
  )
}
