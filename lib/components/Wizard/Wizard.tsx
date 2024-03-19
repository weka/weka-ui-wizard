import type { TFValues } from '../../types/configTypes.ts'
import type { WizardProps } from '../../WizardView/WizardView.tsx'
import type { JsonValue, UnfilledFields } from '../../context/wizardContext.tsx'

import { EMPTY_STRING } from 'utils/consts.ts'

import { useWizardContext } from '../../context/wizardContext.tsx'
import Questionnaire from './Questionnaire'
import RightSidebar from './RightSidebar'
import FormatHandler from './FormatHandler'

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
  const { jsonValue, showHandler } = useWizardContext()
  const formattedGuidance = config.map(
    ({ section, section_title, section_description, inputs }) => ({
      section,
      sectionTitle: section_title,
      sectionDescription: section_description || EMPTY_STRING,
      inputsDescription: inputs.map(({ identifier, title, description }) => ({
        identifier,
        title,
        description: description || EMPTY_STRING
      }))
    })
  )

  return (
    <div className={classes.layoutWrapper}>
      <div className={classes.contentWrapper}>
        <div className={classes.wizard}>
          <Questionnaire config={config} />
          {!!jsonValue && interchangeableTabs?.length === 2 && showHandler ? (
            <FormatHandler
              interchangeableTabs={interchangeableTabs}
              projectName={projectName}
            />
          ) : null}
          <RightSidebar
            tabs={tabs}
            interchangeableTabs={interchangeableTabs}
            guidance={formattedGuidance}
            {...rest}
          />
        </div>
      </div>
    </div>
  )
}

export default Wizard
