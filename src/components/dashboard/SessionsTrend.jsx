import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { aifaPetrolAPI } from "../../api/aifa_petrol_api";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-xs font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-500 capitalize">{entry.dataKey}:</span>
            <span className="text-xs font-medium text-gray-900">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function SessionsTrend({ projectName = "Aifa Petrol", dateRange, className = "" }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to get last 7 days
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        const response = await aifaPetrolAPI.getProjectSession();
        
        if (response.success && response.data) {
          // Get last 7 days
          const last7Days = getLast7Days();
          
          // Create a map for quick lookup
          const dataMap = new Map();
          response.data.forEach(item => {
            if (item.session_date !== 'Grand Total') {
              dataMap.set(item.session_date, item);
            }
          });
          
          // Prepare data for last 7 days
          const formattedData = last7Days.map(date => {
            const dayData = dataMap.get(date);
            const dateObj = new Date(date);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            
            return {
              day: dayName,
              fullDate: date,
              session_count: dayData ? parseInt(dayData.session_count) || 0 : 0,
              active_users: dayData ? parseInt(dayData.active_users) || 0 : 0,
            };
          });
          
          setChartData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching session trend data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [projectName, dateRange]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
        className={`bg-white rounded-xl border border-gray-100 p-4 flex flex-col w-full ${className}`}
      >
        <div className="flex items-center justify-center h-[200px]">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-xs text-gray-500">Loading session data...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
      className={`bg-white rounded-xl border border-gray-100 p-4 flex flex-col w-full ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base text-gray-800" style={{ fontFamily: 'Jura', fontWeight: '700' }}>
            Sessions trend
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </div>
            <p className="text-[10px] text-emerald-600">LAST 7 DAYS</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-gray-600">Session Count</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <span className="text-xs text-gray-600">Active Users</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="sessionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F472B6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#F472B6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickFormatter={(value) => value.toString()}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="session_count"
              name="Session Count"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#sessionGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#3B82F6", stroke: "#fff", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="active_users"
              name="Active Users"
              stroke="#F472B6"
              strokeWidth={2}
              fill="url(#usersGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#F472B6", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}