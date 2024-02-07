import type { UnfilledFields } from 'context/wizardContext'

import clsx from 'clsx'
import { startCase } from 'lodash'
import { useWizardContext } from 'context/wizardContext'

import classes from './unfilledParts.module.scss'
import generalClasses from 'generalClasses.module.scss'

function UnfilledParts({ unfilledFields }: { unfilledFields: UnfilledFields }) {
  const { setSelectTab } = useWizardContext()
  return (
    <div className={classes.unfilledSections}>
      {unfilledFields?.map(({ section, sectionTitle }) => (
        <div key={section} onClick={() => setSelectTab(section)}>
          <span
            className={clsx(generalClasses.label5, generalClasses.pointer, classes.sectionTitle, generalClasses.bold)}>
            {startCase(sectionTitle)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default UnfilledParts
