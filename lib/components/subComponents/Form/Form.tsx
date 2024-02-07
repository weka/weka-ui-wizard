import { useEffect, useRef, useState } from 'react'
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
  useWatch
} from 'react-hook-form'
import clsx from 'clsx'
import { pickBy } from 'lodash'
import {
  TextField,
  FormSwitch,
  TextBox,
  TagsBox,
  Select,
  IpSubnetTextBox,
  LoginField,
  TextSelectBox,
  IpTextBox,
  TextArea,
  IpRangeTextBox,
  Button,
  ShowMore,
  DateTimePicker,
  CustomizableSelect,
  Info
} from '@weka.io/weka-ui-components'

import {
  EMPTY_STRING,
  FORM_INPUTS,
  FORM_VALIDATIONS
} from '../../../utils/consts'
import utils from '../../../utils/utils'
import { useToggle } from '../../../hooks'
import InputsList from './InputsList'

import './form.scss'

export function getInputType(type: string) {
  const inputsTypes = {
    [FORM_INPUTS.LOGIN_FIELD]: LoginField,
    [FORM_INPUTS.TEXT_FIELD]: TextField,
    [FORM_INPUTS.TEXT_BOX]: TextBox,
    [FORM_INPUTS.TAGS_BOX]: TagsBox,
    [FORM_INPUTS.SELECT]: Select,
    [FORM_INPUTS.SWITCH]: FormSwitch,
    [FORM_INPUTS.TEXT_SELECT]: TextSelectBox,
    [FORM_INPUTS.IP_TEXT_BOX]: IpTextBox,
    [FORM_INPUTS.IP_SUBNET_TEXT_BOX]: IpSubnetTextBox,
    [FORM_INPUTS.IP_RANGE_TEXT_BOX]: IpRangeTextBox,
    [FORM_INPUTS.TEXT_AREA]: TextArea,
    [FORM_INPUTS.DATE_PICKER]: DateTimePicker,
    [FORM_INPUTS.CUSTOM_SELECT]: CustomizableSelect
  }
  return inputsTypes[type]
}

function getValidations(validations, getValues) {
  const validationTypes = {
    [FORM_VALIDATIONS.REQUIRED]: (value: number | string) =>
      utils.isEmpty(value) ? 'required' : false,
    [FORM_VALIDATIONS.NOT_NEGATIVE]: (value: number) =>
      value < 0 ? 'Can`t be Negative' : false,
    [FORM_VALIDATIONS.POSITIVE]: (value: number) =>
      value < 1 ? 'Must be greater than 0' : false
  }

  if (utils.isEmpty(validations)) {
    return () => true
  }
  return (value) => {
    let error = EMPTY_STRING
    validations.forEach((validation) => {
      let validMessage = EMPTY_STRING
      if (utils.isString(validation)) {
        validMessage = validationTypes[validation](value)
      } else if (validation instanceof Function) {
        validMessage = validation(value)
      } else if (utils.isObject(validation)) {
        const { dependField, checkFunction } = validation
        validMessage = checkFunction(value, getValues()[dependField])
      }
      if (validMessage && !error) {
        error = validMessage
      }
    })
    return error || true
  }
}

function startWatchAndReturnHide({ checkHide, changeValue, field }, control) {
  const { setValue } = useFormContext()
  const values = useWatch({ control })
  if (checkHide && checkHide(values)) {
    return true
  }
  if (changeValue) {
    const newValue = changeValue(values)
    if (newValue !== undefined && newValue !== values[field]) {
      setTimeout(() => setValue(field, newValue), 1)
    }
  }
  return false
}

function getPlaceholder(placeHolders, keys, getValues, field) {
  if (utils.isEmpty(placeHolders)) {
    return null
  }
  const watchValue = getValues(placeHolders.key)
  if (utils.isEmpty(keys)) {
    return placeHolders.placeholders?.[watchValue]?.[field]
  }
  return utils.getNestedValueByString(
    placeHolders.placeholders?.[watchValue],
    keys
  )
}

