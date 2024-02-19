import type { PropsWithChildren } from 'react'

import { createContext, useContext, useMemo, useState } from 'react'

import testConfig from '../../tfconfig.json'

export type JsonValue = Record<
  string,
  string | boolean | number | string[]
> | null
export type UnfilledFields =
  | { section: string; sectionTitle: string; fields: string[] }[]
  | null
export type WizardContextType = {
  jsonValue: JsonValue
  setJsonValue: (value: JsonValue) => void
  unfilledFields: UnfilledFields
  setUnfilledFields: (value: UnfilledFields) => void
  selectTab: string
  setSelectTab: (value: string) => void
}

const WizardContext = createContext<WizardContextType | null>(null)

const WizardContextProvider = (props: PropsWithChildren) => {
  const [jsonValue, setJsonValue] = useState<JsonValue>(null)
  const [unfilledFields, setUnfilledFields] = useState<UnfilledFields>(null)
  const firstPart = testConfig[0]
  const [selectTab, setSelectTab] = useState<string>(firstPart?.section)

  const contextValue = useMemo(
    () => ({
      jsonValue,
      setJsonValue,
      unfilledFields,
      setUnfilledFields,
      selectTab,
      setSelectTab
    }),
    [jsonValue, unfilledFields, selectTab]
  )

  return <WizardContext.Provider value={contextValue} {...props} />
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
