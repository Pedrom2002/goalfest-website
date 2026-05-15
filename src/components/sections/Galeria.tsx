'use client'

import { useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Masonry from 'react-masonry-css'
import PhotoLightbox from '@/components/ui/PhotoLightbox'
import galleryData from '@/data/gallery.json'

const breakpoints = { default: 3, 1024: 2, 640: 1 }

export default function Galeria() {
  const t = useTranslations('galeria')
  const locale = useLocale()
  const photos = galleryData.map((p) => ({ src: p.src, alt: locale === 'en' ? p.altEn : p.alt }))
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const total = galleryData.length
  const prev = useCallback(() => setLightboxIndex((i) => (i !== null ? (i - 1 + total) % total : null)), [total])
  const next = useCallback(() => setLightboxIndex((i) => (i !== null ? (i + 1) % total : null)), [total])
  const close = useCallback(() => setLightboxIndex(null), [])

  return (
    <section id="galeria" className="py-24 px-4 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl md:text-5xl font-black text-center text-text-primary mb-16 uppercase tracking-wide"
      >
        {t('title')}
      </motion.h2>

      <Masonry breakpointCols={breakpoints} className="flex gap-4" columnClassName="flex flex-col gap-4">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover="hover"
            className="relative group cursor-pointer rounded-xl overflow-hidden"
            onClick={() => setLightboxIndex(i)}
          >
            <motion.div
              variants={{ hover: { scale: 1.05 } }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full"
            >
              <Image src={photo.src} alt={photo.alt} width={600} height={400} className="w-full object-cover" />
            </motion.div>

            {/* Overlay */}
            <motion.div
              variants={{ hover: { opacity: 1 } }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2"
            >
              {/* Expand icon with bounce */}
              <motion.div
                variants={{ hover: { scale: 1, opacity: 1 } }}
                initial={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 1h5M1 1v5M15 1h-5M15 1v5M1 15h5M1 15v-5M15 15h-5M15 15v-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.div>

              {/* Caption slides up */}
              <motion.p
                variants={{ hover: { y: 0, opacity: 1 } }}
                initial={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-white text-xs uppercase tracking-widest text-center px-4"
              >
                {photo.alt}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
      </Masonry>

      <PhotoLightbox
        photos={photos}
        index={lightboxIndex}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </section>
  )
}
