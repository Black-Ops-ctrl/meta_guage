import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Smartphone,
  Monitor,
  Star,
  Clock,
  Users,
  TrendingUp,
  BarChart2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { aifaPetrolAPI } from "../api/aifa_petrol_api";

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// ─── GET COLOR BY PLATFORM ───────────────────────────────────────────────────
function getLineColor(type) {
  switch(type) {
    case "WEB": return "#3b82f6";
    case "IOS": return "#ec4899";
    case "ANDROID": return "#ec4899";
    case "DESKTOP": return "#8b5cf6";
    default: return "#3b82f6";
  }
}

// ─── GET PROJECT METADATA FROM API ────────────────────────────────────────────
const getProjectMetadataFromAPI = (projectName, grandTotalData) => {
  const getIcon = () => {
    if (projectName === "Aifa_Petrol" || projectName === "Aifa Petrol") {
      return { icon: Globe, type: "WEB", iconColor: "text-blue-500", iconBg: "bg-blue-50" };
    }
    return { icon: Globe, type: "WEB", iconColor: "text-blue-500", iconBg: "bg-blue-50" };
  };
  
  const { icon, type, iconColor, iconBg } = getIcon();
  
  return {
    id: "aifa-petrol",
    name: projectName,
    type: type,
    icon: icon,
    iconColor: iconColor,
    iconBg: iconBg,
    dau: grandTotalData?.dau || "00:00:00",
    mau: grandTotalData?.mau || "00:00:00",
    totalDuration: grandTotalData?.total_duration || "00:00:00",
    feedback: 4.6,
    trend: 8.4,
  };
};

// ─── STAT PILL ────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium flex items-center gap-1">
        <Icon className="w-3 h-3" color={color} /> {label}
      </p>
      <p className="text-sm font-bold text-gray-700" style={{ fontFamily: "Jura" }}>
        {value}
      </p>
    </div>
  );
}

// ─── FORMAT X-AXIS LABELS - SMART ADJUSTMENT (FROM YOUR OLD CODE) ────────────
const formatXAxisLabels = (filteredData, rangeDays) => {
  if (!filteredData.length) return [];
  
  const totalPoints = filteredData.length;
  
  if (rangeDays <= 7) {
    return filteredData.map(d => {
      const date = new Date(d.session_date);
      return date.toLocaleDateString('en', { weekday: 'short' });
    });
  }
  
  if (rangeDays <= 14) {
    return filteredData.map((d, i) => {
      const date = new Date(d.session_date);
      if (i % 2 === 0 || i === totalPoints - 1) {
        return `${date.getMonth()+1}/${date.getDate()}`;
      }
      return '';
    });
  }
  
  if (rangeDays <= 30) {
    const step = Math.floor(totalPoints / 8);
    return filteredData.map((d, i) => {
      const date = new Date(d.session_date);
      if (i % step === 0 || i === totalPoints - 1) {
        return `${date.getMonth()+1}/${date.getDate()}`;
      }
      return '';
    });
  }
  
  if (rangeDays <= 60) {
    const step = Math.floor(totalPoints / 8);
    return filteredData.map((d, i) => {
      const date = new Date(d.session_date);
      if (i % step === 0 || i === totalPoints - 1) {
        return `${date.getMonth()+1}/${date.getDate()}`;
      }
      return '';
    });
  }
  
  const step = Math.max(1, Math.floor(totalPoints / 8));
  return filteredData.map((d, i) => {
    const date = new Date(d.session_date);
    if (i % step === 0 || i === totalPoints - 1) {
      return `${date.getMonth()+1}/${date.getDate()}`;
    }
    return '';
  });
};

// ─── MINI CHART ──────────────────────────────────────────────────────────────
function MiniChart({ dailyData, type, projectId, startDate, endDate }) {
  const [filteredData, setFilteredData] = useState([]);
  
  useEffect(() => {
    if (dailyData && startDate && endDate) {
      // Sort data by date
      const sorted = [...dailyData].sort((a, b) => 
        new Date(a.session_date) - new Date(b.session_date)
      );
      setFilteredData(sorted);
    }
  }, [startDate, endDate, dailyData]);
  
  if (!filteredData.length) {
    return (
      <div className="h-[120px] w-full flex items-center justify-center text-gray-400 text-xs">
        No data for selected range
      </div>
    );
  }
  
  const rangeDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const xAxisLabels = formatXAxisLabels(filteredData, rangeDays);
  
  const chartData = filteredData.map((item, idx) => ({
    day: xAxisLabels[idx] || '',
    activeUsers: parseInt(item.active_users) || 0,
    fullDate: item.session_date
  }));
  
  const gradId = `grad-${projectId}`;
  const lineColor = getLineColor(type);
  
  let tickInterval = 0;
  if (chartData.length > 30) tickInterval = Math.floor(chartData.length / 8);
  else if (chartData.length > 15) tickInterval = Math.floor(chartData.length / 6);
  else if (chartData.length > 7) tickInterval = 2;
  else tickInterval = 0;
  
  return (
    <div className="h-[120px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.4} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis hide />
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 11,
              color: "#374151",
              fontFamily: "Jura",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0] && payload[0].payload) {
                return payload[0].payload.fullDate;
              }
              return label;
            }}
            formatter={(value) => [`${value} users`, "Active Users"]}
            cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="activeUsers"
            name="Active Users"
            stroke={lineColor}
            strokeWidth={2.5}
            fill={`url(#${gradId})`}
            dot={filteredData.length <= 14}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── DATE RANGE PICKER ───────────────────────────────────────────────────────
