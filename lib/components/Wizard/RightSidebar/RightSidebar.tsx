import type {
  WizardTab,
  IncompleteTab,
  ParserTab,
  ContentTab
} from '../Wizard.tsx'
import type {
  JsonValue,
  UnfilledFields
} from '../../../context/wizardContext.tsx'
import type { InterchangeableTabs } from '../../../WizardView/WizardView.tsx'

import { Button, Tab } from '@weka.io/weka-ui-components'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

import generalClasses from '../../../style/generalClasses.ts'
import { useWizardContext } from '../../../context/wizardContext.tsx'
import JsonSidebar from './JsonSidebar'
import UnfilledParts from './UnfilledParts'

import classes from './rightSidebar.module.scss'

interface RightSidebarProps {
  tabs: WizardTab[]
  incompleteTab?: IncompleteTab
  downloadBtnText?: string
  interchangeableTabs?: InterchangeableTabs
}

interface FormattedTab {
  key: string
  content?: string | JsonValue | UnfilledFields
  parser?: (json: JsonValue) => unknown
  shouldShow: boolean
  title: string
  isIncompleteTab?: boolean
  isParsableTab?: boolean
  downloadFunc?: (value: unknown) => void
}

function isParserTab(tab: WizardTab): tab is ParserTab {
  return (tab as ParserTab)?.parser !== undefined
}

function isContentTab(tab: WizardTab): tab is ContentTab {
  return (tab as ContentTab)?.content !== undefined
}

function RightSidebar({
  tabs = [],
  incompleteTab,
  downloadBtnText,
  interchangeableTabs
}: RightSidebarProps) {
  const { jsonValue, unfilledFields, currentFormat } = useWizardContext()

  const initialFormattedTabs: FormattedTab[] = tabs.map((tab) => {
    if (isContentTab(tab)) {
      return { ...tab, shouldShow: true }
    } else if (isParserTab(tab)) {
      return {
        ...tab,
        isParsableTab: true,
        shouldShow: !!jsonValue
      }
    }
  })

  if (incompleteTab) {
    initialFormattedTabs.push({
      key: incompleteTab.key || 'incompleteSections',
      title: incompleteTab.title || 'Incomplete Sections',
      shouldShow: !jsonValue,
      isIncompleteTab: true
    })
  }

  const [formattedTabs, setFormattedTabs] = useState(initialFormattedTabs)
  const [activeTab, setActiveTab] = useState(
    formattedTabs?.filter(({ shouldShow }) => shouldShow)?.[0]
  )

  useEffect(() => {
    const updatedTabs = [...formattedTabs]
    const parsableTabs = formattedTabs.filter(
      ({ isParsableTab }) => isParsableTab
    )
    const incompleteTab = formattedTabs.find(
      ({ isIncompleteTab }) => isIncompleteTab
    )
    if (jsonValue && parsableTabs?.length > 0 && !activeTab?.isParsableTab) {
      parsableTabs.forEach((tab) => {
        const updatedTab = {
          ...tab,
          shouldShow: !(
            tab.key !== currentFormat &&
            interchangeableTabs?.find(
              (interchangeableTab) => interchangeableTab.key === tab.key
            )
          )
        }
        updatedTabs.splice(formattedTabs.indexOf(tab), 1, updatedTab)
      })
      const tabToShow = formattedTabs.find((tab) => currentFormat === tab.key)
      if (tabToShow) {
        const updatedToShow = { ...tabToShow, shouldShow: true }
        updatedTabs.splice(formattedTabs.indexOf(tabToShow), 1, updatedToShow)
        setActiveTab(updatedToShow)
      } else {
        setActiveTab(parsableTabs[0])
      }
      if (incompleteTab) {
        const updatedIncomplete = { ...incompleteTab, shouldShow: false }
        updatedTabs.splice(
          formattedTabs.indexOf(incompleteTab),
          1,
          updatedIncomplete
        )
      }
    } else if (!jsonValue && !!incompleteTab) {
      if (parsableTabs?.length > 0) {
        parsableTabs.forEach((tab) => {
          const updatedTab = { ...tab, shouldShow: false }
          updatedTabs.splice(formattedTabs.indexOf(tab), 1, updatedTab)
        })
      }
      const updatedIncomplete = { ...incompleteTab, shouldShow: true }
      updatedTabs.splice(
        formattedTabs.indexOf(incompleteTab),
        1,
        updatedIncomplete
      )
      setActiveTab(incompleteTab)
    }
    setFormattedTabs(updatedTabs)
  }, [jsonValue])

  useEffect(() => {
    if (currentFormat) {
      const updatedTabs = [...formattedTabs]
      const foundTab = formattedTabs.find((tab) => tab?.key === currentFormat)
      if (foundTab) {
        const updatedFoundTab = {
          ...foundTab,
          shouldShow: true
        }
        setActiveTab(updatedFoundTab)
        updatedTabs.splice(formattedTabs.indexOf(foundTab), 1, updatedFoundTab)
        const pairTab = interchangeableTabs?.find(
          (tab) => tab.key !== foundTab.key
        )
        if (pairTab) {
          const tabToHide = formattedTabs.find((tab) => tab.key === pairTab.key)
          if (tabToHide) {
            updatedTabs.splice(formattedTabs.indexOf(tabToHide), 1, {
              ...tabToHide,
              shouldShow: false
            })
            setFormattedTabs(updatedTabs)
          }
        }
      }
    }
  }, [currentFormat])

  const getTabs = () => {
    return formattedTabs.map((tab, index) => {
      if (tab.shouldShow) {
        return (
          <Tab
            key={index}
            title={tab.title}
            active={activeTab?.key === tab.key}
            setActive={() => setActiveTab(tab)}
          />
        )
      }
      return null
    })
  }
  return (
    <div className={classes.rightSidebar}>
      <div className={classes.rightSidebarWrapper}>
        <div className={clsx(generalClasses.topWithTabs, classes.tabsBar)}>
          {getTabs()}
        </div>
        <div className={classes.rightSidebarContent}>
          {activeTab?.isIncompleteTab ? (
            <UnfilledParts unfilledFields={unfilledFields} />
          ) : (
            <JsonSidebar
              allowCopy={true}
              jsonValue={
                activeTab?.content ||
                (isParserTab(activeTab) &&
                  jsonValue &&
                  activeTab?.parser(jsonValue)) ||
                'Invalid Value. Please provide the `incompleteTab` parameter in order to list all the incomplete sections.'
              }
            />
          )}
        </div>
      </div>
      {activeTab?.downloadFunc && (
        <div className={classes.generateButton}>
          <Button
            onClick={() => {
              const content =
                isParserTab(activeTab) && jsonValue && activeTab?.parser
                  ? activeTab.parser(jsonValue)
                  : activeTab?.content
              return activeTab?.downloadFunc(content)
            }}
          >
            {downloadBtnText || 'Download'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default RightSidebar
