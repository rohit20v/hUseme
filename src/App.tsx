import './App.css'
import ToolPickerContainer from "./components/ToolPickerContainer.tsx";
import {useRef, useState} from "react";
import {Circle, Layer, Stage} from 'react-konva';
import {Stage as StageType} from "konva/lib/Stage";
import {TOOLS} from "./constants.ts";
import {Rect} from "react-konva/lib/ReactKonvaCore";
import {v4 as uuid} from "uuid";
import {shape} from "./utils/types.ts";


function App() {
    const [tool, setTool] = useState(TOOLS.SELECT)

    const [shapes, setShapes] = useState<shape[]>([])

    const [selectColor, setSelectedColor] = useState<string>()
    const [strokeWidth, setStrokeWidth] = useState<number>()

    const stageRef = useRef<StageType>();
    const isDrawing = useRef<boolean>()
    const shapeId = useRef<string>()


    const handleOnPointerMove = () => {
        if (tool === TOOLS.SELECT || !isDrawing.current) return;

        const stage = stageRef.current;
        const {x, y} = stage.getPointerPosition();

        setShapes(shapes.map((currentShape) => {
            if (currentShape.id === shapeId.current) {
                if (currentShape.type === "rect") {
                    return {
                        ...currentShape,
                        width: x - currentShape.x,
                        height: y - currentShape.y,
                    }
                }
                if (currentShape.type === "circle") {
                    return {
                        ...currentShape,
                        radius: ((y - currentShape.y) ** 2 + (x - currentShape.x) ** 2) ** .5
                    }
                }
            }
            return currentShape
        }))

    };
    const handleOnPointerUp = () => {
        isDrawing.current = false;
    };
    const handleOnPointerDown = () => {
        if (tool === TOOLS.SELECT) return;

        const stage = stageRef.current;
        const {x, y} = stage.getPointerPosition();

        const id = uuid()

        shapeId.current = id;
        isDrawing.current = true;

        const newShape: shape = {
            id,
            x,
            y,
            fill: selectColor,
            strokeWidth: strokeWidth,
            stroke: "black",
            type: tool === TOOLS.RECT ? 'rect' : 'circle',
            ...(tool === TOOLS.RECT ? {width: 0, height: 0} : {radius: 0})
        };

        setShapes(() => [...shapes, newShape]);

    };
    return (
        <div className="canvas-container">
            <div className="toolbar-wrapper">
                <ToolPickerContainer tool={tool} setTool={setTool} stageRef={stageRef}
                                     setSelectedColor={setSelectedColor} setStrokeWidth={setStrokeWidth}/>
            </div>

            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onPointerDown={handleOnPointerDown}
                onPointerMove={handleOnPointerMove}
                onPointerUp={handleOnPointerUp}
            >
                <Layer>
                    {shapes.map((shape) => {
                        switch (shape.type) {
                            case 'rect':
                                return (
                                    <Rect
                                        key={shape.id}
                                        {...shape}
                                    />
                                );
                            case 'circle':
                                return (
                                    <Circle
                                        key={shape.id}
                                        {...shape}
                                    />
                                );
                        }
                    })}

                </Layer>
            </Stage>
        </div>
    )
}

export default App
