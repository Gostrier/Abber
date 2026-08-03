import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Lightbulb,
  Users,
  MessageSquare,
  MessagesSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Users2,
} from "lucide-react";
import Logo, { AbberBrandText } from "../components/common/Logo";
import AbberAI from "../components/common/AbberAI";
import Avatar from "../components/ui/Avatar";
import { useAuth } from "../context/AuthContext";

const baseSidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Ideas", href: "/ideas", icon: Lightbulb },
  { label: "Mentors", href: "/mentors", icon: Users },
  { label: "Community Chat", href: "/chat", icon: MessagesSquare },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Settings", href: "/settings", icon: Settings },
];

const adminSidebarLinks = [
  { label: "Admin Dashboard", href: "/admin", icon: ShieldCheck },
];

const mentorSidebarLinks = [
  { label: "Mentees", href: "/mentor", icon: Users2 },
];

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const roles = user?.roles ?? [];

  const sidebarLinks = [
    ...(roles.includes("ROLE_ADMIN") ? adminSidebarLinks : []),
    ...(roles.includes("ROLE_MENTOR") || roles.includes("ROLE_ADMIN")
      ? mentorSidebarLinks
      : []),
    ...baseSidebarLinks,
  ];

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    (user?.email ? user.email.split("@")[0] : "User");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 transform border-r border-white/10 bg-white/5 backdrop-blur-2xl transition-all duration-300 lg:translate-x-0 ${
          collapsed ? "w-24" : "w-80"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex h-24 items-center border-b border-white/10 ${
            collapsed ? "flex-col justify-center gap-2 px-2" : "justify-between gap-4 px-6"
          }`}
        >
          <div className={collapsed ? "flex justify-center" : "flex items-center gap-4"}>
            <Logo size={collapsed ? "sm" : "lg"} />
            {!collapsed && <AbberBrandText size="md" />}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-xl p-2.5 text-blue-200 transition-all hover:bg-white/10 hover:text-white"
          >
            {collapsed ? <PanelLeftOpen size={22} /> : <PanelLeftClose size={22} />}
          </button>
        </div>

        <nav className={`mt-8 space-y-2 ${collapsed ? "px-3" : "px-6"}`}>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                title={collapsed ? link.label : undefined}
                className={`flex items-center gap-4 rounded-xl px-5 py-4 text-base font-medium transition-all ${
                  collapsed ? "justify-center px-3" : ""
                } ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md"
                    : "text-blue-100/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={24} />
                {!collapsed && link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-6">
          <button
            onClick={handleLogout}
            title={collapsed ? "Sign Out" : undefined}
            className={`flex w-full items-center gap-4 rounded-xl px-5 py-4 text-base font-medium text-red-300 hover:bg-white/10 hover:text-red-200 transition-all ${
              collapsed ? "justify-center px-3" : ""
            }`}
          >
            <LogOut size={24} />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className={`flex flex-1 flex-col ${collapsed ? "lg:ml-24" : "lg:ml-80"}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex h-24 items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-2xl px-8">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden rounded-xl p-3 text-blue-200 hover:bg-white/10"
          >
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-6">
            <button className="relative rounded-xl p-3 text-blue-200 hover:bg-white/10">
              <Bell size={24} />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-blue-950" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-4 rounded-xl p-3 hover:bg-white/10 transition-all"
              >
                <Avatar name={user?.email || "User"} size="lg" />
                <div className="hidden md:block text-left">
                  <p className="text-base font-semibold text-white">
                    {displayName}
                  </p>
                  <p className="text-sm text-blue-200">Startup Founder</p>
                </div>
                <ChevronDown size={20} className="text-blue-300" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-16 z-20 w-64 rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-xl backdrop-blur-2xl">
                    <div className="border-b border-white/10 px-4 py-4">
                      <p className="text-base font-semibold text-white">{user?.email || "User"}</p>
                      <p className="text-sm text-blue-200">Startup Founder</p>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base text-blue-200 hover:bg-white/10 mt-1"
                    >
                      <Settings size={20} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-base text-red-300 hover:bg-white/10"
                    >
                      <LogOut size={20} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content - full bleed */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* AbberAI Floating Chat */}
        <AbberAI />
      </div>
    </div>
  );
};

export default MainLayout;
