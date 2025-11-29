import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { 
  MousePointer2, 
  Square, 
  Move, 
  RotateCw, 
  Ruler,
  Undo2,
  Redo2,
  Save,
  Download,
  Upload,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Trash2,
  Copy,
  Eye,
  Layers,
  Sofa,
  UtensilsCrossed,
  Bath,
  Bed,
  DoorOpen,
  FileJson,
  LayoutGrid,
  Settings2,
  Scale,
  Package
} from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { AIChat } from "@/components/AIChat";
import { ComplianceChecker } from "@/components/ComplianceChecker";

type Tool = "select" | "wall" | "move" | "rotate" | "measure";
type ViewMode = "2d" | "3d";

interface Point {
  x: number;
  y: number;
}

interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  height: number;
  isBearing: boolean;
}

interface CanvasObject {
  id: string;
  type: "furniture";
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  rotation: number;
  name: string;
  color: string;
}

interface ProjectData {
  walls: Wall[];
  objects: CanvasObject[];
  canvasWidth: number;
  canvasHeight: number;
}

const furnitureCategories = [
  { 
    id: "living", 
    name: "Гостиная", 
    icon: Sofa,
    items: [
      { name: "Диван", width: 200, height: 90, depth: 85, color: "#7a7a7a" },
      { name: "Кресло", width: 80, height: 80, depth: 75, color: "#7a7a7a" },
      { name: "Журнальный стол", width: 120, height: 60, depth: 45, color: "#cfcfcf" },
      { name: "ТВ-тумба", width: 160, height: 45, depth: 40, color: "#7a7a7a" },
    ]
  },
  { 
    id: "bedroom", 
    name: "Спальня", 
    icon: Bed,
    items: [
      { name: "Кровать 160", width: 200, height: 170, depth: 45, color: "#8B7355" },
      { name: "Кровать 140", width: 200, height: 150, depth: 45, color: "#8B7355" },
      { name: "Тумба", width: 50, height: 45, depth: 45, color: "#cfcfcf" },
      { name: "Шкаф", width: 200, height: 60, depth: 220, color: "#A0522D" },
    ]
  },
  { 
    id: "kitchen", 
    name: "Кухня", 
    icon: UtensilsCrossed,
    items: [
      { name: "Плита", width: 60, height: 60, depth: 85, color: "#333333" },
      { name: "Холодильник", width: 70, height: 70, depth: 180, color: "#cfcfcf" },
      { name: "Мойка", width: 60, height: 50, depth: 20, color: "#b0b0b0" },
      { name: "Стол обеденный", width: 140, height: 90, depth: 75, color: "#8B7355" },
    ]
  },
  { 
    id: "bathroom", 
    name: "Санузел", 
    icon: Bath,
    items: [
      { name: "Ванна", width: 170, height: 75, depth: 60, color: "#ffffff" },
      { name: "Душевая кабина", width: 90, height: 90, depth: 200, color: "#e0e0e0" },
      { name: "Унитаз", width: 40, height: 60, depth: 40, color: "#ffffff" },
      { name: "Раковина", width: 55, height: 45, depth: 20, color: "#ffffff" },
    ]
  },
  { 
    id: "doors", 
    name: "Двери/Окна", 
    icon: DoorOpen,
    items: [
      { name: "Дверь 80", width: 80, height: 10, depth: 210, color: "#FFD028" },
      { name: "Дверь 90", width: 90, height: 10, depth: 210, color: "#FFD028" },
      { name: "Окно 120", width: 120, height: 10, depth: 150, color: "#5BA3E0" },
      { name: "Окно 180", width: 180, height: 10, depth: 150, color: "#5BA3E0" },
    ]
  },
];

const tools = [
  { id: "select" as Tool, icon: MousePointer2, name: "Выделение", shortcut: "V" },
  { id: "wall" as Tool, icon: Square, name: "Стена", shortcut: "W" },
  { id: "move" as Tool, icon: Move, name: "Перемещение", shortcut: "M" },
  { id: "rotate" as Tool, icon: RotateCw, name: "Поворот", shortcut: "R" },
  { id: "measure" as Tool, icon: Ruler, name: "Линейка", shortcut: "L" },
];

