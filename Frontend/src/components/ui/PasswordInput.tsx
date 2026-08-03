import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full">
        <label className="mb-3 block text-center text-lg font-semibold text-slate-700">
          {label}
        </label>

        <div
          className={`
            flex items-center
            rounded-3xl
            border-2
            bg-white
            transition-all
            ${
              error
                ? "border-red-500"
                : "border-slate-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20"
            }
          `}
        >
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`
              flex-1
              bg-transparent
              py-5
              text-lg
              text-center
              outline-none
              text-slate-700
              placeholder:text-slate-400
              px-6
              ${className}
            `}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              flex items-center px-6
              text-slate-400
              transition
              hover:text-primary
            "
          >
            {showPassword ? (
              <EyeOff size={24} />
            ) : (
              <Eye size={24} />
            )}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-center text-lg text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
