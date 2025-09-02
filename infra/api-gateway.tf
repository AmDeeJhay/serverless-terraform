# API Gateway
resource "aws_api_gateway_rest_api" "api" {
  name        = "${var.app_name}-api"
  description = "API Gateway for ${var.app_name}"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = local.common_tags
}

# /items resource
resource "aws_api_gateway_resource" "items" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "items"
}

# POST /items method
resource "aws_api_gateway_method" "create_item" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.items.id
  http_method   = "POST"
  authorization = "NONE"
}

# GET /items method
resource "aws_api_gateway_method" "get_items" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.items.id
  http_method   = "GET"
  authorization = "NONE"
}

# OPTIONS method for CORS
resource "aws_api_gateway_method" "items_options" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.items.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# Lambda integrations
resource "aws_api_gateway_integration" "create_item" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.items.id
  http_method = aws_api_gateway_method.create_item.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.create_item.invoke_arn
}

resource "aws_api_gateway_integration" "get_items" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.items.id
  http_method = aws_api_gateway_method.get_items.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.get_items.invoke_arn
}

# CORS integration
resource "aws_api_gateway_integration" "items_options" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.items.id
  http_method = aws_api_gateway_method.items_options.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

# Method responses
resource "aws_api_gateway_method_response" "create_item_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.items.id
  http_method = aws_api_gateway_method.create_item.http_method
  status_code = "200"

  response_headers = {
    "Access-Control-Allow-Origin"  = true
    "Access-Control-Allow-Methods" = true
    "Access-Control-Allow-Headers" = true
  }
}

resource "aws_api_gateway_method_response" "get_items_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.items.id
  http_method = aws_api_gateway_method.get_items.http_method
  status_code = "200"

  response_headers = {
    "Access-Control-Allow-Origin"  = true
    "Access-Control-Allow-Methods" = true
    "Access-Control-Allow-Headers" = true
  }
}

resource "aws_api_gateway_method_response" "items_options_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.items.id
  http_method = aws_api_gateway_method.items_options.http_method
  status_code = "200"

  response_headers = {
    "Access-Control-Allow-Origin"  = true
    "Access-Control-Allow-Methods" = true
    "Access-Control-Allow-Headers" = true
  }
}

# Integration responses
resource "aws_api_gateway_integration_response" "items_options_200" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.items.id
  http_method = aws_api_gateway_method.items_options.http_method
  status_code = aws_api_gateway_method_response.items_options_200.status_code

  response_headers = {
    "Access-Control-Allow-Origin"  = "'*'"
    "Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
    "Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  }

  depends_on = [aws_api_gateway_integration.items_options]
}

# API Gateway deployment
resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.create_item,
    aws_api_gateway_integration.get_items,
    aws_api_gateway_integration.items_options,
  ]

  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = var.environment

  lifecycle {
    create_before_destroy = true
  }

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.items.id,
      aws_api_gateway_method.create_item.id,
      aws_api_gateway_method.get_items.id,
      aws_api_gateway_method.items_options.id,
      aws_api_gateway_integration.create_item.id,
      aws_api_gateway_integration.get_items.id,
      aws_api_gateway_integration.items_options.id,
    ]))
  }
}

# Enable CloudWatch logging for API Gateway
resource "aws_api_gateway_account" "api_gateway_account" {
  cloudwatch_role_arn = aws_iam_role.api_gateway_cloudwatch_role.arn
}

resource "aws_iam_role" "api_gateway_cloudwatch_role" {
  name = "${var.app_name}-api-gateway-cloudwatch-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "api_gateway_cloudwatch_logs" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
  role       = aws_iam_role.api_gateway_cloudwatch_role.name
}

# Stage configuration for logging
resource "aws_api_gateway_stage" "api_stage" {
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.api.id
  stage_name    = var.environment

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_access_logs.arn
    format = jsonencode({
      requestId      = "$requestId"
      ip             = "$requestContext.http.sourceIp"
      caller         = "$requestContext.identity.caller"
      user           = "$requestContext.identity.user"
      requestTime    = "$requestTime"
      httpMethod     = "$httpMethod"
      resourcePath   = "$resourcePath"
      status         = "$status"
      protocol       = "$protocol"
      responseLength = "$responseLength"
    })
  }

  xray_tracing_enabled = true

  tags = local.common_tags
}