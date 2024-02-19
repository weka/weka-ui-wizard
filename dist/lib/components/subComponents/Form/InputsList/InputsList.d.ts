import type { Input } from 'types/wizardTypes';
import type { TFValues } from 'types/configTypes';
interface InputsListProps {
    list: {
        label: string;
        info?: string;
        inputsArray: Input[];
        section: string;
        maxLength?: number;
        minLength?: number;
        validations?: string[];
    };
    name: string;
    listIndex: number;
    selectTab?: string;
    setAllValues: (values: TFValues) => void;
}
declare function InputsList({ list, name, listIndex, selectTab, setAllValues }: InputsListProps): import("react/jsx-runtime").JSX.Element;
export default InputsList;
