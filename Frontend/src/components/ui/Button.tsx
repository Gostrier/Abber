import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeStyles = {
  sm: "px-7 py-3.5 text-base rounded-2xl",
  md: "px-10 py-5 text-lg rounded-2xl",
  lg: "px-14 py-7 text-xl rounded-3xl",
  xl: "px-18 py-8 text-2xl rounded-3xl",
};

const Button = ({
  children,
  loading = false,
  fullWidth = true,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white hover:opacity-95 hover:shadow-xl shadow-lg",

    secondary:
      "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800",

    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-md",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };

  return (
    <button
      disabled={loading || props.disabled}
      className={`
        flex items-center justify-center gap-3
        font-semibold
        transition-all
        duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-600
        focus-visible:ring-offset-2
        ${variants[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 size={26} className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
