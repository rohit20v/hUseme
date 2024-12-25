import {PiHandGrabbingLight, PiRectangleLight} from "react-icons/pi";
import Tool from "./Tool.tsx";
import React, {useEffect} from "react";
import {GiCircle} from "react-icons/gi";
import {RxPencil1} from "react-icons/rx";
import {BsArrow90DegRight} from "react-icons/bs";
import {TOOLS} from "../constants.ts";
import {SaveTool} from "./SaveTool.tsx";
import {useTheme} from "../hooks/useTheme.ts";
import {useColorPicker} from "../hooks/useColorPicker.ts";
import {ColorPickerTool} from "./ColorPickerTool.tsx";
import {ThemeToggler} from "./ThemeToggler.tsx";
import {Stage} from "konva/lib/Stage";

const ToolPickerContainer = ({tool, setTool, stageRef, setSelectedColor}: {
    tool: string,
    setTool: React.Dispatch<React.SetStateAction<string>>
    stageRef: React.RefObject<Stage>
    setSelectedColor: (color: string) => void
}) => {

    const {selectedColor, isPickerVisible, togglePicker, handleColorChange} = useColorPicker();
    const {theme, setTheme} = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    useEffect(() => {
        setSelectedColor(selectedColor)
    }, [selectedColor, setSelectedColor]);

    return (
        <>
            <div className={"toolPickerContainer"}>
                <div className={"tools"}>
                    <SaveTool onClick={() => setTool(TOOLS.SAVE)} stageRef={stageRef}/>

                    <Tool isSelected={tool === TOOLS.SELECT}>
                        <PiHandGrabbingLight
                            color={"black"} size={24}
                            onClick={() => setTool(TOOLS.SELECT)}/>
                    </Tool>
                    <Tool isSelected={tool === TOOLS.ARROW}>
                        <BsArrow90DegRight
                            color={"black"} size={20}
                            onClick={() => setTool(TOOLS.ARROW)}/>
                    </Tool>
                    <Tool isSelected={tool === TOOLS.PENCIL}>
                        <RxPencil1
                            color={"black"} size={24}
                            onClick={() => setTool(TOOLS.PENCIL)}/>
                    </Tool>
                    <Tool isSelected={tool === TOOLS.RECT}>
                        <PiRectangleLight
                            color={"black"} size={24}
                            onClick={() => setTool(TOOLS.RECT)}/>

                    </Tool>
                    <Tool isSelected={tool === TOOLS.CIRCLE}>
                        <GiCircle
                            color={"black"} size={22}
                            onClick={() => setTool(TOOLS.CIRCLE)}/>
                    </Tool>

                    <ColorPickerTool color={selectedColor} isVisible={isPickerVisible} onChange={handleColorChange}
                                     onToggle={togglePicker}/>

                    <ThemeToggler onClick={toggleTheme} theme={theme}/>
                </div>
            </div>
        </>
    );
};

export default ToolPickerContainer;