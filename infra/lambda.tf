# Create Item Lambda
resource "aws_lambda_function" "create_item" {
  filename         = "../backend/dist/createItem.zip"
  function_name    = "${var.app_name}-create-item"
  role            = aws_iam_role.lambda_role.arn
  handler         = "createItem.handler"
  runtime         = "nodejs18.x"
  timeout         = 30

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = aws_dynamodb_table.items.name
      AWS_REGION         = var.aws_region
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.create_item_log_group,
  ]

  tags = local.common_tags
}

# Get Items Lambda
resource "aws_lambda_function" "get_items" {
  filename         = "../backend/dist/getItems.zip"
  function_name    = "${var.app_name}-get-items"
  role            = aws_iam_role.lambda_role.arn
  handler         = "getItems.handler"
  runtime         = "nodejs18.x"
  timeout         = 30

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = aws_dynamodb_table.items.name
      AWS_REGION         = var.aws_region
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic_execution,
    aws_cloudwatch_log_group.get_items_log_group,
  ]

  tags = local.common_tags
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "create_item_log_group" {
  name              = "/aws/lambda/${var.app_name}-create-item"
  retention_in_days = 14
  tags              = local.common_tags
}

resource "aws_cloudwatch_log_group" "get_items_log_group" {
  name              = "/aws/lambda/${var.app_name}-get-items"
  retention_in_days = 14
  tags              = local.common_tags
}

# Lambda permissions for API Gateway
resource "aws_lambda_permission" "create_item_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_item.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "get_items_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_items.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}