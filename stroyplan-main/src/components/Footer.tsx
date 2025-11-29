import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const footerLinks = {
  product: {
    title: "Продукт",
    links: [
      { href: "/editor", label: "Редактор" },
      { href: "/gallery", label: "Галерея" },
      { href: "/guide", label: "Руководство" },
    ],
  },
  support: {
    title: "Поддержка",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/about", label: "О проекте" },
      { href: "/about#contact", label: "Контакты" },
    ],
  },
  legal: {
    title: "Правовая информация",
    links: [
      { href: "/faq#legal", label: "Законодательство" },
      { href: "/privacy", label: "Конфиденциальность" },
      { href: "/terms", label: "Условия использования" },
    ],
  },
};

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-wide px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Онлайн-планировщик перепланировок и ремонта. 
              Визуализируйте идеи до начала работ.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} СтройПлан. Все права защищены.
          </p>
          <p className="text-xs text-muted-foreground">
            Сервис не заменяет профессиональную консультацию специалистов.
          </p>
        </div>
      </div>
    </footer>
  );
};
