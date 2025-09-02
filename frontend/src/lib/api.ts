import axios from 'axios'

const API_BASE_URL = process.env.API_BASE_URL || 'https://your-api-id.execute-api.us-east-1.amazonaws.com/prod'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

export const createItem = async (item: CreateItemRequest): Promise => {
  const response = await api.post('/items', item)
  return response.data
}

export const getItems = async (): Promise => {
  const response = await api.get('/items')
  return response.data
}