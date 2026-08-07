import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    ShieldCheck,
    LockKeyhole,
    Mail,
    Eye,
    EyeOff,
    Loader2,
    ArrowLeft,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

type AdminLoginForm = {
    email: string;
    password: string;
};

const AdminLoginPage = () => {
    const { login, logout } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AdminLoginForm>();

    const onSubmit = async (data: AdminLoginForm) => {
        try {
            const response = await login(data);

            const roles = response?.roles ?? [];

            if (!roles.includes("ROLE_ADMIN")) {
                toast.error(
                    "This account does not have admin access. Please use the member login."
                );
                await logout();
                return;
            }

            toast.success("Admin access granted. Welcome back!");
            navigate("/admin", { replace: true });
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                "Invalid admin credentials. Please try again.";
            toast.error(msg);
        }
    };

    const inputClass = (hasError?: string) =>
        `w-full rounded-xl border bg-white/5 px-4 py-3.5 text-base text-white placeholder:text-slate-500 outline-none transition-all ${
            hasError
                ? "border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border-white/10 focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/20"
        }`;

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12 text-white">
            <div className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-rose-600/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-slate-700/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0,_rgba(2,6,23,0.6)_70%)]" />

            <div className="relative z-10 w-full max-w-md">
                <div className="mb-8 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold tracking-wide text-rose-300 uppercase">
                        <LockKeyhole size={15} />
                        Restricted Area
                    </span>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl lg:p-10">
                    <div className="mb-8 flex flex-col items-center gap-4 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-lg shadow-rose-900/40">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Admin Access
                            </h1>
                            <p className="mt-2 text-base text-slate-400">
                                Sign in to manage the Abber platform.
                                Authorized administrators only.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type="email"
                                    autoComplete="username"
                                    placeholder="admin@abber.local"
                                    className={`${inputClass(errors.email?.message)} pl-11`}
                                    {...register("email", {
                                        required: "Email is required",
                                    })}
                                />
                            </div>
                            {errors.email?.message && (
                                <p className="text-sm font-medium text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300">
                                Password
                            </label>
                            <div className="relative">
                                <LockKeyhole
                                    size={18}
                                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className={`${inputClass(errors.password?.message)} pl-11 pr-12`}
                                    {...register("password", {
                                        required: "Password is required",
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:text-white"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {errors.password?.message && (
                                <p className="text-sm font-medium text-red-400">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-rose-950/40 transition-all hover:opacity-90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting && (
                                <Loader2 size={19} className="animate-spin" />
                            )}
                            <ShieldCheck size={19} />
                            Sign In to Admin
                        </button>
                    </form>

                    <div className="mt-8 border-t border-white/10 pt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Back to member login
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs tracking-wide text-slate-600">
                    This portal is for Abber platform administrators only.
                    All access is logged and monitored.
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
