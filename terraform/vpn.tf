module "vpn" {
  count  = 1
  source = "./modules/vpn"

  client_cidr_block = var.public_subnets_cidr[2]
  security_group_id = module.networking.vpc_default_security_group_id
  vpc_id            = module.networking.vpc_id

  root_certificate_chain_arn = "arn:aws:acm:ap-southeast-2:883979811993:certificate/e9436b9a-1d4d-48b1-8694-870708f20fa9"
  server_certificate_arn     = "arn:aws:acm:ap-southeast-2:883979811993:certificate/e9436b9a-1d4d-48b1-8694-870708f20fa9"
  public_subnet_id           = module.networking.public_subnet_ids[0]
}
