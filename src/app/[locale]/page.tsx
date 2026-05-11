import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Jogos from '@/components/sections/Jogos'
import Venue from '@/components/sections/Venue'
import Galeria from '@/components/sections/Galeria'
import Sponsors from '@/components/sections/Sponsors'
import matchesData from '@/data/matches.json'
import sponsorsData from '@/data/sponsors.json'
import type { Match, SponsorsData } from '@/types'

export default function LandingPage() {
  const matches = matchesData as Match[]
  const sponsors = sponsorsData as SponsorsData

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Jogos matches={matches} />
        <Venue />
        <Galeria />
        <Sponsors data={sponsors} />
      </main>
      <Footer />
    </>
  )
}
