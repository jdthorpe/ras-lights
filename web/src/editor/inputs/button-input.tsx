import React, { useState, useCallback, useContext } from 'react';
// import { ui_button } from "shared/types/user-input";
import { button_input } from "shared/types/parameters";
import { button_value } from 'shared/types/mode';
// import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { Label } from '@fluentui/react/lib/Label';
import { DefaultButton } from '@fluentui/react/lib/Button';
// import { EditorContext, pathEquals } from '../editor';
// import { Label } from '@fluentui/react/lib/Label';

// const styles: Partial<ITextFieldStyles> = { fieldGroup: { width: "5rem" } };

// interface props {
//     spec: button_input;
//     value: button_value;
//     path: number[];
// }

// export const ButtonInput: React.FC<props> = ({ spec, value, path }) => {
// 
//     // const [checked, setChecked] = useState(value)
//     const editor = useContext(EditorContext);
//     const is_active = pathEquals(editor.active_path, path)
//     // const [label, set_label] = useState("")
// 
//     const onLabelChange = useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
//         // newValue && set_label(newValue)
//         editor.set_value({ type: "button", label }, path)
//     }, [])
// 
//     return (
//         <div
//             style={{ backgroundColor: is_active ? "#cccccc" : "tranparent" }}
//             onClick={(ev: React.MouseEvent<HTMLElement>) => {
//                 ev.preventDefault()
//                 ev.stopPropagation()
//                 editor.set_active_path(path)
//             }}>
//             <TextField
//                 label="Button Label"
//                 value={value.label}
//                 onChange={onLabelChange}
//                 styles={styles}
//             />
//             <DefaultButton>{value}</DefaultButton>
//         </div>
//     )
// }

// { value: button_value }

interface props {
    spec: button_input;
    value: button_value;
}
export const ButtonValue: React.FC<props> = ({ spec, value }) => {
    return (<>
        <Label>{spec.label}</Label>
        <DefaultButton>{value.ui.label}</DefaultButton>
    </>)
}

