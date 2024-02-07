import utils from '../utils/utils.tsx'

export const FORM_VALIDATIONS = {
  REQUIRED: 'required',
  POSITIVE: 'positive',
  NOT_NEGATIVE: 'not-negative',
  VALID_RANGE: (value: string) => {
    if (!value?.includes('-')) {
      return true
    }
    const range = value.split('.')[3]
    const [start, end] = range.split('-')
    if (parseInt(start, 10) > parseInt(end, 10)) {
      return 'Not a valid IP range'
    }
    return false
  },
  MAX_VALUE: (max: number, customErrorMsg?: string) => (val: number) => {
    if (val > max) {
      return customErrorMsg || `The maximum value is ${max}`
    }
    return false
  },
  MIN_VALUE: (min: number, customErrorMsg?: string) => (val: number) => {
    if (!utils.isEmpty(val) && val < min) {
      return customErrorMsg || `The minimum value is ${min}`
    }
    return false
  },
  MAX_LENGTH:
    (max: number, customErrorMsg?: string) => (val: string | string[]) => {
      if (val?.length > max) {
        return customErrorMsg || `The maximum length is ${max}`
      }
      return false
    },
  MIN_LENGTH:
    (min: number, customErrorMsg?: string) => (val: string | string[]) => {
      if (val?.length < min) {
        return customErrorMsg || `The minimum length is ${min}`
      }
      return false
    },
  REGEX_TEST: (regex: RegExp, customErrorMsg?: string) => (val: string) => {
    if (!utils.isEmpty(val) && !val?.match(regex)) {
      return customErrorMsg || 'Invalid value'
    }
    return false
  }
}

export const FORM_INPUTS = {
  LOGIN_FIELD: 'login-field',
  TEXT_FIELD: 'text-field',
  SWITCH: 'switch',
  TEXT_BOX: 'text-box',
  TEXT_AREA: 'text-area',
  TAGS_BOX: 'tags-box',
  SELECT: 'select',
  DATA_INFO: 'data-info',
  TEXT_SELECT: 'text-select',
  INPUTS_SECTION: 'inputs-section',
  IP_TEXT_BOX: 'masked-text-box',
  IP_SUBNET_TEXT_BOX: 'ip-subnet-text-box',
  IP_RANGE_TEXT_BOX: 'ip-range-text-box',
  DATE_PICKER: 'date-picker',
  CUSTOM_SELECT: 'customizable-select',
  LIST: 'list'
} as const

export const EMPTY_STRING = ''

export const MIME_TYPES = {
  CSV: 'text/csv',
  PLAIN: 'text/plain',
  GZIP: 'application/x-gzip',
  OCTET_STREAM: 'application/octet-stream'
} as const

export const CLUSTER_LOCATIONS = {
  AZURE: 'AZURE',
  AWS: 'AWS',
  GCP: 'GCP',
  OCI: 'OCI'
} as const

export const INPUT_TYPES = {
  STRING: 'string',
  ENUM: 'enum',
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  MULTI_CUSTOM: 'multi_custom',
  IP_SUBNET: 'ip_subnet',
  LIST: 'list'
} as const

export const DIALOG_STATUSES = {
  SUCCESS: 'success',
  ERROR: 'error'
} as const

export const TOASTER_DIALOG = 'toasterDialog'

export const ROUTES = {
  QUESTIONNAIRE: 'questionnaire'
} as const
