import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="w-full max-w-3xl rounded-[3.5rem] bg-white p-14 shadow-2xl">
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-bold text-gray-900">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-4 text-xl text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}
