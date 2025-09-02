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
      setError(null)
      const fetchedItems = await getItems()
      setItems(fetchedItems)
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

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold mb-8">Item Manager</h1>
                
                <ItemForm onItemCreated={fetchItems} />

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Items List</h2>
                  
                  {loading && <p>Loading items...</p>}
                  
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                  
                  {!loading && !error && items.length === 0 && (
                    <p className="text-gray-500">No items found.</p>
                  )}
                  
                  {items.length > 0 && (
                    <ul className="space-y-4">
                      {items.map((item) => (
                        <li 
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-gray-600 mt-1">{item.description}</p>
                          <p className="text-sm text-gray-400 mt-2">
                            Created: {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
