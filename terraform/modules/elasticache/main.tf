resource "aws_elasticache_replication_group" "this" {
  replication_group_id       = var.name
  description                = "elasticache rep group"
  node_type                  = "cache.t2.medium"
  port                       = var.cache_port
  parameter_group_name       = "default.redis7.cluster.on"
  engine_version             = "7.0"
  automatic_failover_enabled = true // enabling this is required for cluster mode
  subnet_group_name          = aws_elasticache_subnet_group.this.name
  security_group_ids         = [aws_security_group.this.id]

  num_node_groups         = var.num_node_groups
  replicas_per_node_group = var.replicas_per_node_group

  at_rest_encryption_enabled = var.at_rest_encryption_enabled
  transit_encryption_enabled = var.transit_encryption_enabled
  user_group_ids             = [aws_elasticache_user_group.this.id]
}

resource "aws_elasticache_subnet_group" "this" {
  name       = "${var.name}-subnet-group"
  subnet_ids = var.subnet_ids
}

resource "aws_security_group" "this" {
  name        = "allow_tls"
  description = "Allow TLS inbound traffic"
  vpc_id      = var.vpc_id


  tags = {
    Name = var.name
  }
}

resource "aws_security_group_rule" "ingress_from_cidr" {
  count             = length(var.sg_ingress_rule_source_cidr) > 0 ? 1 : 0
  from_port         = var.cache_port
  protocol          = "tcp"
  cidr_blocks       = var.sg_ingress_rule_source_cidr
  to_port           = var.cache_port
  type              = "ingress"
  security_group_id = aws_security_group.this.id
}

resource "aws_security_group_rule" "ingress_from_source_sg_id" {
  count                    = length(var.sg_ingress_rule_source_security_group_ids)
  from_port                = var.cache_port
  protocol                 = "tcp"
  source_security_group_id = element(var.sg_ingress_rule_source_security_group_ids, count.index)
  to_port                  = var.cache_port
  type                     = "ingress"
  security_group_id        = aws_security_group.this.id
}
