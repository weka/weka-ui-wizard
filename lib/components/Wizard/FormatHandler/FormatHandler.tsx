import type { InterchangeableTabs } from '../../../WizardView/WizardView.tsx'

import { Switch } from '@weka.io/weka-ui-components'
import { useEffect } from 'react'
import { useLocalStorage } from 'react-use'

import { useWizardContext } from '../../../context/wizardContext.tsx'

import classes from './formatHandler.module.scss'

function useFormatHandlerParts(
  interchangeableTabs: InterchangeableTabs
): [InterchangeableTabs, boolean] {
  const [firstPart, secondPart] = interchangeableTabs
  const onByDefaultKey = interchangeableTabs.find(
    ({ isOnByDefault }) => isOnByDefault
  )?.key
  if (onByDefaultKey) {
    return [
      [
        interchangeableTabs.find(({ key }) => key !== onByDefaultKey),
        interchangeableTabs.find(({ key }) => key === onByDefaultKey)
      ],
      true
    ]
  }
  return [[firstPart, secondPart], false]
}

function FormatHandler({
  interchangeableTabs,
  projectName
}: {
  interchangeableTabs: InterchangeableTabs
  projectName: string
}) {
  const projectFormat = `${projectName}-format`
  const { setCurrentFormat } = useWizardContext()
  const [handlerParts, shouldBeOn] = useFormatHandlerParts(interchangeableTabs)
  const [leftSide, rightSide] = handlerParts
  const [isOn, setOn] = useLocalStorage<boolean>(projectFormat, shouldBeOn)

  useEffect(() => {
    if (isOn) {
      setCurrentFormat(rightSide.key)
    } else {
      setCurrentFormat(leftSide.key)
    }
  }, [isOn])

  return (
    <div className={classes.formatHandler}>
      <Switch checked={!!isOn} onChange={() => setOn(!isOn)} />
      <span>{rightSide?.label}</span>
    </div>
  )
}

export default FormatHandler
