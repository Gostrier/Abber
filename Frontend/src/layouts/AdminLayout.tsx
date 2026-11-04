import { useState } from "react";
import { ArrowLeftRight, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo, { AbberBrandText } from "../components/common/Logo";
import Avatar from "../components/ui/Avatar";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-slate-950 transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-24 items-center gap-3 border-b border-white/10 px-6">
                    <Logo size="sm" />
                    <AbberBrandText size="sm" />
                </div>

                <div className="px-6 pt-8">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Administration
                    </p>
                    <nav aria-label="Admin navigation">
                        <NavLink
                            to="/admin"
                            end
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${
                                    isActive
                                        ? "bg-rose-500/15 text-rose-200"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >
                            <LayoutDashboard size={20} />
                            Admin dashboard
                        </NavLink>
                    </nav>
                </div>

                <div className="mt-auto space-y-3 border-t border-white/10 p-5">
                    <Link
                        to="/dashboard"
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <ArrowLeftRight size={18} />
                        Open user workspace
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-white/5 hover:text-red-200"
                    >
                        <LogOut size={18} />
                        Sign out
                    </button>
                </div>
            </aside>

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close admin navigation"
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="min-h-screen lg:pl-72">
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 backdrop-blur-xl sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label={sidebarOpen ? "Close admin navigation" : "Open admin navigation"}
                            aria-expanded={sidebarOpen}
                            onClick={() => setSidebarOpen((open) => !open)}
                            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <span className="text-sm font-semibold text-slate-300">
                            Abber <span className="text-slate-600">/</span> Admin workspace
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Avatar name={user?.email || "Admin"} size="sm" />
                        <span className="hidden max-w-48 truncate text-sm text-slate-300 sm:block">
                            {user?.email || "Administrator"}
                        </span>
                        <Link
                            to="/dashboard"
                            className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
                        >
                            User site
                        </Link>
                    </div>
                </header>

                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
