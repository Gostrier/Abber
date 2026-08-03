import { useEffect, useState } from "react";
import {
  Lightbulb,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  MessageSquare,
  BrainCircuit,
  Rocket,
  ClipboardCheck,
  MapPin,
  Wrench,
  Building2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import CountUp from "../../components/ui/CountUp";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { getDashboardSummary } from "../../api/businessIdeaApi";
import type { DashboardSummary, BusinessIdea, BusinessRoadmap, Milestone } from "../../api/businessIdeaApi";

const startupStages = [
  { icon: Lightbulb, label: "Idea", desc: "Refine your concept", href: "/stages/idea", color: "from-blue-500 to-blue-600" },
  { icon: ClipboardCheck, label: "Validation", desc: "Test your assumptions", href: "/stages/validation", color: "from-indigo-500 to-indigo-600" },
  { icon: Rocket, label: "Develop", desc: "Build your MVP", href: "/stages/develop", color: "from-purple-500 to-purple-600" },
  { icon: TrendingUp, label: "Scale", desc: "Grow your startup", href: "/stages/scale", color: "from-rose-500 to-rose-600" },
];

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.max(0, now.getTime() - date.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
};

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

interface Stat {
  icon: typeof Lightbulb;
  label: string;
  value: string;
  numeric?: number;
  suffix?: string;
  change: string;
  color: string;
}

const DashboardPage = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getDashboardSummary()
      .then((data) => {
        if (mounted) setSummary(data);
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.response?.data?.message || "Failed to load your dashboard summary.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    (user?.email ? user.email.split("@")[0] : "");

  const skills = user?.skills?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  const latestIdea: BusinessIdea | null | undefined = summary?.latestIdea;
  const latestRoadmap: BusinessRoadmap | null | undefined = summary?.latestRoadmap;
  const milestones: Milestone[] = latestRoadmap?.milestones ?? [];
  const progress = latestRoadmap?.overallCompletionPercentage ?? 0;

  const stats: Stat[] = [
    {
      icon: Lightbulb,
      label: "Active Ideas",
      value: summary ? String(summary.activeIdeasCount) : "0",
      numeric: summary?.activeIdeasCount ?? 0,
      suffix: "",
      change: summary && summary.activeIdeasCount > 0 ? `${summary.activeIdeasCount} in your pipeline` : "Start your first idea",
      color: "text-blue-400 bg-blue-500/20",
    },
    {
      icon: Building2,
      label: "Mentor",
      value: summary?.mentorName ? "1" : "—",
      change: summary?.mentorName ?? "Not assigned yet",
      color: "text-violet-400 bg-violet-500/20",
    },
    {
      icon: TrendingUp,
      label: "Progress",
      value: summary ? `${Math.round(summary.overallProgress)}%` : "0%",
      numeric: Math.round(summary?.overallProgress ?? 0),
      suffix: "%",
      change: "Across all ideas",
      color: "text-green-400 bg-green-500/20",
    },
    {
      icon: Award,
      label: "Milestones",
      value: summary ? String(summary.completedMilestonesCount) : "0",
      numeric: summary?.completedMilestonesCount ?? 0,
      suffix: "",
      change: `of ${summary?.totalMilestonesCount ?? 0} completed`,
      color: "text-amber-400 bg-amber-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950">
        <Loader2 className="animate-spin text-blue-300" size={48} />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative min-h-screen w-full overflow-hidden px-6 py-10 lg:px-20 lg:py-16 bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950 text-white"
    >
      {/* Animated background accents */}
      <motion.div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
        animate={{ y: [0, 50, 0], x: [0, 25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-violet-600/20 blur-3xl"
        animate={{ y: [0, -60, 0], x: [0, -35, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 space-y-14 lg:space-y-20">
        {/* Header */}
        <motion.div variants={itemAnim} className="pt-6 lg:pt-8">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight flex items-center flex-wrap gap-4">
            <span>Welcome back{displayName ? `, ${displayName}` : ""}</span>
            <Sparkles className="inline text-amber-400" size={40} />
          </h1>
          <p className="mt-4 text-lg lg:text-xl text-blue-200">
            Here's what's happening with your startup journey. Let's make it real.
          </p>
        </motion.div>

        {error && (
          <motion.div variants={itemAnim}>
            <div className="flex items-center gap-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-8 text-red-200">
              <AlertTriangle size={28} />
              <p className="text-lg">{error}</p>
            </div>
          </motion.div>
        )}

        {/* User Profile Location & Skills Context Bar */}
        <motion.div variants={itemAnim}>
          <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-8 lg:p-10 shadow-xl rounded-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                <div className="rounded-2xl p-4 bg-blue-500/20 text-blue-400 shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-300">Region & Location</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {user?.county ? `${user.county} County` : "Add your county"}
                    {user?.town ? ` • ${user.town}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="rounded-2xl p-4 bg-purple-500/20 text-purple-300 shrink-0">
                  <Wrench size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-300">Registered Competencies</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.length > 0 ? (
                      skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-blue-100">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-blue-200">No skills added yet</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="rounded-2xl p-4 bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Building2 size={28} />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-300">Account Status</p>
                  <p className="text-xl font-bold text-emerald-400 mt-1">Active Founder</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemAnim} className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full border-white/10 bg-white/10 backdrop-blur-xl hover:shadow-2xl hover:bg-white/15 transition-all p-8 rounded-2xl">
                  <div className="flex items-start justify-between">
                    <div className={`rounded-2xl p-4 ${stat.color}`}>
                      <Icon size={32} />
                    </div>
                  </div>
                  <p className="mt-8 text-5xl font-bold text-white tabular-nums">
                    {stat.numeric !== undefined ? (
                      <>
                        <CountUp end={stat.numeric} duration={2.2} separator="," />
                        {stat.suffix}
                      </>
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="mt-3 text-lg text-blue-200">{stat.label}</p>
                  <p className="mt-2 text-base font-medium text-green-400">{stat.change}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Startup Stages */}
        <motion.div variants={itemAnim}>
          <h2 className="text-3xl font-bold text-white mb-8">Startup Lifecycle Stages</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {startupStages.map((stage) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.label}
                  whileHover={{ y: -10, scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    to={stage.href}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:bg-white/20 block h-full"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stage.color} opacity-0 group-hover:opacity-20 transition-opacity`} />
                    <div className={`inline-flex rounded-xl bg-gradient-to-br ${stage.color} p-4 text-white`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-white">{stage.label}</h3>
                    <p className="mt-2 text-base text-blue-200">{stage.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Quick Actions + Activity */}
          <motion.div variants={itemAnim} className="lg:col-span-2 space-y-10">
            <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-8 lg:p-10 rounded-2xl">
              <h2 className="text-3xl font-bold text-white">Quick Actions</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {[
                  { label: "New Business Idea", icon: Lightbulb, href: "/stages/idea", color: "text-blue-400 bg-blue-500/20" },
                  { label: "My Ideas", icon: BookOpen, href: "/ideas", color: "text-violet-400 bg-violet-500/20" },
                  { label: "Community Chat", icon: MessageSquare, href: "/chat", color: "text-emerald-400 bg-emerald-500/20" },
                  { label: "Milestone Tracker", icon: Award, href: "/stages/idea", color: "text-amber-400 bg-amber-500/20" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      to={action.href}
                      className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-7 transition-all hover:bg-white/20 hover:shadow-lg group"
                    >
                      <div className={`rounded-xl p-4 ${action.color}`}>
                        <Icon size={28} />
                      </div>
                      <span className="text-lg font-semibold text-white group-hover:text-white transition-colors">
                        {action.label}
                      </span>
                      <ArrowRight size={20} className="ml-auto text-blue-300 group-hover:text-white transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-8 lg:p-10 rounded-2xl">
              <h2 className="text-3xl font-bold text-white">Recent Activity</h2>
              <div className="mt-8 space-y-8">
                {!summary || summary.recentActivity.length === 0 ? (
                  <p className="text-lg text-blue-200">No activity yet. Create your first idea to get started.</p>
                ) : (
                  summary.recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-5 border-b border-white/10 pb-8 last:border-0 last:pb-0"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                        <Clock size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-white">{activity.action}</p>
                        {activity.detail && <p className="text-base text-blue-200 mt-1">{activity.detail}</p>}
                        <p className="text-sm text-blue-300/60 mt-1.5">{formatTimestamp(activity.timestamp)}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* Side Panel: Mentor & Latest Idea */}
          <motion.div variants={itemAnim} className="space-y-10">
            {/* Mentor */}
            <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-8 lg:p-10 rounded-2xl">
              <h2 className="text-3xl font-bold text-white">Assigned Mentor</h2>
              <div className="mt-10">
                {summary?.mentorName ? (
                  <div className="flex flex-col items-center text-center gap-5">
                    <Avatar name={summary.mentorName} size="lg" />
                    <div>
                      <p className="text-xl font-bold text-white">{summary.mentorName}</p>
                      <p className="text-base text-blue-200 mt-1">{summary.mentorSpecialty ?? "Startup Mentor"}</p>
                    </div>
                    <Button size="md" className="mt-4 w-full">
                      Book a Session
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center gap-5 py-6">
                    <Avatar name="?" size="lg" />
                    <p className="text-lg text-blue-200">No mentor assigned yet.</p>
                    <p className="text-sm text-blue-300 leading-relaxed">
                      Your mentor will be matched as you progress through the startup stages.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Latest Idea */}
            <Card className="border-white/10 bg-white/10 backdrop-blur-xl p-8 lg:p-10 rounded-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Latest Idea</h2>
                {latestIdea ? getStageBadge(latestIdea.executionStage) : <Badge variant="info">No ideas yet</Badge>}
              </div>
              <div className="mt-10">
                {latestIdea ? (
                  <>
                    <div className="flex items-center gap-5">
                      <div className="rounded-xl bg-amber-500/20 p-3 text-amber-400">
                        <BrainCircuit size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{latestIdea.title}</h3>
                        <p className="text-base text-blue-200 mt-1">{latestIdea.elevatorPitch}</p>
                      </div>
                    </div>

                    {latestRoadmap ? (
                      <div className="mt-10">
                        <div className="flex justify-between text-base mb-3">
                          <span className="text-blue-200">Roadmap Progress</span>
                          <span className="font-bold text-white">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="mt-6 text-base text-blue-200">No roadmap yet. Start your journey to create one.</p>
                    )}

                    {milestones.length > 0 && (
                      <div className="mt-8 space-y-5">
                        {milestones.slice(0, 4).map((milestone) => {
                          const done = milestone.status === "COMPLETED";
                          const inProgress = milestone.status === "IN_PROGRESS" || milestone.status === "SUBMITTED_FOR_REVIEW";
                          return (
                            <div key={milestone.id} className="flex items-center gap-4">
                              <div
                                className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  done ? "bg-green-500 border-green-500" : inProgress ? "border-amber-400 border-dashed" : "border-blue-300"
                                }`}
                              >
                                {done && <div className="h-3 w-3 rounded-full bg-white" />}
                              </div>
                              <span className={`text-base min-w-0 ${done ? "text-white font-medium" : "text-blue-200"}`}>
                                {milestone.taskTitle}
                              </span>
                              {done && <Badge variant="success">Done</Badge>}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-12">
                      <Link to="/ideas">
                        <Button size="lg" className="w-full">
                          View Full Details
                          <ArrowRight size={20} />
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center gap-6 py-10">
                    <div className="rounded-xl bg-amber-500/20 p-4 text-amber-400">
                      <Lightbulb size={36} />
                    </div>
                    <p className="text-lg text-blue-200">You haven't submitted a business idea yet.</p>
                    <Link to="/stages/idea">
                      <Button size="lg">
                        Submit Your First Idea
                        <ArrowRight size={20} />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
