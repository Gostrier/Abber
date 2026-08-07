import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    X,
    Loader2,
    AlertTriangle,
    RefreshCw,
    Lightbulb,
    Map,
    TrendingUp,
    Circle,
    CheckCircle2,
    Clock,
    Briefcase,
    MapPin,
    CalendarDays,
    Star,
    PencilLine,
    Save,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import ProgressBar from "../../components/ui/ProgressBar";

import {
    getMentorUsers,
    getMentorUserProgress,
    getMentorProfile,
    updateMilestoneNotes,
} from "../../api/mentorApi";
import type { MentorProfile } from "../../api/mentorApi";
import type {
    AdminUserResponse,
    UserProgressResponse,
    MilestoneInfo,
} from "../../api/adminApi";

const getStatusBadge = (status: string) => {
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

const MentorDashboardPage = () => {
    const [profile, setProfile] = useState<MentorProfile | null>(null);
    const [users, setUsers] = useState<AdminUserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selected, setSelected] = useState<UserProgressResponse | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const [notesDraft, setNotesDraft] = useState<Record<number, string>>({});
    const [editingMilestone, setEditingMilestone] = useState<number | null>(null);
    const [savingNotes, setSavingNotes] = useState<number | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [mentorProfile, mentees] = await Promise.all([
                getMentorProfile(),
                getMentorUsers(),
            ]);
            setProfile(mentorProfile);
            setUsers(mentees);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    "Failed to load mentees. Make sure you have mentor access."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const openDetail = async (user: AdminUserResponse) => {
        setDetailLoading(true);

        try {
            const progress = await getMentorUserProgress(user.id);
            setSelected(progress);
            setNotesDraft({});
            setEditingMilestone(null);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to load user progress."
            );
        } finally {
            setDetailLoading(false);
        }
    };

    const startEditNotes = (milestone: MilestoneInfo) => {
        setEditingMilestone(milestone.id);
        setNotesDraft((draft) => ({
            ...draft,
            [milestone.id]: milestone.mentorNotes ?? "",
        }));
    };

    const saveNotes = async (milestone: MilestoneInfo) => {
        setSavingNotes(milestone.id);

        try {
            await updateMilestoneNotes(milestone.id, notesDraft[milestone.id] ?? "");
            toast.success("Mentor notes saved.");

            if (selected) {
                const updated = await getMentorUserProgress(selected.userId);
                setSelected(updated);
            }
            setEditingMilestone(null);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to save mentor notes."
            );
        } finally {
            setSavingNotes(null);
        }
    };

    const profileName =
        profile &&
        [profile.firstName, profile.lastName].filter(Boolean).join(" ");

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950 px-6 py-10 text-white lg:px-14 lg:py-12">
            <motion.div
                className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl"
                animate={{ y: [0, 50, 0], x: [0, -25, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="pointer-events-none absolute bottom-0 -left-24 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl"
                animate={{ y: [0, -40, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 space-y-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                            Mentor Dashboard
                        </h1>
                        <p className="mt-3 text-lg text-blue-200">
                            Track the progress of founders you are mentoring.
                        </p>
                    </div>

                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="flex items-center gap-3 self-start rounded-xl border border-white/10 bg-white/10 px-6 py-4 text-base font-semibold text-blue-100 backdrop-blur-xl transition-all hover:bg-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-red-200">
                        <AlertTriangle size={26} />
                        <p className="text-lg">{error}</p>
                    </div>
                )}

                {profile && (
                    <Card
                        padding={false}
                        className="rounded-2xl border-white/10 bg-white/10 p-7 backdrop-blur-xl lg:p-9"
                    >
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-5">
                                <Avatar name={profileName ?? profile.email} size="lg" />
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="text-2xl font-bold text-white">
                                            {profileName ?? profile.email}
                                        </h2>
                                        {profile.isFeatured && (
                                            <Badge variant="warning">
                                                <Star size={12} className="mr-1 inline" />
                                                Featured
                                            </Badge>
                                        )}
                                        <Badge
                                            variant={profile.isAvailable ? "success" : "default"}
                                        >
                                            {profile.isAvailable ? "Available" : "Unavailable"}
                                        </Badge>
                                    </div>
                                    {profile.specialty && (
                                        <p className="mt-1 text-lg text-emerald-300">
                                            {profile.specialty}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
                                    <p className="text-2xl font-bold text-white">
                                        {profile.menteeCount}
                                    </p>
                                    <p className="text-sm text-blue-300">Mentees</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
                                    <p className="text-2xl font-bold text-white">
                                        {profile.ideasMentored}
                                    </p>
                                    <p className="text-sm text-blue-300">Ideas mentored</p>
                                </div>
                                {profile.yearsOfExperience != null && (
                                    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
                                        <p className="text-2xl font-bold text-white">
                                            {profile.yearsOfExperience}
                                        </p>
                                        <p className="text-sm text-blue-300">
                                            Years experience
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {profile.bio && (
                            <p className="mt-6 max-w-3xl text-base leading-relaxed text-blue-100">
                                {profile.bio}
                            </p>
                        )}

                        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-blue-200">
                            {profile.company && (
                                <span className="flex items-center gap-2">
                                    <Briefcase size={16} />
                                    {profile.company}
                                </span>
                            )}
                            {profile.location && (
                                <span className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    {profile.location}
                                </span>
                            )}
                            <span className="flex items-center gap-2">
                                <CalendarDays size={16} />
                                {profile.email}
                            </span>
                        </div>
                    </Card>
                )}

                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <Loader2 className="animate-spin text-blue-300" size={48} />
                    </div>
                ) : users.length === 0 ? (
                    <Card
                        padding={false}
                        className="rounded-2xl border-white/10 bg-white/10 p-12 text-center backdrop-blur-xl"
                    >
                        <p className="text-xl text-blue-200">
                            No mentees found yet. An admin will assign founders to you.
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {users.map((user, index) => {
                            const name =
                                [user.firstName, user.lastName]
                                    .filter(Boolean)
                                    .join(" ") || "—";

                            return (
                                <motion.button
                                    key={user.id}
                                    type="button"
                                    onClick={() => openDetail(user)}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="rounded-2xl border border-white/10 bg-white/10 p-7 text-left backdrop-blur-xl transition-all hover:scale-[1.02] hover:bg-white/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar name={name} size="md" />
                                        <div className="min-w-0">
                                            <p className="truncate text-xl font-bold text-white">
                                                {name}
                                            </p>
                                            <p className="truncate text-base text-blue-300">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-200">
                                        <Lightbulb size={16} />
                                        {user.ideasCount} idea
                                        {user.ideasCount === 1 ? "" : "s"}
                                    </div>

                                    <div className="mt-4">
                                        <div className="mb-2 flex items-center justify-between text-sm">
                                            <span className="text-blue-200">
                                                Overall progress
                                            </span>
                                            <span className="font-bold text-white">
                                                {Math.round(user.progress)}%
                                            </span>
                                        </div>
                                        <ProgressBar percent={user.progress} />
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-blue-300">
                                        <span className="flex items-center gap-2">
                                            <Map size={16} />
                                            {user.completedMilestones} /{" "}
                                            {user.totalMilestones} milestones
                                        </span>
                                        <span className="font-semibold text-emerald-300">
                                            View details →
                                        </span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {detailLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <Loader2 className="animate-spin text-blue-300" size={48} />
                    </div>
                )}

                {selected && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 20 }}
                            transition={{ duration: 0.25 }}
                            onClick={(event) => event.stopPropagation()}
                            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl lg:p-10"
                        >
                            <div className="flex items-start justify-between gap-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-white">
                                        {selected.firstName} {selected.lastName}
                                    </h2>
                                    <p className="mt-2 text-lg text-blue-200">
                                        {selected.email}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="rounded-xl p-3 text-blue-200 transition-all hover:bg-white/10 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                                <div className="rounded-2xl bg-indigo-500/20 p-4 text-indigo-300">
                                    <TrendingUp size={26} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-300">
                                        Overall Progress
                                    </p>
                                    <p className="mt-1 text-3xl font-bold text-white tabular-nums">
                                        {Math.round(selected.overallProgress)}%
                                    </p>
                                </div>
                                <div className="h-3 w-40 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                                        style={{
                                            width: `${Math.min(100, Math.max(0, selected.overallProgress))}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 space-y-8">
                                {selected.ideas.length === 0 ? (
                                    <p className="text-lg text-blue-200">
                                        This user has no business ideas yet.
                                    </p>
                                ) : (
                                    selected.ideas.map((entry) => (
                                        <div
                                            key={entry.idea.id}
                                            className="rounded-2xl border border-white/10 bg-white/5 p-6"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-xl font-bold text-white">
                                                        {entry.idea.title}
                                                    </p>
                                                    <p className="mt-1 text-base text-blue-200">
                                                        {entry.idea.elevatorPitch}
                                                    </p>
                                                </div>
                                                <Badge variant="info">
                                                    {entry.idea.executionStage}
                                                </Badge>
                                            </div>

                                            {entry.roadmap ? (
                                                <div className="mt-6">
                                                    <div className="mb-3 flex items-center justify-between text-sm">
                                                        <span className="text-blue-200">
                                                            Roadmap progress
                                                        </span>
                                                        <span className="font-bold text-white">
                                                            {Math.round(
                                                                entry.roadmap.overallCompletionPercentage
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                                            style={{
                                                                width: `${Math.min(100, Math.max(0, entry.roadmap.overallCompletionPercentage))}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="mt-6 space-y-3">
                                                        {entry.roadmap.milestones.map(
                                                            (milestone) => (
                                                                <div
                                                                    key={milestone.id}
                                                                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        {milestone.status ===
                                                                        "COMPLETED" ? (
                                                                            <CheckCircle2
                                                                                size={22}
                                                                                className="shrink-0 text-green-400"
                                                                            />
                                                                        ) : milestone.status ===
                                                                          "IN_PROGRESS" ||
                                                                          milestone.status ===
                                                                              "SUBMITTED_FOR_REVIEW" ? (
                                                                            <Clock
                                                                                size={22}
                                                                                className="shrink-0 text-amber-400"
                                                                            />
                                                                        ) : (
                                                                            <Circle
                                                                                size={22}
                                                                                className="shrink-0 text-slate-500"
                                                                            />
                                                                        )}
                                                                        <span className="min-w-0 flex-1 text-base text-blue-100">
                                                                            {
                                                                                milestone.taskTitle
                                                                            }
                                                                        </span>
                                                                        {getStatusBadge(
                                                                            milestone.status
                                                                        )}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                editingMilestone ===
                                                                                milestone.id
                                                                                    ? setEditingMilestone(
                                                                                          null
                                                                                      )
                                                                                    : startEditNotes(
                                                                                          milestone
                                                                                      )
                                                                            }
                                                                            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-blue-100 transition-all hover:bg-white/20 hover:text-white"
                                                                        >
                                                                            <PencilLine size={14} />
                                                                            Notes
                                                                        </button>
                                                                    </div>

                                                                    {milestone.mentorNotes &&
                                                                        editingMilestone !==
                                                                            milestone.id && (
                                                                            <p className="mt-3 rounded-lg border-l-2 border-emerald-400 bg-emerald-500/10 px-4 py-2 text-sm italic text-emerald-200">
                                                                                {milestone.mentorNotes}
                                                                            </p>
                                                                        )}

                                                                    {editingMilestone ===
                                                                        milestone.id && (
                                                                        <div className="mt-4">
                                                                            <textarea
                                                                                value={
                                                                                    notesDraft[
                                                                                        milestone.id
                                                                                    ] ?? ""
                                                                                }
                                                                                onChange={(event) =>
                                                                                    setNotesDraft(
                                                                                        (draft) => ({
                                                                                            ...draft,
                                                                                            [milestone.id]:
                                                                                                event.target
                                                                                                    .value,
                                                                                        })
                                                                                    )
                                                                                }
                                                                                rows={3}
                                                                                placeholder="Add guidance or feedback for this milestone..."
                                                                                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-blue-300 focus:border-emerald-400 focus:outline-none"
                                                                            />
                                                                            <div className="mt-3 flex justify-end gap-3">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        setEditingMilestone(
                                                                                            null
                                                                                        )
                                                                                    }
                                                                                    className="rounded-xl px-4 py-2 text-sm font-semibold text-blue-200 transition-all hover:bg-white/10"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        saveNotes(
                                                                                            milestone
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        savingNotes ===
                                                                                        milestone.id
                                                                                    }
                                                                                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                                                                                >
                                                                                    {savingNotes ===
                                                                                    milestone.id ? (
                                                                                        <Loader2
                                                                                            size={16}
                                                                                            className="animate-spin"
                                                                                        />
                                                                                    ) : (
                                                                                        <Save size={16} />
                                                                                    )}
                                                                                    Save notes
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mt-6 text-base text-blue-200">
                                                    No roadmap created yet.
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MentorDashboardPage;
