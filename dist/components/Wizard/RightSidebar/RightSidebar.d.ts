import type { WizardTab, IncompleteTab } from '../Wizard.tsx';
import type { InterchangeableTabs } from '../../../WizardView/WizardView.tsx';
import type { Guidance } from 'types/wizardTypes.ts';
interface RightSidebarProps {
    tabs: WizardTab[];
    incompleteTab?: IncompleteTab;
    downloadBtnText?: string;
    interchangeableTabs?: InterchangeableTabs;
    guidance: Guidance[];
    guidanceTabTitle?: string;
    hasGuidance?: boolean;
}
declare function RightSidebar({ tabs, incompleteTab, downloadBtnText, interchangeableTabs, guidance, guidanceTabTitle, hasGuidance }: RightSidebarProps): import("react/jsx-runtime").JSX.Element;
export default RightSidebar;
