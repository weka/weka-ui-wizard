import type {
  InputType,
  Input,
  HandledInput,
  HandledSection,
  ClusterLocation
} from '../../../types/wizardTypes.ts'
import type { TFValues } from '../../../types/configTypes'

import { useLocation } from 'react-router-dom'
import { useCallback, useState } from 'react'
import { Tab, Tooltip } from '@weka.io/weka-ui-components'
import clsx from 'clsx'
import { IconButton } from '@mui/material'

import { useWizardContext } from '../../../context/wizardContext'
import {
  FORM_VALIDATIONS,
  FORM_INPUTS,
  EMPTY_STRING,
  INPUT_TYPES
} from '../../../utils/consts'
import utils from '../../../utils/utils'
import { Arrow } from '../../../static/svgs'
import Form from '../../subComponents/Form'

import classes from './questionnaire.module.scss'

const CLUSTER_LOCATION = 'cluster_location'

const getInputByType = (
  type: InputType,
  hasOptions: boolean,
  hasDependentOptions: boolean
) => {
  if (type === INPUT_TYPES.ENUM) {
    return FORM_INPUTS.SELECT
  }
  if (type === INPUT_TYPES.MULTI_CUSTOM) {
    return FORM_INPUTS.TAGS_BOX
  }
  if (type === INPUT_TYPES.STRING) {
    if (hasOptions || hasDependentOptions) {
      return FORM_INPUTS.CUSTOM_SELECT
    }
    return FORM_INPUTS.TEXT_BOX
  }
  if (type === INPUT_TYPES.NUMBER) {
    return FORM_INPUTS.TEXT_BOX
  }
  if (type === INPUT_TYPES.IP_SUBNET) {
    return FORM_INPUTS.IP_SUBNET_TEXT_BOX
  }
  if (type === INPUT_TYPES.LIST) {
    return FORM_INPUTS.LIST
  }
  return FORM_INPUTS.SWITCH
}

interface QuestionnaireProps {
  config: HandledSection[]
}

