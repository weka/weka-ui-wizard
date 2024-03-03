import type { PropsWithChildren } from 'react';
export type JsonValue = Record<string, string | boolean | number | string[]> | string | null;
export type UnfilledFields = {
    section: string;
    sectionTitle: string;
    fields: string[];
}[] | null;
export type CurrentFormat = string | null;
export type WizardContextType = {
    jsonValue: JsonValue;
    setJsonValue: (value: JsonValue) => void;
    unfilledFields: UnfilledFields;
    setUnfilledFields: (value: UnfilledFields) => void;
    selectTab: string;
    setSelectTab: (value: string) => void;
    currentFormat: CurrentFormat;
    setCurrentFormat: (format: string) => void;
};
declare const WizardContextProvider: (props: PropsWithChildren) => import("react/jsx-runtime").JSX.Element;
declare const useWizardContext: () => WizardContextType;
export { WizardContextProvider, useWizardContext };
