import type { IncompleteTab, WizardTab } from '../components/Wizard/Wizard.tsx'
import type { HandledSection } from 'types/wizardTypes.ts'

import '../style/app.scss'
import '../style/index.scss'
import '../style/fonts.scss'

import '@weka.io/weka-ui-components/dist/style/theme.scss'

import { ThemeProvider } from '@mui/material'

import MUItheme from '../style/MUItheme.ts'
import { WizardContextProvider } from '../context/wizardContext.tsx'
import Wizard from '../components/Wizard'

export interface InterchangeableTab {
  key: string
  isOnByDefault: boolean
  label?: string
}

export type InterchangeableTabs = [InterchangeableTab, InterchangeableTab]

export interface WizardProps {
  projectName: string
  config: HandledSection[]
  //TODO: make generic for handled config
  tabs: WizardTab[]
  incompleteTab?: IncompleteTab
  downloadBtnText?: string
  interchangeableTabs?: InterchangeableTabs
}

function WizardView(props: WizardProps) {
  const { config } = props
  return (
    <ThemeProvider theme={MUItheme}>
      <WizardContextProvider config={config}>
        <Wizard {...props} />
      </WizardContextProvider>
    </ThemeProvider>
  )
}

export default WizardView
