import {KonvaEventObject} from "konva/lib/Node";
import {Stage} from "konva/lib/Stage";
import React from "react";

export const useScreenZoom = ({stageRef, scale, setScale, position, setPosition}: {
    stageRef: React.RefObject<Stage>
    scale: number,
    setScale: (newScale: number) => void
    position: { x: number, y: number }
    setPosition: (newPosition: { x: number, y: number }) => void

}) => {
    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();

        const stage = stageRef.current;
        const oldScale = scale;

        const pointer = stage.getPointerPosition();
        const mousePointTo = {
            x: (pointer.x - position.x) / oldScale,
            y: (pointer.y - position.y) / oldScale,
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1;
        const limitedScale = Math.min(Math.max(0, newScale), 5);
        setScale(limitedScale);

        const newPos = {
            x: pointer.x - mousePointTo.x * limitedScale,
            y: pointer.y - mousePointTo.y * limitedScale,
        };

        setPosition(newPos);
    };

    return {handleWheel};
};
