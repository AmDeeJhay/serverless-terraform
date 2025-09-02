# API Gateway outputs
output "api_gateway_id" {
  description = "ID of the API Gateway"
  value       = aws_api_gateway_rest_api.api.id
}

output "api_gateway_url" {
  description = "Base URL of the API Gateway"
  value       = "https://${aws_api_gateway_rest_api.api.id}.execute-api.${var.aws_region}.amazonaws.com/${var.environment}"
}

output "api_gateway_stage_name" {
  description = "API Gateway stage name"
  value       = aws_api_gateway_stage.api_stage.stage_name
}

# Lambda function outputs
output "create_item_function_name" {
  description = "Name of the create item Lambda function"
  value       = aws_lambda_function.create_item.function_name
}

output "create_item_function_arn" {
  description = "ARN of the create item Lambda function"
  value       = aws_lambda_function.create_item.arn
}

output "get_items_function_name" {
  description = "Name of the get items Lambda function"
  value       = aws_lambda_function.get_items.function_name
}

output "get_items_function_arn" {
  description = "ARN of the get items Lambda function"
  value       = aws_lambda_function.get_items.arn
}

# DynamoDB outputs
output "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  value       = aws_dynamodb_table.items.name
}

output "dynamodb_table_arn" {
  description = "ARN of the DynamoDB table"
  value       = aws_dynamodb_table.items.arn
}

# IAM outputs
output "lambda_role_arn" {
  description = "ARN of the Lambda execution role"
  value       = aws_iam_role.lambda_role.arn
}

output "lambda_role_name" {
  description = "Name of the Lambda execution role"
  value       = aws_iam_role.lambda_role.name
}

# CloudWatch Log Groups
output "create_item_log_group_name" {
  description = "Name of the create item Lambda log group"
  value       = aws_cloudwatch_log_group.create_item_log_group.name
}

output "get_items_log_group_name" {
  description = "Name of the get items Lambda log group"
  value       = aws_cloudwatch_log_group.get_items_log_group.name
}

output "api_gateway_log_group_name" {
  description = "Name of the API Gateway access log group"
  value       = aws_cloudwatch_log_group.api_gateway_access_logs.name
}

# Environment information
output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "app_name" {
  description = "Application name"
  value       = var.app_name
}