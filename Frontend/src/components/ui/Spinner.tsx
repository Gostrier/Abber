import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
}

const Spinner = ({ size = 32 }: SpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        size={size}
        className="animate-spin text-indigo-600"
      />
    </div>
  );
};

export default Spinner;