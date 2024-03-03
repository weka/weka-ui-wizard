import type { IncompleteTab, WizardTab } from '../components/Wizard/Wizard.tsx';
import type { HandledSection } from 'types/wizardTypes.ts';
export interface InterchangeableTab {
    key: string;
    isOnByDefault: boolean;
    label?: string;
}
export type InterchangeableTabs = [InterchangeableTab, InterchangeableTab];
export interface WizardProps {
    projectName: string;
    config: HandledSection[];
    tabs: WizardTab[];
    incompleteTab?: IncompleteTab;
    downloadBtnText?: string;
    interchangeableTabs?: InterchangeableTabs;
}
declare function WizardView(props: WizardProps): import("react/jsx-runtime").JSX.Element;
export default WizardView;
