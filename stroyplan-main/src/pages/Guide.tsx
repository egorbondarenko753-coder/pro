import { Link } from "react-router-dom";
import { 
  Play, 
  MousePointer2, 
  Move, 
  RotateCw, 
  Ruler, 
  Download,
  Keyboard,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: 1,
    title: "Создайте новый проект",
    description: "Откройте редактор и выберите размеры помещения или загрузите готовый шаблон из галереи",
    icon: Play,
  },
  {
    number: 2,
    title: "Нарисуйте стены",
    description: "Используйте инструмент «Стена» для создания планировки. Стены автоматически выравниваются по сетке",
    icon: MousePointer2,
  },
  {
    number: 3,
    title: "Добавьте мебель",
    description: "Перетащите объекты из каталога на план. Выбирайте из сотен предметов мебели и техники",
    icon: Move,
  },
  {
    number: 4,
    title: "Настройте расположение",
    description: "Перемещайте и поворачивайте объекты для идеального результата. Все размеры отображаются автоматически",
    icon: RotateCw,
  },
  {
    number: 5,
    title: "Сохраните и экспортируйте",
    description: "Сохраните проект для дальнейшей работы или экспортируйте в PNG/PDF для печати",
    icon: Download,
  },
];

const shortcuts = [
  { key: "V", action: "Инструмент выделения" },
  { key: "W", action: "Рисование стен" },
  { key: "M", action: "Перемещение объектов" },
  { key: "R", action: "Поворот объектов" },
  { key: "L", action: "Линейка" },
  { key: "Ctrl+Z", action: "Отменить действие" },
  { key: "Ctrl+Y", action: "Вернуть действие" },
  { key: "Delete", action: "Удалить выбранное" },
];

const tips = [
  "Используйте сетку для точного позиционирования объектов",
  "Дублируйте объекты вместо добавления новых из каталога",
  "Регулярно сохраняйте проект, чтобы не потерять изменения",
  "Переключайтесь между 2D и 3D для лучшей визуализации",
  "Используйте горячие клавиши для ускорения работы",
];

const Guide = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Руководство пользователя
            </h1>
            <p className="text-lg text-muted-foreground">
              Пошаговые инструкции по работе с редактором СтройПлан. 
              От создания первого проекта до экспорта готового плана.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="section-padding">
        <div className="container-wide px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-8">Начало работы</h2>
          
          <div className="space-y-8">
            {steps.map((step) => (
              <div 
                key={step.number}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Шаг {step.number}
                    </span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link to="/editor">
              <Button size="lg" className="btn-primary">
                Попробовать редактор
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-4 md:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Keyboard className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Горячие клавиши</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
            {shortcuts.map((shortcut, index) => (
              <div 
                key={index}
                className="card-elevated p-4 flex items-center gap-3"
              >
                <kbd className="px-3 py-1.5 rounded bg-muted font-mono text-sm font-medium">
                  {shortcut.key}
                </kbd>
                <span className="text-sm text-muted-foreground">{shortcut.action}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="section-padding">
        <div className="container-wide px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-8">Полезные советы</h2>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section Placeholder */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Видеоуроки</h2>
          <p className="text-muted-foreground mb-8">
            Видеоруководства скоро будут доступны
          </p>
          <div className="max-w-2xl mx-auto aspect-video bg-muted rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Play className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Скоро</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Guide;
