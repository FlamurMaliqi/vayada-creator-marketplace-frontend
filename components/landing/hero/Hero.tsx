'use client'

import { useState } from 'react'

export default function Hero() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Properties Section */}
        <section 
          className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out"
          style={{
            flex: hoveredSection === 'properties' ? '0.8' : hoveredSection === 'creators' ? '0.2' : '1'
          }}
          onMouseEnter={() => setHoveredSection('properties')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/hotel-hero.JPG)'
            }}
          >
            <div className="absolute inset-0 bg-blue-900/70"></div>
          </div>
          <div className="relative z-10 w-full text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-gray-500 border border-white text-white rounded-full text-sm font-medium">
                  For Properties
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white">Less OTAs.</span>
                <br />
                <span className="text-primary-400">More Direct Bookings.</span>
              </h1>
              <p className="text-lg md:text-xl text-white leading-relaxed">
                Streamline your workflow. Convert influencer reach to direct bookings.
              </p>
            </div>
          </div>
        </section>

        {/* Creators Section */}
        <section 
          className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out"
          style={{
            flex: hoveredSection === 'creators' ? '0.8' : hoveredSection === 'properties' ? '0.2' : '1'
          }}
          onMouseEnter={() => setHoveredSection('creators')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/creator-hero.jpg)'
            }}
          >
            <div className="absolute inset-0 bg-blue-900/70"></div>
          </div>
          <div className="relative z-10 w-full text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-gray-500 border border-white text-white rounded-full text-sm font-medium">
                  For Creators
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white">Your Reach.</span>
                <br />
                <span className="text-primary-400">Turned into partnerships.</span>
              </h2>
              <p className="text-lg md:text-xl text-white leading-relaxed">
                Trade your travel influence for partnerships with curated & high-quality hotels worldwide.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

