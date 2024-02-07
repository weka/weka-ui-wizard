import type { TFOutput, TFValues } from 'types/configTypes.ts'

import { CLUSTER_LOCATIONS, EMPTY_STRING } from 'utils/consts.ts'

import Wizard from '../lib/components/Wizard'
import testConfig from '../tfconfig.json'

function generateOutputDict(inputDict: TFValues): TFOutput {
  const outputDict: TFOutput = {
    variable: {},
    output: {},
    module: {}
  }
  outputDict.variable.get_weka_io_token = {}
  outputDict.output.weka_deployment_output = {
    value: '${module.weka_deployment}'
  }
  outputDict.module.weka_deployment = {
    get_weka_io_token: '${var.get_weka_io_token}'
  }

  let default_version = EMPTY_STRING
  if (inputDict.cluster_location === CLUSTER_LOCATIONS.AWS) {
    outputDict.provider = {
      aws: {
        region: inputDict.region
      }
    }
    default_version = '1.0.1'
    outputDict.module.weka_deployment.instance_type = inputDict.instance_type
    outputDict.module.weka_deployment.availability_zones = [inputDict.zone]
  } else if (inputDict.cluster_location === CLUSTER_LOCATIONS.AZURE) {
    outputDict.provider = {
      azurerm: {
        features: {},
        subscription_id: inputDict.subscription_id
      }
    }
    default_version = '4.0.2'
    outputDict.module.weka_deployment.instance_type = inputDict.instance_type
    outputDict.module.weka_deployment.subscription_id =
      inputDict.subscription_id
    outputDict.module.weka_deployment.rg_name = inputDict.rg_name
    outputDict.module.weka_deployment.vnet_rg_name = inputDict.vnet_rg_name
  } else if (inputDict.cluster_location === CLUSTER_LOCATIONS.GCP) {
    outputDict.provider = {
      google: {
        region: inputDict.region,
        project: inputDict.project_id
      }
    }
    default_version = '4.0.0'
    outputDict.module.weka_deployment.machine_type = inputDict.instance_type
    outputDict.module.weka_deployment.project_id = inputDict.project_id
    outputDict.module.weka_deployment.region = inputDict.region
    outputDict.module.weka_deployment.zone = inputDict.zone
  }

  const weka_deployment = {
    source: 'weka/weka/' + inputDict.cluster_location.toLowerCase(),
    version: default_version, // TODO: get it from the user in the form
    prefix: 'weka',
    cluster_size: inputDict.cluster_size,
    cluster_name: inputDict.cluster_name
  }

  Object.assign(outputDict.module.weka_deployment, weka_deployment)

  return outputDict
}

// For testing purposes
function App() {
  return (
    <div>
      <Wizard config={testConfig} parsingFunc={generateOutputDict} />
    </div>
  )
}

export default App
