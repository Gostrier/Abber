import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Lightbulb,
  Plus,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  getMyIdeas,
  getRoadmap,
  createRoadmap,
  addMilestone,
  updateMilestoneStatus,
} from "../../api/businessIdeaApi";
import type { BusinessIdea, BusinessRoadmap, Milestone, MilestoneStatus } from "../../api/businessIdeaApi";

const getStageBadge = (stage?: string) => {
  switch (stage) {
    case "VALIDATION":
      return <Badge variant="info">Validation</Badge>;
    case "MVP_LAUNCH":
      return <Badge variant="success">MVP Launch</Badge>;
    case "SCALING":
      return <Badge variant="success">Scaling</Badge>;
    case "IDEATION":
    default:
      return <Badge variant="warning">Ideation</Badge>;
  }
};

const getStatusBadge = (status: MilestoneStatus) => {
  switch (status) {
    case "COMPLETED":
      return <Badge variant="success">Completed</Badge>;
    case "IN_PROGRESS":
      return <Badge variant="info">In Progress</Badge>;
    case "SUBMITTED_FOR_REVIEW":
      return <Badge variant="warning">Submitted</Badge>;
    case "LOCKED":
    default:
      return <Badge variant="default">Locked</Badge>;
  }
};

const IdeasPage = () => {
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [roadmap, setRoadmap] = useState<BusinessRoadmap | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMyIdeas()
      .then((data) => {
        setIdeas(data);
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Failed to load your ideas.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedId === null) {
      setRoadmap(null);
      return;
    }

    setRoadmapLoading(true);
    setShowAddMilestone(false);

    getRoadmap(selectedId)
      .then((data) => setRoadmap(data))
      .catch(() => setRoadmap(null))
      .finally(() => setRoadmapLoading(false));
  }, [selectedId]);

  const handleAddMilestone = async () => {
    if (!roadmap) return;

    try {
      setSubmitting(true);
      const created = await addMilestone(roadmap.id, {
        sequenceOrder: roadmap.milestones.length + 1,
        taskTitle,
        taskDescription,
      });

      setRoadmap({
        ...roadmap,
        milestones: [...roadmap.milestones, created],
      });

      setTaskTitle("");
      setTaskDescription("");
      setShowAddMilestone(false);
      toast.success("Milestone added!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add milestone.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (milestone: Milestone) => {
    if (!roadmap) return;

    const next: MilestoneStatus = milestone.status === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED";

    try {
      const updated = await updateMilestoneStatus(milestone.id, next);
      setRoadmap({
        ...roadmap,
        milestones: roadmap.milestones.map((m) => (m.id === updated.id ? updated : m)),
      });
      toast.success(next === "COMPLETED" ? "Milestone completed!" : "Milestone reopened.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update milestone.");
    }
  };

  const handleCreateRoadmap = async () => {
    if (selectedId === null) return;

    try {
      setRoadmapLoading(true);
      const created = await createRoadmap(selectedId);
      setRoadmap(created);
      toast.success("Roadmap created!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create roadmap.");
    } finally {
      setRoadmapLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-300" size={48} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full px-6 py-8 lg:px-16 lg:py-12"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">My Ideas</h1>
          <p className="mt-3 text-lg text-blue-200">Manage your business ideas and roadmap milestones.</p>
        </div>
        <Link to="/stages/idea">
          <Button size="md">
            <Plus size={20} />
            New Idea
          </Button>
        </Link>
      </div>

      {error && (
        <div className="mb-10 flex items-center gap-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-red-200">
          <AlertTriangle size={28} />
          <p className="text-lg">{error}</p>
        </div>
      )}

      {ideas.length === 0 && !error ? (
        <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-12 text-center">
          <div className="mx-auto inline-flex rounded-2xl bg-blue-500/20 p-4 text-blue-300">
            <Lightbulb size={40} />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">No ideas yet</h2>
          <p className="mt-3 text-lg text-blue-200">Submit your first business idea to start your journey.</p>
          <Link to="/stages/idea" className="mt-8 inline-block">
            <Button size="lg">
              Submit Your First Idea
              <ArrowRight size={20} />
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Ideas list */}
          <div className="space-y-6">
            {ideas.map((idea) => {
              const selected = idea.id === selectedId;
              return (
                <button
                  key={idea.id}
                  onClick={() => setSelectedId(idea.id)}
                  className={`w-full rounded-2xl border p-6 text-left transition-all ${
                    selected
                      ? "border-blue-400 bg-white/15 shadow-xl"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-white truncate">{idea.title}</h3>
                      <p className="mt-1 text-base text-blue-200 line-clamp-2">{idea.elevatorPitch}</p>
                    </div>
                    {getStageBadge(idea.executionStage)}
                  </div>
                  <p className="mt-4 text-sm text-blue-300/70">
                    Created {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : "—"}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Roadmap detail */}
          <div className="lg:col-span-2">
            {selectedId === null ? (
              <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-12 text-center">
                <p className="text-lg text-blue-200">Select an idea to view its roadmap.</p>
              </Card>
            ) : roadmapLoading ? (
              <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-12 text-center">
                <Loader2 className="mx-auto animate-spin text-blue-300" size={40} />
              </Card>
            ) : roadmap ? (
              <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-8 lg:p-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Roadmap</h2>
                    <p className="mt-1 text-base text-blue-200">
                      {roadmap.milestones.length} milestone{roadmap.milestones.length === 1 ? "" : "s"} in {roadmap.currentPhase}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-white">{Math.round(roadmap.overallCompletionPercentage)}%</p>
                    <p className="text-sm text-blue-300">overall progress</p>
                  </div>
                </div>

                <div className="mt-6 h-3 rounded-full bg-white/10">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                    style={{ width: `${roadmap.overallCompletionPercentage}%` }}
                  />
                </div>

                <div className="mt-8 space-y-4">
                  {roadmap.milestones.length === 0 ? (
                    <p className="text-lg text-blue-200">No milestones yet. Add your first one below.</p>
                  ) : (
                    roadmap.milestones.map((milestone) => {
                      const done = milestone.status === "COMPLETED";
                      return (
                        <div
                          key={milestone.id}
                          className="flex items-center gap-5 rounded-xl border border-white/10 bg-white/5 p-5"
                        >
                          <button onClick={() => handleToggleComplete(milestone)} aria-label="Toggle milestone">
                            {done ? (
                              <CheckCircle2 className="text-green-400" size={28} />
                            ) : (
                              <Circle className="text-blue-300" size={28} />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-lg font-semibold ${done ? "text-white" : "text-white"}`}>
                              {milestone.taskTitle}
                            </p>
                            {milestone.taskDescription && (
                              <p className="text-base text-blue-200 mt-0.5">{milestone.taskDescription}</p>
                            )}
                            {milestone.completedAt && (
                              <p className="text-sm text-blue-300/70 mt-1 flex items-center gap-1.5">
                                <Clock size={14} />
                                Completed {new Date(milestone.completedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(milestone.status)}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-8">
                  {showAddMilestone ? (
                    <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
                      <Input
                        label="Milestone Title"
                        placeholder="e.g., Complete market research"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                      />
                      <Input
                        label="Description"
                        placeholder="What needs to be done?"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                      />
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          loading={submitting}
                          disabled={!taskTitle.trim()}
                          onClick={handleAddMilestone}
                        >
                          Add Milestone
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setShowAddMilestone(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button type="button" size="md" variant="outline" onClick={() => setShowAddMilestone(true)}>
                      <Plus size={20} />
                      Add Milestone
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-12 text-center">
                <p className="text-lg text-blue-200">
                  No roadmap found for this idea. Create one to start tracking milestones.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button
                    type="button"
                    loading={roadmapLoading}
                    onClick={handleCreateRoadmap}
                    className="flex items-center gap-2"
                  >
                    <ChevronDown size={20} />
                    Create Roadmap
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default IdeasPage;
