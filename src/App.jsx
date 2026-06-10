import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layout } from "./components/layout";
import {
  StatCards,
  SessionsTrend,
  PlatformSplit,
  LiveUsers,
  TopProjects,
  RecentFeedback,
} from "./components/dashboard";
import ProjectDashboard from "./pages/ProjectDashboard";

const pageVariants = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.22, ease: "easeIn" } },
};

export default function App() {
  const [activePage, setActivePage] = useState("overview");
  const [scopeLabel, setScopeLabel] = useState("All projects");
  const [dateLabel, setDateLabel] = useState("May 30 – Jun 5, 2026");

  // Determine which project is selected (ignore "All projects" for now)
  const getSelectedProject = () => {
    if (scopeLabel === "All projects") return "Aifa Petrol";
    return scopeLabel;
  };

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      scopeLabel={scopeLabel}
      onScopeChange={setScopeLabel}
      dateLabel={dateLabel}
      onDateChange={setDateLabel}
    >
      <AnimatePresence mode="wait">
        {activePage === "projects" ? (
          <motion.div key="projects" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <ProjectDashboard
              scopeLabel={getSelectedProject()}
              dateLabel={dateLabel}
            />
          </motion.div>
        ) : (
          <motion.div key="overview" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <StatCards 
              projectName={getSelectedProject()}
              dateRange={dateLabel}
            />
            <div className="grid grid-cols-12 gap-2 mb-6">
              <div className="lg:col-span-5 flex">
                <SessionsTrend projectName={getSelectedProject()} dateRange={dateLabel} />
              </div>
              <div className="lg:col-span-4 flex">
                <PlatformSplit projectName={getSelectedProject()} dateRange={dateLabel} />
              </div>
              <div className="lg:col-span-3 flex">
                <LiveUsers projectName={getSelectedProject()} dateRange={dateLabel} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <TopProjects projectName={getSelectedProject()} dateRange={dateLabel} />
              </div>
              <div className="lg:col-span-4">
                <RecentFeedback projectName={getSelectedProject()} dateRange={dateLabel} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}