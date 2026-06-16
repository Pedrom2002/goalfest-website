'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export interface Headliner {
  name: string
  date: string
  image: string
}

const HEADLINERS: Headliner[] = [
  { name: 'KissCam Party',    date: '13 Jun', image: '/headliners/Kisscamparty.png' },
  { name: 'DJ Rúben da Cruz', date: '17 Jun', image: '/headliners/ruben-da-cruz.jpeg' },
  { name: 'DJ Overule',       date: '20 Jun', image: '/headliners/dj-overule.jpeg' },
  { name: 'Ben Colton',       date: '25 Jun', image: '/headliners/bencolton.jpg' },
  { name: 'DJ Marques',       date: '26 Jun', image: '/headliners/dj-marques.jpg' },
  { name: 'Força Suprema',    date: '27 Jun', image: '/headliners/forca-suprema.jpeg' },
]

export default function HeadlinerCarousel() {
  return (
    <div className="flex flex-nowrap gap-3 mb-10 overflow-x-auto pb-2 sm:justify-center sm:overflow-visible">
      {HEADLINERS.map((h, i) => (
        <motion.div
          key={h.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="relative aspect-[2/3] w-[130px] sm:w-[150px] lg:w-[160px] flex-shrink-0 rounded-2xl overflow-hidden group"
        >
          <Image
            src={h.image}
            alt={h.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 14vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

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
    </div>
  )
}
