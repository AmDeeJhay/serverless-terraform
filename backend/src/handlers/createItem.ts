import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { putItem } from '@/lib/dynamodb'
import { CreateItemRequest, Item } from '@/types/item'

export const handler: APIGatewayProxyHandler = async (event): Promise => {
  console.log('Create item request:', JSON.stringify(event, null, 2))

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' }),
      }
    }

    const requestBody: CreateItemRequest = JSON.parse(event.body)
    
    if (!requestBody.name || !requestBody.description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name and description are required' }),
      }
    }

    const item: Item = {
      id: uuidv4(),
      name: requestBody.name,
      description: requestBody.description,
      createdAt: new Date().toISOString(),
    }

    await putItem(item)

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(item),
    }
  } catch (error) {
    console.error('Error creating item:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}