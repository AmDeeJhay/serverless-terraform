variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "serverless-items-app"
}

variable "table_name" {
  description = "DynamoDB table name"
  type        = string
  default     = "items-table"
}