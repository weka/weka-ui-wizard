import type { JsonValue } from 'context/wizardContext'

import { TextEditor } from '@weka.io/weka-ui-components'


import classes from './jsonSidebar.module.scss'

function JsonSidebar({ jsonValue }: { jsonValue: JsonValue }) {
  return (
    <TextEditor
      value={JSON.stringify(jsonValue, null, 2)}
      readOnly
      maxLines={Infinity}
      extraClass={classes.json}
    />
  )
}

export default JsonSidebar
