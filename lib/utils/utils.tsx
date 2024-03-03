import { toast } from 'react-toastify'
import { Toast } from '@weka.io/weka-ui-components'

import { Approve, Warning } from '../static/svgs'
import {
  DIALOG_STATUSES,
  EMPTY_STRING,
  MIME_TYPES,
  TOASTER_DIALOG
} from './consts'

export interface Dictionary {
  [key: string]: any
}

const utils = {
  insensitiveSort,
  isEmpty(val: any): boolean {
    return (
      val === null || // null
      val === undefined || // undefined
      val === EMPTY_STRING || // empty string
      (Array.isArray(val) && !val.length) || // empty array
      (Object.prototype.toString.call(val) === '[object Number]' &&
        isNaN(val)) /* eslint-disable-line */ || // NaN
      (typeof val === 'object' &&
        !Object.keys(val).length && // empty object
        Object.prototype.toString.call(val) !== '[object Date]')
    ) // Date
  },
  isString: (value: unknown): value is string =>
    typeof value === 'string' || value instanceof String,
  isObject: (value: any): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value),
  formatStringOption: (option: string) => ({ label: option, value: option }),
  getNestedValueByString: (obj: Record<string, any>, keysString: string) => {
    let ans = obj
    const keys = keysString.split('.')
    for (let i = 0; i < keys.length; i += 1) {
      if (keys[i] in ans) {
        ans = ans[keys[i]]
      } else {
        return undefined
      }
    }
    return ans
  },
  // eslint-disable-next-line max-params
  downloadFile: (
    content: Dictionary,
    fileName: string,
    type: (typeof MIME_TYPES)[keyof typeof MIME_TYPES] = MIME_TYPES.PLAIN,
    shouldStringify = true,
    replacer = null,
    space = 4
  ) => {
    try {
      const formattedContent = shouldStringify
        ? JSON.stringify(content, replacer, space)
        : content
      const downloadLink = document.createElement('a')
      const file = new Blob([formattedContent], { type })
      downloadLink.href = URL.createObjectURL(file)
      downloadLink.download = fileName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      downloadLink.parentNode?.removeChild(downloadLink)
    } catch (e) {
      alert('Download failed')
    }
  },
  dispatchCustomEvent: (id: string, data: any) => {
    document.dispatchEvent(new CustomEvent(id, { detail: data }))
  },
  toastError: (err?: string | Error | { data: string }) => {
    let message: string

    if (typeof err === 'string') {
      message = err
    } else if (err && 'message' in err) {
      message = err.message
    } else if (err && 'data' in err) {
      message = err.data
    } else {
      message = 'Something went wrong'
    }

    if (message.length < 75) {
      toast.error(<Toast message={message} icon={<Warning />} />, {
        position: toast.POSITION.BOTTOM_CENTER,
        icon: false
      })
    } else {
      utils.dispatchCustomEvent(TOASTER_DIALOG, {
        status: DIALOG_STATUSES.ERROR,
        message
      })
    }
  },
  toastSuccess: (message: string) => {
    if (message.length < 100) {
      toast.success(<Toast message={message} icon={<Approve />} />, {
        position: toast.POSITION.BOTTOM_CENTER,
        icon: false
      })
    } else {
      utils.dispatchCustomEvent(TOASTER_DIALOG, {
        status: DIALOG_STATUSES.SUCCESS,
        message
      })
    }
  }
}

function insensitiveSort<Arr extends string[] | number[]>(array: Arr): Arr

function insensitiveSort<
  Arr extends Record<Key, string>[] | Record<Key, number>[],
  Key extends string
>(array: Arr, key: Key): Arr

function insensitiveSort<Key extends string>(
  array: string[] | number[] | Record<Key, string>[] | Record<Key, number>[],
  key?: Key
) {
  const newArray = [...array]
  return newArray.sort((objA, objB) => {
    if (utils.isString(objA) && utils.isString(objB)) {
      return objA.toLowerCase().localeCompare(objB.toLowerCase())
    }

    if (typeof objA === 'number' && typeof objB === 'number') {
      return objA - objB
    }

    if (key && utils.isObject(objA) && utils.isObject(objB)) {
      const a = objA[key]
      const b = objB[key]

      if (utils.isString(a) && utils.isString(b)) {
        return a.toLowerCase().localeCompare(b.toLowerCase())
      }

      if (typeof a === 'number' && typeof b === 'number') {
        return a - b
      }

      return 0
    }

    return 0
  })
}

export default utils
