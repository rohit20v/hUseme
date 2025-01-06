import './App.css'
import ToolPickerContainer from "./components/ToolPickerContainer.tsx";
import {useCallback, useEffect, useRef, useState} from "react";
import {Arrow, Circle, Layer, Line, RegularPolygon, Stage, Transformer} from 'react-konva';
import {Stage as StageType} from "konva/lib/Stage";
import {TOOLS} from "./constants.ts";
import {Rect} from "react-konva/lib/ReactKonvaCore";
import {v4 as uuid} from "uuid";
import {Shapes} from "./utils/types.ts";
import {createShape} from "./utils/createShape.ts";
import Konva from "konva";
import {KonvaEventObject} from "konva/lib/Node";
import {useScreenZoom} from "./hooks/useScreenZoom.ts";
import {Bounce, toast, ToastContainer} from "react-toastify";


function App() {
    const [tool, setTool] = useState(TOOLS.PENCIL)

    const [shapes, setShapes] = useState<Shapes[]>(() => {
        const savedShapes = localStorage.getItem('shapes');
        return savedShapes ? JSON.parse(savedShapes) : [];
    });

    const [selectColor, setSelectedColor] = useState<string>()
    const [strokeWidth, setStrokeWidth] = useState<number>()
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState<{ x: number, y: number }>({x: 0, y: 0})

    const stageRef = useRef<StageType>();
    const isDrawing = useRef<boolean>()
    const transformerRef = useRef<Konva.Transformer>();
    const shapeId = useRef<string>()


    const isDraggable = tool === TOOLS.SELECT

    const {handleWheel} = useScreenZoom({stageRef, scale, setScale, position, setPosition})

    const handleShapeCreation = (x: number, y: number) => {
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

    const handleOnPointerMove = () => {
        if (tool === TOOLS.SELECT || !isDrawing.current) return;

        const stage = stageRef.current;
        const pointerPos = stage.getPointerPosition();
        const x = (pointerPos.x - position.x) / scale
        const y = (pointerPos.y - position.y) / scale

        handleShapeCreation(x, y);

    };

    const handleOnPointerUp = () => {
        isDrawing.current = false;
    };

    const handleOnPointerDown = () => {
        if (tool === TOOLS.SELECT) return;

        const stage = stageRef.current;
        const pointerPos = stage.getPointerPosition();
        const x = (pointerPos.x - position.x) / scale
        const y = (pointerPos.y - position.y) / scale
        const id = uuid()

        shapeId.current = id;
        isDrawing.current = true;

        const newShape: Shapes = createShape(tool, id, x, y, selectColor, strokeWidth, [x, y, x, y]);

        setShapes(() => [...shapes, newShape]);

    };

    const removeSelectedShape = (event: KeyboardEvent) => {
        if (event.key === 'Delete') {
            if (transformerRef.current && transformerRef.current.getNode()) {
                const selectedShapeId = transformerRef.current.getNode().id();
                setShapes((prevShapes) => prevShapes.filter(shape => shape.id !== selectedShapeId));
                transformerRef.current.nodes([])
                localStorage.setItem('shapes', JSON.stringify(shapes));
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

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        if (tool !== TOOLS.SELECT) return;

        const target = e.currentTarget;
        transformerRef.current.nodes([target]);

        const selectedNode = transformerRef.current.getNode();

        const {x, y} = e.target.position();
        setShapes((v) =>
            v.map((shape) =>
                shape.id === selectedNode.id() ? {...shape, x, y} : shape
            )
        );
    };

    const handleTransformEnd = (id: string, e: Konva.KonvaEventObject<Event>) => {
        const node = e.target;

        const updatedShape = {
            id,
            x: node.x(),
            y: node.y(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            rotation: node.rotation(),
            ...shapes.find((shape) => shape.id === id),
        };

        if (updatedShape.type === "rect" || updatedShape.type === "circle") {
            updatedShape.width = node.width() * node.scaleX();
            updatedShape.height = node.height() * node.scaleY();
        }

        setShapes((v) =>
            v.map((shape) =>
                shape.id === id ? {...shape, ...updatedShape} : shape
            )
        );

        node.scaleX(1);
        node.scaleY(1);
    };


    const listenUndoKeys = useCallback((e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'z') {
            if (shapes.length > 0) {
                setShapes((prevShapes) => prevShapes.slice(0, prevShapes.length - 1));
            } else {
                console.log(shapes.length);
                console.log("No shapes found.");
                toast('😺 Nothing to remove', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
        }
    }, [shapes, setShapes]);

    useEffect(() => {
        window.addEventListener('keydown', listenUndoKeys);
        localStorage.setItem('shapes', JSON.stringify(shapes));

        return () => {
            window.removeEventListener('keydown', listenUndoKeys);
        };
    }, [shapes, listenUndoKeys]);




    const handleStageClick = () => {
        const stage = stageRef.current;
        const pointerPos = stage.getPointerPosition();

        // Check if the click is inside any shape
        const clickedOnShape = stage.getIntersection(pointerPos);

        if (!clickedOnShape) {
            transformerRef.current.nodes([]);
        }
    };

    return (
        <div className="canvas-container">
            <div className="toolbar-wrapper">
                <ToolPickerContainer tool={tool} setTool={setTool} stageRef={stageRef}
                                     setSelectedColor={setSelectedColor} setStrokeWidth={setStrokeWidth}
                                     setShapes={() => {
                                         setShapes(() => [])
                                         localStorage.setItem('shapes', JSON.stringify(shapes));
                                     }}/>
            </div>

            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
                onPointerDown={handleOnPointerDown}
                onPointerMove={handleOnPointerMove}
                onPointerUp={handleOnPointerUp}
                onWheel={handleWheel}
                scaleX={scale}
                scaleY={scale}
                x={position.x}
                y={position.y}
                onClick={handleStageClick}
            >
                <Layer>
                    {shapes.map((shape) => {
                        switch (shape.type) {
                            case 'rect':
                                return (
                                    <Rect
                                        key={shape.id}
                                        {...shape}
                                        draggable={isDraggable}
                                        onClick={handleTransformation}
                                        onDragEnd={handleDragEnd}
                                        onTransformEnd={(evt) => handleTransformEnd(shape.id, evt)}
                                    />
                                );
                            case 'circle':
                                return (
                                    <Circle
                                        key={shape.id}
                                        {...shape}
                                        draggable={isDraggable}
                                        onClick={handleTransformation}
                                        onDragEnd={handleDragEnd}
                                        onTransformEnd={(evt) => handleTransformEnd(shape.id, evt)}
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
                                        onDragEnd={handleDragEnd}
                                        onTransformEnd={(evt) => handleTransformEnd(shape.id, evt)}
                                    />
                                )
                            case 'arrow':
                                return (
                                    <Arrow
                                        key={shape.id}
                                        {...shape}
                                        draggable={isDraggable}
                                        onClick={handleTransformation}
                                        onDragEnd={handleDragEnd}
                                        onTransformEnd={(evt) => handleTransformEnd(shape.id, evt)}
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
                                        onDragEnd={handleDragEnd}
                                        onTransformEnd={(evt) => handleTransformEnd(shape.id, evt)}
                                    />
                                )
                        }
                    })}
                    <Transformer ref={transformerRef}/>
                </Layer>
            </Stage>
            <ToastContainer/>

        </div>
    )
}

export default App
