import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "light" | "dark";
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ 
  className, 
  variant = "default", 
  showText = true,
  size = "md" 
}: LogoProps) => {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
  };

  const colors = {
    default: {
      crane: "hsl(var(--brand-yellow))",
      text: "hsl(var(--foreground))",
    },
    light: {
      crane: "hsl(var(--brand-yellow))",
      text: "#ffffff",
    },
    dark: {
      crane: "hsl(var(--brand-yellow))",
      text: "hsl(var(--brand-dark))",
    },
  };

  const { icon, text } = sizes[size];
  const { crane, text: textColor } = colors[variant];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo SVG - Letter П stylized as construction crane */}
      <svg 
        width={icon} 
        height={icon} 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Crane base / left vertical */}
        <rect x="6" y="12" width="6" height="32" rx="1" fill={crane} />
        
        {/* Crane tower / right vertical */}
        <rect x="36" y="20" width="6" height="24" rx="1" fill={crane} />
        
        {/* Crane jib / horizontal top */}
        <rect x="6" y="8" width="36" height="6" rx="1" fill={crane} />
        
        {/* Crane hook cable */}
        <rect x="30" y="14" width="2" height="12" fill={crane} />
        
        {/* Crane hook */}
        <path 
          d="M28 26 L34 26 L34 30 Q34 34 31 34 Q28 34 28 30 L28 26Z" 
          fill={crane}
        />
        
        {/* Counter jib weight */}
        <rect x="8" y="4" width="8" height="4" rx="1" fill={crane} opacity="0.7" />
      </svg>

      {showText && (
        <span 
          className={cn("font-bold tracking-tight", text)}
          style={{ color: textColor }}
        >
          Строй<span style={{ color: crane }}>План</span>
        </span>
      )}
    </div>
  );
};
