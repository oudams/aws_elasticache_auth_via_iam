module "elaticache-iam-auth" {
  source                                    = "./modules/elasticache"
  name                                      = var.name
  availability_zones                        = var.availability_zones
  cache_port                                = 6379
  sg_ingress_rule_source_security_group_ids = [module.networking.vpc_default_security_group_id]
  subnet_ids                                = module.networking.private_subnet_id
  vpc_id                                    = module.networking.vpc_id
}
