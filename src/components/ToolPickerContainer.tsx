import {PiHandGrabbingLight, PiRectangleLight} from "react-icons/pi";
import Tool from "./Tool.tsx";
import {useContext} from "react";
import {GiCircle} from "react-icons/gi";
import {RxPencil1} from "react-icons/rx";
import {BsArrow90DegRight, BsMoonStars, BsSave} from "react-icons/bs";
import {GoSun} from "react-icons/go";
import {ThemeContext} from "../context/themeContext.tsx";

const ToolPickerContainer = () => {

    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('DarkModeToggle must be used within a ThemeProvider');
    }

    const {theme, setTheme} = context;

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <>
            <div className={"toolPickerContainer"}>
                <div className={"tools"}>
                    <Tool>
                        <PiHandGrabbingLight color={"black"} size={24}/>
                    </Tool>
                    <Tool>
                        <BsArrow90DegRight color={"black"} size={24}/>
                    </Tool>
                    <Tool>
                        <RxPencil1 color={"black"} size={24}/>
                    </Tool>
                    <div onClick={toggleTheme} style={{boxShadow: "0 4px 16px 0 gray", borderRadius: "8px"}}>
                        <Tool>
                            {
                                theme === 'dark' ?
                                    <GoSun color={"black"} size={24}/>
                                    :
                                    <BsMoonStars color={"black"} size={24}/>
                            }
                        </Tool>
                    </div>
                    <Tool>
                        <PiRectangleLight color={"black"} size={24}/>
                    </Tool>
                    <Tool>
                        <GiCircle color={"black"} size={24}/>
                    </Tool>
                    <Tool>
                        <BsSave color={"black"} size={24}/>
                    </Tool>
                </div>
            </div>
        </>
    );
};

export default ToolPickerContainer;