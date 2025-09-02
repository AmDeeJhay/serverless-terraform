'use client'

import { useState, useEffect } from 'react'
import ItemForm from '@/components/ItemForm'
import { getItems, Item } from '@/lib/api'

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const data = await getItems()
      setItems(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch items')
      console.error('Error fetching items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleItemCreated = () => {
    fetchItems()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Serverless Items Manager
          </h1>
          <p className="text-lg text-gray-600">
            Create and manage your items with ease
          </p>
        </header>

        {/* Create Item Form */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Item</h2>
          <ItemForm onItemCreated={handleItemCreated} />
        </section>

        {/* Items List */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Items List</h2>
          
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {!loading && !error && items.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No items found. Create your first item above!
            </p>
          )}
          
          {items.length > 0 && (
            <div className="space-y-4">
              {items.map((item: Item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {item.description}
                  </p>
                  <p className="text-sm text-gray-400" suppressHydrationWarning>
                    Created: {new Date(item.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
