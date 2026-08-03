import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Hammer, ArrowRight } from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

interface ComingSoonPageProps {
  title: string;
  description: string;
}

const ComingSoonPage = ({ title, description }: ComingSoonPageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-screen items-center justify-center px-6 py-12"
    >
      <Card className="max-w-lg border-white/10 bg-white/10 backdrop-blur-xl p-12 text-center">
        <div className="mx-auto inline-flex rounded-2xl bg-blue-500/20 p-5 text-blue-300">
          <Hammer size={44} />
        </div>
        <h1 className="mt-8 text-3xl font-bold text-white">{title}</h1>
        <p className="mt-4 text-lg text-blue-200 leading-relaxed">{description}</p>
        <div className="mt-10">
          <Link to="/dashboard">
            <Button size="lg">
              Back to Dashboard
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export default ComingSoonPage;
