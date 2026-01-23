'use client'

import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  itemName: string
  itemType?: string
  message?: string
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Listing?',
  itemName,
  itemType = 'listing',
  message = 'This action cannot be undone. All data associated with this {itemType} will be permanently deleted.',
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  const displayMessage = message.replace('{itemType}', itemType)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <TrashIcon className="w-8 h-8 text-red-600" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-700 mb-1">
            Are you sure you want to delete
          </p>
          <p className="text-gray-900 font-semibold mb-4">
            &quot;{itemName}&quot;?
          </p>
          <p className="text-sm text-gray-600 mb-6">
            {displayMessage}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
            >
              Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
