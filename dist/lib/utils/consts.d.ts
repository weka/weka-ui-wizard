export declare const FORM_VALIDATIONS: {
    REQUIRED: string;
    POSITIVE: string;
    NOT_NEGATIVE: string;
    VALID_RANGE: (value: string) => boolean | "Not a valid IP range";
    MAX_VALUE: (max: number, customErrorMsg?: string) => (val: number) => string | false;
    MIN_VALUE: (min: number, customErrorMsg?: string) => (val: number) => string | false;
    MAX_LENGTH: (max: number, customErrorMsg?: string) => (val: string | string[]) => string | false;
    MIN_LENGTH: (min: number, customErrorMsg?: string) => (val: string | string[]) => string | false;
    REGEX_TEST: (regex: RegExp, customErrorMsg?: string) => (val: string) => string | false;
};
export declare const FORM_INPUTS: {
    readonly LOGIN_FIELD: "login-field";
    readonly TEXT_FIELD: "text-field";
    readonly SWITCH: "switch";
    readonly TEXT_BOX: "text-box";
    readonly TEXT_AREA: "text-area";
    readonly TAGS_BOX: "tags-box";
    readonly SELECT: "select";
    readonly DATA_INFO: "data-info";
    readonly TEXT_SELECT: "text-select";
    readonly INPUTS_SECTION: "inputs-section";
    readonly IP_TEXT_BOX: "masked-text-box";
    readonly IP_SUBNET_TEXT_BOX: "ip-subnet-text-box";
    readonly IP_RANGE_TEXT_BOX: "ip-range-text-box";
    readonly DATE_PICKER: "date-picker";
    readonly CUSTOM_SELECT: "customizable-select";
    readonly LIST: "list";
};
export declare const EMPTY_STRING = "";
export declare const MIME_TYPES: {
    readonly CSV: "text/csv";
    readonly PLAIN: "text/plain";
    readonly GZIP: "application/x-gzip";
    readonly OCTET_STREAM: "application/octet-stream";
};
export declare const CLUSTER_LOCATIONS: {
    readonly AZURE: "AZURE";
    readonly AWS: "AWS";
    readonly GCP: "GCP";
    readonly OCI: "OCI";
};
export declare const INPUT_TYPES: {
    readonly STRING: "string";
    readonly ENUM: "enum";
    readonly BOOLEAN: "boolean";
    readonly NUMBER: "number";
    readonly MULTI_CUSTOM: "multi_custom";
    readonly IP_SUBNET: "ip_subnet";
    readonly LIST: "list";
};
export declare const DIALOG_STATUSES: {
    readonly SUCCESS: "success";
    readonly ERROR: "error";
};
export declare const TOASTER_DIALOG = "toasterDialog";
export declare const ROUTES: {
    readonly QUESTIONNAIRE: "questionnaire";
};
