'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Masonry from 'react-masonry-css'
import PhotoLightbox from '@/components/ui/PhotoLightbox'

const PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800', alt: 'Adeptos no estádio' },
  { src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', alt: 'Bola de futebol' },
  { src: 'https://images.unsplash.com/photo-1551958219-acbc608f2099?w=800', alt: 'Ecrã gigante fanzone' },
  { src: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', alt: 'Adeptos portugueses' },
  { src: 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=800', alt: 'Lisboa ao pôr do sol' },
  { src: 'https://images.unsplash.com/photo-1540747913346-19212a32a168?w=800', alt: 'Celebração golo' },
]

const breakpoints = { default: 3, 1024: 2, 640: 1 }

export default function Galeria() {
  const t = useTranslations('galeria')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + PHOTOS.length) % PHOTOS.length : null))
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % PHOTOS.length : null))

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
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative group cursor-pointer rounded-xl overflow-hidden"
            onClick={() => setLightboxIndex(i)}
          >
            <Image src={photo.src} alt={photo.alt} width={600} height={400} className="w-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
              <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">&#10138;</span>
            </div>
          </motion.div>
        ))}
      </Masonry>

      <PhotoLightbox
        photos={PHOTOS}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={prev}
        onNext={next}
      />
    </section>
  )
}
