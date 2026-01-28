export interface DeliverableItem {
  type: string
  quantity: number
}

export interface PlatformDeliverable {
  platform: string
  deliverables: DeliverableItem[]
}
