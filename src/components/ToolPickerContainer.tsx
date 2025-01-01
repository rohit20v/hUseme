import {PiHandGrabbingLight, PiRectangleLight, PiTriangle} from "react-icons/pi";
import Tool from "./Tool.tsx";
import React, {useEffect, useState} from "react";
import {GiCircle} from "react-icons/gi";
import {RxPencil1} from "react-icons/rx";
import {BsArrow90DegRight} from "react-icons/bs";
import {TOOLS} from "../constants.ts";
import {SaveTool} from "./SaveTool.tsx";
import {useColorPicker} from "../hooks/useColorPicker.ts";
import {ColorPickerTool} from "./ColorPickerTool.tsx";
import {Stage} from "konva/lib/Stage";
import {RiDeleteBin2Fill} from "react-icons/ri";

const ToolPickerContainer = ({tool, setTool, stageRef, setSelectedColor, setStrokeWidth, setShapes}: {
    tool: string,
    setTool: React.Dispatch<React.SetStateAction<string>>
    stageRef: React.RefObject<Stage>
    setSelectedColor: (color: string) => void
    setStrokeWidth: (width: number) => void,
    setShapes: () => void
}) => {

    const {selectedColor, isPickerVisible, togglePicker, handleColorChange} = useColorPicker();
    // const {theme, setTheme} = useTheme();
    const [strokeSize, setStrokeSize] = useState<number>(2)

    // todo fix theme toggling
    // const toggleTheme = () => {
    //     setTheme(theme === 'dark' ? 'light' : 'dark');
    // };

    useEffect(() => {
        setSelectedColor(selectedColor)
        setStrokeWidth(strokeSize)
    }, [selectedColor, setSelectedColor, strokeSize, setStrokeWidth]);

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
                        <BsArrow90DegRight style={{padding: "2px"}}
                                           color={"black"} size={18}
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
                    <Tool isSelected={tool === TOOLS.TRIANGLE}>
                        <PiTriangle
                            color={"black"} size={22}
                            onClick={() => setTool(TOOLS.TRIANGLE)}/>
                    </Tool>

                    <ColorPickerTool color={selectedColor} isVisible={isPickerVisible} onChange={handleColorChange}
                                     onToggle={togglePicker}/>
                    <input type="range" min={0} max={24} value={strokeSize}
                           onChange={(event) => setStrokeSize(Number(event.target.value))}/>

                    {/*<ThemeToggler onClick={toggleTheme} theme={theme}/>*/}
                    <div
                        style={{
                            boxShadow: "0 4px 16px 0 gray",
                            borderRadius: "8px"
                        }}>
                        <Tool isSelected={false}>
                            <RiDeleteBin2Fill color={"black"} size={22} onClick={setShapes}/>
                        </Tool>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ToolPickerContainer;