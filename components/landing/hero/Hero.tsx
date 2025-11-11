import { siteConfig } from '@/config/site'
import { HERO_FEATURES } from '@/lib/constants'
import { Button } from '@/components/ui'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            {siteConfig.hero.title.split(' ').slice(0, 2).join(' ')}
            <span className="text-primary-600 block">
              {siteConfig.hero.title.split(' ').slice(2).join(' ')}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {siteConfig.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={siteConfig.hero.cta.hotel.href}>
              <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl">
                {siteConfig.hero.cta.hotel.text}
              </Button>
            </a>
            <a href={siteConfig.hero.cta.creator.href}>
              <Button variant="outline" size="lg" className="shadow-lg hover:shadow-xl">
                {siteConfig.hero.cta.creator.text}
              </Button>
            </a>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {HERO_FEATURES.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <IconComponent className={feature.iconClassName} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

