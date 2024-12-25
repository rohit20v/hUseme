import {useState} from "react";

export const useColorPicker = () => {
    const [selectedColor, setSelectedColor] = useState("black");
    const [isPickerVisible, setPickerVisible] = useState(false);

    return {
        selectedColor,
        isPickerVisible,
        togglePicker: () => setPickerVisible(prev => !prev),
        handleColorChange: (color: { hex: string }) => setSelectedColor(color.hex)
    };
};