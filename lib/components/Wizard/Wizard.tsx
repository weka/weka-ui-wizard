import type { HandledSection } from '../../types/wizardTypes.ts'
import type { TFValues } from '../../types/configTypes.ts'

import { ThemeProvider } from '@mui/material'

import { WizardContextProvider } from '../../context/wizardContext'
import MUItheme from '../../style/MUItheme'
import '../../style/app.scss'
import '../../style/index.scss'
import '../../style/fonts.scss'

import '@weka.io/weka-ui-components/dist/style/theme.scss'

import Questionnaire from './Questionnaire'
import RightSidebar from './RightSidebar'

import classes from './wizard.module.scss'

export interface Wizard {
  config: HandledSection[]
  //TODO: make generic for handled config
  parsingFunc?: (json: TFValues) => unknown
}

function Wizard({ config, parsingFunc }: Wizard) {
  return (
    <ThemeProvider theme={MUItheme}>
      <WizardContextProvider>
        <div className={classes.layoutWrapper}>
          <div className={classes.contentWrapper}>
            <div className={classes.wizard}>
              <Questionnaire config={config} parsingFunc={parsingFunc} />
              <RightSidebar />
            </div>
          </div>
        </div>
      </WizardContextProvider>
    </ThemeProvider>
  )
}

export default Wizard
