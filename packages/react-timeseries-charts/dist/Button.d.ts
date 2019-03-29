import './Button.css';
export interface Props {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}
export declare const Button: (props: Props) => JSX.Element;
