import type { PropsWithChildren } from 'react';
import type { HandledSection } from 'types/wizardTypes.ts';
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
    setCurrentFormat: (format: CurrentFormat) => void;
    focusedInput: string;
    setFocusedInput: (description: string) => void;
    showHandler: boolean;
    setShowHandler: (value: boolean) => void;
};
declare const WizardContextProvider: (props: PropsWithChildren<{
    config: HandledSection[];
}>) => import("react/jsx-runtime").JSX.Element;
declare const useWizardContext: () => WizardContextType;
export { WizardContextProvider, useWizardContext };
