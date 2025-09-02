terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  cloud {
    organization = "your-terraform-org"
    workspaces {
      name = "serverless-app"
    }
  }
}

provider "aws" {
  region = var.aws_region
}