import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { scanItems } from '@/lib/dynamodb'

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  console.log('Get items request:', JSON.stringify(event, null, 2))

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    const items = await scanItems()

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(items),
    }
  } catch (error) {
    console.error('Error fetching items:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}