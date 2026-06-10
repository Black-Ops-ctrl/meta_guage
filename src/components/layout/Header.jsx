import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

const PROJECTS_LIST = [
  { name: "Aifa Petrol", type: "WEB & APP" },
  // Add more projects here as you connect them
  // { name: "Project 2", type: "WEB" },
  // { name: "Project 3", type: "APP" },
];

function AllProjectsMenu({ scopeLabel, onScopeChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="group relative flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all duration-300 rounded hover:scale-105 active:scale-95 overflow-hidden"
        style={{ fontFamily: "sans-serif" }}
        aria-label="Select project"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900" />
        <div className="relative z-10 flex items-center gap-1.5">
          <LayoutDashboard className="w-3.5 h-3.5 text-white/80 group-hover:text-white transition-colors" />
          <span className="text-white">{scopeLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-white/80 transition-all duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full mt-1 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl shadow-black/60 z-[200] py-2 w-52"
          >
            <p className="text-[9px] uppercase tracking-widest text-gray-300 px-3 mb-1 font-medium">
              Select Project
            </p>
            {PROJECTS_LIST.map((p) => (
              <div
                key={p.name}
                onClick={() => { 
                  onScopeChange(p.name); 
                  setOpen(false); 
                }}
                className={`flex items-center justify-between px-3 py-1.5 cursor-pointer transition-colors hover:bg-white/[0.05] ${
                  scopeLabel === p.name ? "text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                <span className="text-sm">{p.name}</span>
                <span className="text-[9px] tracking-widest text-gray-400 uppercase">{p.type}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header({ scopeLabel, onScopeChange }) {
  useEffect(() => {
    if (!scopeLabel || scopeLabel === "All projects") {
      onScopeChange("Aifa Petrol");
    }
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-3 sm:px-4 md:px-6 py-3 md:py-3.5">
        <div className="flex-1 text-center md:text-left">
          <p
            className="text-xl mb-1 tracking-wide bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent"
            style={{ fontFamily: "Jura, sans-serif", fontWeight: "700" }}
          >
            MetaGuage
          </p>
          <h1
            className="text-sm font-semibold text-gray-600 text-left"
            style={{ fontFamily: "Jura, sans-serif", fontWeight: "500" }}
          >
            Every session, every project, one pulse.
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <AllProjectsMenu 
            scopeLabel={scopeLabel || "Aifa Petrol"} 
            onScopeChange={onScopeChange} 
          />
        </div>
      </div>
    </motion.header>
  );
}