import type { ClusterLocation } from './wizardTypes.ts'

export type TFValues = {
  weka_version: string
  cluster_name: string
  cluster_size: number
  cluster_location: ClusterLocation
  instance_type: string
  region: string
  zone: string
  subscription_id: string
  rg_name: string
  vnet_rg_name: string
  project_id: string
  network_stack_creation: string
  is_private: string
  no_internet: boolean
  subnet_id?: string
  vpc: string
  subnet_internet_access: string
  weka_proxy_vpc_endpoint?: string
  proxy_access?: string
  security_configuration: string
  ssh?: string
  sg_id?: string
  ssh_access?: string
  key_name?: string
  public_key: string
  vm_username?: string
  iam_roles_creation?: string
  instance_iam_profile_arn?: string
  lambda_iam_role_arn?: string
  sfn_iam_role_arn?: string
  event_iam_role_arn?: string
  enable_obs: boolean
  obs_bucket_name?: string
  obs_percentage?: number
  nfs: boolean
  nfs_num_backends?: number
  smb: boolean
  smb_num_backends?: number
  s3: boolean
  s3_num_backends?: number
  alb?: boolean
  alb_alias?: string
  has_clients: boolean
  num_clients?: number
  clients_machine_type?: string
  clients_type?: string
  ami_id?: string
  frontend_on_backends?: boolean
  num_data_drives?: number
  num_protection_drives?: number
  tags?: { [key: string]: string | number }[]
}

type Provider =
  | { aws: { region: string } }
  | { azurerm: { features: Record<string, unknown>; subscription_id: string } }
  | { google: { region: string; project: string } }

export type TFOutput = {
  variable: {
    get_weka_io_token?: Record<string, string>
  }
  output: {
    weka_deployment_output?: {
      value: string
    }
  }
  module: {
    weka_deployment?: {
      get_weka_io_token: string
      instance_type?: string
      availability_zones?: string[]
      subscription_id?: string
      rg_name?: string
      vnet_rg_name?: string
      machine_type?: string
      project_id?: string
      region?: string
      zone?: string
    }
  }
  provider?: Provider
}
