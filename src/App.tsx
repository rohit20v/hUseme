import './App.css'
import ToolPickerContainer from "./components/ToolPickerContainer.tsx";
import {useRef, useState} from "react";
import {Layer, Stage} from 'react-konva';
import {Stage as StageType} from "konva/lib/Stage";
import {TOOLS} from "./constants.ts";
import {Rect} from "react-konva/lib/ReactKonvaCore";
import {v4 as uuid} from "uuid";
import {rect} from "./utils/types.ts";


function App() {
    const [tool, setTool] = useState(TOOLS.SELECT)
    const [rectangles, setRectangles] = useState<rect[]>([])
    const [selectColor, setSelectedColor] = useState<string>()
    const [strokeWidth, setStrokeWidth] = useState<number>()

    const stageRef = useRef<StageType>();
    const isDrawing = useRef<boolean>()
    const shapeId = useRef<string>()

    const handleOnPointerMove = () => {
        if (tool === TOOLS.SELECT || !isDrawing.current) return;

        const stage = stageRef.current;
        const {x, y} = stage.getPointerPosition();


        switch (tool) {
            case TOOLS.RECT:
                setRectangles((rectangles.map(rectangle => {
                        if (rectangle.id === shapeId.current) {
                            return {
                                ...rectangle,
                                width: x - rectangle.x,
                                height: y - rectangle.y,
                            }
                        }
                        return rectangle
                    }))
                );
                break
        }
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

        switch (tool) {
            case TOOLS.RECT:
                setRectangles(() => [...rectangles, {
                    id,
                    x,
                    y,
                    height: 20,
                    width: 20,
                    fill: selectColor,
                    strokeWidth: strokeWidth,
                    strokeColor: "black"
                }])
                break
        }

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
                    {rectangles.map((rectangle) =>
                        <Rect
                            id={rectangle.id}
                            x={rectangle.x}
                            y={rectangle.y}
                            width={rectangle.width}
                            height={rectangle.height}
                            fill={rectangle.fill}
                            stroke={rectangle.strokeColor}
                            strokeWidth={rectangle.strokeWidth}
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    )
}

export default App
