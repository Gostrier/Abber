import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: boolean;
}

const Card = ({ children, padding = true, className = "", ...props }: CardProps) => {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${padding ? "p-8" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
