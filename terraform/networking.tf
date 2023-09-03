module "networking" {
  source = "./modules/networking"

  name                 = var.name
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  private_subnets_cidr = var.private_subnets_cidr
  public_subnets_cidr  = var.public_subnets_cidr
}
