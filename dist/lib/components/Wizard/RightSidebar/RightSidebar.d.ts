import type { WizardTab, IncompleteTab } from '../Wizard.tsx';
import type { InterchangeableTabs } from '../../../WizardView/WizardView.tsx';
interface RightSidebarProps {
    tabs: WizardTab[];
    incompleteTab?: IncompleteTab;
    downloadBtnText?: string;
    interchangeableTabs?: InterchangeableTabs;
}
declare function RightSidebar({ tabs, incompleteTab, downloadBtnText, interchangeableTabs }: RightSidebarProps): import("react/jsx-runtime").JSX.Element;
export default RightSidebar;
