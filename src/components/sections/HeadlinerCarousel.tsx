'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export interface Headliner {
  name: string
  date: string
  image: string
}

const HEADLINERS: Headliner[] = [
  { name: 'Pimba à Bruta',   date: '12 Jun', image: '/headliners/Pimbaaforça.JPG' },
  { name: 'KissCam Party',   date: '13 Jun', image: '/headliners/Kisscamparty.png' },
  { name: 'DJ Rúben da Cruz',date: '17 Jun', image: '/headliners/rubendacruz.webp' },
  { name: 'DJ Overule',      date: '20 Jun', image: '/headliners/dj_overule137073cedefaultlarge_1024.jpg' },
  { name: 'Ben Colton',      date: '25 Jun', image: '/headliners/bencolton.jpg' },
  { name: 'DJ Marques',      date: '26 Jun', image: '/headliners/dj_marques.jpg' },
  { name: 'Força Suprema',   date: '27 Jun', image: '/headliners/força suprema.png' },
]

export default function HeadlinerCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <div className="mb-10 -mx-4 px-4 overflow-hidden">
      <motion.div
        ref={trackRef}
        drag="x"
        dragConstraints={{ left: -(HEADLINERS.length * 160 - 600), right: 0 }}
        dragElastic={0.08}
        className="flex gap-3 cursor-grab active:cursor-grabbing select-none"
        style={{ width: 'max-content' }}
      >
        {HEADLINERS.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="relative w-36 h-44 rounded-2xl overflow-hidden flex-shrink-0 group"
          >
            {/* Photo */}
            <Image
              src={h.image}
              alt={h.name}
              fill
              sizes="144px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              draggable={false}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Date badge */}
            <div className="absolute top-2 right-2 bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight">
              {h.date}
            </div>

            {/* Name */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-xs font-bold uppercase tracking-wide leading-tight line-clamp-2">
                {h.name}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll hint fade */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-bg-base to-transparent" />
    </div>
  )
}
