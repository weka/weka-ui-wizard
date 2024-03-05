import type { CLUSTER_LOCATIONS, FORM_INPUTS, FORM_VALIDATIONS, INPUT_TYPES } from '../utils/consts';
import type { TFValues } from './configTypes.ts';
type InputComponent = (typeof FORM_INPUTS)[keyof typeof FORM_INPUTS];
export type InputType = (typeof INPUT_TYPES)[keyof typeof INPUT_TYPES];
type InputValidation = (typeof FORM_VALIDATIONS)[keyof typeof FORM_VALIDATIONS];
export type ClusterLocation = (typeof CLUSTER_LOCATIONS)[keyof typeof CLUSTER_LOCATIONS];
export interface Input {
    section: string;
    inputComponent: InputComponent;
    field: string;
    label?: string;
    info?: string;
    validations?: InputValidation[];
    customValueValidation?: (value: string) => RegExpMatchArray | null;
    customValueError?: string;
    checkHide?: (values: Record<string, unknown>) => boolean;
    options?: Option[];
    getOptions?: (values: Record<string, unknown>) => Option[];
    type?: 'text' | 'number' | 'password';
    defaultValue?: string | number | boolean | string[];
    getNotes?: (values: Record<string, unknown>) => string | string[];
    isSingleClearable?: boolean;
    allowDecimal?: boolean;
    allowNegative?: boolean;
    dependentDefaultValues?: string[];
    getDefaultValue?: (values: Record<string, unknown>) => string | number | boolean | undefined;
    autofill?: boolean;
    autofillMessage?: string;
    placeholder?: string;
    getDependentPlaceHolder?: (values: Record<string, unknown>) => string;
    notes?: string[];
    isMulti?: boolean;
    tagsValidation?: (tags: string[]) => string[];
    invalidTagText?: string;
    shouldConvertSubnet2Mask?: boolean;
    inputsArray?: Input[];
    maxLength?: number;
    isHidden?: boolean;
    disabled?: boolean;
}
export interface Section {
    key: string;
    inputComponent: typeof FORM_INPUTS.INPUTS_SECTION;
    info?: string;
    title: string;
    toggle?: boolean;
    watchOn?: Dependency[];
    inputs: Input[];
    disableToggle?: (values: Record<string, unknown>) => boolean;
    toggleTooltip?: string;
    showDivider?: boolean;
    shouldBeInitiallyOpen?: boolean;
}
export interface HandledSection {
    section: string;
    section_title: string;
    inputs: HandledInput[];
    section_info?: string;
    section_dependencies?: Dependency[];
}
interface Dependency {
    key: string;
    value: boolean | string | number | string[];
}
interface DependentOption {
    key: string;
    option_sets: {
        value: string | number | boolean;
        set: string[];
    }[];
    default_set?: string[];
}
interface DependentNote {
    value: string;
    notes: string | string[];
}
interface DependentDefaultValue {
    affecting_key: string;
    default_values_sets: {
        affecting_value: string;
        value: string;
    }[];
}
interface AutofillPlaceholder<T> {
    take_value_from: keyof T;
    dependent_appendix: {
        affecting_key: keyof T;
        appendix_sets: {
            affecting_value: string | number | boolean;
            appendix: string;
        }[];
    };
}
type HandledField = Pick<HandledInput, 'info' | 'title' | 'regex' | 'regex_flag' | 'identifier' | 'allow_negative' | 'allow_decimal'>;
export interface HandledInput {
    section: string;
    type: InputType;
    identifier: string;
    title: string;
    required?: boolean;
    regex?: string;
    regex_flag?: string;
    info?: string;
    options?: string[];
    dependent_options?: DependentOption;
    dependencies: Dependency[];
    invalid_value_error?: string;
    default_value?: string | number | boolean;
    dependent_notes?: DependentNote[];
    allow_decimal?: boolean;
    allow_negative?: boolean;
    dependent_default_values?: DependentDefaultValue;
    autofill_placeholder?: AutofillPlaceholder<TFValues>;
    notes?: string[];
    is_multi?: boolean;
    fields?: HandledField[];
    max_length?: number;
    min?: number;
    max?: number;
    hide_field?: boolean;
    disabled?: boolean;
}
export {};
