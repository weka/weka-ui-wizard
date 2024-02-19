import { MIME_TYPES } from './consts';
export interface Dictionary {
    [key: string]: any;
}
declare const utils: {
    insensitiveSort: typeof insensitiveSort;
    isEmpty(val: any): boolean;
    isString: (value: unknown) => value is string;
    isObject: (value: any) => value is Record<string, unknown>;
    formatStringOption: (option: string) => {
        label: string;
        value: string;
    };
    getNestedValueByString: (obj: Record<string, any>, keysString: string) => Record<string, any> | undefined;
    downloadFile: (content: Dictionary, fileName: string, type?: (typeof MIME_TYPES)[keyof typeof MIME_TYPES], shouldStringify?: boolean, replacer?: null, space?: number) => void;
    dispatchCustomEvent: (id: string, data: any) => void;
    toastError: (err?: string | Error | {
        data: string;
    }) => void;
    toastSuccess: (message: string) => void;
};
declare function insensitiveSort<Arr extends string[] | number[]>(array: Arr): Arr;
declare function insensitiveSort<Arr extends Record<Key, string>[] | Record<Key, number>[], Key extends string>(array: Arr, key: Key): Arr;
export default utils;
