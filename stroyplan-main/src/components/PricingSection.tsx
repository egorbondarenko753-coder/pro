import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Демо",
    price: "0",
    period: "бесплатно",
    description: "Познакомьтесь с возможностями",
    icon: Zap,
    features: [
      "2D редактор",
      "До 10 стен",
      "5 объектов мебели",
      "Экспорт PNG",
      "Сохранение в браузере",
    ],
    cta: "Начать бесплатно",
    highlighted: false,
  },
  {
    name: "Стандарт",
    price: "799",
    period: "₽ / навсегда",
    description: "Для личного использования",
    icon: Sparkles,
    features: [
      "2D и 3D редактор",
      "Неограниченно стен",
      "Полный каталог мебели",
      "Экспорт PNG, JSON",
      "AI-помощник",
      "Облачное хранение",
      "Несущие/перегородки",
    ],
    cta: "Выбрать Стандарт",
    highlighted: true,
  },
  {
    name: "Про",
    price: "2999",
    period: "₽ / навсегда",
    description: "Для профессионалов",
    icon: Crown,
    features: [
      "Всё из Стандарт",
      "Экспорт PDF с размерами",
      "Экспорт DWG/DXF",
      "Генерация сметы",
      "Приоритетная поддержка",
      "Коммерческое использование",
      "Ранний доступ к функциям",
    ],
    cta: "Выбрать Про",
    highlighted: false,
  },
];

export const PricingSection = () => {
  return (
    <section className="section-padding bg-muted/30" id="pricing">
      <div className="container-wide px-4 md:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary mb-4">
            <Crown className="h-4 w-4" />
            Тарифы
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Выберите подходящий план
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Начните бесплатно и улучшите по мере необходимости. Одноразовая оплата — без подписок.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-6 transition-all duration-300 animate-fade-up ${
                plan.highlighted
                  ? "bg-foreground text-background shadow-2xl scale-105 border-2 border-primary"
                  : "bg-card border border-border shadow-lg hover:shadow-xl"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Популярный
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl ${
                  plan.highlighted ? "bg-primary/20" : "bg-primary/10"
                }`}>
                  <plan.icon className={`h-5 w-5 ${
                    plan.highlighted ? "text-primary" : "text-primary"
                  }`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className={`text-xs ${
                    plan.highlighted ? "text-background/70" : "text-muted-foreground"
                  }`}>
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className={`text-sm ml-1 ${
                  plan.highlighted ? "text-background/70" : "text-muted-foreground"
                }`}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      plan.highlighted ? "text-primary" : "text-primary"
                    }`} />
                    <span className={plan.highlighted ? "text-background/90" : ""}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Все тарифы включают бессрочную лицензию. Возврат в течение 14 дней.
        </p>
      </div>
    </section>
  );
};
