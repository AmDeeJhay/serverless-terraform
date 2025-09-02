import { DynamoDB } from 'aws-sdk'
import { Item } from '@/types/item'

const dynamodb = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
})

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'items-table'

if (!TABLE_NAME) {
  throw new Error('DYNAMODB_TABLE_NAME environment variable is required')
}

export const putItem = async (item: Item): Promise<void> => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Item: item,
    }
    
    await dynamodb.put(params).promise()
  } catch (error) {
    console.error('DynamoDB putItem error:', error)
    throw new Error('Failed to save item to database')
  }
}

export const scanItems = async (): Promise<Item[]> => {
  try {
    const params = {
      TableName: TABLE_NAME,
    }
    
    const result = await dynamodb.scan(params).promise()
    return (result.Items || []) as Item[]
  } catch (error) {
    console.error('DynamoDB scanItems error:', error)
    throw new Error('Failed to fetch items from database')
  }
}