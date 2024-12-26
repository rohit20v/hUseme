import Tool from "./Tool.tsx";
import {BsSave} from "react-icons/bs";
import React from "react";
import {Stage} from "konva/lib/Stage";

export const SaveTool = ({onClick, stageRef}: { onClick: () => void, stageRef: React.RefObject<Stage> }) => {

    const exportDrawing = () => {
        const imageUrl = stageRef.current.toDataURL();
        const link = document.createElement("a");
        link.download = "image.png"
        link.href = imageUrl
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return <div onClick={exportDrawing} style={{boxShadow: "0 4px 16px 0 gray", borderRadius: "8px"}}>
        <Tool isSelected={false}>
            <BsSave
                color={"black"} size={22}
                onClick={onClick}/>
        </Tool>
    </div>

}
