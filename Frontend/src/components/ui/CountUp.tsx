import { useEffect, useState } from "react";

interface CountUpProps {
    end: number;
    start?: number;
    duration?: number;
    separator?: string;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    delay?: number;
    className?: string;
}

const easeOutExpo = (t: number) =>
    t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

const formatValue = (
    value: number,
    separator?: string,
    decimals = 0,
    prefix = "",
    suffix = ""
) => {
    const [int, frac] = value.toFixed(decimals).split(".");
    const grouped = separator
        ? int.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
        : int;
    return `${prefix}${grouped}${frac ? `.${frac}` : ""}${suffix}`;
};

const CountUp = ({
    end,
    start = 0,
    duration = 2,
    separator,
    decimals = 0,
    prefix = "",
    suffix = "",
    delay = 0,
    className,
}: CountUpProps) => {
    const [display, setDisplay] = useState(() =>
        formatValue(start, separator, decimals, prefix, suffix)
    );

    useEffect(() => {
        let raf = 0;
        let startTime = 0;

        const tick = (now: number) => {
            if (!startTime) startTime = now;
            const progress = Math.min(1, (now - startTime) / (duration * 1000));
            const eased = easeOutExpo(progress);
            const value = start + (end - start) * eased;
            setDisplay(formatValue(value, separator, decimals, prefix, suffix));
            if (progress < 1) {
                raf = requestAnimationFrame(tick);
            }
        };

        const timeoutId = setTimeout(() => {
            raf = requestAnimationFrame(tick);
        }, delay * 1000);

        return () => {
            clearTimeout(timeoutId);
            cancelAnimationFrame(raf);
        };
    }, [end, start, duration, separator, decimals, prefix, suffix, delay]);

    return <span className={className}>{display}</span>;
};

export default CountUp;