// 3D Scene Components
const Wall3D = ({ wall, scale }: { wall: Wall; scale: number }) => {
  const length = Math.sqrt(
    Math.pow(wall.end.x - wall.start.x, 2) + 
    Math.pow(wall.end.y - wall.start.y, 2)
  );
  const angle = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);
  const centerX = ((wall.start.x + wall.end.x) / 2) * scale;
  const centerZ = ((wall.start.y + wall.end.y) / 2) * scale;

  return (
    <mesh 
      position={[centerX - 6, (wall.height * scale) / 2, centerZ - 4]}
      rotation={[0, -angle, 0]}
    >
      <boxGeometry args={[length * scale, wall.height * scale, wall.thickness * scale]} />
      <meshStandardMaterial color={wall.isBearing ? "#555555" : "#888888"} />
    </mesh>
  );
};

const Furniture3D = ({ obj, scale }: { obj: CanvasObject; scale: number }) => {
  const rotationY = (obj.rotation * Math.PI) / 180;
  
  return (
    <mesh 
      position={[
        (obj.x + obj.width / 2) * scale - 6, 
        (obj.depth * scale) / 2, 
        (obj.y + obj.height / 2) * scale - 4
      ]}
      rotation={[0, -rotationY, 0]}
    >
      <boxGeometry args={[obj.width * scale, obj.depth * scale, obj.height * scale]} />
      <meshStandardMaterial color={obj.color} />
    </mesh>
  );
};

const Floor3D = ({ width, height, scale }: { width: number; height: number; scale: number }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(width * scale) / 2 - 6, 0, (height * scale) / 2 - 4]}>
    <planeGeometry args={[width * scale, height * scale]} />
    <meshStandardMaterial color="#f0f0f0" />
  </mesh>
);

const Scene3D = ({ walls, objects, canvasWidth, canvasHeight }: { 
  walls: Wall[]; 
  objects: CanvasObject[]; 
  canvasWidth: number;
  canvasHeight: number;
}) => {
  const scale = 0.01; // 1cm = 0.01 units in 3D

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      
      <Floor3D width={canvasWidth} height={canvasHeight} scale={scale} />
      
      {walls.map((wall) => (
        <Wall3D key={wall.id} wall={wall} scale={scale} />
      ))}
      
      {objects.map((obj) => (
        <Furniture3D key={obj.id} obj={obj} scale={scale} />
      ))}
      
      <gridHelper args={[20, 40, "#cccccc", "#eeeeee"]} position={[0, 0.01, 0]} />
    </>
  );
};

