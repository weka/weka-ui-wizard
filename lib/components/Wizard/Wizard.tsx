import type { TFValues } from '../../types/configTypes.ts'
import type { WizardProps } from '../../WizardView/WizardView.tsx'
import type { JsonValue, UnfilledFields } from '../../context/wizardContext.tsx'

import Questionnaire from './Questionnaire'
import RightSidebar from './RightSidebar'
import FormatHandler from './FormatHandler'
import { useWizardContext } from '../../context/wizardContext.tsx'

import classes from './wizard.module.scss'

interface CommonTabValues {
  key: string
  title: string
  downloadFunc?: (value: unknown) => void
}

export type ParserTab = CommonTabValues & {
  parser: (json: TFValues | null) => unknown
}

export type ContentTab = CommonTabValues & {
  content: string | JsonValue | UnfilledFields
}

export type WizardTab = ParserTab | ContentTab

export interface IncompleteTab {
  key: string
  title: string
}

function Wizard({
  config,
  tabs,
  interchangeableTabs,
  projectName,
  ...rest
}: WizardProps) {
  const { jsonValue } = useWizardContext()

  return (
    <div className={classes.layoutWrapper}>
      <div className={classes.contentWrapper}>
        <div className={classes.wizard}>
          <Questionnaire config={config} />
          {!!jsonValue && interchangeableTabs?.length === 2 ? (
            <FormatHandler
              interchangeableTabs={interchangeableTabs}
              projectName={projectName}
            />
          ) : null}
          <RightSidebar
            tabs={tabs}
            interchangeableTabs={interchangeableTabs}
            {...rest}
          />
        </div>
      </div>
    </div>
  )
}

export default Wizard
