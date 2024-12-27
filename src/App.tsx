import './App.css'
import ToolPickerContainer from "./components/ToolPickerContainer.tsx";
import {useRef, useState} from "react";
import {Circle, Layer, RegularPolygon, Stage} from 'react-konva';
import {Stage as StageType} from "konva/lib/Stage";
import {TOOLS} from "./constants.ts";
import {Rect} from "react-konva/lib/ReactKonvaCore";
import {v4 as uuid} from "uuid";
import {Shapes} from "./utils/types.ts";
import {createShape} from "./utils/createShape.ts";


function App() {
    const [tool, setTool] = useState(TOOLS.SELECT)

    const [shapes, setShapes] = useState<Shapes[]>([])

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
                } else if (currentShape.type === "circle") {
                    return {
                        ...currentShape,
                        radius: ((y - currentShape.y) ** 2 + (x - currentShape.x) ** 2) ** .5
                    }
                } else if (currentShape.type === "triangle") {
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

        const newShape: Shapes = createShape(tool, id, x, y, selectColor, strokeWidth);

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
                            case 'triangle':
                                return (
                                    <RegularPolygon
                                        key={shape.id}
                                        sides={shape.sides} radius={shape.radius}
                                        {...shape}
                                    />
                                )
                        }
                    })}
                </Layer>
            </Stage>
        </div>
    )
}

export default App
