import { Mail, MessageCircle, MapPin } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/Logo";
import { toast } from "@/hooks/use-toast";

const teamMembers = [
  {
    name: "Команда разработки",
    role: "Создание и развитие продукта",
    description: "Работаем над тем, чтобы СтройПлан был удобным и полезным инструментом для планирования ремонта",
  },
];

const About = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Сообщение отправлено",
      description: "Мы свяжемся с вами в ближайшее время",
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              О проекте
            </h1>
            <p className="text-lg text-muted-foreground">
              СтройПлан создан, чтобы сделать планирование перепланировки 
              простым и наглядным процессом для каждого.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container-wide px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Наша миссия</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Перепланировка квартиры — сложный процесс, который требует 
                  тщательного планирования. Многие владельцы квартир сталкиваются 
                  с трудностями при визуализации будущих изменений.
                </p>
                <p>
                  Мы создали СтройПлан, чтобы каждый мог легко создать план 
                  своей квартиры, расставить мебель и увидеть результат до 
                  начала реальных работ.
                </p>
                <p>
                  Наша цель — уменьшить неопределённость и помочь принимать 
                  взвешенные решения о перепланировке.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="card-elevated p-12 text-center">
                <Logo size="lg" className="justify-center mb-6" />
                <p className="text-muted-foreground">
                  Визуализируйте идеи.<br />Планируйте уверенно.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Roadmap */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Планы развития
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-elevated p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">3D-визуализация</h3>
              <p className="text-sm text-muted-foreground">
                Полноценный 3D-режим с прогулкой по квартире
              </p>
            </div>
            
            <div className="card-elevated p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Облачное хранение</h3>
              <p className="text-sm text-muted-foreground">
                Сохранение проектов в облаке с доступом с любого устройства
              </p>
            </div>
            
            <div className="card-elevated p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Расчёт сметы</h3>
              <p className="text-sm text-muted-foreground">
                Автоматическая оценка стоимости материалов и работ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-padding">
        <div className="container-wide px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Свяжитесь с нами
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Есть вопросы, предложения или нашли ошибку? 
                Мы всегда рады обратной связи.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">support@stroyplan.ru</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telegram</p>
                    <p className="font-medium">@stroyplan_support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="card-elevated p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Имя</label>
                <Input placeholder="Ваше имя" required />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input type="email" placeholder="email@example.com" required />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Сообщение</label>
                <Textarea 
                  placeholder="Опишите ваш вопрос или предложение..." 
                  rows={4}
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full btn-primary">
                Отправить сообщение
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
