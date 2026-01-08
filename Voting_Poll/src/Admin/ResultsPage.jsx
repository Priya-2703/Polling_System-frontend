import { useState, useEffect } from "react";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";

const ResultsPage = () => {
  const [playClick] = useSound(scifi);
  const [animatedVotes, setAnimatedVotes] = useState(0);
  const [selectedView, setSelectedView] = useState("overview");

  const results = [
    { 
      id: 1, 
      name: "Alexander Mitchell", 
      party: "Progressive Alliance",
      votes: 4520, 
      percentage: 32.5,
      color: "#00d4aa",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      trend: "+2.3%",
      trendUp: true
    },
    { 
      id: 2, 
      name: "Sarah Chen", 
      party: "Unity Party",
      votes: 3890, 
      percentage: 28.0,
      color: "#6366f1",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      trend: "+1.1%",
      trendUp: true
    },
    { 
      id: 3, 
      name: "Michael Johnson", 
      party: "People's Front",
      votes: 2850, 
      percentage: 20.5,
      color: "#22d3ee",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      trend: "-0.8%",
      trendUp: false
    },
    { 
      id: 4, 
      name: "Emily Rodriguez", 
      party: "Reform Coalition",
      votes: 2640, 
      percentage: 19.0,
      color: "#a855f7",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      trend: "-1.2%",
      trendUp: false
    },
  ];

  const totalVotes = results.reduce((acc, curr) => acc + curr.votes, 0);

  // Animate vote count on load
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = totalVotes / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalVotes) {
        setAnimatedVotes(totalVotes);
        clearInterval(timer);
      } else {
        setAnimatedVotes(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalVotes]);

  // Recent votes feed
  const recentVotes = [
    { id: 1, candidate: "Alexander Mitchell", time: "Just now", region: "North" },
    { id: 2, candidate: "Sarah Chen", time: "2s ago", region: "South" },
    { id: 3, candidate: "Alexander Mitchell", time: "5s ago", region: "East" },
    { id: 4, candidate: "Michael Johnson", time: "8s ago", region: "West" },
    { id: 5, candidate: "Emily Rodriguez", time: "12s ago", region: "North" },
    { id: 6, candidate: "Sarah Chen", time: "15s ago", region: "South" },
  ];

  // Regional data
  const regionalData = [
    { region: "North", votes: 4200, leader: "Alexander Mitchell", color: "#00d4aa" },
    { region: "South", votes: 3800, leader: "Sarah Chen", color: "#6366f1" },
    { region: "East", votes: 3100, leader: "Alexander Mitchell", color: "#00d4aa" },
    { region: "West", votes: 2800, leader: "Michael Johnson", color: "#22d3ee" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-accet to-cyan-400 rounded-full" />
            <h1 className="font-heading text-xl md:text-3xl text-white font-bold tracking-wide">
              Election Results
            </h1>
            {/* Live Badge */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 border border-red-500/40 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-[9px] font-heading uppercase tracking-wider">Live</span>
            </div>
          </div>
          <p className="text-white/40 text-xs md:text-sm font-heading pl-4">
            Real-time voting results and analytics
          </p>
        </div>

        {/* View Toggle & Export */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 border border-accet/20 rounded-sm p-1">
            {["overview", "detailed", "regional"].map((view) => (
              <button
                key={view}
                onClick={() => {
                  playClick();
                  setSelectedView(view);
                }}
                className={`px-3 py-1.5 text-[10px] font-heading uppercase tracking-wider rounded-sm transition-all
                  ${selectedView === view 
                    ? 'bg-accet/20 text-accet border border-accet/50' 
                    : 'text-white/50 hover:text-white'
                  }`}
              >
                {view}
              </button>
            ))}
          </div>

          <button
            onClick={() => playClick()}
            className="flex items-center gap-2 px-4 py-2.5 bg-accet/20 border border-accet/50 
              rounded-sm hover:bg-accet/30 transition-all font-heading text-xs uppercase tracking-wider text-accet"
          >
            <Icon icon="lucide:download" width={14} />
            Export
          </button>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Votes - Animated */}
        <div className="relative bg-gradient-to-br from-accet/20 to-cyan-500/10 backdrop-blur-xl 
          border border-accet/30 rounded-sm p-4 md:p-6 overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accet/10 rounded-full blur-3xl 
            group-hover:bg-accet/20 transition-all duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-sm bg-accet/20 flex items-center justify-center 
                border border-accet/30">
                <Icon icon="lucide:vote" className="text-accet" width={24} />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <Icon icon="lucide:trending-up" width={14} />
                <span>+128</span>
              </div>
            </div>
            <p className="text-3xl md:text-4xl font-heading font-bold text-white mb-1">
              {animatedVotes.toLocaleString()}
            </p>
            <p className="text-accet/80 text-xs uppercase tracking-wider font-heading">Total Votes Cast</p>
          </div>
        </div>

        {/* Voter Turnout */}
        <div className="relative bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-sm p-4 md:p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-sm bg-indigo-500/20 flex items-center justify-center 
              border border-indigo-500/30">
              <Icon icon="lucide:users" className="text-indigo-400" width={24} />
            </div>
          </div>
          <p className="text-3xl md:text-4xl font-heading font-bold text-white mb-1">89.7%</p>
          <p className="text-indigo-400/80 text-xs uppercase tracking-wider font-heading">Voter Turnout</p>
          
          {/* Mini Progress */}
          <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
              style={{ width: '89.7%' }} />
          </div>
        </div>

        {/* Leading Candidate */}
        <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-sm p-4 md:p-6 overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={results[0].avatar} 
              alt={results[0].name}
              className="w-12 h-12 rounded-full border-2 border-accet"
            />
            <div className="flex-1">
              <p className="text-white font-heading text-sm font-semibold truncate">{results[0].name}</p>
              <p className="text-white/40 text-[10px]">{results[0].party}</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl md:text-4xl font-heading font-bold text-accet">{results[0].percentage}%</p>
              <p className="text-cyan-400/80 text-xs uppercase tracking-wider font-heading">Leading</p>
            </div>
            <Icon icon="lucide:crown" className="text-yellow-400" width={28} />
          </div>
        </div>

        {/* Margin */}
        <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-sm p-4 md:p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-sm bg-purple-500/20 flex items-center justify-center 
              border border-purple-500/30">
              <Icon icon="lucide:git-compare" className="text-purple-400" width={24} />
            </div>
          </div>
          <p className="text-3xl md:text-4xl font-heading font-bold text-white mb-1">
            {(results[0].percentage - results[1].percentage).toFixed(1)}%
          </p>
          <p className="text-purple-400/80 text-xs uppercase tracking-wider font-heading">Lead Margin</p>
          <p className="text-white/30 text-[10px] mt-1">
            {results[0].votes - results[1].votes} votes difference
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Candidates Leaderboard */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-accet/10">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg text-white font-semibold flex items-center gap-2">
                <Icon icon="lucide:trophy" className="text-yellow-400" width={20} />
                Live Standings
              </h3>
              <span className="text-white/40 text-xs font-heading">Updated just now</span>
            </div>
          </div>

          <div className="divide-y divide-accet/5">
            {results.map((candidate, index) => (
              <div 
                key={candidate.id}
                className={`p-4 md:p-6 transition-all duration-300 hover:bg-white/5
                  ${index === 0 ? 'bg-gradient-to-r from-accet/10 to-transparent' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm
                    ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' : 
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-black' :
                      index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' : 
                      'bg-white/10 text-white/60'
                    }`}>
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <img 
                      src={candidate.avatar} 
                      alt={candidate.name}
                      className="w-14 h-14 rounded-full border-2"
                      style={{ borderColor: candidate.color }}
                    />
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full 
                        flex items-center justify-center">
                        <Icon icon="lucide:crown" className="text-black" width={12} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-heading text-base text-white font-semibold truncate">
                        {candidate.name}
                      </h4>
                      {/* Trend */}
                      <span className={`flex items-center gap-0.5 text-[10px] font-heading px-1.5 py-0.5 rounded
                        ${candidate.trendUp 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                        }`}>
                        <Icon 
                          icon={candidate.trendUp ? "lucide:trending-up" : "lucide:trending-down"} 
                          width={10} 
                        />
                        {candidate.trend}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs mb-2">{candidate.party}</p>
                    
                    {/* Progress Bar */}
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 relative"
                        style={{ 
                          width: `${candidate.percentage}%`,
                          background: `linear-gradient(90deg, ${candidate.color}, ${candidate.color}88)`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          animate-shimmer" />
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="font-heading text-2xl font-bold" style={{ color: candidate.color }}>
                      {candidate.percentage}%
                    </p>
                    <p className="text-white/40 text-xs font-heading">
                      {candidate.votes.toLocaleString()} votes
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm p-4 md:p-6">
            <h3 className="font-heading text-lg text-white font-semibold mb-6 flex items-center gap-2">
              <Icon icon="lucide:pie-chart" className="text-accet" width={20} />
              Vote Distribution
            </h3>

            {/* CSS Pie Chart */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {results.reduce((acc, candidate, index) => {
                  const prevPercentage = results.slice(0, index).reduce((sum, c) => sum + c.percentage, 0);
                  const dashArray = `${candidate.percentage} ${100 - candidate.percentage}`;
                  const dashOffset = -prevPercentage;
                  
                  acc.push(
                    <circle
                      key={candidate.id}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={candidate.color}
                      strokeWidth="20"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-1000"
                    />
                  );
                  return acc;
                }, [])}
              </svg>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-heading font-bold text-white">{totalVotes.toLocaleString()}</p>
                <p className="text-white/40 text-[10px] uppercase tracking-wider">Total</p>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3">
              {results.map((candidate) => (
                <div key={candidate.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: candidate.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-xs truncate">{candidate.name.split(' ')[0]}</p>
                    <p className="text-white/40 text-[10px]">{candidate.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Vote Feed */}
          <div className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm p-4 md:p-6">
            <h3 className="font-heading text-lg text-white font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live Feed
            </h3>

            <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar">
              {recentVotes.map((vote, index) => (
                <div 
                  key={vote.id}
                  className="flex items-center gap-3 p-2 bg-white/5 rounded-sm border border-white/5
                    hover:border-accet/20 transition-all animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accet/20 to-indigo-500/20 
                    flex items-center justify-center border border-white/10">
                    <Icon icon="lucide:vote" className="text-accet" width={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs truncate">
                      Vote for <span className="text-accet">{vote.candidate.split(' ')[0]}</span>
                    </p>
                    <p className="text-white/30 text-[10px]">{vote.region} Region</p>
                  </div>
                  <span className="text-white/30 text-[10px]">{vote.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Breakdown */}
      <div className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-lg text-white font-semibold flex items-center gap-2">
            <Icon icon="lucide:map" className="text-indigo-400" width={20} />
            Regional Breakdown
          </h3>
          <button 
            onClick={() => playClick()}
            className="text-accet text-xs font-heading uppercase tracking-wider hover:text-accet/80 transition-colors
              flex items-center gap-1"
          >
            View Map
            <Icon icon="lucide:arrow-right" width={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regionalData.map((region, index) => (
            <div 
              key={region.region}
              className="relative bg-white/5 border border-white/10 rounded-sm p-4 
                hover:border-accet/30 transition-all group overflow-hidden"
            >
              {/* Background Gradient */}
              <div 
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ 
                  background: `linear-gradient(135deg, ${region.color}40, transparent)` 
                }}
              />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-heading text-sm text-white font-semibold flex items-center gap-2">
                    <Icon icon="lucide:map-pin" className="text-white/40" width={14} />
                    {region.region}
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded-full font-heading"
                    style={{ backgroundColor: `${region.color}20`, color: region.color }}>
                    #{index + 1}
                  </span>
                </div>

                <p className="text-2xl font-heading font-bold text-white mb-1">
                  {region.votes.toLocaleString()}
                </p>
                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3">Total Votes</p>

                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: region.color }}
                  />
                  <p className="text-white/60 text-xs">
                    Leading: <span style={{ color: region.color }}>{region.leader.split(' ')[0]}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Bar Chart */}
      <div className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm p-4 md:p-6">
        <h3 className="font-heading text-lg text-white font-semibold mb-6 flex items-center gap-2">
          <Icon icon="lucide:bar-chart-3" className="text-cyan-400" width={20} />
          Vote Comparison
        </h3>

        <div className="space-y-4">
          {results.map((candidate, index) => (
            <div key={candidate.id} className="flex items-center gap-4">
              <div className="w-24 flex items-center gap-2">
                <img 
                  src={candidate.avatar} 
                  alt={candidate.name}
                  className="w-8 h-8 rounded-full border"
                  style={{ borderColor: candidate.color }}
                />
                <span className="text-white/80 text-xs font-heading truncate">
                  {candidate.name.split(' ')[0]}
                </span>
              </div>
              
              <div className="flex-1 h-8 bg-white/5 rounded-sm overflow-hidden relative">
                <div 
                  className="h-full rounded-sm transition-all duration-1000 flex items-center justify-end pr-3"
                  style={{ 
                    width: `${candidate.percentage}%`,
                    background: `linear-gradient(90deg, ${candidate.color}60, ${candidate.color})`
                  }}
                >
                  <span className="text-white font-heading text-xs font-bold">
                    {candidate.votes.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="w-16 text-right">
                <span className="font-heading font-bold" style={{ color: candidate.color }}>
                  {candidate.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-sm p-4 text-center">
          <Icon icon="lucide:building-2" className="text-white/40 mx-auto mb-2" width={24} />
          <p className="text-lg font-heading font-bold text-white">156</p>
          <p className="text-white/40 text-[10px] uppercase tracking-wider">Polling Stations</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-sm p-4 text-center">
          <Icon icon="lucide:check-circle" className="text-green-400 mx-auto mb-2" width={24} />
          <p className="text-lg font-heading font-bold text-white">142</p>
          <p className="text-white/40 text-[10px] uppercase tracking-wider">Reporting</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-sm p-4 text-center">
          <Icon icon="lucide:loader" className="text-yellow-400 mx-auto mb-2 animate-spin" width={24} />
          <p className="text-lg font-heading font-bold text-white">14</p>
          <p className="text-white/40 text-[10px] uppercase tracking-wider">Processing</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-sm p-4 text-center">
          <Icon icon="lucide:shield-check" className="text-accet mx-auto mb-2" width={24} />
          <p className="text-lg font-heading font-bold text-white">100%</p>
          <p className="text-white/40 text-[10px] uppercase tracking-wider">Verified</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;