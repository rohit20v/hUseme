import Tool from "./Tool.tsx";
import {ColorPicker} from "react-pick-color";
import {IoIosColorFill} from "react-icons/io";

export const ColorPickerTool = ({color, onToggle, isVisible, onChange}) => (
    <Tool isSelected={false}>
        <IoIosColorFill color={color} size={22} onClick={onToggle}/>
        {isVisible && (
            <div style={{position: 'absolute', zIndex: 2}}>
                <ColorPicker color={color} onChange={onChange}/>
            </div>
        )}
    </Tool>
);