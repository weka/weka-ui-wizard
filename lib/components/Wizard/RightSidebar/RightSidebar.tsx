import { Button, Tab } from '@weka.io/weka-ui-components'

import utils from '../../../utils/utils'
import { useWizardContext } from '../../../context/wizardContext.tsx'
import JsonSidebar from './JsonSidebar'
import UnfilledParts from './UnfilledParts'

import classes from './rightSidebar.module.scss'

function RightSidebar() {
  const { jsonValue, unfilledFields } = useWizardContext()
  const tabs = [
    { title: 'Values', shouldShow: jsonValue },
    { title: 'Incomplete sections', shouldShow: !jsonValue }
  ]

  const getTabs = () => {
    return tabs.map((tab, index) => {
      if (tab.shouldShow) {
        return <Tab key={index} title={tab.title} active={true} />
      }
      return null
    })
  }
  return (
    <div className={classes.rightSidebar}>
      <div>
        <div className={classes.tabsBar}>{getTabs()}</div>
        <div className={classes.rightSidebarContent}>
          {jsonValue ? (
            <JsonSidebar jsonValue={jsonValue} />
          ) : (
            <UnfilledParts unfilledFields={unfilledFields} />
          )}
        </div>
      </div>
      {jsonValue && (
        <div className={classes.generateButton}>
          <Button
            onClick={() => {
              try {
                utils.downloadFile(jsonValue, 'tf_wizard_config.tf.json')
              } catch (e) {
                utils.toastError(e)
              }
            }}
          >
            Generate
          </Button>
        </div>
      )}
    </div>
  )
}

export default RightSidebar
