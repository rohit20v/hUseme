import './App.css'
import ToolPickerContainer from "./components/ToolPickerContainer.tsx";
import {useRef, useState} from "react";
import {Arrow, Circle, Layer, Line, RegularPolygon, Stage, Transformer} from 'react-konva';
import {Stage as StageType} from "konva/lib/Stage";
import {TOOLS} from "./constants.ts";
import {Rect} from "react-konva/lib/ReactKonvaCore";
import {v4 as uuid} from "uuid";
import {Shapes} from "./utils/types.ts";
import {createShape} from "./utils/createShape.ts";
import Konva from "konva";
import {KonvaEventObject} from "konva/lib/Node";


function App() {
    const [tool, setTool] = useState(TOOLS.PENCIL)

    const [shapes, setShapes] = useState<Shapes[]>([])

    const [selectColor, setSelectedColor] = useState<string>()
    const [strokeWidth, setStrokeWidth] = useState<number>()

    const stageRef = useRef<StageType>();
    const isDrawing = useRef<boolean>()
    const transformerRef = useRef<Konva.Transformer>();
    const shapeId = useRef<string>()

    const isDraggable = tool === TOOLS.SELECT

    const handleOnPointerMove = () => {
        if (tool === TOOLS.SELECT || !isDrawing.current) return;

        const stage = stageRef.current;
        const {x, y} = stage.getPointerPosition();

        setShapes(shapes.map((currentShape) => {
            if (currentShape.id === shapeId.current) {
                switch (currentShape.type) {
                    case "rect":
                        return {
                            ...currentShape,
                            width: x - currentShape.x,
                            height: y - currentShape.y,
                        }
                    case "circle":
                        return {
                            ...currentShape,
                            radius: ((y - currentShape.y) ** 2 + (x - currentShape.x) ** 2) ** .5
                        }
                    case "triangle":
                        return {
                            ...currentShape,
                            radius: ((y - currentShape.y) ** 2 + (x - currentShape.x) ** 2) ** .5
                        }
                    case "arrow":
                        return {
                            ...currentShape,
                            points: [currentShape.points[0], currentShape.points[1], x, y],
                        }
                    case "pencil":
                        return {
                            ...currentShape,
                            points: [...currentShape.points, x, y],
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

        const newShape: Shapes = createShape(tool, id, x, y, selectColor, strokeWidth, [x, y, x, y]);

        setShapes(() => [...shapes, newShape]);

    };

    const removeSelectedShape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' || event.key === 'Delete') {
            if (transformerRef.current && transformerRef.current.getNode()) {
                const selectedShapeId = transformerRef.current.getNode().id();
                setShapes((prevShapes) => prevShapes.filter(shape => shape.id !== selectedShapeId));
                transformerRef.current.nodes([])
            }
        }
    };

    const handleTransformation = (e: KonvaEventObject<MouseEvent>) => {
        if (tool !== TOOLS.SELECT) return;

        const target = e.currentTarget;
        transformerRef.current.nodes([target]);

        const selectedNode = transformerRef.current.getNode();
        if (selectedNode) {

            window.addEventListener('keydown', removeSelectedShape);
            return () => {
                window.removeEventListener('keydown', removeSelectedShape);
            };
        }
    };


    return (
        <div className="canvas-container">
            <div className="toolbar-wrapper">
                <ToolPickerContainer tool={tool} setTool={setTool} stageRef={stageRef}
                                     setSelectedColor={setSelectedColor} setStrokeWidth={setStrokeWidth}
                                     setShapes={() => setShapes(() => [])}/>
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
                    <Rect
                        x={0}
                        y={0}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        fill={"white"}
                        id={"background"}
                        onClick={() => transformerRef.current.nodes([])}
                    />
                    {shapes.map((shape) => {
                        switch (shape.type) {
                            case 'rect':
                                return (
                                    <Rect
                                        key={shape.id}
                                        {...shape}
                                        draggable={isDraggable}
                                        onClick={handleTransformation}
                                    />
                                );
                            case 'circle':
                                return (
                                    <Circle
                                        key={shape.id}
                                        {...shape}
                                        draggable={isDraggable}
                                        onClick={handleTransformation}
                                    />
                                );
                            case 'triangle':
                                return (
                                    <RegularPolygon
                                        key={shape.id}
                                        sides={shape.sides} radius={shape.radius}
                                        {...shape}
                                        draggable={isDraggable}
                                        onClick={handleTransformation}
                                    />
                                )
                            case 'arrow':
                                return (
                                    <Arrow
                                        key={shape.id}
                                        {...shape}
                                        draggable={isDraggable}
                                        onClick={handleTransformation}
                                    />
                                )
                            case 'pencil':
                                return (
                                    <Line
                                        key={shape.id}
                                        lineCap={"round"}
                                        lineJoin={"round"}
                                        {...shape}
                                        tension={0.3}
                                        draggable={isDraggable}
                                        onClick={handleTransformation}
                                    />
                                )
                        }
                    })}
                    <Transformer ref={transformerRef}/>
                </Layer>
            </Stage>
        </div>
    )
}

export default App