const Editor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [viewMode, setViewMode] = useState<ViewMode>("2d");
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [selectedWall, setSelectedWall] = useState<string | null>(null);
  const [history, setHistory] = useState<{ walls: Wall[]; objects: CanvasObject[] }[]>([{ walls: [], objects: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("living");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Wall drawing state
  const [isDrawingWall, setIsDrawingWall] = useState(false);
  const [wallStartPoint, setWallStartPoint] = useState<Point | null>(null);
  const [tempWallEnd, setTempWallEnd] = useState<Point | null>(null);
  
  // Measure tool state
  const [measureStart, setMeasureStart] = useState<Point | null>(null);
  const [measureEnd, setMeasureEnd] = useState<Point | null>(null);

  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 800;
  const GRID_SIZE = 50;
  const WALL_HEIGHT = 280;
  const WALL_THICKNESS_BEARING = 25; // Несущая стена
  const WALL_THICKNESS_PARTITION = 12; // Перегородка
  
  // Wall drawing settings
  const [newWallIsBearing, setNewWallIsBearing] = useState(false);

  const addToHistory = useCallback((newWalls: Wall[], newObjects: CanvasObject[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ walls: [...newWalls], objects: [...newObjects] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const state = history[historyIndex - 1];
      setWalls([...state.walls]);
      setObjects([...state.objects]);
      setSelectedObject(null);
      setSelectedWall(null);
      toast({ title: "Отменено", duration: 1500 });
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const state = history[historyIndex + 1];
      setWalls([...state.walls]);
      setObjects([...state.objects]);
      setSelectedObject(null);
      setSelectedWall(null);
      toast({ title: "Возвращено", duration: 1500 });
    }
  }, [historyIndex, history]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z") {
          e.preventDefault();
          undo();
        } else if (e.key === "y") {
          e.preventDefault();
          redo();
        } else if (e.key === "s") {
          e.preventDefault();
          handleSave();
        }
      } else {
        switch (e.key.toLowerCase()) {
          case "v": setActiveTool("select"); break;
          case "w": setActiveTool("wall"); break;
          case "m": setActiveTool("move"); break;
          case "r": setActiveTool("rotate"); break;
          case "l": setActiveTool("measure"); break;
          case "escape":
            setIsDrawingWall(false);
            setWallStartPoint(null);
            setTempWallEnd(null);
            setMeasureStart(null);
            setMeasureEnd(null);
            break;
          case "delete":
          case "backspace":
            if (selectedObject) deleteSelectedObject();
            if (selectedWall) deleteSelectedWall();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, selectedObject, selectedWall]);

  const getWallLength = (wall: Wall): number => {
    return Math.sqrt(
      Math.pow(wall.end.x - wall.start.x, 2) + 
      Math.pow(wall.end.y - wall.start.y, 2)
    );
  };

  // Draw canvas
  useEffect(() => {
    if (viewMode !== "2d") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with blueprint-style background
    ctx.fillStyle = "#fafbfc";
    ctx.fillRect(0, 0, CANVAS_WIDTH * zoom, CANVAS_HEIGHT * zoom);

    // Draw grid - professional architectural style
    if (showGrid) {
      // Minor grid
      ctx.strokeStyle = "#e8eaed";
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE / 2) {
        ctx.beginPath();
        ctx.moveTo(x * zoom, 0);
        ctx.lineTo(x * zoom, CANVAS_HEIGHT * zoom);
        ctx.stroke();
      }
      
      for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE / 2) {
        ctx.beginPath();
        ctx.moveTo(0, y * zoom);
        ctx.lineTo(CANVAS_WIDTH * zoom, y * zoom);
        ctx.stroke();
      }

      // Major grid
      ctx.strokeStyle = "#d0d4d9";
      ctx.lineWidth = 1;
      
      for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x * zoom, 0);
        ctx.lineTo(x * zoom, CANVAS_HEIGHT * zoom);
        ctx.stroke();
      }
      
      for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y * zoom);
        ctx.lineTo(CANVAS_WIDTH * zoom, y * zoom);
        ctx.stroke();
      }
    }

    // Draw walls with architectural precision
    walls.forEach((wall) => {
      const isSelected = wall.id === selectedWall;
      
      // Wall fill
      ctx.beginPath();
      ctx.moveTo(wall.start.x * zoom, wall.start.y * zoom);
      ctx.lineTo(wall.end.x * zoom, wall.end.y * zoom);
      
      // Different styles for bearing vs partition
      if (wall.isBearing) {
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = wall.thickness * zoom;
      } else {
        ctx.strokeStyle = "#4a4a4a";
        ctx.lineWidth = wall.thickness * zoom;
      }
      ctx.lineCap = "square";
      ctx.stroke();

      // Hatching for bearing walls
      if (wall.isBearing) {
        const length = getWallLength(wall);
        const angle = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);
        const perpAngle = angle + Math.PI / 2;
        const hatchSpacing = 8 * zoom;
        const numHatches = Math.floor(length * zoom / hatchSpacing);
        
        ctx.save();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        
        for (let i = 1; i < numHatches; i++) {
          const t = i / numHatches;
          const px = (wall.start.x + (wall.end.x - wall.start.x) * t) * zoom;
          const py = (wall.start.y + (wall.end.y - wall.start.y) * t) * zoom;
          const halfThick = (wall.thickness * zoom) / 2 - 2;
          
          ctx.beginPath();
          ctx.moveTo(px + Math.cos(perpAngle) * halfThick, py + Math.sin(perpAngle) * halfThick);
          ctx.lineTo(px - Math.cos(perpAngle) * halfThick, py - Math.sin(perpAngle) * halfThick);
          ctx.stroke();
        }
        ctx.restore();
      }
      
      // Selection highlight
      if (isSelected) {
        ctx.strokeStyle = "#FFD028";
        ctx.lineWidth = (wall.thickness + 6) * zoom;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(wall.start.x * zoom, wall.start.y * zoom);
        ctx.lineTo(wall.end.x * zoom, wall.end.y * zoom);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw wall length label - professional dimension style
      const length = getWallLength(wall);
      const midX = ((wall.start.x + wall.end.x) / 2) * zoom;
      const midY = ((wall.start.y + wall.end.y) / 2) * zoom;
      const angle = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);
      
      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);
      
      // Background for text
      const textWidth = ctx.measureText(`${Math.round(length)}`).width + 30;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-textWidth / 2, -wall.thickness * zoom - 18, textWidth, 16);
      
      ctx.fillStyle = "#1a1a1a";
      ctx.font = `600 ${11 * zoom}px Manrope`;
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(length)} см`, 0, -wall.thickness * zoom - 6);
      ctx.restore();
    });

    // Draw temporary wall while drawing
    if (isDrawingWall && wallStartPoint && tempWallEnd) {
      const tempThickness = newWallIsBearing ? WALL_THICKNESS_BEARING : WALL_THICKNESS_PARTITION;
      ctx.beginPath();
      ctx.moveTo(wallStartPoint.x * zoom, wallStartPoint.y * zoom);
      ctx.lineTo(tempWallEnd.x * zoom, tempWallEnd.y * zoom);
      ctx.strokeStyle = newWallIsBearing ? "#333333" : "#FFD028";
      ctx.lineWidth = tempThickness * zoom;
      ctx.setLineDash([10, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Show length while drawing
      const tempLength = Math.sqrt(
        Math.pow(tempWallEnd.x - wallStartPoint.x, 2) + 
        Math.pow(tempWallEnd.y - wallStartPoint.y, 2)
      );
      const midX = ((wallStartPoint.x + tempWallEnd.x) / 2) * zoom;
      const midY = ((wallStartPoint.y + tempWallEnd.y) / 2) * zoom;
      
      ctx.fillStyle = newWallIsBearing ? "#333333" : "#FFD028";
      ctx.font = `bold ${12 * zoom}px Manrope`;
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(tempLength)} см`, midX, midY - 20);
    }

    // Draw furniture objects
    objects.forEach((obj) => {
      ctx.save();
      ctx.translate((obj.x + obj.width / 2) * zoom, (obj.y + obj.height / 2) * zoom);
      ctx.rotate((obj.rotation * Math.PI) / 180);

      ctx.fillStyle = obj.color;
      ctx.fillRect(
        (-obj.width / 2) * zoom,
        (-obj.height / 2) * zoom,
        obj.width * zoom,
        obj.height * zoom
      );

      ctx.strokeStyle = obj.id === selectedObject ? "#FFD028" : "#d9d9d9";
      ctx.lineWidth = obj.id === selectedObject ? 3 : 1;
      ctx.strokeRect(
        (-obj.width / 2) * zoom,
        (-obj.height / 2) * zoom,
        obj.width * zoom,
        obj.height * zoom
      );

      ctx.restore();

      // Draw dimensions for selected object
      if (obj.id === selectedObject) {
        ctx.fillStyle = "#333333";
        ctx.font = `${12 * zoom}px Manrope`;
        ctx.textAlign = "center";
        ctx.fillText(`${obj.width} см`, (obj.x + obj.width / 2) * zoom, (obj.y - 8) * zoom);
        
        ctx.save();
        ctx.translate((obj.x - 8) * zoom, (obj.y + obj.height / 2) * zoom);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${obj.height} см`, 0, 0);
        ctx.restore();
      }
    });

    // Draw measure line
    if (measureStart && measureEnd) {
      ctx.beginPath();
      ctx.moveTo(measureStart.x * zoom, measureStart.y * zoom);
      ctx.lineTo(measureEnd.x * zoom, measureEnd.y * zoom);
      ctx.strokeStyle = "#FF5722";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      const distance = Math.sqrt(
        Math.pow(measureEnd.x - measureStart.x, 2) + 
        Math.pow(measureEnd.y - measureStart.y, 2)
      );
      const midX = ((measureStart.x + measureEnd.x) / 2) * zoom;
      const midY = ((measureStart.y + measureEnd.y) / 2) * zoom;
      
      ctx.fillStyle = "#FF5722";
      ctx.font = `bold ${14 * zoom}px Manrope`;
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(distance)} см`, midX, midY - 10);
    }
  }, [objects, walls, selectedObject, selectedWall, zoom, showGrid, viewMode, isDrawingWall, wallStartPoint, tempWallEnd, measureStart, measureEnd]);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    };
  };

  const snapToGrid = (value: number): number => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const findObjectAt = (x: number, y: number): CanvasObject | undefined => {
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (x >= obj.x && x <= obj.x + obj.width && y >= obj.y && y <= obj.y + obj.height) {
        return obj;
      }
    }
    return undefined;
  };

  const findWallAt = (x: number, y: number): Wall | undefined => {
    for (const wall of walls) {
      const dx = wall.end.x - wall.start.x;
      const dy = wall.end.y - wall.start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length === 0) continue;
      
      const t = Math.max(0, Math.min(1, 
        ((x - wall.start.x) * dx + (y - wall.start.y) * dy) / (length * length)
      ));
      
      const closestX = wall.start.x + t * dx;
      const closestY = wall.start.y + t * dy;
      const distance = Math.sqrt(
        Math.pow(x - closestX, 2) + Math.pow(y - closestY, 2)
      );
      
      if (distance <= wall.thickness / 2 + 5) {
        return wall;
      }
    }
    return undefined;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);

    if (activeTool === "wall") {
      const snappedX = snapToGrid(x);
      const snappedY = snapToGrid(y);
      
      if (!isDrawingWall) {
        setIsDrawingWall(true);
        setWallStartPoint({ x: snappedX, y: snappedY });
        setTempWallEnd({ x: snappedX, y: snappedY });
      } else if (wallStartPoint) {
        // Create wall
        const newWall: Wall = {
          id: `wall-${Date.now()}`,
          start: wallStartPoint,
          end: { x: snappedX, y: snappedY },
          thickness: newWallIsBearing ? WALL_THICKNESS_BEARING : WALL_THICKNESS_PARTITION,
          height: WALL_HEIGHT,
          isBearing: newWallIsBearing,
        };
        
        const newWalls = [...walls, newWall];
        setWalls(newWalls);
        addToHistory(newWalls, objects);
        
        // Continue drawing from this point
        setWallStartPoint({ x: snappedX, y: snappedY });
        toast({ title: `Стена: ${Math.round(getWallLength(newWall))} см`, duration: 1500 });
      }
    } else if (activeTool === "measure") {
      const snappedX = snapToGrid(x);
      const snappedY = snapToGrid(y);
      
      if (!measureStart) {
        setMeasureStart({ x: snappedX, y: snappedY });
        setMeasureEnd({ x: snappedX, y: snappedY });
      } else {
        setMeasureStart(null);
        setMeasureEnd(null);
      }
    } else if (activeTool === "select") {
      const obj = findObjectAt(x, y);
      const wall = findWallAt(x, y);
      
      if (obj) {
        setSelectedObject(obj.id);
        setSelectedWall(null);
      } else if (wall) {
        setSelectedWall(wall.id);
        setSelectedObject(null);
      } else {
        setSelectedObject(null);
        setSelectedWall(null);
      }
    } else if (activeTool === "move") {
      const obj = findObjectAt(x, y);
      if (obj) {
        setSelectedObject(obj.id);
        setSelectedWall(null);
        setIsDragging(true);
        setDragOffset({ x: x - obj.x, y: y - obj.y });
      }
    } else if (activeTool === "rotate" && selectedObject) {
      const obj = objects.find(o => o.id === selectedObject);
      if (obj) {
        const newObjects = objects.map(o => 
          o.id === selectedObject 
            ? { ...o, rotation: (o.rotation + 15) % 360 }
            : o
        );
        setObjects(newObjects);
        addToHistory(walls, newObjects);
        toast({ title: `Поворот: ${(obj.rotation + 15) % 360}°`, duration: 1500 });
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);

    if (activeTool === "wall" && isDrawingWall) {
      setTempWallEnd({ x: snapToGrid(x), y: snapToGrid(y) });
    }

    if (activeTool === "measure" && measureStart) {
      setMeasureEnd({ x: snapToGrid(x), y: snapToGrid(y) });
    }

    if (isDragging && selectedObject) {
      const snappedX = snapToGrid(x - dragOffset.x);
      const snappedY = snapToGrid(y - dragOffset.y);

      setObjects(objects.map(obj =>
        obj.id === selectedObject
          ? { ...obj, x: snappedX, y: snappedY }
          : obj
      ));
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      addToHistory(walls, objects);
    }
  };

  const handleDoubleClick = () => {
    if (activeTool === "wall" && isDrawingWall) {
      setIsDrawingWall(false);
      setWallStartPoint(null);
      setTempWallEnd(null);
      toast({ title: "Рисование стен завершено", duration: 1500 });
    }
  };

  const addFurniture = (item: { name: string; width: number; height: number; depth: number; color: string }) => {
    const newObject: CanvasObject = {
      id: `obj-${Date.now()}`,
      type: "furniture",
      x: 100,
      y: 100,
      width: item.width,
      height: item.height,
      depth: item.depth,
      rotation: 0,
      name: item.name,
      color: item.color,
    };
    
    const newObjects = [...objects, newObject];
    setObjects(newObjects);
    setSelectedObject(newObject.id);
    addToHistory(walls, newObjects);
    toast({ title: `Добавлено: ${item.name}`, duration: 1500 });
  };

  const deleteSelectedObject = () => {
    if (!selectedObject) return;
    
    const obj = objects.find(o => o.id === selectedObject);
    const newObjects = objects.filter(o => o.id !== selectedObject);
    setObjects(newObjects);
    setSelectedObject(null);
    addToHistory(walls, newObjects);
    toast({ title: `Удалено: ${obj?.name}`, duration: 1500 });
  };

  const deleteSelectedWall = () => {
    if (!selectedWall) return;
    
    const newWalls = walls.filter(w => w.id !== selectedWall);
    setWalls(newWalls);
    setSelectedWall(null);
    addToHistory(newWalls, objects);
    toast({ title: "Стена удалена", duration: 1500 });
  };

  const duplicateSelected = () => {
    if (!selectedObject) return;
    
    const obj = objects.find(o => o.id === selectedObject);
    if (!obj) return;

    const newObject: CanvasObject = {
      ...obj,
      id: `obj-${Date.now()}`,
      x: obj.x + 20,
      y: obj.y + 20,
    };
    
    const newObjects = [...objects, newObject];
    setObjects(newObjects);
    setSelectedObject(newObject.id);
    addToHistory(walls, newObjects);
    toast({ title: `Копия: ${obj.name}`, duration: 1500 });
  };

  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `stroyplan-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast({ title: "PNG экспортирован", duration: 2000 });
  };

  const handleExportJSON = () => {
    const projectData: ProjectData = {
      walls,
      objects,
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.download = `stroyplan-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    toast({ title: "JSON экспортирован", duration: 2000 });
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data: ProjectData = JSON.parse(event.target?.result as string);
        setWalls(data.walls || []);
        setObjects(data.objects || []);
        addToHistory(data.walls || [], data.objects || []);
        toast({ title: "Проект импортирован", duration: 2000 });
      } catch {
        toast({ title: "Ошибка импорта", description: "Неверный формат файла", variant: "destructive" });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleSave = () => {
    const data = JSON.stringify({ walls, objects, zoom, showGrid });
    localStorage.setItem("stroyplan-project", data);
    toast({ title: "Проект сохранён", duration: 2000 });
  };

  useEffect(() => {
    const saved = localStorage.getItem("stroyplan-project");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.walls) setWalls(data.walls);
        if (data.objects) setObjects(data.objects);
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const selectedObj = objects.find(o => o.id === selectedObject);
  const selectedWallObj = walls.find(w => w.id === selectedWall);

  return (
    <div className="h-screen flex flex-col bg-editor-bg">
      {/* Top Bar */}
      <header className="h-14 bg-editor-panel border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <span className="text-sm text-muted-foreground">Новый проект</span>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0}>
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Отменить (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1}>
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Вернуть (Ctrl+Y)</TooltipContent>
          </Tooltip>

          <div className="h-6 w-px bg-border mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Сохранить (Ctrl+S)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Импорт JSON</TooltipContent>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleExportJSON}>
                <FileJson className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Экспорт JSON</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleExportPNG}>
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Экспорт PNG</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "2d" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("2d")}
            className={viewMode === "2d" ? "btn-primary" : ""}
          >
            <Layers className="h-4 w-4 mr-1" />
            2D
          </Button>
          <Button
            variant={viewMode === "3d" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("3d")}
            className={viewMode === "3d" ? "btn-primary" : ""}
          >
            <Eye className="h-4 w-4 mr-1" />
            3D
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Tools Panel */}
        <aside className="w-16 bg-editor-panel border-r border-border flex flex-col items-center py-3 gap-1">
          {tools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "tool-button w-11 h-11",
                    activeTool === tool.id && "tool-button-active"
                  )}
                  onClick={() => {
                    setActiveTool(tool.id);
                    if (tool.id !== "wall") {
                      setIsDrawingWall(false);
                      setWallStartPoint(null);
                      setTempWallEnd(null);
                    }
                    if (tool.id !== "measure") {
                      setMeasureStart(null);
                      setMeasureEnd(null);
                    }
                  }}
                >
                  <tool.icon className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {tool.name} ({tool.shortcut})
              </TooltipContent>
            </Tooltip>
          ))}

          <div className="h-px w-10 bg-border my-2" />

          {/* Wall Type Toggle - show when wall tool active */}
          {activeTool === "wall" && (
            <div className="flex flex-col items-center gap-1 px-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "tool-button w-11 h-11 text-xs flex flex-col gap-0.5",
                      !newWallIsBearing && "bg-primary/20 border border-primary"
                    )}
                    onClick={() => setNewWallIsBearing(false)}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="text-[9px]">12см</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Перегородка (12 см)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "tool-button w-11 h-11 text-xs flex flex-col gap-0.5",
                      newWallIsBearing && "bg-foreground text-background"
                    )}
                    onClick={() => setNewWallIsBearing(true)}
                  >
                    <Square className="h-4 w-4" />
                    <span className="text-[9px]">25см</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Несущая стена (25 см)</TooltipContent>
              </Tooltip>
            </div>
          )}

          <div className="h-px w-10 bg-border my-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn("tool-button w-11 h-11", showGrid && "bg-muted")}
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Сетка</TooltipContent>
          </Tooltip>

          <div className="flex-1" />

          {viewMode === "2d" && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="tool-button w-11 h-11" onClick={() => setZoom(Math.min(zoom + 0.1, 2))}>
                    <ZoomIn className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Увеличить</TooltipContent>
              </Tooltip>

              <span className="text-xs text-muted-foreground font-mono">{Math.round(zoom * 100)}%</span>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="tool-button w-11 h-11" onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}>
                    <ZoomOut className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Уменьшить</TooltipContent>
              </Tooltip>
            </>
          )}
        </aside>

        {/* Canvas / 3D Area */}
        <div className="flex-1 overflow-auto p-6 bg-editor-bg">
          {viewMode === "2d" ? (
            <div className="inline-block shadow-elevated rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH * zoom}
                height={CANVAS_HEIGHT * zoom}
                className={cn(
                  "cursor-crosshair",
                  activeTool === "wall" && "cursor-cell",
                  activeTool === "move" && "cursor-move"
                )}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onDoubleClick={handleDoubleClick}
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-lg overflow-hidden shadow-elevated">
              <Canvas>
                <Suspense fallback={null}>
                  <PerspectiveCamera makeDefault position={[0, 8, 12]} />
                  <OrbitControls 
                    enablePan 
                    enableZoom 
                    enableRotate 
                    maxPolarAngle={Math.PI / 2}
                    minDistance={2}
                    maxDistance={30}
                  />
                  <Scene3D 
                    walls={walls} 
                    objects={objects} 
                    canvasWidth={CANVAS_WIDTH}
                    canvasHeight={CANVAS_HEIGHT}
                  />
                </Suspense>
              </Canvas>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <aside className="w-80 bg-editor-panel border-l border-border flex flex-col">
          {/* Properties */}
          {selectedObj ? (
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold mb-3">Свойства объекта</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Объект:</span>
                  <span className="ml-2 font-medium">{selectedObj.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Ширина:</span>
                    <span className="ml-1">{selectedObj.width} см</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Глубина:</span>
                    <span className="ml-1">{selectedObj.height} см</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Высота:</span>
                  <span className="ml-2">{selectedObj.depth} см</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Поворот:</span>
                  <span className="ml-2">{selectedObj.rotation}°</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={duplicateSelected}>
                  <Copy className="h-4 w-4 mr-1" />
                  Копия
                </Button>
                <Button size="sm" variant="destructive" onClick={deleteSelectedObject}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Удалить
                </Button>
              </div>
            </div>
          ) : selectedWallObj ? (
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold mb-3">Свойства стены</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Длина:</span>
                  <span className="ml-2 font-medium">{Math.round(getWallLength(selectedWallObj))} см</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Толщина:</span>
                  <span className="ml-2">{selectedWallObj.thickness} см</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Высота:</span>
                  <span className="ml-2">{selectedWallObj.height} см</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Тип:</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded",
                      selectedWallObj.isBearing 
                        ? "bg-foreground text-background font-medium" 
                        : "bg-primary/20 text-primary"
                    )}>
                      {selectedWallObj.isBearing ? "Несущая" : "Перегородка"}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => {
                        const newWalls = walls.map(w => 
                          w.id === selectedWall 
                            ? { 
                                ...w, 
                                isBearing: !w.isBearing,
                                thickness: !w.isBearing ? WALL_THICKNESS_BEARING : WALL_THICKNESS_PARTITION
                              }
                            : w
                        );
                        setWalls(newWalls);
                        addToHistory(newWalls, objects);
                        toast({ 
                          title: selectedWallObj.isBearing ? "Перегородка" : "Несущая стена", 
                          duration: 1500 
                        });
                      }}
                    >
                      Изменить
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="destructive" onClick={deleteSelectedWall}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Удалить
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-border">
              <p className="text-sm text-muted-foreground">
                {activeTool === "wall" 
                  ? `Кликните для начала стены. Тип: ${newWallIsBearing ? "Несущая (25 см)" : "Перегородка (12 см)"}`
                  : "Выберите объект или стену"}
              </p>
            </div>
          )}

          {/* Tabs for Catalog and Compliance */}
          <Tabs defaultValue="catalog" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="mx-3 mt-3 grid grid-cols-2 h-10">
              <TabsTrigger value="catalog" className="text-xs gap-1.5">
                <Package className="h-3.5 w-3.5" />
                Каталог
              </TabsTrigger>
              <TabsTrigger value="compliance" className="text-xs gap-1.5">
                <Scale className="h-3.5 w-3.5" />
                Проверка
              </TabsTrigger>
            </TabsList>

            <TabsContent value="catalog" className="flex-1 overflow-hidden flex flex-col mt-0 data-[state=inactive]:hidden">
              <div className="flex border-b border-border overflow-x-auto">
                {furnitureCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className={cn(
                      "flex-1 min-w-0 p-3 flex flex-col items-center gap-1 text-xs transition-colors",
                      activeCategory === cat.id
                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <cat.icon className="h-4 w-4" />
                    <span className="truncate w-full text-center">{cat.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                <div className="grid grid-cols-2 gap-2">
                  {furnitureCategories
                    .find((c) => c.id === activeCategory)
                    ?.items.map((item, index) => (
                      <button
                        key={index}
                        className="p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                        onClick={() => addFurniture(item)}
                      >
                        <div 
                          className="w-full aspect-square rounded mb-2 border border-border"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="text-xs font-medium truncate">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.width}×{item.height} см
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden">
              <ComplianceChecker 
                walls={walls}
                objects={objects}
                canvasWidth={CANVAS_WIDTH}
                canvasHeight={CANVAS_HEIGHT}
              />
            </TabsContent>
          </Tabs>
        </aside>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-10 bg-editor-panel border-t border-border flex items-center justify-between px-4 text-xs font-mono">
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-foreground" />
            <span>Несущие: {walls.filter(w => w.isBearing).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-primary/60" />
            <span>Перегородки: {walls.filter(w => !w.isBearing).length}</span>
          </div>
          <span className="text-border">|</span>
          <span>Объектов: {objects.length}</span>
          {viewMode === "2d" && (
            <>
              <span className="text-border">|</span>
              <span>Масштаб: {Math.round(zoom * 100)}%</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>{tools.find(t => t.id === activeTool)?.name}</span>
          {isDrawingWall && (
            <span className="text-primary font-medium animate-pulse">
              ● {newWallIsBearing ? "Несущая" : "Перегородка"}
            </span>
          )}
        </div>
      </footer>

      {/* AI Chat */}
      <AIChat />
    </div>
  );
};

export default Editor;
