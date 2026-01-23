'use client'

import { Input, Textarea, HotelBadgeIcon } from '@/components/ui'
import {
  BuildingOfficeIcon,
  MapPinIcon,
  GlobeAltIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'
import type { HotelFormState } from '@/lib/types'

interface HotelBasicInfoStepProps {
  form: HotelFormState
  onFormChange: (updates: Partial<HotelFormState>) => void
  error: string
}

export function HotelBasicInfoStep({
  form,
  onFormChange,
  error,
}: HotelBasicInfoStepProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-1">
        <HotelBadgeIcon active={false} />
        <div>
          <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
          <p className="text-xs text-gray-500">Your hotel details</p>
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-5">
        {/* Left Column: Name & Location */}
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Hotel Name"
              type="text"
              value={form.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              required
              placeholder="Your hotel name"
              leadingIcon={<BuildingOfficeIcon className="w-5 h-5" />}
            />

            <Input
              label="Location"
              type="text"
              value={form.location}
              onChange={(e) => onFormChange({ location: e.target.value })}
              required
              placeholder="City, Country"
              error={error && error.includes('Location') ? error : undefined}
              helperText="Country or island, e.g., Bali, Indonesia."
              leadingIcon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Textarea
          label="About"
          value={form.about}
          onChange={(e) => onFormChange({ about: e.target.value })}
          placeholder="Tell potential creators about your properties"
          rows={4}
          maxLength={5000}
          required
          helperText={`${form.about.length}/5000 characters`}
          className="resize-none"
          error={
            (error && error.includes('About') ? error : undefined) ||
            (form.about.trim().length > 0 && form.about.trim().length < 50
              ? `About section must be at least 50 characters (${form.about.length}/5000)`
              : undefined)
          }
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-900">Contact Information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Website"
            type="url"
            value={form.website}
            onChange={(e) => onFormChange({ website: e.target.value })}
            placeholder="https://your-hotel.com"
            required
            error={error && error.includes('Website') ? error : undefined}
            leadingIcon={<GlobeAltIcon className="w-5 h-5 text-gray-400" />}
          />

          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => onFormChange({ phone: e.target.value })}
            placeholder="+1-555-123-4567"
            required
            leadingIcon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
          />
        </div>
      </div>
    </div>
  )
}