function Questionnaire({ config }: QuestionnaireProps) {
  const {
    setJsonValue,
    unfilledFields,
    setUnfilledFields,
    selectTab,
    setSelectTab,
    setFocusedInput
  } = useWizardContext()

  const onValidForm = useCallback((values) => {
    if (values) {
      setJsonValue(values)
      setUnfilledFields(null)
    } else {
      setJsonValue(null)
    }
  }, [])

  const getInitialValues = (cloud: ClusterLocation) => {
    const initialValues: TFValues = {}
    config.forEach((section: HandledSection) => {
      section.inputs.forEach((input: HandledInput) => {
        if (input.identifier === CLUSTER_LOCATION) {
          initialValues[input.identifier] = cloud
        } else {
          if ('default_value' in input) {
            initialValues[input.identifier] = input.default_value
          } else if (input.dependent_default_values) {
            const { affecting_key, default_values_sets } =
              input.dependent_default_values
            const foundDefaultValueSet = default_values_sets.find(
              ({ affecting_value }) =>
                initialValues[affecting_key] === affecting_value
            )
            if (foundDefaultValueSet) {
              initialValues[input.identifier] = foundDefaultValueSet.value
            }
          } else {
            initialValues[input.identifier] = EMPTY_STRING
          }
        }
      })
    })

    return initialValues
  }

  function handleInputs(inputs: HandledInput[], cloud?: ClusterLocation) {
    const formattedInputs: Input[] = []
    inputs.forEach((input) => {
      const {
        section,
        identifier,
        type,
        options,
        dependent_options,
        title,
        info,
        regex: regexString,
        regex_flag,
        dependencies,
        required,
        invalid_value_error,
        dependent_notes,
        allow_decimal,
        allow_negative,
        dependent_default_values,
        autofill_placeholder,
        notes,
        is_multi,
        fields,
        max_length,
        min,
        max,
        hide_field,
        disabled,
        description
      } = input
      const fieldType = getInputByType(type, !!options, !!dependent_options)
      const currentInput: Input = {
        field: identifier,
        inputComponent: fieldType,
        section
      }
      if (type === INPUT_TYPES.NUMBER) {
        currentInput.type = INPUT_TYPES.NUMBER
      }
      if (fieldType === FORM_INPUTS.SELECT && !required) {
        currentInput.isSingleClearable = true
      }
      currentInput.label = title
      currentInput.info = info
      if (type === INPUT_TYPES.NUMBER && allow_decimal) {
        currentInput.allowDecimal = true
      }
      if (type === INPUT_TYPES.NUMBER && allow_negative) {
        currentInput.allowNegative = true
      }
      if (type === INPUT_TYPES.ENUM && is_multi) {
        currentInput.isMulti = true
      }
      if (type === INPUT_TYPES.LIST && fields) {
        const formattedFields = fields.map((field) => ({
          ...field,
          section,
          required: true
        }))
        currentInput.inputsArray = handleInputs(formattedFields, cloud)
        if (max_length) {
          currentInput.maxLength = max_length
        }
      }
      if (dependent_default_values) {
        currentInput.getDefaultValue = (values) => {
          const { affecting_key, default_values_sets } =
            dependent_default_values
          const foundDefaultValueSet = default_values_sets.find(
            ({ affecting_value }) => values[affecting_key] === affecting_value
          )
          return foundDefaultValueSet?.value
        }
      }
      if (
        autofill_placeholder &&
        'take_value_from' in autofill_placeholder &&
        'dependent_appendix' in autofill_placeholder
      ) {
        currentInput.autofill = true
        currentInput.autofillMessage = 'For autofill press Tab or Right Arrow'
        const { take_value_from, dependent_appendix } = autofill_placeholder
        const { affecting_key, appendix_sets } = dependent_appendix
        currentInput.getDependentPlaceHolder = (values) => {
          const foundSet = appendix_sets.find(
            ({ affecting_value }) => values[affecting_key] === affecting_value
          )
          if (foundSet && !!values[take_value_from]) {
            return `${values[take_value_from]}${foundSet.appendix}`
          }
          return EMPTY_STRING
        }
      }
      if ('default_value' in input) {
        if (
          (type === INPUT_TYPES.ENUM && is_multi) ||
          type === INPUT_TYPES.MULTI_CUSTOM
        ) {
          currentInput.defaultValue =
            typeof input.default_value === 'string'
              ? [input.default_value]
              : input.default_value
        } else {
          currentInput.defaultValue = input.default_value
        }
      }
      if (identifier === CLUSTER_LOCATION && cloud) {
        currentInput.defaultValue = cloud
      }
      if (type === INPUT_TYPES.BOOLEAN && !('default_value' in input)) {
        currentInput.defaultValue = false
      }
      if (options) {
        currentInput.options = options.map(utils.formatStringOption)
      }
      if (dependent_options) {
        if ('key' in dependent_options && 'option_sets' in dependent_options) {
          const { key, option_sets, default_set } = dependent_options
          currentInput.getOptions = (values) => {
            const foundSet = option_sets.find(
              ({ value }) => values[key] === value
            )?.set
            return (
              foundSet?.map(utils.formatStringOption) ||
              default_set?.map(utils.formatStringOption) ||
              []
            )
          }
        } else {
          currentInput.options = []
        }
      }
      currentInput.validations = []
      if (required) {
        currentInput.validations.push(FORM_VALIDATIONS.REQUIRED)
      }
      if (fieldType === FORM_INPUTS.IP_SUBNET_TEXT_BOX) {
        currentInput.shouldConvertSubnet2Mask = false
        if (!required) {
          currentInput.validations.push((value) => {
            if (
              !!value &&
              value !== '.../' &&
              value !== '...' &&
              (value.includes('..') ||
                value.includes('./') ||
                value.at(-1) === '/')
            ) {
              return 'Invalid Value'
            }
          })
        }
      }
      if (regexString) {
        const regex = regex_flag
          ? new RegExp(regexString, regex_flag)
          : new RegExp(regexString)
        if (fieldType === FORM_INPUTS.CUSTOM_SELECT) {
          currentInput.customValueValidation = (value: string) =>
            value.match(regex)
          if (invalid_value_error) {
            currentInput.customValueError = invalid_value_error
          }
        } else if (fieldType === FORM_INPUTS.TAGS_BOX) {
          currentInput.tagsValidation = (tags: string[]) =>
            tags.filter((tag) => tag.match(regex))
          if (invalid_value_error) {
            currentInput.invalidTagText = invalid_value_error
          }
        } else {
          currentInput.validations.push(FORM_VALIDATIONS.REGEX_TEST(regex))
        }
      }
      if (type === INPUT_TYPES.NUMBER) {
        if (min) {
          currentInput.validations.push(FORM_VALIDATIONS.MIN_VALUE(min))
        }
        if (max) {
          currentInput.validations.push(FORM_VALIDATIONS.MAX_VALUE(max))
        }
      }
      if (dependencies) {
        currentInput.checkHide = (values) =>
          dependencies.some(({ key, value }) => {
            if (typeof value === 'boolean') {
              return Boolean(values[key]) !== value
            }
            if (Array.isArray(value)) {
              return value.every((valuePart) => values[key] !== valuePart)
            }
            return values[key] !== value
          })
      }
      if (notes) {
        currentInput.notes = notes
      }
      if (dependent_notes) {
        currentInput.getNotes = (values) => {
          const foundNotes = dependent_notes.find(
            ({ value }) => values[identifier] === value
          )?.notes
          return foundNotes || EMPTY_STRING
        }
      }
      if (hide_field) {
        currentInput.isHidden = true
      }
      if (disabled) {
        currentInput.disabled = true
      }
      if (description) {
        currentInput.description = description
      }
      formattedInputs.push(currentInput)
    })
    return formattedInputs
  }

  const location = useLocation()
  const cloud: ClusterLocation = location.state?.cloud || 'AWS'
  const [allValues, setAllValues] = useState(getInitialValues(cloud))

  const formattedSections = config.filter(
    (part) =>
      !part.section_dependencies ||
      !part.section_dependencies.some(
        ({ key, value }) => allValues[key] !== value
      )
  )

  const currentSectionIndex = formattedSections.findIndex(
    (section) => section.section === selectTab
  )

  const shownSectionInputs = handleInputs(
    formattedSections.reduce((acc, part) => {
      const { inputs, section } = part
      const formattedInputs = inputs.map((input) => ({ ...input, section }))
      acc.push(...formattedInputs)
      return acc
    }, []),
    cloud
  )

  const shownInputs = shownSectionInputs.filter(
    (input) => !input.checkHide?.(allValues)
  )

  const defaultValues = shownInputs.reduce((acc, input) => {
    if (input.inputComponent === FORM_INPUTS.LIST) {
      acc[input.field] = input.validations?.includes(FORM_VALIDATIONS.REQUIRED)
        ? [
            input.inputsArray?.reduce((accum, insideInput) => {
              if ('defaultValue' in insideInput) {
                accum[insideInput.field] = insideInput.defaultValue
              } else {
                accum[insideInput.field] = EMPTY_STRING
              }
              return accum
            }, {})
          ]
        : []
      return acc
    } else {
      acc[input.field] =
        input.getDefaultValue?.(allValues) || 'defaultValue' in input
          ? input.defaultValue
          : EMPTY_STRING
    }
    return acc
  }, {})

  const getTabs = () => {
    return formattedSections.map((part) => {
      const { section, section_title, section_info } = part
      return (
        <Tab
          key={section}
          hasIncompleteFields={
            !!unfilledFields?.find((item) => item.section === section)
          }
          title={section_title}
          info={section_info}
          active={section === selectTab}
          wrapperClass={classes.tab}
          isSideTab={true}
          setActive={() => {
            setSelectTab(section)
          }}
        />
      )
    })
  }

  return (
    <div className={classes.questionnaire}>
      <div className={classes.questionnaireWrapper}>
        <div className={classes.tabsSidebar}>{getTabs()}</div>
        <div className={classes.formContainer}>
          <div className={classes.formWrapper}>
            <Form
              inputs={shownInputs}
              defaultValues={defaultValues}
              allValues={allValues}
              setAllValues={setAllValues}
              disableSubmitUntilValid={true}
              selectTab={selectTab}
              onFormValid={onValidForm}
              setFocusedInput={setFocusedInput}
              onFormInvalid={(errors) => {
                const formattedErrors = Object.keys(errors).reduce(
                  (acc, field) => {
                    const foundField = shownInputs.find(
                      (input) => input.field === field
                    )
                    const foundItemInAcc = acc.find(
                      (item) => item?.section === foundField?.section
                    )
                    if (foundItemInAcc) {
                      foundItemInAcc.fields.push(field)
                    } else {
                      const foundSection = formattedSections.find(
                        (part) => part.section === foundField?.section
                      )
                      if (
                        foundSection &&
                        foundField.section &&
                        foundSection.section_title
                      ) {
                        acc.push({
                          section: foundField?.section,
                          sectionTitle: foundSection?.section_title,
                          fields: [field]
                        })
                      }
                    }
                    return acc
                  },
                  []
                )
                setUnfilledFields(formattedErrors)
              }}
            />
          </div>
          {formattedSections?.length > 1 ? (
            <div className={classes.arrowBtnsContainer}>
              {currentSectionIndex > 0 && (
                <Tooltip data='Previous Section'>
                  <div>
                    <IconButton
                      className={clsx(classes.arrowBtn, classes.prevBtn)}
                      onClick={() =>
                        setSelectTab(
                          formattedSections[currentSectionIndex - 1].section
                        )
                      }
                    >
                      <Arrow />
                    </IconButton>
                  </div>
                </Tooltip>
              )}
              {currentSectionIndex < formattedSections.length - 1 && (
                <Tooltip data='Next Section'>
                  <div>
                    <IconButton
                      className={clsx(classes.arrowBtn, classes.nextBtn)}
                      onClick={() =>
                        setSelectTab(
                          formattedSections[currentSectionIndex + 1].section
                        )
                      }
                    >
                      <Arrow />
                    </IconButton>
                  </div>
                </Tooltip>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Questionnaire
