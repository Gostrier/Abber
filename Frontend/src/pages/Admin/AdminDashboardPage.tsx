import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    Users,
    GraduationCap,
    UserCog,
    ShieldCheck,
    Lightbulb,
    Map,
    ListChecks,
    TrendingUp,
    RefreshCw,
    Activity,
    Loader2,
    AlertTriangle,
    UserPlus,
    LogIn,
    CheckCircle2,
    KeyRound,
    UserCheck,
    UserX,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import CountUp from "../../components/ui/CountUp";
import ProgressBar from "../../components/ui/ProgressBar";

import {
    getAdminStats,
    getActivityLogs,
    getAdminUsers,
    updateUserRole,
} from "../../api/adminApi";
import type {
    AdminStatsResponse,
    AdminUserResponse,
    ActivityLogResponse,
    RoleAction,
} from "../../api/adminApi";

type TabId = "overview" | "users" | "logs";

const tabs: { id: TabId; label: string; icon: typeof Users }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users },
    { id: "logs", label: "Activity Logs", icon: Activity },
];

const roleVariant: Record<
    string,
    "default" | "success" | "warning" | "danger" | "info"
> = {
    ROLE_ADMIN: "danger",
    ROLE_MENTOR: "info",
    ROLE_MENTEE: "success",
};

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

const formatDate = (timestamp?: string | null) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const RoleBadges = ({ roles }: { roles: string[] }) => (
    <div className="flex flex-wrap gap-1.5">
        {roles.map((role) => (
            <Badge key={role} variant={roleVariant[role] ?? "default"}>
                {role.replace("ROLE_", "")}
            </Badge>
        ))}
    </div>
);

interface KpiCardProps {
    icon: typeof Users;
    label: string;
    value: number;
    suffix?: string;
    sub?: string;
    color: string;
    decimals?: number;
}

const KpiCard = ({
    icon: Icon,
    label,
    value,
    suffix = "",
    sub,
    color,
    decimals = 0,
}: KpiCardProps) => (
    <Card
        padding={false}
        className="rounded-2xl border-white/10 bg-white/10 p-6 backdrop-blur-xl lg:p-7"
    >
        <div className="flex items-center justify-between">
            <div className={`rounded-2xl p-3.5 ${color}`}>
                <Icon size={26} />
            </div>
        </div>
        <p className="mt-6 text-4xl font-bold text-white tabular-nums">
            <CountUp
                end={value}
                duration={1.8}
                separator=","
                decimals={decimals}
            />
            {suffix && <span className="text-xl font-semibold text-blue-200">{suffix}</span>}
        </p>
        <p className="mt-2 text-base font-medium text-blue-200">{label}</p>
        {sub && <p className="mt-1 text-sm text-blue-300/70">{sub}</p>}
    </Card>
);

interface BarDatum {
    label: string;
    value: number;
}

