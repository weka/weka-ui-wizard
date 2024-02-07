import type { HandledSection } from '../../types/wizardTypes.ts';
import type { TFValues } from '../../types/configTypes.ts';
export interface Wizard {
    config: HandledSection[];
    parsingFunc?: (json: TFValues) => unknown;
}
declare function Wizard({ config, parsingFunc }: Wizard): import("react/jsx-runtime").JSX.Element;
export default Wizard;
