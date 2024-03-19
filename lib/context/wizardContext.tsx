import type { PropsWithChildren } from 'react'
import type { HandledSection } from 'types/wizardTypes.ts'

import { createContext, useContext, useMemo, useState } from 'react'

import { EMPTY_STRING } from '../utils/consts.ts'

export type JsonValue =
  | Record<string, string | boolean | number | string[]>
  | string
  | null
export type UnfilledFields =
  | { section: string; sectionTitle: string; fields: string[] }[]
  | null
export type CurrentFormat = string | null
// export type CurrentDescription =
//   | { title: string; description: string }
//   | typeof EMPTY_STRING
export type WizardContextType = {
  jsonValue: JsonValue
  setJsonValue: (value: JsonValue) => void
  unfilledFields: UnfilledFields
  setUnfilledFields: (value: UnfilledFields) => void
  selectTab: string
  setSelectTab: (value: string) => void
  currentFormat: CurrentFormat
  setCurrentFormat: (format: CurrentFormat) => void
  focusedInput: string
  setFocusedInput: (description: string) => void
  showHandler: boolean
  setShowHandler: (value: boolean) => void
}

const WizardContext = createContext<WizardContextType | null>(null)

const WizardContextProvider = (
  props: PropsWithChildren<{ config: HandledSection[] }>
) => {
  const { config, ...rest } = props
  const [jsonValue, setJsonValue] = useState<JsonValue>(null)
  const [unfilledFields, setUnfilledFields] = useState<UnfilledFields>(null)
  const [currentFormat, setCurrentFormat] = useState<CurrentFormat>(null)
  const firstPart = config[0]
  const [selectTab, setSelectTab] = useState<string>(firstPart?.section)
  const [focusedInput, setFocusedInput] = useState<string>(EMPTY_STRING)
  const [showHandler, setShowHandler] = useState<boolean>(false)

  const contextValue = useMemo(
    () => ({
      jsonValue,
      setJsonValue,
      unfilledFields,
      setUnfilledFields,
      selectTab,
      setSelectTab,
      currentFormat,
      setCurrentFormat,
      focusedInput,
      setFocusedInput,
      showHandler,
      setShowHandler
    }),
    [
      jsonValue,
      unfilledFields,
      selectTab,
      currentFormat,
      focusedInput,
      showHandler
    ]
  )

  return <WizardContext.Provider value={contextValue} {...rest} />
}

const useWizardContext = () => {
  const context = useContext(WizardContext)

  if (!context) {
    throw new Error(
      `useWizardContext must be used within the WizardContext provider`
    )
  }

  return context
}

export { WizardContextProvider, useWizardContext }