export function ParseInput({ input, index, setAllValues, selectTab, isList }) {
  const { control, getValues, placeHolders, setValue } = useFormContext()
  const {
    inputComponent,
    defaultValue,
    checkHide,
    changeValue,
    field,
    placeholder,
    placeholderKeys,
    getOptions,
    getNotes,
    getDefaultValue,
    getDependentPlaceHolder,
    autofillMessage,
    notes,
    section,
    autofocus,
    ...restInput
  } = input
  const InputComponent = getInputType(inputComponent)
  const validationFunction = getValidations(input.validations, getValues)
  const dependentOptions = getOptions?.(getValues())
  const dependentNotes = getNotes?.(getValues()) || []
  const dependentDefaultValue = getDefaultValue?.(getValues())
  const dependentPlaceholder = getDependentPlaceHolder?.(getValues())
  const shouldHide = startWatchAndReturnHide(
    { checkHide, changeValue, field },
    control
  )
  const getAllNotes = () => {
    const allNotes = []
    if (utils.isEmpty(getValues(field)) && autofillMessage) {
      allNotes.push(autofillMessage)
    }
    return utils.isEmpty(notes)
      ? [...allNotes, ...dependentNotes]
      : [...allNotes, ...notes, ...dependentNotes]
  }

  useEffect(() => {
    if (shouldHide) {
      if (dependentDefaultValue) {
        setValue(field, dependentDefaultValue)
      } else {
        setValue(field, defaultValue)
      }
    } else {
      if (dependentDefaultValue && !getValues().field) {
        setValue(field, dependentDefaultValue)
      }
    }
  }, [
    shouldHide,
    field,
    defaultValue,
    setValue,
    dependentDefaultValue,
    getValues
  ])

  useEffect(() => {
    if (setAllValues) {
      setAllValues((prevState) => ({ ...prevState, ...getValues() }))
    }
  }, [getValues(field)])

  return (
    !shouldHide && (
      <>
        <Controller
          name={input.field}
          isClearable
          rules={{ validate: validationFunction }}
          defaultValue={dependentDefaultValue || defaultValue}
          control={control}
          render={({ field: formField, fieldState: { error } }) => (
            <div
              className={clsx({
                'field-container': true,
                'field-container-list': isList,
                'field-container-hidden': selectTab && section !== selectTab
              })}
              data-testid={input.field}
            >
              <InputComponent
                {...restInput}
                {...(!!dependentOptions && { options: dependentOptions })}
                placeholder={
                  dependentPlaceholder ||
                  placeholder ||
                  (utils.isEmpty(changeValue)
                    ? getPlaceholder(
                        placeHolders,
                        placeholderKeys,
                        getValues,
                        input.field
                      )
                    : EMPTY_STRING)
                }
                onChange={formField.onChange}
                value={formField.value}
                error={error?.message}
                isRequired={input.validations?.includes(
                  FORM_VALIDATIONS.REQUIRED
                )}
                autoFocus={autofocus || index === 0}
              />
            </div>
          )}
        />
        {!utils.isEmpty(getAllNotes()) && (
          <div
            className={clsx({
              'input-notes': true,
              'input-notes-hidden': selectTab && section !== selectTab
            })}
          >
            {getAllNotes().map((note) => (
              <span key={note} className='note'>{`• ${note}`}</span>
            ))}
          </div>
        )}
      </>
    )
  )
}

function FormSection({ section, mainIndex, allInputs }) {
  const { getValues, watch } = useFormContext()
  const {
    inputs,
    title,
    toggle,
    info,
    disableToggle,
    toggleTooltip,
    watchOn,
    showDivider,
    shouldBeInitiallyOpen,
    setAllValues
  } = section
  const [isClose, toggleSection] = useToggle(!shouldBeInitiallyOpen)
  const cls = clsx({
    'form-section': true,
    'has-title': !!title,
    'form-section-divided': !!showDivider,
    'form-section-divided-closed': !!showDivider && toggle && isClose
  })

  const watchValues = {}
  watchOn?.forEach((dependency) => {
    const { key } = dependency
    watchValues[key] = watch(
      key,
      allInputs.find((input) => input.field === key)?.defaultValue
    )
  })

  const shouldRender =
    !watchOn || watchOn.every(({ key, value }) => watchValues[key] === value)

  return (
    shouldRender && (
      <div className={cls}>
        <div className='section-header'>
          {toggle ? (
            <ShowMore
              isClose={isClose}
              onClick={toggleSection}
              disabled={disableToggle?.(getValues())}
              tooltip={toggleTooltip}
            />
          ) : null}
          <span className='heading-4 section-header-title'>{title}</span>
          {info ? <Info data={info} /> : null}
        </div>
        {(!toggle || !isClose) && (
          <div className='form-section-body'>
            {inputs.map((input, index) => (
              <ParseInput
                key={input.key || input.field}
                input={input}
                index={mainIndex + index}
                setAllValues={setAllValues}
              />
            ))}
          </div>
        )}
      </div>
    )
  )
}

