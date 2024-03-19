import type { Guidance } from '../../../../types/wizardTypes'

import clsx from 'clsx'

import { useWizardContext } from '../../../../context/wizardContext.tsx'
import generalClasses from '../../../../style/generalClasses.ts'

import classes from './guidancePart.module.scss'
function GuidancePart({
  currentGuidancePart
}: {
  currentGuidancePart: Guidance | null
}) {
  const { focusedInput } = useWizardContext()
  const foundInput = currentGuidancePart?.inputsDescription?.find(
    ({ identifier }) => identifier === focusedInput
  )
  return (
    <div className={classes.guidance}>
      <div className={clsx(classes.guidanceBlock, classes.sectionGuidance)}>
        <span
          className={clsx(
            generalClasses.label5,
            classes.sectionTitle,
            generalClasses.bold
          )}
        >
          {currentGuidancePart?.sectionTitle}
        </span>
        <span>
          {currentGuidancePart?.sectionDescription
            ? currentGuidancePart.sectionDescription
            : 'Section description was not provided'}
        </span>
      </div>
      <div className={classes.inputsPart}>
        <div className={classes.divider} />
        <div className={classes.inputsDescriptionWrapper}>
          {foundInput?.description && (
            <div className={classes.guidanceBlock}>
              <span className={generalClasses.label5}>{foundInput.title}</span>
              <span>{foundInput.description}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GuidancePart
