# CloudWatch Log Group for API Gateway access logs
resource "aws_cloudwatch_log_group" "api_gateway_access_logs" {
  name              = "/aws/apigateway/${var.app_name}-${var.environment}"
  retention_in_days = 30
  tags              = local.common_tags
}

# CloudWatch Log Group for Lambda function logs
resource "aws_cloudwatch_log_group" "lambda_logs" {
  for_each          = toset(["create-item", "get-items"])
  name              = "/aws/lambda/${var.app_name}-${each.key}-${var.environment}"
  retention_in_days = 30
  tags              = local.common_tags
}
