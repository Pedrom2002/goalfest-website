'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export interface Headliner {
  name: string
  date: string
  image: string
}

const HEADLINERS: Headliner[] = [
  { name: 'Pimba à Bruta',    date: '12 Jun', image: '/headliners/Pimbaaforça.JPG' },
  { name: 'KissCam Party',    date: '13 Jun', image: '/headliners/Kisscamparty.png' },
  { name: 'DJ Rúben da Cruz', date: '17 Jun', image: '/headliners/rubendacruz.webp' },
  { name: 'DJ Overule',       date: '20 Jun', image: '/headliners/dj_overule137073cedefaultlarge_1024.jpg' },
  { name: 'Ben Colton',       date: '25 Jun', image: '/headliners/bencolton.jpg' },
  { name: 'DJ Marques',       date: '26 Jun', image: '/headliners/dj_marques.jpg' },
  { name: 'Força Suprema',    date: '27 Jun', image: '/headliners/Força suprema.jpeg' },
]

export default function HeadlinerCarousel() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-10">
      {HEADLINERS.map((h, i) => (
        <motion.div
          key={h.name}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          className="relative aspect-[3/4] rounded-xl overflow-hidden group"
        >
          <Image
            src={h.image}
            alt={h.name}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 14vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

          {/* Date badge */}
          <div className="absolute top-1.5 right-1.5 bg-[#C8102E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-tight">
            {h.date}
          </div>

          {/* Name */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <p className="text-white text-[10px] font-bold uppercase tracking-wide leading-tight line-clamp-2">
              {h.name}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
