import Tool from "./Tool.tsx";
import {BsSave} from "react-icons/bs";

export const SaveTool = (props: { onClick: () => any }) => {

    const exportDrawing = () => {
        console.log("exporting the drawing")
    }

    return <div onClick={exportDrawing} style={{boxShadow: "0 4px 16px 0 gray", borderRadius: "8px"}}>
        <Tool isSelected={false}>
            <BsSave
                color={"black"} size={22}
                onClick={props.onClick}/>
        </Tool>
    </div>

}