function DateRangePicker({ onRangeChange, initialRange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState(initialRange || {
    start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [selecting, setSelecting] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);
  
  const DATE_PRESETS = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 14 days", days: 14 },
    { label: "Last 30 days", days: 30 }
  ];
  
  const TODAY = new Date();
  
  function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && 
           a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  
  function isInRange(date) {
    const rangeEnd = selecting ? hoverDate : range.end;
    if (!range.start || !rangeEnd) return false;
    const lo = range.start < rangeEnd ? range.start : rangeEnd;
    const hi = range.start < rangeEnd ? rangeEnd : range.start;
    return date > lo && date < hi;
  }
  
  function handleDayClick(date) {
    if (!selecting) {
      setRange({ start: date, end: null });
      setSelecting(true);
    } else {
      const lo = range.start < date ? range.start : date;
      const hi = range.start < date ? date : range.start;
      const newRange = { start: lo, end: hi };
      setRange(newRange);
      setSelecting(false);
      onRangeChange(newRange);
      setIsOpen(false);
    }
  }
  
  function applyPreset(days) {
    const end = new Date(TODAY);
    const start = new Date(TODAY);
    start.setDate(start.getDate() - days + 1);
    const newRange = { start, end };
    setRange(newRange);
    setSelecting(false);
    onRangeChange(newRange);
    setIsOpen(false);
  }
  
  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  }
  
  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  }
  
  function renderMonth() {
    const dim = new Date(viewYear, viewMonth + 1, 0).getDate();
    const fd = new Date(viewYear, viewMonth, 1).getDay();
    const cells = Array.from({ length: fd }, () => null).concat(
      Array.from({ length: dim }, (_, i) => new Date(viewYear, viewMonth, i + 1))
    );
    
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="text-xs font-semibold text-gray-200" style={{ fontFamily: "Jura" }}>
            {new Date(viewYear, viewMonth).toLocaleString("default", { month: "long", year: "numeric" })}
          </p>
          <button onClick={nextMonth} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 text-center">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
            <p key={d} className="text-[9px] text-gray-600 py-1 uppercase tracking-wide font-medium">{d}</p>
          ))}
          {cells.map((date, i) => {
            if (!date) return <div key={`e-${i}`} />;
            const isStart = isSameDay(date, range.start);
            const isEnd = isSameDay(date, range.end);
            const inRange = isInRange(date);
            
            return (
              <div
                key={i}
                onClick={() => handleDayClick(date)}
                onMouseEnter={() => selecting && setHoverDate(date)}
                className={`
                  relative text-xs py-[7px] cursor-pointer select-none transition-all duration-100 text-center
                  ${isStart || isEnd ? "text-white font-bold z-10 bg-cyan-500 rounded-lg" : ""}
                  ${inRange ? "bg-cyan-500/10 text-cyan-300" : ""}
                  ${!isStart && !isEnd && !inRange ? "text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg" : ""}
                `}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  const formatDisplayDate = () => {
    if (!range.start) return "Select date";
    if (!range.end) return `${range.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ?`;
    return `${range.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${range.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200"
      >
        <Calendar className="w-3.5 h-3.5" />
        {formatDisplayDate()}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 bg-[#0f172a] border border-white/30 rounded-xl z-[200] p-4 w-[360px]"
          >
            <div className="flex gap-2 mb-4">
              {DATE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.days)}
                  className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-white/[0.07] text-gray-200 hover:text-white hover:border-white/20 transition-all duration-200"
                >
                  {p.label}
                </button>
              ))}
            </div>
            
            {renderMonth()}
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
              <p className="text-xs text-gray-500">
                {selecting ? "Select end date..." : range.start && range.end ? 
                  <span className="text-gray-300">{formatDisplayDate()}</span> : 
                  "Select start date"}
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PROJECT CARD ────────────────────────────────────────────────────────────
function ProjectCard({ project, index, dailyData, startDate, endDate }) {
  const isPositive = project.trend >= 0;
  const lineColor = getLineColor(project.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
      className="relative bg-white rounded-2xl border border-gray-300 overflow-hidden cursor-pointer group transition-all duration-300 hover:border-gray-300 hover:shadow-xl"
    >      
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${project.iconBg} flex items-center justify-center border border-gray-200`}>
              <project.icon className={`${project.iconColor}`} size={18} />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900" style={{ fontFamily: "Jura" }}>
                {project.name}
              </p>
              <span className="text-[10px] tracking-widest text-gray-500 uppercase font-medium">
                {project.type}
              </span>
            </div>
          </div>
          {isPositive ? (
            <div className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              <span className="text-[10px] font-bold">+{project.trend}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-0.5 text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              <ArrowDownRight className="w-3 h-3" />
              <span className="text-[10px] font-bold">{project.trend}%</span>
            </div>
          )}
        </div>

        <MiniChart
          dailyData={dailyData}
          type={project.type}
          projectId={project.id}
          startDate={startDate}
          endDate={endDate}
        />

        <div className="border-t border-gray-100 my-3" />

        <div className="grid grid-cols-3 gap-3">
          <StatPill icon={Users} label="DAU" value={project.dau} color={lineColor} />
          <StatPill icon={TrendingUp} label="MAU" value={project.mau} color={lineColor} />
          <StatPill icon={Clock} label="TOTAL DURATION" value={project.totalDuration} color={lineColor} />
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                className={`w-3.5 h-3.5 transition-all ${
                  s <= Math.round(project.feedback) 
                    ? "text-amber-400 fill-amber-400" 
                    : "text-gray-200 fill-gray-200"
                }`} 
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-400">Feedback</span>
            <span className="text-[11px] text-gray-400">{project.feedback}</span>
            <span className="text-[11px] text-gray-400">/ 5</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ProjectDashboard({ scopeLabel = "All Projects" }) {
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState([]);
  const [grandTotalData, setGrandTotalData] = useState(null);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    end: new Date()
  });

  const formatDateToYMD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const startDate = formatDateToYMD(dateRange.start);
        const endDate = formatDateToYMD(dateRange.end);
        
        const response = await aifaPetrolAPI.getProjectSession(startDate, endDate);
        
        if (response.success && response.data) {
          const grandTotal = response.data.find(item => item.session_date === 'Grand Total');
          setGrandTotalData(grandTotal || null);
          
          const projectData = response.data.filter(item => 
            item.session_date !== 'Grand Total'
          );
          setDailyData(projectData);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [scopeLabel, dateRange.start, dateRange.end]);

  // Calculate totals based on filtered data (not from Grand Total)
  const totalActiveUsers = dailyData.reduce((sum, item) => 
    sum + (parseInt(item.active_users) || 0), 0
  );
  
  const totalSessions = dailyData.reduce((sum, item) => 
    sum + (parseInt(item.session_count) || 0), 0
  );

  const projectMetadata = getProjectMetadataFromAPI(scopeLabel, grandTotalData);
  const filtered = [projectMetadata].filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const formatDateRange = () => {
    const start = dateRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = dateRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start} – ${end}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-6 pt-6 pb-10">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-500">Loading project data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 pt-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 p-6 mb-6 rounded-md"
      >
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "Jura" }}
            >
              {scopeLabel}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-gray-300 max-w-xl"
            >
              Select date range to filter charts — {formatDateRange()}
            </motion.p>
          </div>
          
          <DateRangePicker 
            onRangeChange={setDateRange}
            initialRange={dateRange}
          />
        </div>

        <div className="flex gap-4 mt-5 flex-wrap">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className="border border-white/[0.6] rounded-xl p-4 min-w-[150px]"
          >
            <p className="text-[10px] uppercase tracking-widest text-gray-300 mb-1">Total Active Users</p>
            <p className="text-xl font-bold text-white" style={{ fontFamily: "Jura" }}>
              {formatNumber(totalActiveUsers)}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">In selected period</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.33, duration: 0.35 }}
            className="border border-white/[0.6] rounded-xl p-4 min-w-[150px]"
          >
            <p className="text-[10px] uppercase tracking-widest text-gray-300 mb-1">Total Sessions</p>
            <p className="text-xl font-bold text-white" style={{ fontFamily: "Jura" }}>
              {formatNumber(totalSessions)}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">In selected period</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Rest of the code remains same... */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="relative mb-5 max-w-xs"
      >
        <BarChart2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-xl text-black bg-white placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-200 transition-all duration-200"
        />
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 text-gray-600"
        >
          <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No projects match "{search}"</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project, i) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={i}
              dailyData={dailyData}
              startDate={dateRange.start}
              endDate={dateRange.end}
            />
          ))}
        </div>
      )}
    </div>
  );
}