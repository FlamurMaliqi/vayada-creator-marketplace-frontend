import { useState, useCallback } from 'react'
import type { PlatformDeliverable, DeliverableItem } from '@/components/marketplace/types'

export function usePlatformDeliverables() {
  const [platformDeliverables, setPlatformDeliverables] = useState<PlatformDeliverable[]>([])
  const [customDeliverableInput, setCustomDeliverableInput] = useState('')

  const handlePlatformToggle = useCallback((platform: string) => {
    setPlatformDeliverables((prev: PlatformDeliverable[]) => {
      const existing = prev.find((pd: PlatformDeliverable) => pd.platform === platform)
      if (existing) {
        return prev.filter((pd: PlatformDeliverable) => pd.platform !== platform)
      } else {
        return [...prev, { platform, deliverables: [] }]
      }
    })
  }, [])

  const handleDeliverableToggle = useCallback((platform: string, deliverableType: string) => {
    setPlatformDeliverables((prev: PlatformDeliverable[]) =>
      prev.map((pd: PlatformDeliverable) => {
        if (pd.platform !== platform) return pd
        const existing = pd.deliverables.find((d: DeliverableItem) => d.type === deliverableType)
        if (existing) {
          return {
            ...pd,
            deliverables: pd.deliverables.filter((d: DeliverableItem) => d.type !== deliverableType),
          }
        } else {
          return {
            ...pd,
            deliverables: [...pd.deliverables, { type: deliverableType, quantity: 1 }],
          }
        }
      })
    )
  }, [])

  const handleDeliverableQuantityChange = useCallback((platform: string, deliverableType: string, quantity: number) => {
    if (quantity < 0) return
    setPlatformDeliverables((prev: PlatformDeliverable[]) =>
      prev.map((pd: PlatformDeliverable) => {
        if (pd.platform !== platform) return pd
        const existing = pd.deliverables.find((d: DeliverableItem) => d.type === deliverableType)

        if (quantity === 0) {
          return {
            ...pd,
            deliverables: pd.deliverables.filter((d: DeliverableItem) => d.type !== deliverableType),
          }
        }

        if (existing) {
          return {
            ...pd,
            deliverables: pd.deliverables.map((d: DeliverableItem) =>
              d.type === deliverableType ? { ...d, quantity } : d
            ),
          }
        } else {
          return {
            ...pd,
            deliverables: [...pd.deliverables, { type: deliverableType, quantity }],
          }
        }
      })
    )
  }, [])

  const handleAddCustomDeliverable = useCallback(() => {
    const trimmed = customDeliverableInput.trim()
    if (!trimmed) return

    setPlatformDeliverables((prev: PlatformDeliverable[]) => {
      const existingPlatform = prev.find((pd: PlatformDeliverable) => pd.platform === 'Custom')
      if (existingPlatform) {
        if (existingPlatform.deliverables.some((d: DeliverableItem) => d.type === trimmed)) {
          return prev
        }
        return prev.map((pd: PlatformDeliverable) =>
          pd.platform === 'Custom'
            ? { ...pd, deliverables: [...pd.deliverables, { type: trimmed, quantity: 1 }] }
            : pd
        )
      }
      return [...prev, { platform: 'Custom', deliverables: [{ type: trimmed, quantity: 1 }] }]
    })
    setCustomDeliverableInput('')
  }, [customDeliverableInput])

  const handleRemoveCustomDeliverable = useCallback((type: string) => {
    setPlatformDeliverables((prev: PlatformDeliverable[]) =>
      prev
        .map((pd: PlatformDeliverable) =>
          pd.platform === 'Custom'
            ? { ...pd, deliverables: pd.deliverables.filter((d: DeliverableItem) => d.type !== type) }
            : pd
        )
        .filter((pd: PlatformDeliverable) => pd.platform !== 'Custom' || pd.deliverables.length > 0)
    )
  }, [])

  const isPlatformSelected = useCallback((platform: string) => {
    return platformDeliverables.some((pd) => pd.platform === platform)
  }, [platformDeliverables])

  const getPlatformDeliverables = useCallback((platform: string) => {
    return platformDeliverables.find((pd) => pd.platform === platform)?.deliverables || []
  }, [platformDeliverables])

  const resetDeliverables = useCallback(() => {
    setPlatformDeliverables([])
    setCustomDeliverableInput('')
  }, [])

  return {
    platformDeliverables,
    setPlatformDeliverables,
    customDeliverableInput,
    setCustomDeliverableInput,
    handlePlatformToggle,
    handleDeliverableToggle,
    handleDeliverableQuantityChange,
    handleAddCustomDeliverable,
    handleRemoveCustomDeliverable,
    isPlatformSelected,
    getPlatformDeliverables,
    resetDeliverables,
  }
}
