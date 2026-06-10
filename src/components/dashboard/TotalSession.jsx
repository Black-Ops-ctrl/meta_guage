import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { aifaPetrolAPI } from "../../api/aifa_petrol_api";

export default function PlatformSplit({ projectName = "Aifa Petrol", dateRange, className = "" }) {
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Note: Since API doesn't provide web/mobile split, we'll show total sessions only
  // For now, showing 100% for total sessions (will update when API provides split data)
  const data = [
    { name: "Total Sessions", value: 100, color: "#1e293b" },
  ];

  useEffect(() => {
    const fetchGrandTotalData = async () => {
      try {
        setLoading(true);
        const response = await aifaPetrolAPI.getProjectSession();
        
        if (response.success && response.data) {
          // Find Grand Total entry
          const grandTotal = response.data.find(item => item.session_date === 'Grand Total');
          
          if (grandTotal) {
            // Get session_count from Grand Total
            const sessions = parseInt(grandTotal.session_count) || 0;
            setTotalSessions(sessions);
          } else {
            setTotalSessions(0);
          }
        }
      } catch (error) {
        console.error('Error fetching platform split data:', error);
        setTotalSessions(0);
      } finally {
        setLoading(false);
      }
    };

    fetchGrandTotalData();
  }, [projectName, dateRange]);

  // Format number with K, M suffix
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
        className={`bg-white rounded-xl border border-gray-100 p-4 flex flex-col w-full ${className}`}
      >
        <div className="flex items-center justify-center h-[200px]">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-xs text-gray-500">Loading sessions data...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
      className={`bg-white rounded-xl border border-gray-100 p-4 flex flex-col w-full ${className}`}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base text-gray-800" style={{ fontFamily: 'Jura', fontWeight: '700' }}>
          Total Sessions
        </h3>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text - Total Sessions Count */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="text-xl text-gray-900" 
            style={{ fontFamily: 'Jura', fontWeight: '800' }}
          >
            {formatNumber(totalSessions)}
          </motion.p>
          <p className="text-[9px] text-emerald-600 uppercase tracking-wider mt-0.5">
            Total Sessions
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-2"
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: "#1e293b" }}
          />
          <span className="text-xs text-gray-500">Total Sessions</span>
          <span className="text-xs font-medium text-gray-900">
            100%
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}