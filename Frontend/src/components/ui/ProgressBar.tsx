interface ProgressBarProps {
    percent: number;
    className?: string;
    gradient?: string;
}

const ProgressBar = ({
    percent,
    className = "",
    gradient = "from-blue-500 to-violet-500",
}: ProgressBarProps) => (
    <div
        className={`h-2.5 overflow-hidden rounded-full bg-white/10 ${className}`}
    >
        <div
            className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
    </div>
);

export default ProgressBar;
