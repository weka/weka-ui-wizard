import type { Input } from 'types/wizardTypes'
import type { TFValues } from 'types/configTypes'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Tooltip } from '@weka.io/weka-ui-components'
import clsx from 'clsx'
import { IconButton } from '@mui/material'

import { AddThin, Delete, Info } from '../../../../static/svgs'
import { EMPTY_STRING, FORM_VALIDATIONS } from '../../../../utils/consts'
import { ParseInput } from '../Form'

import generalClasses from 'generalClasses.module.scss'

import './inputsList.scss'

const MIN_REQUIRED_LIST_LENGTH = 1

interface InputsListProps {
  list: {
    label: string
    info?: string
    inputsArray: Input[]
    section: string
    maxLength?: number
    minLength?: number
    validations?: string[]
  }
  name: string
  listIndex: number
  selectTab?: string
  setAllValues: (values: TFValues) => void
}

function InputsList({
  list,
  name,
  listIndex,
  selectTab,
  setAllValues
}: InputsListProps) {
  const { control, watch } = useFormContext<TFValues>()
  const { label, info, inputsArray, section, maxLength, validations } = list
  const { fields, append, remove } = useFieldArray({ control, name })
  const rowToAppend = inputsArray.reduce((acc, input) => {
    acc[input.field] = input.defaultValue || EMPTY_STRING
    return acc
  }, {})
  const entriesLength =
    fields?.length > 0 ? Object.keys(fields[0]).length - 1 : 0
  const watchList = watch(name)
  const isListRequired = validations?.includes(FORM_VALIDATIONS.REQUIRED)

  const getAppendButton = () => {
    return (
      <div>
        <Tooltip data='Add'>
          <IconButton onClick={() => append(rowToAppend)}>
            <AddThin />
          </IconButton>
        </Tooltip>
      </div>
    )
  }

  return (
    <div
      className={clsx({
        'inputs-list': true,
        [generalClasses.hidden]: selectTab && section !== selectTab
      })}
    >
      <div className='inputs-list-header'>
        <div className='inputs-list-header-label-wrapper'>
          <span className='list-label'>
            {label}
            {isListRequired && <span className='required-star'>*</span>}
          </span>
          {info && (
            <Tooltip data={info}>
              <Info />
            </Tooltip>
          )}
        </div>
        {watchList?.length === 0 && getAppendButton()}
      </div>
      {fields.map((item, index) => {
        return (
          <div key={item.id} className='list-part'>
            <div className='list-bracket' />
            <div>
              <div>
                {Object.entries(item)
                  .filter(([key]) => key !== 'id')
                  .map(([key, value], entryIndex) => {
                    const foundInput = inputsArray.find(
                      (input) => input.field === key
                    )
                    return (
                      <div key={`${key}${value}${entryIndex}`}>
                        <ParseInput
                          input={{
                            ...foundInput,
                            field: `${name}.${index}.${key}`,
                            autofocus:
                              entryIndex === 0 &&
                              index === watchList?.length - 1
                          }}
                          key={`${name}.${index}.${key}`}
                          index={listIndex + index}
                          selectTab={selectTab}
                          setAllValues={setAllValues}
                          isList={true}
                        />
                        {entryIndex !== entriesLength - 1 && (
                          <div className='border-between' />
                        )}
                      </div>
                    )
                  })}
              </div>
              <div className='row-icons'>
                {(!maxLength || watchList.length < maxLength) &&
                  getAppendButton()}
                {((isListRequired &&
                  watchList.length > MIN_REQUIRED_LIST_LENGTH) ||
                  !isListRequired) && (
                  <div>
                    <Tooltip data='Remove'>
                      <IconButton onClick={() => remove(index)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default InputsList
