import { DynamoDB } from 'aws-sdk'

const dynamodb = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
})

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'items-table'

export const putItem = async (item: any) => {
  const params = {
    TableName: TABLE_NAME,
    Item: item,
  }
  
  return dynamodb.put(params).promise()
}

export const scanItems = async () => {
  const params = {
    TableName: TABLE_NAME,
  }
  
  const result = await dynamodb.scan(params).promise()
  return result.Items || []
}