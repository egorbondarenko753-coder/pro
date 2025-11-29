import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/editor", label: "Редактор" },
  { href: "/gallery", label: "Галерея" },
  { href: "/guide", label: "Руководство" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "О проекте" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container-wide flex h-16 items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/editor">
            <Button className="btn-primary font-semibold">
              Открыть редактор
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-4 space-y-2 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg font-medium transition-colors",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/editor" onClick={() => setIsOpen(false)}>
              <Button className="w-full btn-primary mt-4 font-semibold">
                Открыть редактор
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
