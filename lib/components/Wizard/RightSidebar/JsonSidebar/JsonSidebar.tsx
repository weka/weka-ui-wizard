import type { JsonValue } from 'context/wizardContext'

import { TextEditor } from '@weka.io/weka-ui-components'

import classes from './jsonSidebar.module.scss'

function JsonSidebar({
  jsonValue,
  allowCopy
}: {
  jsonValue: JsonValue | string
  allowCopy?: boolean
}) {
  const valueType = typeof jsonValue
  return (
    <TextEditor
      value={
        valueType === 'string' ? jsonValue : JSON.stringify(jsonValue, null, 2)
      }
      mode={valueType === 'string' ? 'text' : 'json'}
      readOnly
      allowCopy={allowCopy}
      maxLines={Infinity}
      extraClass={classes.json}
    />
  )
}

export default JsonSidebar
