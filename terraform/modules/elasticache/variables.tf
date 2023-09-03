variable "name" {
  type = string
}
variable "num_node_groups" {
  default = 1
}
variable "replicas_per_node_group" {
  default = 1
}
variable "availability_zones" {
  type = list(string)
}
variable "cache_port" {
  type = number
}
variable "sg_ingress_rule_source_cidr" {
  type    = list(string)
  default = []
}
variable "at_rest_encryption_enabled" {
  default = true
}
variable "transit_encryption_enabled" {
  default = true
}

variable "subnet_ids" {
  type = list(string)
}

variable "sg_ingress_rule_source_security_group_ids" {
  type = list(string)
}

variable "vpc_id" {
  type = string
}

