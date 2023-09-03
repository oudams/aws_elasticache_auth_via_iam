variable "vpc_cidr" {
  type = string
}

variable "name" {
  type = string
}

variable "public_subnets_cidr" {
  type = list(string)
}

variable "availability_zones" {
  type = list(string)
}

variable "private_subnets_cidr" {
  type = list(string)
}

variable "enable_nat_gw" {
  default = false
}
