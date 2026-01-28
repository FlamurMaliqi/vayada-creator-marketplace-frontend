'use client'

import { MONTHS_ABBR } from '@/lib/constants'
import { CalendarIcon } from '@heroicons/react/24/outline'

interface DateMonthPickerProps {
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  preferredMonths: string[]
  onMonthToggle: (month: string) => void
  isMonthAvailable?: (month: string) => boolean
  dateLabel?: string
}

export function DateMonthPicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  preferredMonths,
  onMonthToggle,
  isMonthAvailable,
  dateLabel = 'Preferred Dates',
}: DateMonthPickerProps) {
  return (
    <div>
      <label className="block text-base font-medium text-gray-900 mb-3">
        {dateLabel}
      </label>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <div className="relative">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <div className="relative">
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              min={dateFrom}
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-3">Or select preferred months</p>
        <div className="grid grid-cols-4 gap-2">
          {MONTHS_ABBR.map((month) => {
            const available = isMonthAvailable ? isMonthAvailable(month) : true

            return (
              <button
                key={month}
                type="button"
                onClick={() => available && onMonthToggle(month)}
                disabled={!available}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${preferredMonths.includes(month)
                  ? 'bg-primary-600 text-white shadow-md'
                  : available
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
              >
                {month}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
