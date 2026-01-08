import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";

const AdminLayout = () => {
  const { t } = useTranslation();
  const [playClick] = useSound(scifi);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", icon: "lucide:layout-dashboard", label: "Dashboard", path: "/admin" },
    { id: "candidates", icon: "lucide:users", label: "Candidates", path: "/admin/candidates" },
    { id: "voters", icon: "lucide:user-check", label: "Voters", path: "/admin/voters" },
    { id: "results", icon: "lucide:bar-chart-3", label: "Results", path: "/admin/results" },
    { id: "polls", icon: "lucide:vote", label: "Polls", path: "/admin/polls" },
    { id: "settings", icon: "lucide:settings", label: "Settings", path: "/admin/settings" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black flex">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-accet/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accet/10 to-transparent" />
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 h-screen ${sidebarOpen ? 'w-64' : 'w-20'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        bg-black/60 backdrop-blur-xl border-r border-accet/10 transition-all duration-300 flex flex-col`}>
        
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-accet/10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <div className="w-3 h-3 bg-accet group-hover:shadow-[0_0_20px_#00d4aa] transition-all duration-500" />
              <div className="absolute -inset-1.5 border border-accet/30 group-hover:scale-125 transition-transform duration-500" />
            </div>
            {sidebarOpen && (
              <span className="font-heading text-sm tracking-widest text-white font-semibold uppercase">
                Admin
              </span>
            )}
          </div>
          <button 
            onClick={() => {
              playClick();
              setSidebarOpen(!sidebarOpen);
            }}
            className="hidden md:flex p-2 hover:bg-accet/10 rounded transition-colors"
          >
            <Icon 
              icon={sidebarOpen ? "lucide:panel-left-close" : "lucide:panel-left-open"} 
              className="text-accet" 
              width={18} 
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  playClick();
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 group
                  ${isActive(item.path) 
                    ? 'bg-accet/20 border border-accet/50 text-accet shadow-[0_0_20px_rgba(0,212,170,0.1)]' 
                    : 'hover:bg-white/5 text-white/60 hover:text-white border border-transparent'
                  }`}
              >
                <Icon 
                  icon={item.icon} 
                  width={20} 
                  className={`${isActive(item.path) ? 'text-accet' : 'text-white/40 group-hover:text-accet'} transition-colors`}
                />
                {sidebarOpen && (
                  <span className="font-heading text-xs tracking-wider uppercase">
                    {item.label}
                  </span>
                )}
                {isActive(item.path) && sidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 bg-accet rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Admin Profile */}
        <div className="p-4 border-t border-accet/10">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="relative">
              <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
                <span className="font-heading text-sm text-white font-bold">A</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-heading text-xs text-white truncate">Admin User</p>
                <p className="text-[10px] text-white/40 truncate">admin@votepoll.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Top Header */}
        <header className="h-20 bg-black/40 backdrop-blur-xl border-b border-accet/10 flex items-center justify-between px-4 md:px-8">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => {
              playClick();
              setMobileMenuOpen(true);
            }}
            className="md:hidden p-2 hover:bg-accet/10 rounded transition-colors"
          >
            <Icon icon="lucide:menu" className="text-white" width={24} />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Icon 
                icon="lucide:search" 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" 
                width={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white/5 border border-accet/20 rounded-sm pl-10 pr-4 py-2.5 
                  text-white text-xs font-heading placeholder:text-white/30
                  focus:outline-none focus:border-accet/50 focus:bg-accet/5 transition-all"
              />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-accet/10 rounded transition-colors group">
              <Icon icon="lucide:bell" className="text-white/60 group-hover:text-accet" width={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* Live Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accet/10 border border-accet/30 rounded-sm">
              <div className="w-2 h-2 bg-accet rounded-full animate-pulse" />
              <span className="text-accet text-[10px] font-heading uppercase tracking-wider">Live</span>
            </div>

            {/* Logout */}
            <button 
              onClick={() => navigate("/")}
              className="p-2 hover:bg-red-500/10 rounded transition-colors group"
            >
              <Icon icon="lucide:log-out" className="text-white/60 group-hover:text-red-400" width={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;