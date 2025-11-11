import { Navigation, Footer } from '@/components/layout'
import { Hero, HotelsSection, CreatorsSection, HowItWorks } from '@/components/landing'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <HotelsSection />
      <CreatorsSection />
      <HowItWorks />
      <Footer />
    </main>
  )
}

