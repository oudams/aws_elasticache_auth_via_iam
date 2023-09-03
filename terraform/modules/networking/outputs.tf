output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "vpc_default_security_group_id" {
  value = aws_vpc.vpc.default_security_group_id
}

output "private_subnet_id" {
  value = aws_subnet.private_subnet.*.id
}
