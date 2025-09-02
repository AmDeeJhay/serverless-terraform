export interface Item {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface CreateItemRequest {
  name: string
  description: string
}