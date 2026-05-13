import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import BackgroundFX from '@/components/ui/BackgroundFX'
// import Jogos from '@/components/sections/Jogos'
import Venue from '@/components/sections/Venue'
// import Galeria from '@/components/sections/Galeria'
import Sponsors from '@/components/sections/Sponsors'
import WhatIsGoalfest from '@/components/sections/WhatIsGoalfest'
import FaqSection from '@/components/sections/FaqSection'
// import matchesData from '@/data/matches.json'
import sponsorsData from '@/data/sponsors.json'
// import type { Match, SponsorsData } from '@/types'
import type { SponsorsData } from '@/types'

function Divider() {
  return (
    <div className="flex items-center gap-4 px-8 md:px-24 opacity-30">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-green-pt" />
      <div className="w-1 h-1 rounded-full bg-green-pt" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-green-pt" />
    </div>
  )
}

export default function LandingPage() {
  const sponsors = sponsorsData as SponsorsData

  return (
    <>
      <BackgroundFX />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Divider />
        <WhatIsGoalfest />
        <Divider />
        <Venue />
        <Divider />
        {/* <Jogos matches={matches} /> */}
        {/* <Divider /> */}
        {/* <Galeria /> */}
        {/* <Divider /> */}
        <Sponsors data={sponsors} />
        <Divider />
        <FaqSection />
      </main>
      {/* <Footer /> */}
    </>
  )
}
