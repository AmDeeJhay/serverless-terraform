locals {
  common_tags = {
    Environment = var.environment
    Application = var.app_name
    ManagedBy   = "terraform"
  }
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}