import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  User,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", page: "overview" },
  { icon: FolderKanban, label: "Projects", page: "projects" },
  { icon: MessageSquare, label: "Feedback", page: "feedback" },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <motion.aside
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 top-0 h-screen w-48 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 border-r border-white/10 flex flex-col z-50"
    >
      {/* Logo */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white rounded-full" />
          </div>
          <div>
            <h1 className="text-white text-sm mb-0.5" style={{ fontFamily: 'Jura', fontWeight: '600' }}>
              Meta Gauge
            </h1>
            <p className="text-[9px] text-gray-400 uppercase tracking-wider">
              Session Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = activePage === item.page;
            return (
              <motion.li
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => onNavigate(item.page)}
                  className={`relative w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      className="absolute left-0 w-0.5 h-4 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full"
                      layoutId="activeBar"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <item.icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : ""}`} />
                  {item.label}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Profile */}
      <div className="p-3 border-t border-white/10">
        <a
          href="#"
          className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-200 transition-colors duration-200"
        >
          <User className="w-3.5 h-3.5" />
          Profile
        </a>
      </div>
    </motion.aside>
  );
}
