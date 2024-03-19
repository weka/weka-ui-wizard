import type { TFValues } from '../../types/configTypes.ts';
import type { WizardProps } from '../../WizardView/WizardView.tsx';
import type { JsonValue, UnfilledFields } from '../../context/wizardContext.tsx';
interface CommonTabValues {
    key: string;
    title: string;
    downloadFunc?: (value: unknown) => void;
}
export type ParserTab = CommonTabValues & {
    parser: (json: TFValues | null) => unknown;
};
export type ContentTab = CommonTabValues & {
    content: string | JsonValue | UnfilledFields;
};
export type WizardTab = ParserTab | ContentTab;
export interface IncompleteTab {
    key: string;
    title: string;
}
declare function Wizard({ config, tabs, interchangeableTabs, projectName, ...rest }: WizardProps): import("react/jsx-runtime").JSX.Element;
export default Wizard;
