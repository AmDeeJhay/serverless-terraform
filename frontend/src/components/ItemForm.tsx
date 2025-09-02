'use client'

import { useState } from 'react'
import { createItem } from '@/lib/api'

interface ItemFormProps {
  onItemCreated: () => void
}

export default function ItemForm({ onItemCreated }: ItemFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !description.trim()) {
      setError('Both name and description are required')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      
      await createItem({ name: name.trim(), description: description.trim() })
      
      // Reset form
      setName('')
      setDescription('')
      
      // Notify parent component
      onItemCreated()
    } catch (err) {
      setError('Failed to create item. Please try again.')
      console.error('Error creating item:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    
      {error && (
        
          {error}
        
      )}
      
      
        
          Item Name
        
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter item name"
          disabled={submitting}
        />
      
      
      
        
          Description
        
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter item description"
          disabled={submitting}
        />
      
      
      
        {submitting ? 'Creating...' : 'Create Item'}
      
    
  )
}