'use client'

import { getPlatformIcon } from '@/components/ui'
import { PLATFORM_OPTIONS_WITH_CONTENT, PLATFORM_DELIVERABLES } from '@/lib/constants'
import { XMarkIcon, PlusSmallIcon, MinusSmallIcon, CheckIcon } from '@heroicons/react/24/outline'
import type { DeliverableItem, PlatformDeliverable } from './types'

interface PlatformDeliverablesSelectorProps {
  platformDeliverables: PlatformDeliverable[]
  customDeliverableInput: string
  onCustomDeliverableInputChange: (value: string) => void
  onPlatformToggle: (platform: string) => void
  onDeliverableQuantityChange: (platform: string, type: string, qty: number) => void
  onAddCustomDeliverable: () => void
  onRemoveCustomDeliverable: (type: string) => void
  isPlatformSelected: (platform: string) => boolean
  getPlatformDeliverables: (platform: string) => DeliverableItem[]
  filterPlatforms: (platform: string) => boolean
  label?: string
  customDescription?: string
}

export function PlatformDeliverablesSelector({
  platformDeliverables,
  customDeliverableInput,
  onCustomDeliverableInputChange,
  onPlatformToggle,
  onDeliverableQuantityChange,
  onAddCustomDeliverable,
  onRemoveCustomDeliverable,
  isPlatformSelected,
  getPlatformDeliverables,
  filterPlatforms,
  label = 'Platforms & Expected Deliverables',
  customDescription = "Add any other content you'd like to offer",
}: PlatformDeliverablesSelectorProps) {
  return (
    <>
      <div>
        <label className="block text-base font-medium text-gray-900 mb-4">
          {label} <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {PLATFORM_OPTIONS_WITH_CONTENT.filter(filterPlatforms).map((platform) => {
            const platformSelected = isPlatformSelected(platform)
            const platformDeliverablesList = getPlatformDeliverables(platform)
            const availableDeliverables = PLATFORM_DELIVERABLES[platform] || []

            return (
              <div
                key={platform}
                className={`rounded-2xl transition-all duration-200 border ${platformSelected
                  ? 'border-primary-500 bg-primary-50/40 shadow-sm'
                  : 'border-gray-300 bg-gray-50/30 hover:bg-gray-50/50'
                  }`}
              >
                {/* Platform Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => onPlatformToggle(platform)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${platformSelected
                      ? 'bg-primary-600 border-primary-600'
                      : 'border-primary-400 bg-white'
                      }`}>
                      {platformSelected && <CheckIcon className="w-4 h-4 text-white stroke-[3px]" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-gray-900">
                        {getPlatformIcon(platform, "w-6 h-6")}
                      </div>
                      <span className="text-lg font-semibold text-gray-900">{platform}</span>
                    </div>
                  </div>
                </div>

                {/* Deliverables for this platform */}
                {platformSelected && (
                  <div className="px-4 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {availableDeliverables.map((deliverable) => {
                      const deliverableItem = platformDeliverablesList.find(
                        (d) => d.type === deliverable
                      )
                      const quantity = deliverableItem?.quantity || 0

                      return (
                        <div
                          key={deliverable}
                          className="bg-white px-4 py-3 rounded-xl border border-gray-200 flex items-center justify-between group hover:border-primary-200 transition-colors shadow-sm"
                        >
                          <span className="text-gray-700 font-medium">{deliverable}</span>
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeliverableQuantityChange(platform, deliverable, quantity - 1)
                              }}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${quantity > 0
                                ? 'border-primary-200 text-primary-600 hover:bg-primary-50'
                                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                                }`}
                              disabled={quantity === 0}
                            >
                              <MinusSmallIcon className="w-5 h-5" />
                            </button>
                            <span className={`w-4 text-center text-base font-bold tabular-nums ${quantity > 0 ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeliverableQuantityChange(platform, deliverable, quantity + 1)
                              }}
                              className="w-8 h-8 rounded-full border border-primary-200 text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-all shadow-sm"
                            >
                              <PlusSmallIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Custom Deliverables Section */}
        <div className="mt-6 p-6 border border-gray-300 bg-gray-50/30 rounded-2xl">
          <div className="mb-4">
            <h4 className="text-lg font-bold text-gray-900">Custom Deliverables</h4>
            <p className="text-sm text-gray-500">{customDescription}</p>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={customDeliverableInput}
              onChange={(e) => onCustomDeliverableInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddCustomDeliverable())}
              placeholder="e.g., Blog Post, Drone Footage..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
            />
            <button
              type="button"
              onClick={onAddCustomDeliverable}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all shadow-sm"
            >
              <PlusSmallIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Custom Deliverables List */}
          <div className="space-y-2">
            {getPlatformDeliverables('Custom').map((item) => (
              <div
                key={item.type}
                className="bg-white px-4 py-3 rounded-xl border border-gray-300 flex items-center justify-between shadow-sm animate-in slide-in-from-top-1 duration-200"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onRemoveCustomDeliverable(item.type)}
                    className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                  <span className="text-gray-700 font-medium">{item.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onDeliverableQuantityChange('Custom', item.type, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-primary-200 text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={item.quantity <= 1}
                  >
                    <MinusSmallIcon className="w-5 h-5" />
                  </button>
                  <span className="w-4 text-center text-base font-bold text-gray-900 tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeliverableQuantityChange('Custom', item.type, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-primary-200 text-primary-600 hover:bg-primary-50 flex items-center justify-center transition-all shadow-sm"
                  >
                    <PlusSmallIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {platformDeliverables.some((pd) => pd.deliverables.length > 0) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected Deliverables:</p>
          <ul className="space-y-1">
            {platformDeliverables
              .filter((pd: PlatformDeliverable) => pd.deliverables.length > 0)
              .map((pd: PlatformDeliverable) =>
                pd.deliverables.map((deliverable: DeliverableItem) => (
                  <li key={`${pd.platform}-${deliverable.type}`} className="text-sm text-gray-600">
                    <span className="font-medium">{pd.platform}:</span> {deliverable.quantity}x{' '}
                    {deliverable.type}
                  </li>
                ))
              )}
          </ul>
        </div>
      )}
    </>
  )
}
