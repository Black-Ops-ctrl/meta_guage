import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { aifaPetrolAPI } from "../../api/aifa_petrol_api";

// Generate random data for animation
const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    value: Math.floor(Math.random() * 300) + 100,
  }));
};

export default function LiveUsers({ projectName = "Aifa Petrol", dateRange, className = "" }) {
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(generateData());

  // Fetch real data from API
  useEffect(() => {
    const fetchLiveUsersData = async () => {
      try {
        setLoading(true);
        const response = await aifaPetrolAPI.getProjectSession();
        
        if (response.success && response.data) {
          // Get today's date
          const today = new Date().toISOString().split('T')[0];
          
          // Find today's data
          const todayData = response.data.find(item => item.session_date === today);
          
          // Set current active users from API
          if (todayData) {
            setActiveUsers(parseInt(todayData.active_users) || 0);
          } else {
            setActiveUsers(0);
          }
        }
      } catch (error) {
        console.error('Error fetching live users data:', error);
        setActiveUsers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveUsersData();
  }, [projectName, dateRange]); // Refetch when project changes

  // Animated chart effect (only for visual, not changing the number)
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: prev[prev.length - 1].time + 1,
          value: Math.floor(Math.random() * 300) + 100,
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
        className={`bg-white rounded-xl border border-gray-100 p-4 flex flex-col w-full ${className}`}
      >
        <div className="flex items-center justify-center h-[200px]">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-xs text-gray-500">Loading live users...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
      className={`bg-white rounded-xl border border-gray-100 p-4 flex flex-col w-full ${className}`}
    >
      {/* Header */}
      <div className="mb-1">
        <h3 className="text-base text-gray-800" style={{ fontFamily: 'Jura', fontWeight: '700' }}>
          Live users
        </h3>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[10px] text-emerald-600 uppercase tracking-wider">
          Active Today
        </span>
      </div>

      {/* Count - Real data from API */}
      <div className="flex items-end justify-between mb-6">
        <motion.p
          key={activeUsers}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className="text-3xl text-gray-800" 
          style={{ fontFamily: 'Jura', fontWeight: '700' }}
        >
          {activeUsers.toLocaleString()}
        </motion.p>
      </div>

      {/* Mini Chart - Animated */}
      <div className="flex-1 min-h-[70px] mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="liveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#liveGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}