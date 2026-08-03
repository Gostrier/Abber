import { Link } from "react-router-dom";
import { useState } from "react";

const logoImg = "/images/abber2.png";

interface LogoProps {
    size?: "sm" | "md" | "lg" | "xl";
}

const fallbackChar = "A";

const sizeMap = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
    xl: "h-20",
};

const Logo = ({ size = "md" }: LogoProps) => {
    const [imgError, setImgError] = useState(false);

    return (
        <Link to="/" className="flex items-center gap-4 group">
            {imgError ? (
                <div className={`${sizeMap[size]} flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 font-bold text-white text-lg`}>
                    {fallbackChar}
                </div>
            ) : (
                <img
                    src={logoImg}
                    alt="Abber"
                    className={`${sizeMap[size]} w-auto object-contain`}
                    onError={() => setImgError(true)}
                />
            )}
        </Link>
    );
};

export default Logo;

export const AbberBrandText = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" | "xl"; className?: string }) => {
    const textSizes = {
        sm: "text-2xl",
        md: "text-4xl",
        lg: "text-5xl",
        xl: "text-6xl",
    };

    const tagSizes = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg",
    };

    return (
        <div className={className}>
            <h1 className={`${textSizes[size]} font-black tracking-[0.15em] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent leading-none`}>
                ABBER
            </h1>
            <p className={`${tagSizes[size]} font-semibold tracking-[0.3em] text-slate-500 mt-1 uppercase`}>
                Make it real
            </p>
        </div>
    );
};
