import {PiPaintBucketLight} from "react-icons/pi";
import Tool from "./Tool.tsx";
import {ColorPicker} from "react-pick-color";

export const ColorPickerTool = ({color, onToggle, isVisible, onChange}) => (
    <Tool isSelected={false}>
        <PiPaintBucketLight color={color} size={22} onClick={onToggle}/>
        {isVisible && (
            <div style={{position: 'absolute', zIndex: 1000}}>
                <ColorPicker color={color} onChange={onChange}/>
            </div>
        )}
    </Tool>
);