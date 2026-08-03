import {
    forwardRef,
    type InputHTMLAttributes,
} from "react";

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {

    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
(
    {
        label,
        error,
        helperText,
        className = "",
        ...props
    },
    ref
) => {

    return (

        <div className="space-y-2">

            {label && (

                <label className="block text-center text-lg font-semibold text-slate-700">

                    {label}

                </label>

            )}

            <input
                ref={ref}
                {...props}
                className={`
                    w-full
                    rounded-3xl
                    border-2
                    px-6
                    py-5
                    text-lg
                    text-center
                    outline-none
                    transition-all

                    ${
                        error
                            ? "border-red-500 focus:ring-2 focus:ring-red-300"
                            : "border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/20"
                    }

                    disabled:bg-slate-100

                    ${className}

                `}
            />

            {helperText && !error && (

                <p className="text-center text-base text-slate-500">

                    {helperText}

                </p>

            )}

            {error && (

                <p className="text-center text-base font-medium text-red-600">

                    {error}

                </p>

            )}

        </div>

    );

});

Input.displayName = "Input";

export default Input;
