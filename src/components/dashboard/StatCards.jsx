import { motion } from "framer-motion";
import { Users, TrendingUp, Activity, Clock, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { aifaPetrolAPI } from "../../api/aifa_petrol_api";

const defaultStats = [
  {
    label: "DAU",
    value: "Loading...",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/20",
    glowColor: "shadow-blue-500/10",
    key: "dau",
  },
  {
    label: "MAU",
    value: "Loading...",
    icon: TrendingUp,
    gradient: "from-violet-500 to-purple-500",
    borderColor: "border-violet-500/20",
    glowColor: "shadow-violet-500/10",
    key: "mau",
  },
  {
    label: "TOTAL ACTIVE USERS",
    value: "Loading...",
    icon: Activity,
    gradient: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/20",
    glowColor: "shadow-emerald-500/10",
    key: "active_users",
  },
  {
    label: "TOTAL DURATION",
    value: "Loading...",
    icon: Clock,
    gradient: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/20",
    glowColor: "shadow-amber-500/10",
    key: "total_duration",
  },
  {
    label: "FEEDBACK SCORE",
    value: "4.6 / 5",
    icon: MessageSquare,
    gradient: "from-gray-500 to-slate-500",
    borderColor: "border-gray-500/20",
    glowColor: "shadow-gray-500/10",
    key: "feedback",
  },
];

export default function StatCards({ projectName = "Aifa Petrol", dateRange }) {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectData = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Map project name to API endpoint or parameters
      let data;
      switch (projectId) {
        case "Aifa Petrol":
          data = await aifaPetrolAPI.getGrandTotal();
          break;
        // Add more cases for future projects
        // case "Other Project":
        //   data = await otherProjectAPI.getGrandTotal();
        //   break;
        default:
          data = await aifaPetrolAPI.getGrandTotal();
      }
      
      if (data) {
        setStats(prevStats => 
          prevStats.map(stat => {
            switch (stat.key) {
              case "dau":
                return { ...stat, value: data.dau || "00:00:00" };
              case "mau":
                return { ...stat, value: data.mau || "00:00:00" };
              case "active_users":
                return { ...stat, value: data.active_users || "0" };
              case "total_duration":
                return { ...stat, value: data.total_duration || "00:00:00" };
              default:
                return stat;
            }
          })
        );
      } else {
        setError("No data found for this project");
      }
    } catch (err) {
      console.error(`Failed to fetch data for ${projectId}:`, err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectName) {
      fetchProjectData(projectName);
    }
  }, [projectName, dateRange]); // Refetch when project or date changes

  if (error && !loading) {
    const errorStats = [...defaultStats];
    errorStats[0].value = "00:00:00";
    errorStats[1].value = "00:00:00";
    errorStats[2].value = "0";
    errorStats[3].value = "00:00:00";
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {errorStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.2 } }}
            className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 rounded-xl border ${stat.borderColor} p-3 cursor-pointer hover:shadow-xl ${stat.glowColor} transition-all duration-300 overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                 style={{ background: `linear-gradient(135deg, ${stat.gradient.split(' ')[1]}, transparent)` }} />
            
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                 style={{ boxShadow: `0 0 15px ${stat.glowColor.split(' ')[0].replace('shadow-', '').replace('/10', '')}` }} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-medium text-gray-100" style={{ fontFamily: 'Jura' }}>
                    {stat.label}
                  </p>
                  <div className={`w-6 h-0.5 bg-gradient-to-r ${stat.gradient} mt-1 rounded-full`} />
                </div>
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.gradient} bg-opacity-10 flex items-center justify-center shrink-0 shadow-md`}>
                  <stat.icon className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              
              <div className="mt-1">
                <p className="text-lg font-bold text-white break-words tracking-tight" style={{ fontFamily: 'Jura' }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.08, 
            duration: 0.4,
            ease: "easeOut"
          }}
          whileHover={{ 
            y: -3,
            scale: 1.01,
            transition: { duration: 0.2 }
          }}
          className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 rounded-xl border ${stat.borderColor} p-3 cursor-pointer hover:shadow-xl ${stat.glowColor} transition-all duration-300 overflow-hidden group`}
        >
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
               style={{ background: `linear-gradient(135deg, ${stat.gradient.split(' ')[1]}, transparent)` }} />
          
          <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
               style={{ boxShadow: `0 0 15px ${stat.glowColor.split(' ')[0].replace('shadow-', '').replace('/10', '')}` }} />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-medium text-gray-100" style={{ fontFamily: 'Jura' }}>
                  {stat.label}
                </p>
                <div className={`w-6 h-0.5 bg-gradient-to-r ${stat.gradient} mt-1 rounded-full`} />
              </div>
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.gradient} bg-opacity-10 flex items-center justify-center shrink-0 shadow-md`}>
                <stat.icon className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            
            <div className="mt-1">
              <p className="text-lg font-bold text-white break-words tracking-tight" style={{ fontFamily: 'Jura' }}>
                {loading ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-white/20 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-white/20 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-white/20 rounded-full animate-pulse delay-150"></span>
                  </span>
                ) : stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}