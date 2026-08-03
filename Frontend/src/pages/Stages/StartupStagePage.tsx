import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  Lightbulb,
  ClipboardCheck,
  Rocket,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { createIdea } from "../../api/businessIdeaApi";
import type { ExecutionStage } from "../../api/businessIdeaApi";

interface StageConfig {
  id: string;
  title: string;
  icon: typeof Lightbulb;
  color: string;
  description: string;
}

const stages: Record<string, StageConfig> = {
  idea: {
    id: "idea",
    title: "Idea",
    icon: Lightbulb,
    color: "from-blue-500 to-blue-600",
    description: "Refine and document your business idea.",
  },
  validation: {
    id: "validation",
    title: "Validation",
    icon: ClipboardCheck,
    color: "from-indigo-500 to-indigo-600",
    description: "Validate your concept with research and feedback.",
  },
  develop: {
    id: "develop",
    title: "Develop",
    icon: Rocket,
    color: "from-purple-500 to-purple-600",
    description: "Build your MVP and product.",
  },
  scale: {
    id: "scale",
    title: "Scale",
    icon: TrendingUp,
    color: "from-rose-500 to-rose-600",
    description: "Grow your startup and expand.",
  },
};

const IDEA_FIELDS = [
  { label: "Idea Name", name: "title", placeholder: "e.g., AI-Powered Farming Assistant" },
  { label: "Problem Statement", name: "detailedDescription", placeholder: "What problem does it solve?" },
  { label: "Target Audience", name: "targetMarket", placeholder: "Who will use it?" },
  { label: "Value Proposition", name: "uniqueValueProposition", placeholder: "Why is it unique?" },
];

interface IdeaForm {
  title: string;
  detailedDescription: string;
  targetMarket: string;
  uniqueValueProposition: string;
}

const stageToExecution: Record<string, ExecutionStage> = {
  idea: "IDEATION",
  validation: "VALIDATION",
  develop: "MVP_LAUNCH",
  scale: "SCALING",
};

const StartupStagePage = ({ stageId }: { stageId: string }) => {
  const navigate = useNavigate();
  const stage = stages[stageId];
  const Icon = stage?.icon || Lightbulb;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IdeaForm>();

  const onSubmit = async (data: IdeaForm) => {
    try {
      await createIdea({
        title: data.title,
        elevatorPitch: data.detailedDescription,
        detailedDescription: data.detailedDescription,
        targetMarket: data.targetMarket,
        uniqueValueProposition: data.uniqueValueProposition,
        executionStage: stageToExecution[stageId] ?? "IDEATION",
      });
      toast.success("Business idea saved successfully!");
      navigate("/ideas");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save your idea. Please try again.");
    }
  };

  if (!stage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-xl text-blue-200">Stage not found.</p>
      </div>
    );
  }

  if (stageId !== "idea") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-8 py-10 lg:px-12 lg:py-12"
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-6 mb-10">
            <div className={`inline-flex rounded-2xl bg-gradient-to-br ${stage.color} p-4 text-white`}>
              <Icon size={36} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{stage.title} Stage</h1>
              <p className="mt-2 text-lg text-blue-200">{stage.description}</p>
            </div>
          </div>

          <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-10">
            <div className="flex flex-col items-center text-center gap-6 py-8">
              <div className={`inline-flex rounded-2xl bg-gradient-to-br ${stage.color} p-4 text-white`}>
                <Layers size={36} />
              </div>
              <h2 className="text-2xl font-bold text-white">Tracked via your Roadmap</h2>
              <p className="max-w-xl text-lg text-blue-200 leading-relaxed">
                The {stage.title.toLowerCase()} stage is managed through your business roadmap.
                Create milestones, mark them complete, and monitor your overall progress from your
                Ideas page.
              </p>
              <Link to="/ideas">
                <Button size="lg">
                  Go to My Ideas
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full px-8 py-10 lg:px-12 lg:py-12"
    >
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-6 mb-10">
          <div className={`inline-flex rounded-2xl bg-gradient-to-br ${stage.color} p-4 text-white`}>
            <Icon size={36} />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">{stage.title} Stage</h1>
            <p className="mt-2 text-lg text-blue-200">{stage.description}</p>
          </div>
        </div>

        <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {IDEA_FIELDS.map((field) => (
              <Input
                key={field.name}
                label={field.label}
                placeholder={field.placeholder}
                error={errors[field.name as keyof IdeaForm]?.message}
                {...register(field.name as keyof IdeaForm, { required: `${field.label} is required` })}
              />
            ))}

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" loading={isSubmitting} size="lg" fullWidth={false}>
                <CheckCircle2 size={20} />
                Save Idea
                <ArrowRight size={20} />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </motion.div>
  );
};

export default StartupStagePage;
