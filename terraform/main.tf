module "vpc" {
  source = "./modules/vpc"

  name            = var.name
  cidr            = var.vpc_cidr
  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
}

module "eks" {
    source = "./modules/eks"

    cluster_name = var.name

    vpc_id     = module.vpc.vpc_id
    subnet_ids = module.vpc.private_subnets
    
}