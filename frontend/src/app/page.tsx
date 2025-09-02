'use client'

import { useState, useEffect } from 'react'
import ItemForm from '@/components/ItemForm'
import { getItems, Item } from '@/lib/api'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    <main>
      <h1>Serverless Items Manager</h1>

      {/* Create Item Form */}
      <section>
        <h2>Create New Item</h2>
        <ItemForm onItemCreated={handleItemCreated} />
      </section>

      {/* Items List */}
      <section>
        <h2>Items List</h2>
        {loading && (
          <p>Loading...</p>
        )}
        {error && (
          <p style={{ color: 'red' }}>{error}</p>
        )}
        {!loading && !error && (
          <>
            {items.length === 0 ? (
              <p>No items found. Create your first item!</p>
            ) : (
              items.map((item: Item) => (
                <div key={item.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <small>Created: {new Date(item.createdAt).toLocaleDateString()}</small>
                </div>
              ))
            )}
          </>
        )}
      </section>
    </main>
  )
}