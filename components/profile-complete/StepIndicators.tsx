'use client'

import { CheckCircleIcon } from '@heroicons/react/24/outline'
import type { StepIndicatorProps } from './types'

export function StepIndicators({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isActive = currentStep === stepNumber
        const isCompleted = currentStep > stepNumber

        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md'
                    : isCompleted
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                }`}
                onClick={() => onStepClick?.(stepNumber)}
                role={onStepClick ? 'button' : undefined}
                tabIndex={onStepClick ? 0 : undefined}
              >
                {isCompleted ? (
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`mt-1 text-[10px] font-medium uppercase tracking-wide ${
                  isActive ? 'text-primary-700' : isCompleted ? 'text-primary-700' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 h-0.5 mx-2 mb-3.5 ${
                  isCompleted ? 'bg-primary-200' : 'bg-gray-100'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
