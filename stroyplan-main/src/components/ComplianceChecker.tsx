import { useMemo } from "react";
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Scale,
  Info,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Wall {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  thickness: number;
  height: number;
  isBearing: boolean;
}

interface CanvasObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  rotation: number;
  name: string;
  color: string;
}

interface ComplianceCheckerProps {
  walls: Wall[];
  objects: CanvasObject[];
  canvasWidth: number;
  canvasHeight: number;
}

interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  code?: string;
  severity: "error" | "warning" | "success";
}

const getWallLength = (wall: Wall): number => {
  return Math.sqrt(
    Math.pow(wall.end.x - wall.start.x, 2) + 
    Math.pow(wall.end.y - wall.start.y, 2)
  );
};

export const ComplianceChecker = ({ walls, objects, canvasWidth, canvasHeight }: ComplianceCheckerProps) => {
  const issues = useMemo(() => {
    const result: ComplianceIssue[] = [];
    
    // === КРИТИЧЕСКИЕ ОШИБКИ (красные) ===
    
    // Проверка несущих стен
    const bearingWalls = walls.filter(w => w.isBearing);
    const removedBearingWalls = bearingWalls.filter(w => getWallLength(w) < 50);
    if (removedBearingWalls.length > 0) {
      result.push({
        id: "bearing-wall-short",
        severity: "error",
        title: "Несущая стена слишком короткая",
        description: "Несущие стены менее 50 см могут нарушать конструктивную целостность здания.",
        code: "СП 70.13330.2012"
      });
    }

    // Проверка минимальной высоты помещения
    const hasLowCeiling = walls.some(w => w.height < 250);
    if (hasLowCeiling) {
      result.push({
        id: "low-ceiling",
        severity: "error",
        title: "Высота потолка ниже нормы",
        description: "Минимальная высота жилого помещения должна быть не менее 2.5 м.",
        code: "СП 54.13330.2016 п.5.8"
      });
    }

    // Проверка проходов между объектами
    const objectPairs: Array<[CanvasObject, CanvasObject]> = [];
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        objectPairs.push([objects[i], objects[j]]);
      }
    }
    
    const tooCloseObjects = objectPairs.filter(([a, b]) => {
      const dist = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
      const minDist = Math.max(a.width, a.height, b.width, b.height) / 2 + 70; // 70 см проход
      return dist < minDist && dist > 0;
    });
    
    if (tooCloseObjects.length > 0) {
      result.push({
        id: "narrow-passage",
        severity: "error",
        title: "Узкий проход между объектами",
        description: `Минимальная ширина прохода должна быть не менее 70 см. Найдено ${tooCloseObjects.length} нарушений.`,
        code: "СП 59.13330.2020"
      });
    }

    // Проверка на отсутствие несущих стен вообще
    if (walls.length > 0 && bearingWalls.length === 0) {
      result.push({
        id: "no-bearing-walls",
        severity: "error",
        title: "Отсутствуют несущие стены",
        description: "Планировка не содержит несущих стен. Убедитесь, что несущие конструкции отмечены корректно.",
        code: "СП 70.13330.2012"
      });
    }

    // === ПРЕДУПРЕЖДЕНИЯ (жёлтые) ===

    // Проверка толщины перегородок
    const thinPartitions = walls.filter(w => !w.isBearing && w.thickness < 10);
    if (thinPartitions.length > 0) {
      result.push({
        id: "thin-partition",
        severity: "warning",
        title: "Тонкие перегородки",
        description: "Перегородки толщиной менее 10 см могут не обеспечивать звукоизоляцию. Проконсультируйтесь со специалистом.",
        code: "СП 51.13330.2011"
      });
    }

    // Проверка санузлов рядом с жилыми комнатами
    const bathObjects = objects.filter(o => 
      o.name.toLowerCase().includes("унитаз") || 
      o.name.toLowerCase().includes("ванна") ||
      o.name.toLowerCase().includes("душ")
    );
    const bedObjects = objects.filter(o => 
      o.name.toLowerCase().includes("кровать")
    );
    
    if (bathObjects.length > 0 && bedObjects.length > 0) {
      const bathNearBed = bathObjects.some(bath => 
        bedObjects.some(bed => {
          const dist = Math.sqrt(Math.pow(bath.x - bed.x, 2) + Math.pow(bath.y - bed.y, 2));
          return dist < 200; // 2 метра
        })
      );
      
      if (bathNearBed) {
        result.push({
          id: "bath-near-bed",
          severity: "warning",
          title: "Санузел рядом со спальней",
          description: "Размещение санузла непосредственно над или рядом со спальней может требовать дополнительной звукоизоляции.",
          code: "СНиП 31-01-2003"
        });
      }
    }

    // Проверка кухни и газового оборудования
    const kitchenObjects = objects.filter(o => 
      o.name.toLowerCase().includes("плита") || 
      o.name.toLowerCase().includes("холодильник")
    );
    if (kitchenObjects.length > 0) {
      result.push({
        id: "kitchen-ventilation",
        severity: "warning",
        title: "Проверьте вентиляцию кухни",
        description: "При наличии газового оборудования требуется естественная вентиляция и окно. Уточните у специалиста.",
        code: "СП 402.1325800.2018"
      });
    }

    // Электробезопасность в санузле
    if (bathObjects.length > 0) {
      result.push({
        id: "bathroom-electrical",
        severity: "warning",
        title: "Электрика в санузле",
        description: "Размещение электроприборов в санузле требует соблюдения зон безопасности. Проконсультируйтесь с электриком.",
        code: "ПУЭ-7 гл.7.1"
      });
    }

    // Проверка площади помещения
    const totalArea = (canvasWidth / 100) * (canvasHeight / 100); // в м²
    if (totalArea < 8) {
      result.push({
        id: "small-area",
        severity: "warning",
        title: "Малая площадь помещения",
        description: "Жилая комната должна быть не менее 8 м². Уточните требования для вашего типа помещения.",
        code: "СП 54.13330.2016 п.5.7"
      });
    }

    // Проверка на перенос мокрых зон
    if (bathObjects.length > 0 && bearingWalls.length > 0) {
      result.push({
        id: "wet-zone-relocation",
        severity: "warning",
        title: "Перенос мокрых зон",
        description: "Перенос санузла или кухни в другое место квартиры требует согласования и гидроизоляции.",
        code: "ПП РФ №47 от 28.01.2006"
      });
    }

    // === СООТВЕТСТВИЯ (зелёные) ===

    // Проверка наличия стен
    if (walls.length > 0) {
      const hasProperWalls = walls.every(w => w.thickness >= 10);
      if (hasProperWalls) {
        result.push({
          id: "proper-walls",
          severity: "success",
          title: "Толщина стен в норме",
          description: "Все стены имеют достаточную толщину для жилых помещений.",
          code: "СП 70.13330.2012"
        });
      }
    }

    // Проверка высоты потолка
    const allWallsProperHeight = walls.length > 0 && walls.every(w => w.height >= 250);
    if (allWallsProperHeight) {
      result.push({
        id: "proper-height",
        severity: "success",
        title: "Высота потолка соответствует",
        description: "Высота помещения соответствует нормам для жилых зданий (≥2.5 м).",
        code: "СП 54.13330.2016"
      });
    }

    // Проверка несущих стен
    if (bearingWalls.length > 0) {
      const properBearing = bearingWalls.every(w => w.thickness >= 20);
      if (properBearing) {
        result.push({
          id: "bearing-thickness",
          severity: "success",
          title: "Несущие стены корректны",
          description: "Толщина несущих стен соответствует минимальным требованиям (≥20 см).",
          code: "СП 70.13330.2012"
        });
      }
    }

    // Проверка расстановки мебели
    if (objects.length > 0 && tooCloseObjects.length === 0) {
      result.push({
        id: "proper-layout",
        severity: "success",
        title: "Расстановка мебели корректна",
        description: "Проходы между объектами соответствуют нормам эргономики.",
        code: "СП 59.13330.2020"
      });
    }

    // Базовая проверка соответствия
    if (walls.length >= 4) {
      result.push({
        id: "enclosed-space",
        severity: "success",
        title: "Помещение замкнуто",
        description: "Планировка содержит достаточное количество стен для образования помещения.",
        code: "СП 54.13330.2016"
      });
    }

    return result;
  }, [walls, objects, canvasWidth, canvasHeight]);

  const errors = issues.filter(i => i.severity === "error");
  const warnings = issues.filter(i => i.severity === "warning");
  const successes = issues.filter(i => i.severity === "success");

  const IssueCard = ({ issue }: { issue: ComplianceIssue }) => (
    <div className={cn(
      "p-3 rounded-lg border mb-2 transition-all hover:shadow-sm",
      issue.severity === "error" && "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900",
      issue.severity === "warning" && "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-900",
      issue.severity === "success" && "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900"
    )}>
      <div className="flex items-start gap-2">
        {issue.severity === "error" && <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />}
        {issue.severity === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />}
        {issue.severity === "success" && <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-medium text-sm",
            issue.severity === "error" && "text-red-800 dark:text-red-200",
            issue.severity === "warning" && "text-yellow-800 dark:text-yellow-200",
            issue.severity === "success" && "text-green-800 dark:text-green-200"
          )}>
            {issue.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {issue.description}
          </p>
          {issue.code && (
            <span className={cn(
              "inline-block text-[10px] px-1.5 py-0.5 rounded mt-2 font-mono",
              issue.severity === "error" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
              issue.severity === "warning" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
              issue.severity === "success" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            )}>
              {issue.code}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Проверка законодательства РФ</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Автоматическая проверка соответствия СНиП, СП и другим нормам
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 p-3 border-b border-border">
        <div className="flex flex-col items-center p-2 rounded-lg bg-red-50 dark:bg-red-950/30">
          <ShieldAlert className="h-5 w-5 text-red-600 mb-1" />
          <span className="text-lg font-bold text-red-700 dark:text-red-400">{errors.length}</span>
          <span className="text-[10px] text-red-600 dark:text-red-400">Ошибки</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
          <ShieldQuestion className="h-5 w-5 text-yellow-600 mb-1" />
          <span className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{warnings.length}</span>
          <span className="text-[10px] text-yellow-600 dark:text-yellow-400">Внимание</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
          <ShieldCheck className="h-5 w-5 text-green-600 mb-1" />
          <span className="text-lg font-bold text-green-700 dark:text-green-400">{successes.length}</span>
          <span className="text-[10px] text-green-600 dark:text-green-400">В норме</span>
        </div>
      </div>

      {/* Issues List */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">
                  Недопустимые ошибки
                </span>
              </div>
              {errors.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 uppercase tracking-wide">
                  Требует уточнения
                </span>
              </div>
              {warnings.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}

          {/* Successes */}
          {successes.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                  Соответствует нормам
                </span>
              </div>
              {successes.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {issues.length === 0 && (
            <div className="text-center py-8">
              <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Добавьте стены и объекты для проверки соответствия нормам
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Disclaimer */}
      <div className="p-3 border-t border-border bg-muted/30">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong>Важно:</strong> Данная проверка носит информационный характер и не заменяет консультацию профессионального архитектора или юриста. Перед проведением перепланировки обязательно получите согласование в уполномоченных органах.
        </p>
      </div>
    </div>
  );
};
