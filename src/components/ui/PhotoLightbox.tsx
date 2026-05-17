'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Photo {
  src: string
  alt: string
}

interface LightboxProps {
  photos: Photo[]
  index: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function PhotoLightbox({ photos, index, onClose, onPrev, onNext }: LightboxProps) {
  const previousFocusRef = useRef<Element | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (index !== null) {
      previousFocusRef.current = document.activeElement
      closeButtonRef.current?.focus()
    } else {
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus()
      }
      previousFocusRef.current = null
    }
  }, [index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()

      if (e.key !== 'Tab' || index === null) return

      const dialog = document.querySelector('[role="dialog"]')
      if (!dialog) return

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.hasAttribute('disabled'))

      if (focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext, index])

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={index !== null ? photos[index]?.alt : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
          <div className="relative z-10 max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[index]?.src ?? ''}
              alt={photos[index]?.alt ?? ''}
              width={1200}
              height={800}
              className="rounded-xl object-cover w-full max-h-[80vh]"
            />
            <button
              onClick={onPrev}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold hover:text-bg-primary transition-colors"
            >
              &#8249;
            </button>
            <button
              onClick={onNext}
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold hover:text-bg-primary transition-colors"
            >
              &#8250;
            </button>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Fechar galeria"
              className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-pt transition-colors"
            >
              &#10005;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
