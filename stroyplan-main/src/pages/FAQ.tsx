import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  Scale, 
  Shield, 
  FileText,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const generalFaq = [
  {
    question: "Что такое СтройПлан?",
    answer: "СтройПлан — это бесплатный онлайн-планировщик перепланировок и ремонта. Он позволяет создавать планы квартир, расставлять мебель и визуализировать результат до начала реальных работ.",
  },
  {
    question: "Нужна ли регистрация?",
    answer: "Нет, для работы с редактором регистрация не требуется. Проекты сохраняются локально в вашем браузере. В будущем мы добавим облачное хранение для зарегистрированных пользователей.",
  },
  {
    question: "Можно ли использовать СтройПлан на мобильном устройстве?",
    answer: "Редактор оптимизирован для работы на компьютере или планшете. На мобильных устройствах доступен ограниченный функционал. Для комфортной работы рекомендуем использовать устройство с экраном от 10 дюймов.",
  },
  {
    question: "В каких форматах можно экспортировать проект?",
    answer: "Сейчас доступен экспорт в PNG. В ближайших обновлениях добавим PDF с размерами для печати и SVG для использования в других программах.",
  },
  {
    question: "Могу ли я импортировать план квартиры из БТИ?",
    answer: "В текущей версии импорт изображений не поддерживается. Вы можете использовать план БТИ как визуальный ориентир и воссоздать планировку вручную.",
  },
];

const legalFaq = [
  {
    question: "Какие перепланировки требуют согласования?",
    answer: "Практически все работы, затрагивающие несущие конструкции, инженерные коммуникации, изменение площади мокрых зон и объединение помещений требуют согласования. Конкретные требования зависят от региона.",
  },
  {
    question: "Где согласовать перепланировку?",
    answer: "В большинстве регионов России согласование проводится через МФЦ или местную жилищную инспекцию. В Москве — через портал mos.ru или МФЦ.",
  },
  {
    question: "Что запрещено делать при перепланировке?",
    answer: "Запрещено: сносить или переносить несущие стены, объединять жилые комнаты с газифицированной кухней, переносить мокрые зоны над жилыми помещениями соседей снизу, демонтировать вентиляционные короба.",
  },
  {
    question: "Заменяет ли СтройПлан проект перепланировки?",
    answer: "Нет. СтройПлан — это инструмент для визуализации и планирования. Для официального согласования перепланировки требуется проект, выполненный лицензированной проектной организацией.",
  },
];

const legalLinks = [
  {
    title: "Жилищный кодекс РФ, Глава 4",
    description: "О переустройстве и перепланировке",
    url: "http://www.consultant.ru/document/cons_doc_LAW_51057/",
  },
  {
    title: "Постановление Правительства Москвы №508-ПП",
    description: "Требования к перепланировке в Москве",
    url: "https://www.mos.ru/authority/documents/",
  },
  {
    title: "mos.ru — Согласование перепланировки",
    description: "Подача заявления онлайн (Москва)",
    url: "https://www.mos.ru/pgu/ru/services/procedure/0/0/7700000010000190240/",
  },
];

const FAQ = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Часто задаваемые вопросы
            </h1>
            <p className="text-lg text-muted-foreground">
              Ответы на популярные вопросы о работе с сервисом и законодательстве в сфере перепланировок.
            </p>
          </div>
        </div>
      </section>

      {/* General FAQ */}
      <section className="section-padding">
        <div className="container-wide px-4 md:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">О сервисе</h2>
          </div>

          <Accordion type="single" collapsible className="max-w-3xl">
            {generalFaq.map((item, index) => (
              <AccordionItem key={index} value={`general-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Legal FAQ */}
      <section id="legal" className="section-padding bg-muted/30">
        <div className="container-wide px-4 md:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Законодательство</h2>
          </div>

          {/* Disclaimer */}
          <div className="card-elevated p-6 mb-8 max-w-3xl border-l-4 border-l-primary">
            <div className="flex gap-4">
              <AlertTriangle className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Важное уведомление</h3>
                <p className="text-sm text-muted-foreground">
                  Информация в этом разделе носит справочный характер и не является юридической консультацией. 
                  Перед началом работ по перепланировке рекомендуем проконсультироваться с профильными специалистами 
                  и уточнить требования в местных органах жилищного контроля.
                </p>
              </div>
            </div>
          </div>

          <Accordion type="single" collapsible className="max-w-3xl mb-8">
            {legalFaq.map((item, index) => (
              <AccordionItem key={index} value={`legal-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Useful Links */}
          <div className="max-w-3xl">
            <h3 className="text-xl font-semibold mb-4">Полезные ссылки</h3>
            <div className="space-y-3">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-elevated p-4 flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding">
        <div className="container-wide px-4 md:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Не нашли ответ на свой вопрос?
          </h2>
          <p className="text-muted-foreground mb-6">
            Свяжитесь с нами, и мы постараемся помочь
          </p>
          <Link to="/about#contact">
            <Button size="lg" className="btn-primary">
              Связаться с поддержкой
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
