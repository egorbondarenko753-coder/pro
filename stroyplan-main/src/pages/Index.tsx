import { Link } from "react-router-dom";
import { 
  Move, 
  RotateCw, 
  Ruler, 
  Undo2, 
  Layers, 
  Eye,
  Download,
  Grid3X3,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Shield
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/PricingSection";
import heroImage from "@/assets/hero-interior.jpg";

const features = [
  {
    icon: Move,
    title: "Перестановка объектов",
    description: "Перемещайте мебель и элементы с точностью до миллиметра",
  },
  {
    icon: RotateCw,
    title: "Поворот и вращение",
    description: "Вращайте объекты для идеального расположения",
  },
  {
    icon: Ruler,
    title: "Точные размеры",
    description: "Все размеры отображаются в реальном времени",
  },
  {
    icon: Undo2,
    title: "История изменений",
    description: "Отменяйте и возвращайте действия без ограничений",
  },
  {
    icon: Layers,
    title: "2D и 3D режимы",
    description: "Переключайтесь между видами одним кликом",
  },
  {
    icon: Download,
    title: "Экспорт проектов",
    description: "Сохраняйте в PNG, PDF или JSON формате",
  },
];

const problems = [
  {
    icon: AlertTriangle,
    title: "Неопределённость",
    description: "Сложно представить, как будет выглядеть результат ремонта",
  },
  {
    icon: Shield,
    title: "Законодательство",
    description: "Не все перепланировки разрешены, есть риск нарушений",
  },
  {
    icon: Eye,
    title: "Визуализация",
    description: "Традиционные чертежи непонятны без подготовки",
  },
];

const solutions = [
  {
    icon: Lightbulb,
    title: "Наглядно",
    description: "Видите результат в 2D и 3D до начала работ",
  },
  {
    icon: CheckCircle2,
    title: "Безопасно",
    description: "Тестируйте варианты без реальных затрат",
  },
  {
    icon: Grid3X3,
    title: "Быстро",
    description: "Создавайте планы за минуты, а не часы",
  },
];

const galleryItems = [
  { title: "Студия 35м²", rooms: "1 комната" },
  { title: "Двушка 54м²", rooms: "2 комнаты" },
  { title: "Трёшка 78м²", rooms: "3 комнаты" },
  { title: "Квартира 92м²", rooms: "4 комнаты" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container-wide px-4 md:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                Бесплатный онлайн-планировщик
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Планируйте 
                <span className="text-gradient"> перепланировку</span>
                {" "}визуально
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                СтройПлан помогает визуализировать и протестировать варианты 
                перепланировки до начала реальных работ. Рисуйте стены, 
                расставляйте мебель, смотрите результат в 3D.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/editor">
                  <Button size="lg" className="btn-primary text-base px-8 h-12 w-full sm:w-auto">
                    Перейти в редактор
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/gallery">
                  <Button size="lg" variant="outline" className="text-base px-8 h-12 w-full sm:w-auto border-2">
                    Смотреть примеры
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-fade-up animation-delay-200">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img 
                  src={heroImage} 
                  alt="Визуализация интерьера в СтройПлан" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
              
              {/* Floating stats */}
              <div className="absolute -bottom-4 -left-4 md:-left-8 bg-card rounded-xl p-4 shadow-elevated border border-border animate-float">
                <div className="text-2xl font-bold text-primary">2D + 3D</div>
                <div className="text-sm text-muted-foreground">Режимы просмотра</div>
              </div>
              
              <div className="absolute -top-4 -right-4 md:-right-8 bg-card rounded-xl p-4 shadow-elevated border border-border animate-float animation-delay-300">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Объектов мебели</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Проблемы перепланировки
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              С какими трудностями сталкиваются владельцы квартир при планировании ремонта
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className="card-elevated p-6 text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <problem.icon className="h-7 w-7 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                <p className="text-sm text-muted-foreground">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section-padding">
        <div className="container-wide px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Решение — <span className="text-gradient">СтройПлан</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Визуализируйте идеи и тестируйте варианты до начала работ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {solutions.map((solution, index) => (
              <div 
                key={index}
                className="card-elevated p-6 text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <solution.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{solution.title}</h3>
                <p className="text-sm text-muted-foreground">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Возможности редактора
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Всё необходимое для создания детального плана квартиры
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card-elevated p-6 animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="section-padding">
        <div className="container-wide px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Примеры проектов
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Начните с готовых шаблонов или создайте план с нуля
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryItems.map((item, index) => (
              <Link 
                key={index}
                to="/gallery"
                className="card-elevated group overflow-hidden animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-[4/3] bg-muted flex items-center justify-center relative">
                  <Grid3X3 className="h-12 w-12 text-muted-foreground/30" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.rooms}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/gallery">
              <Button variant="outline" size="lg" className="border-2">
                Смотреть все проекты
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* CTA Section */}
      <section className="section-padding bg-foreground text-background">
        <div className="container-wide px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Готовы начать планирование?
          </h2>
          <p className="text-background/70 max-w-2xl mx-auto mb-8">
            Создайте первый проект бесплатно. Регистрация не требуется.
          </p>
          <Link to="/editor">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 h-12">
              Открыть редактор
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
