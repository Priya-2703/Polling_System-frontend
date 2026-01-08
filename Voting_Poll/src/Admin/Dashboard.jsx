import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, BarChart, Bar
// } from "recharts";

const Dashboard = () => {
  const { t } = useTranslation();
  const [playClick] = useSound(scifi);
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [liveCount, setLiveCount] = useState(1247);

  // Simulate live voting count
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
      id: 1, 
      label: "Total Votes", 
      value: liveCount.toLocaleString(), 
      change: "+12.5%", 
      trend: "up",
      icon: "lucide:vote",
      color: "accet"
    },
    { 
      id: 2, 
      label: "Active Voters", 
      value: "892", 
      change: "+8.2%", 
      trend: "up",
      icon: "lucide:users",
      color: "indigo-400"
    },
    { 
      id: 3, 
      label: "Candidates", 
      value: "24", 
      change: "+2", 
      trend: "up",
      icon: "lucide:user-check",
      color: "cyan-400"
    },
    { 
      id: 4, 
      label: "Completion Rate", 
      value: "67.8%", 
      change: "+3.1%", 
      trend: "up",
      icon: "lucide:pie-chart",
      color: "purple-400"
    },
  ];

  const votingData = [
    { time: "00:00", votes: 120 },
    { time: "04:00", votes: 80 },
    { time: "08:00", votes: 250 },
    { time: "12:00", votes: 420 },
    { time: "16:00", votes: 380 },
    { time: "20:00", votes: 520 },
    { time: "Now", votes: 610 },
  ];

  const candidateData = [
    { name: "Candidate A", votes: 450, color: "#00d4aa" },
    { name: "Candidate B", votes: 380, color: "#6366f1" },
    { name: "Candidate C", votes: 290, color: "#22d3ee" },
    { name: "Candidate D", votes: 180, color: "#a855f7" },
    { name: "Others", votes: 120, color: "#64748b" },
  ];

  const recentVotes = [
    { id: 1, voter: "User_8x7k2", candidate: "Candidate A", time: "2 min ago", verified: true },
    { id: 2, voter: "User_3m9p1", candidate: "Candidate B", time: "5 min ago", verified: true },
    { id: 3, voter: "User_5n2w8", candidate: "Candidate A", time: "8 min ago", verified: true },
    { id: 4, voter: "User_1k4j6", candidate: "Candidate C", time: "12 min ago", verified: true },
    { id: 5, voter: "User_9p7m3", candidate: "Candidate D", time: "15 min ago", verified: true },
  ];

  const regionData = [
    { region: "North", votes: 420, percentage: 35 },
    { region: "South", votes: 380, percentage: 31 },
    { region: "East", votes: 250, percentage: 21 },
    { region: "West", votes: 160, percentage: 13 },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-accet rounded-full" />
            <h1 className="font-heading text-xl md:text-3xl text-white font-bold tracking-wide">
              Dashboard
            </h1>
          </div>
          <p className="text-white/40 text-xs md:text-sm font-heading pl-4">
            Real-time voting analytics and insights
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-white/5 border border-accet/20 rounded-sm p-1">
          {["1h", "24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => {
                playClick();
                setSelectedTimeRange(range);
              }}
              className={`px-3 py-1.5 text-[10px] md:text-xs font-heading uppercase tracking-wider rounded-sm transition-all
                ${selectedTimeRange === range 
                  ? 'bg-accet/20 text-accet border border-accet/50' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.id}
            className="group relative bg-black/40 backdrop-blur-xl border border-accet/10 
              hover:border-accet/30 rounded-sm p-4 md:p-6 transition-all duration-500
              hover:shadow-[0_0_30px_rgba(0,212,170,0.1)]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}/10 blur-2xl 
              opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Icon */}
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-sm bg-${stat.color}/10 
              flex items-center justify-center mb-3 md:mb-4 border border-${stat.color}/20`}>
              <Icon icon={stat.icon} className={`text-${stat.color}`} width={20} />
            </div>

            {/* Value */}
            <div className="flex items-end gap-2 mb-1">
              <span className="font-heading text-xl md:text-3xl text-white font-bold">
                {stat.value}
              </span>
              <span className={`text-[10px] md:text-xs font-heading ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              } flex items-center gap-0.5 mb-1`}>
                <Icon 
                  icon={stat.trend === 'up' ? 'lucide:trending-up' : 'lucide:trending-down'} 
                  width={12} 
                />
                {stat.change}
              </span>
            </div>

            {/* Label */}
            <p className="text-white/40 text-[10px] md:text-xs font-heading uppercase tracking-wider">
              {stat.label}
            </p>

            {/* Bottom Accent Line */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r 
              from-transparent via-${stat.color}/50 to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity`} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading text-sm md:text-lg text-white font-semibold">
                Voting Activity
              </h3>
              <p className="text-white/40 text-[10px] md:text-xs">
                Votes over time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accet rounded-full animate-pulse" />
              <span className="text-accet text-[10px] font-heading uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>

          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={votingData}>
                <defs>
                  <linearGradient id="voteGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4aa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(0,212,170,0.3)',
                    borderRadius: '4px'
                  }}
                  labelStyle={{ color: '#00d4aa' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="votes" 
                  stroke="#00d4aa" 
                  strokeWidth={2}
                  fill="url(#voteGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm p-4 md:p-6">
          <h3 className="font-heading text-sm md:text-lg text-white font-semibold mb-2">
            Vote Distribution
          </h3>
          <p className="text-white/40 text-[10px] md:text-xs mb-4">
            By candidate
          </p>

          <div className="h-40 md:h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={candidateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="votes"
                >
                  {candidateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0,0,0,0.9)', 
                    border: '1px solid rgba(0,212,170,0.3)',
                    borderRadius: '4px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-2 mt-4">
            {candidateData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white/60 text-[10px] md:text-xs">{item.name}</span>
                </div>
                <span className="text-white text-[10px] md:text-xs font-heading">
                  {item.votes}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Votes */}
        <div className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="font-heading text-sm md:text-lg text-white font-semibold">
              Recent Votes
            </h3>
            <button className="text-accet text-[10px] md:text-xs font-heading uppercase tracking-wider 
              hover:text-accet/80 transition-colors flex items-center gap-1">
              View All
              <Icon icon="lucide:arrow-right" width={12} />
            </button>
          </div>

          <div className="space-y-3">
            {recentVotes.map((vote, index) => (
              <div 
                key={vote.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-sm 
                  border border-transparent hover:border-accet/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 
                    flex items-center justify-center border border-white/10">
                    <Icon icon="lucide:user" className="text-white/40" width={14} />
                  </div>
                  <div>
                    <p className="text-white text-xs font-heading">{vote.voter}</p>
                    <p className="text-white/40 text-[10px]">Voted for {vote.candidate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/30 text-[10px]">{vote.time}</span>
                  {vote.verified && (
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Icon icon="lucide:check" className="text-green-400" width={12} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm p-4 md:p-6">
          <h3 className="font-heading text-sm md:text-lg text-white font-semibold mb-2">
            Regional Distribution
          </h3>
          <p className="text-white/40 text-[10px] md:text-xs mb-4 md:mb-6">
            Votes by region
          </p>

          <div className="space-y-4">
            {regionData.map((region, index) => (
              <div key={region.region}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-xs font-heading">{region.region}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[10px]">{region.votes} votes</span>
                    <span className="text-accet text-xs font-heading">{region.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accet to-cyan-400 rounded-full transition-all duration-1000"
                    style={{ width: `${region.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="mt-6 h-32 bg-white/5 rounded-sm border border-dashed border-white/10 
            flex items-center justify-center">
            <div className="text-center">
              <Icon icon="lucide:map" className="text-white/20 mx-auto mb-2" width={24} />
              <p className="text-white/20 text-[10px] font-heading uppercase tracking-wider">
                Interactive Map
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;