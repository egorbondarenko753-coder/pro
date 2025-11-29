import { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles,
  ChevronDown,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Suggestion {
  title: string;
  description: string;
}

const suggestions: Suggestion[] = [
  { title: "Гостиная 20м²", description: "Оптимальная расстановка для просторной гостиной" },
  { title: "Спальня 12м²", description: "Компактная спальня с гардеробом" },
  { title: "Кухня-студия", description: "Зонирование кухни и столовой" },
  { title: "Детская комната", description: "Функциональное пространство для ребёнка" },
  { title: "Рабочий кабинет", description: "Организация домашнего офиса" },
];

const aiResponses: Record<string, string> = {
  "гостиная": `Для гостиной 20м² рекомендую:

📐 **Планировка:**
• Диван (200×90) у стены напротив окна
• ТВ-тумба (160×45) напротив дивана
• Журнальный стол (120×60) по центру
• Два кресла по бокам дивана

💡 **Советы:**
• Оставьте проход минимум 80 см
• Расстояние до ТВ — 2.5-3 метра
• Зона отдыха ближе к окну для естественного света`,

  "спальня": `Для спальни 12м² рекомендую:

📐 **Планировка:**
• Кровать 160×200 — изголовьем к глухой стене
• Две тумбы (50×45) по бокам кровати
• Шкаф (200×60) вдоль короткой стены

💡 **Советы:**
• Расстояние вокруг кровати минимум 60 см
• Не ставьте кровать напротив двери
• Зеркало визуально увеличит пространство`,

  "кухня": `Для кухни-студии рекомендую:

📐 **Планировка:**
• Рабочий треугольник: плита — мойка — холодильник
• Обеденная зона у окна
• Барная стойка для зонирования

💡 **Советы:**
• Между рабочими зонами 1.2-2.7 м
• Вытяжка над плитой обязательна
• Освещение над каждой зоной отдельно`,

  "детская": `Для детской комнаты рекомендую:

📐 **Планировка:**
• Кровать в дальнем от двери углу
• Рабочий стол у окна (естественный свет)
• Шкаф и стеллажи вдоль стены
• Игровая зона в центре

💡 **Советы:**
• Розетки выше 1.5 м от пола
• Закруглённая мебель безопаснее
• Оставьте место для роста`,

  "кабинет": `Для домашнего офиса рекомендую:

📐 **Планировка:**
• Стол (140×70) перпендикулярно окну
• Стеллаж за спиной для книг
• Кресло с хорошей поддержкой спины

💡 **Советы:**
• Свет должен падать слева (для правшей)
• Расстояние до монитора 50-70 см
• Добавьте растения для уюта`,
};

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Привет! Я AI-помощник СтройПлан. Могу предложить планировки для разных комнат. Выберите комнату или задайте вопрос.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(aiResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return `Интересный вопрос! Для более точных рекомендаций, уточните:

• Площадь комнаты (м²)
• Тип помещения (гостиная, спальня, кухня)
• Особые требования (рабочее место, хранение)

Или выберите один из готовых вариантов планировки выше.`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: getAIResponse(input),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: `Покажи планировку: ${suggestion.title}`,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const key = suggestion.title.toLowerCase().split(" ")[0];
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: getAIResponse(key),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <Sparkles className="h-5 w-5" />
        <span className="font-medium">AI-помощник</span>
      </button>
    );
  }

  return (
    <div 
      className={cn(
        "fixed bottom-20 right-6 z-50 bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden",
        isMinimized ? "w-80 h-14" : "w-96 h-[500px]"
      )}
    >
      {/* Header */}
      <div 
        className="h-14 px-4 flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-sm">AI-помощник</span>
            {!isMinimized && (
              <span className="text-xs text-muted-foreground ml-2">онлайн</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform", isMinimized && "rotate-180")} />
          </button>
          <button 
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Suggestions */}
          <div className="p-3 border-b border-border overflow-x-auto">
            <div className="flex gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex-shrink-0 px-3 py-2 bg-muted hover:bg-primary/10 rounded-lg text-left transition-colors group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium group-hover:text-primary">
                    <Lightbulb className="h-3 w-3" />
                    {suggestion.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 h-[320px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Задайте вопрос..."
                className="flex-1 px-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
