variable "name" {
  type    = string
  default = "Elasticache-IAM-AUTH"
}

variable "vpc_cidr" {
  type = string
}

variable "public_subnets_cidr" {
  type = list(string)
}

variable "private_subnets_cidr" {
  type = list(string)
}

variable "availability_zones" {
  type = list(string)
}

variable "enable_elasticache" {
  type = bool
}

variable "demo_user_password" {
  type = string
}

variable "main_runner" {
  type = string
}
/* VPN */