function clearEmptyStringAndExe(values, func) {
  const sanitizedValues = pickBy(
    values,
    (value) =>
      value !== EMPTY_STRING && !(Array.isArray(value) && value.length === 0)
  )
  return func(sanitizedValues)
}

function ReactForm(props) {
  const {
    inputs,
    submitText,
    onSubmit,
    onCancel,
    showCancel,
    showSubmit,
    cancelText,
    defaultPlaceholders,
    onValidate,
    defaultValues,
    disableSubmitUntilValid,
    extraClass,
    allValues,
    setAllValues,
    selectTab,
    onFormValid,
    onFormInvalid
  } = props
  const formMethods = useForm({
    ...(disableSubmitUntilValid && { mode: 'onChange' }),
    defaultValues
  })
  const [isClickLoading, setClickLoading] = useState(false)
  const [isValidLoading, setValidLoading] = useState(false)
  const mounted = useRef(false)

  useEffect(() => {
    if (onFormValid && onFormInvalid) {
      console.log('%cISVALID', 'color: blue', formMethods.formState.isValid)
      console.log('%cERRORS', 'color: red', formMethods.formState.errors)
      console.log('%callValues', 'color: green', allValues)
      formMethods.trigger()
      if (formMethods.formState.isValid) {
        clearEmptyStringAndExe(allValues, onFormValid)
      } else {
        onFormInvalid(formMethods.formState.errors)
        onFormValid(null)
      }
    }
  }, [formMethods.formState.isValid, formMethods.formState.errors, allValues])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  return (
    <FormProvider {...formMethods} placeHolders={defaultPlaceholders}>
      <form
        className={clsx('form', extraClass)}
        onSubmit={(e) => {
          e.preventDefault()
          formMethods.handleSubmit((values) => {
            setClickLoading(true)
            return clearEmptyStringAndExe(values, onSubmit).finally(() => {
              if (mounted.current) {
                setClickLoading(false)
              }
            })
          })()
        }}
      >
        <div className='form-body'>
          {inputs.map((input, index) => {
            if (input.inputComponent === FORM_INPUTS.INPUTS_SECTION) {
              return (
                <FormSection
                  key={input.key}
                  section={input}
                  allInputs={inputs}
                  mainIndex={index}
                  setAllValues={setAllValues}
                />
              )
            }
            if (input.inputComponent === FORM_INPUTS.LIST) {
              return (
                <InputsList
                  list={input}
                  key={input.key || input.field}
                  name={input.field}
                  listIndex={index}
                  selectTab={selectTab}
                  setAllValues={setAllValues}
                />
              )
            }
            return (
              <ParseInput
                key={input.key || input.field}
                input={input}
                index={index}
                setAllValues={setAllValues}
                selectTab={selectTab}
              />
            )
          })}
        </div>
        <div className='dialog-actions'>
          {showCancel && (
            <Button empty onClick={onCancel}>
              {cancelText || 'Close'}
            </Button>
          )}
          {onValidate && (
            <Button
              empty
              isLoading={isValidLoading}
              onClick={formMethods.handleSubmit((values) => {
                setValidLoading(true)
                return clearEmptyStringAndExe(values, onValidate).finally(() =>
                  setValidLoading(false)
                )
              })}
            >
              Validate
            </Button>
          )}
          {showSubmit && (
            <Button
              type='submit'
              isLoading={isClickLoading}
              disable={
                disableSubmitUntilValid && !formMethods.formState.isValid
              }
            >
              {submitText || 'Save'}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

export default ReactForm