const MiniBarChart = ({
    data,
    color = "from-blue-500 to-violet-500",
}: {
    data: BarDatum[];
    color?: string;
}) => {
    const max = Math.max(1, ...data.map((d) => d.value));

    return (
        <div className="flex h-52 items-end gap-3">
            {data.map((d) => {
                const pct = Math.round((d.value / max) * 100);
                return (
                    <div
                        key={d.label}
                        className="flex h-full min-w-0 flex-1 flex-col items-center gap-2"
                    >
                        <div className="flex w-full flex-1 items-end">
                            <div
                                className={`w-full rounded-t-xl bg-gradient-to-t ${color}`}
                                style={{ height: `${Math.max(4, pct)}%` }}
                                title={`${d.label}: ${d.value}`}
                            />
                        </div>
                        <span className="max-w-full truncate text-xs font-medium text-blue-200">
                            {d.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const ProgressWithLabel = ({ percent }: { percent: number }) => (
    <div className="flex items-center gap-3">
        <ProgressBar percent={percent} className="w-28" />
        <span className="w-12 text-right text-sm font-semibold text-white tabular-nums">
            {Math.round(percent)}%
        </span>
    </div>
);

const getLogStyle = (action: string) => {
    const lower = action.toLowerCase();

    if (lower.includes("logged in")) {
        return { icon: LogIn, color: "text-blue-300 bg-blue-500/20" };
    }
    if (lower.includes("regist")) {
        return { icon: UserPlus, color: "text-emerald-300 bg-emerald-500/20" };
    }
    if (lower.includes("idea")) {
        return { icon: Lightbulb, color: "text-amber-300 bg-amber-500/20" };
    }
    if (lower.includes("mentor")) {
        return { icon: KeyRound, color: "text-violet-300 bg-violet-500/20" };
    }
    if (lower.includes("complet") || lower.includes("milestone")) {
        return { icon: CheckCircle2, color: "text-green-300 bg-green-500/20" };
    }
    return { icon: Activity, color: "text-blue-200 bg-blue-500/10" };
};

const AdminDashboardPage = () => {
    const [tab, setTab] = useState<TabId>("overview");
    const [stats, setStats] = useState<AdminStatsResponse | null>(null);
    const [users, setUsers] = useState<AdminUserResponse[]>([]);
    const [logs, setLogs] = useState<ActivityLogResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busyUserId, setBusyUserId] = useState<number | null>(null);

    const loadAll = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [statsData, usersData, logsData] = await Promise.all([
                getAdminStats(),
                getAdminUsers(),
                getActivityLogs(),
            ]);

            setStats(statsData);
            setUsers(usersData);
            setLogs(logsData);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    "Failed to load admin data. Make sure you have admin access."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const handleRoleAction = async (
        user: AdminUserResponse,
        action: RoleAction
    ) => {
        setBusyUserId(user.id);

        try {
            await updateUserRole(user.id, "MENTOR", action);

            toast.success(
                action === "GRANT"
                    ? `Granted MENTOR to ${user.firstName} ${user.lastName}.`
                    : `Revoked MENTOR from ${user.firstName} ${user.lastName}.`
            );

            setUsers((prev) =>
                prev.map((u) =>
                    u.id === user.id
                        ? {
                              ...u,
                              roles:
                                  action === "GRANT"
                                      ? [...new Set([...u.roles, "ROLE_MENTOR"])]
                                      : u.roles.filter(
                                            (role) => role !== "ROLE_MENTOR"
                                        ),
                          }
                        : u
                )
            );
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Failed to update user role."
            );
        } finally {
            setBusyUserId(null);
        }
    };

    const isLoading = loading && !stats;

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-950 px-6 py-10 text-white lg:px-14 lg:py-12">
            <motion.div
                className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl"
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
                            Admin Dashboard
                        </h1>
                        <p className="mt-3 text-lg text-blue-200">
                            Platform overview, user management and activity.
                        </p>
                    </div>

                    <button
                        onClick={loadAll}
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

                <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex flex-1 items-center justify-center gap-3 whitespace-nowrap rounded-xl px-6 py-4 text-base font-semibold transition-all ${
                                tab === id
                                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md"
                                    : "text-blue-200 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            <Icon size={20} />
                            {label}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex h-96 items-center justify-center">
                        <Loader2 className="animate-spin text-blue-300" size={48} />
                    </div>
                ) : (
                    <>
                        {tab === "overview" && stats && (
                            <OverviewTab stats={stats} />
                        )}

                        {tab === "users" && (
                            <UsersTab
                                users={users}
                                busyUserId={busyUserId}
                                onRoleAction={handleRoleAction}
                            />
                        )}

                        {tab === "logs" && <LogsTab logs={logs} />}
                    </>
                )}
            </div>
        </div>
    );
};

const OverviewTab = ({ stats }: { stats: AdminStatsResponse }) => {
    const kpis: KpiCardProps[] = [
        {
            icon: Users,
            label: "Total Users",
            value: stats.totalUsers,
            color: "text-blue-300 bg-blue-500/20",
        },
        {
            icon: GraduationCap,
            label: "Mentors",
            value: stats.totalMentors,
            color: "text-violet-300 bg-violet-500/20",
        },
        {
            icon: UserCog,
            label: "Mentees",
            value: stats.totalMentees,
            color: "text-emerald-300 bg-emerald-500/20",
        },
        {
            icon: ShieldCheck,
            label: "Admins",
            value: stats.totalAdmins,
            color: "text-rose-300 bg-rose-500/20",
        },
        {
            icon: Lightbulb,
            label: "Total Ideas",
            value: stats.totalIdeas,
            color: "text-amber-300 bg-amber-500/20",
        },
        {
            icon: Map,
            label: "Roadmaps",
            value: stats.totalRoadmaps,
            color: "text-cyan-300 bg-cyan-500/20",
        },
        {
            icon: ListChecks,
            label: "Milestones Completed",
            value: stats.completedMilestones,
            sub: `of ${stats.totalMilestones} total`,
            color: "text-green-300 bg-green-500/20",
        },
        {
            icon: TrendingUp,
            label: "Average Progress",
            value: stats.averageProgress,
            suffix: "%",
            decimals: 1,
            color: "text-indigo-300 bg-indigo-500/20",
        },
        {
            icon: UserPlus,
            label: "Registrations Today",
            value: stats.registrationsToday,
            color: "text-teal-300 bg-teal-500/20",
        },
        {
            icon: LogIn,
            label: "Logins Today",
            value: stats.loginsToday,
            color: "text-sky-300 bg-sky-500/20",
        },
    ];

    return (
        <div className="space-y-10">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {kpis.map((kpi, index) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                    >
                        <KpiCard {...kpi} />
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card
                    padding={false}
                    className="rounded-2xl border-white/10 bg-white/10 p-8 backdrop-blur-xl"
                >
                    <h2 className="text-2xl font-bold text-white">
                        Ideas by Stage
                    </h2>
                    <p className="mt-2 text-base text-blue-200">
                        Distribution of business ideas across the startup lifecycle.
                    </p>
                    <div className="mt-10">
                        <MiniBarChart
                            data={stats.ideasByStage.map((item) => ({
                                label: item.stage,
                                value: item.count,
                            }))}
                        />
                    </div>
                </Card>

                <Card
                    padding={false}
                    className="rounded-2xl border-white/10 bg-white/10 p-8 backdrop-blur-xl"
                >
                    <h2 className="text-2xl font-bold text-white">
                        Registrations — Last 7 Days
                    </h2>
                    <p className="mt-2 text-base text-blue-200">
                        New accounts created each day over the past week.
                    </p>
                    <div className="mt-10">
                        <MiniBarChart
                            data={stats.registrationsLast7Days.map((item) => ({
                                label: item.date.slice(5),
                                value: item.count,
                            }))}
                            color="from-emerald-500 to-teal-500"
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

const UsersTab = ({
    users,
    busyUserId,
    onRoleAction,
}: {
    users: AdminUserResponse[];
    busyUserId: number | null;
    onRoleAction: (user: AdminUserResponse, action: RoleAction) => void;
}) => {
    if (users.length === 0) {
        return (
            <Card
                padding={false}
                className="rounded-2xl border-white/10 bg-white/10 p-12 text-center backdrop-blur-xl"
            >
                <p className="text-xl text-blue-200">No users found.</p>
            </Card>
        );
    }

    return (
        <Card
            padding={false}
            className="overflow-hidden rounded-2xl border-white/10 bg-white/10 backdrop-blur-xl"
        >
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left">
                    <thead>
                        <tr className="border-b border-white/10 text-sm uppercase tracking-wide text-blue-300">
                            <th className="px-6 py-5 font-semibold">User</th>
                            <th className="px-6 py-5 font-semibold">Roles</th>
                            <th className="px-6 py-5 font-semibold">Ideas</th>
                            <th className="px-6 py-5 font-semibold">Progress</th>
                            <th className="px-6 py-5 font-semibold">Milestones</th>
                            <th className="px-6 py-5 font-semibold">Status</th>
                            <th className="px-6 py-5 font-semibold">Last Login</th>
                            <th className="px-6 py-5 font-semibold">Joined</th>
                            <th className="px-6 py-5 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const isMentor = user.roles.includes("ROLE_MENTOR");
                            const busy = busyUserId === user.id;
                            const name =
                                [user.firstName, user.lastName]
                                    .filter(Boolean)
                                    .join(" ") || "—";

                            return (
                                <tr
                                    key={user.id}
                                    className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <Avatar name={name} size="sm" />
                                            <div className="min-w-0">
                                                <p className="truncate text-base font-semibold text-white">
                                                    {name}
                                                </p>
                                                <p className="truncate text-sm text-blue-300">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <RoleBadges roles={user.roles} />
                                    </td>
                                    <td className="px-6 py-5 text-base font-semibold text-white tabular-nums">
                                        {user.ideasCount}
                                    </td>
                                    <td className="px-6 py-5">
                                        <ProgressWithLabel percent={user.progress} />
                                    </td>
                                    <td className="px-6 py-5 text-base text-blue-200 tabular-nums">
                                        {user.completedMilestones} / {user.totalMilestones}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <Badge
                                                variant={
                                                    user.isActive
                                                        ? "success"
                                                        : "danger"
                                                }
                                            >
                                                {user.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                            {user.emailVerified ? (
                                                <span className="flex items-center gap-1.5 text-sm text-green-300">
                                                    <UserCheck size={15} />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-sm text-amber-300">
                                                    <UserX size={15} />
                                                    Unverified
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-blue-200">
                                        {formatTimestamp(user.lastLoginAt ?? undefined)}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-blue-200">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <button
                                            onClick={() =>
                                                onRoleAction(
                                                    user,
                                                    isMentor ? "REVOKE" : "GRANT"
                                                )
                                            }
                                            disabled={busy}
                                            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                                                isMentor
                                                    ? "border border-red-400/40 text-red-300 hover:bg-red-500/15 hover:text-red-200"
                                                    : "border border-blue-400/40 text-blue-200 hover:bg-blue-500/15 hover:text-white"
                                            }`}
                                        >
                                            {busy ? (
                                                <Loader2
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                            ) : isMentor ? (
                                                <UserX size={16} />
                                            ) : (
                                                <UserCheck size={16} />
                                            )}
                                            {isMentor ? "Revoke Mentor" : "Grant Mentor"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const LogsTab = ({ logs }: { logs: ActivityLogResponse[] }) => {
    if (logs.length === 0) {
        return (
            <Card
                padding={false}
                className="rounded-2xl border-white/10 bg-white/10 p-12 text-center backdrop-blur-xl"
            >
                <p className="text-xl text-blue-200">No activity recorded yet.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {logs.map((log, index) => {
                const { icon: Icon, color } = getLogStyle(log.action);

                return (
                    <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <Card
                            padding={false}
                            className="flex items-start gap-5 rounded-2xl border-white/10 bg-white/10 p-6 backdrop-blur-xl"
                        >
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}
                            >
                                <Icon size={22} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                    <p className="text-lg font-semibold text-white">
                                        {log.action}
                                    </p>
                                    <p className="text-sm text-blue-300">
                                        {log.userEmail ?? "Unknown user"}
                                    </p>
                                </div>
                                {log.detail && (
                                    <p className="mt-1 text-base text-blue-200">
                                        {log.detail}
                                    </p>
                                )}
                                <p className="mt-1.5 text-sm text-blue-300/60">
                                    {formatTimestamp(log.timestamp)}
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default AdminDashboardPage;
