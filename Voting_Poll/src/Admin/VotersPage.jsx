import { useState } from "react";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";

const VotersPage = () => {
  const [playClick] = useSound(scifi);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [regionFilter, setRegionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const voters = [
    { id: 1, voterId: "VTR_8x7k2m9p", name: "John Doe", email: "john@email.com", region: "North", status: "verified", votedAt: "2024-01-15 14:32" },
    { id: 2, voterId: "VTR_3m9p1k4j", name: "Jane Smith", email: "jane@email.com", region: "South", status: "verified", votedAt: "2024-01-15 14:28" },
    { id: 3, voterId: "VTR_5n2w8q6r", name: "Bob Wilson", email: "bob@email.com", region: "East", status: "pending", votedAt: null },
    { id: 4, voterId: "VTR_1k4j6n2w", name: "Alice Brown", email: "alice@email.com", region: "West", status: "verified", votedAt: "2024-01-15 13:45" },
    { id: 5, voterId: "VTR_9p7m3x8k", name: "Charlie Davis", email: "charlie@email.com", region: "North", status: "rejected", votedAt: null },
    { id: 6, voterId: "VTR_2k5m8n1p", name: "David Lee", email: "david@email.com", region: "East", status: "verified", votedAt: "2024-01-15 12:30" },
    { id: 7, voterId: "VTR_7j3k9m2n", name: "Emma Watson", email: "emma@email.com", region: "West", status: "pending", votedAt: null },
    { id: 8, voterId: "VTR_4n8k2m5p", name: "Frank Miller", email: "frank@email.com", region: "South", status: "verified", votedAt: "2024-01-15 11:15" },
    { id: 9, voterId: "VTR_6m2n4k8j", name: "Grace Kim", email: "grace@email.com", region: "North", status: "pending", votedAt: null },
    { id: 10, voterId: "VTR_1p5m9k3n", name: "Henry Chen", email: "henry@email.com", region: "East", status: "rejected", votedAt: null },
  ];

  // ✅ Filter voters based on search term, region, and status
  const filteredVoters = voters.filter(voter => {
    // Search filter (name, email, voterId)
    const search = searchTerm?.toLowerCase() || '';
    const matchesSearch =
      (voter?.name?.toLowerCase() || '').includes(search) ||
      (voter?.email?.toLowerCase() || '').includes(search) ||
      (voter?.voterId?.toLowerCase() || '').includes(search);

    // Region filter
    const matchesRegion = regionFilter === '' || voter?.region === regionFilter;

    // Status filter
    const matchesStatus = statusFilter === '' || voter?.status === statusFilter;

    // Return true only if all conditions match
    return matchesSearch && matchesRegion && matchesStatus;
  });

  // Calculate stats based on all voters (not filtered)
  const stats = [
    {
      label: "Total Registered",
      value: voters.length.toLocaleString(),
      icon: "lucide:users",
      color: "accet"
    },
    {
      label: "Verified",
      value: voters.filter(v => v.status === 'verified').length.toLocaleString(),
      icon: "lucide:user-check",
      color: "green-400"
    },
    {
      label: "Pending",
      value: voters.filter(v => v.status === 'pending').length.toLocaleString(),
      icon: "lucide:user-cog",
      color: "yellow-400"
    },
    {
      label: "Rejected",
      value: voters.filter(v => v.status === 'rejected').length.toLocaleString(),
      icon: "lucide:user-x",
      color: "red-400"
    },
  ];

  // Clear all filters
  const clearFilters = () => {
    playClick();
    setSearchTerm("");
    setRegionFilter("");
    setStatusFilter("");
  };

  // Check if any filter is active
  const hasActiveFilters = searchTerm !== '' || regionFilter !== '' || statusFilter !== '';

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-green-400 rounded-full" />
            <h1 className="font-heading text-xl md:text-3xl text-white font-bold tracking-wide">
              Voters
            </h1>
          </div>
          <p className="text-white/40 text-xs md:text-sm font-heading pl-4">
            Manage registered voters
          </p>
        </div>

        {/* <button
          onClick={() => {
            playClick();
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-accet/20 border border-accet/50 
            text-accet rounded-sm hover:bg-accet/30 transition-all font-heading text-xs 
            uppercase tracking-wider"
        >
          <Icon icon="lucide:user-plus" width={16} />
          Add Voter
        </button> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm p-4 
              hover:border-accet/30 transition-all cursor-pointer group"
            onClick={() => {
              playClick();
              // Quick filter by clicking on stat cards
              if (stat.label === "Verified") setStatusFilter("verified");
              else if (stat.label === "Pending") setStatusFilter("pending");
              else if (stat.label === "Rejected") setStatusFilter("rejected");
              else {
                setStatusFilter("");
                setRegionFilter("");
                setSearchTerm("");
              }
            }}
          >
            <div className={`w-10 h-10 rounded-sm flex items-center justify-center mb-3
              ${stat.color === 'accet' ? 'bg-accet/10' :
                stat.color === 'green-400' ? 'bg-green-400/10' :
                  stat.color === 'yellow-400' ? 'bg-yellow-400/10' : 'bg-red-400/10'
              }`}>
              <Icon
                icon={stat.icon}
                className={`${stat.color === 'accet' ? 'text-accet' :
                  stat.color === 'green-400' ? 'text-green-400' :
                    stat.color === 'yellow-400' ? 'text-yellow-400' : 'text-red-400'
                  }`}
                width={20}
              />
            </div>
            <p className="text-xl md:text-2xl font-heading font-bold text-white mb-1 
              group-hover:text-accet transition-colors">
              {stat.value}
            </p>
            <p className="text-white/40 text-[10px] uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Icon
            icon="lucide:search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            width={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value || '')}
            placeholder="Search by name, email, or voter ID..."
            className="w-full bg-white/5 border border-accet/20 rounded-sm pl-10 pr-10 py-2.5 
              text-white text-xs font-heading placeholder:text-white/30
              focus:outline-none focus:border-accet/50 focus:bg-accet/5 transition-all"
          />
          {/* Clear search button */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
            >
              <Icon icon="lucide:x" width={14} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex gap-2 flex-wrap">
          {/* Region Filter */}
          <div className="relative">
            <select
              value={regionFilter}
              onChange={(e) => {
                playClick();
                setRegionFilter(e.target.value);
              }}
              className="bg-black border border-accet/20 rounded-sm px-4 py-2.5 pr-8
    text-white text-xs font-heading appearance-none cursor-pointer
    focus:outline-none focus:border-accet/50 transition-all"
            >
              <option value="" className="bg-black text-white">All Regions</option>
              <option value="North" className="bg-black text-white">North</option>
              <option value="South" className="bg-black text-white">South</option>
              <option value="East" className="bg-black text-white">East</option>
              <option value="West" className="bg-black text-white">West</option>
            </select>
            <Icon
              icon="lucide:chevron-down"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              width={14}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                playClick();
                setStatusFilter(e.target.value);
              }}
              className="bg-[#0a0a0a] border border-accet/20 rounded-sm px-4 py-2.5 pr-8
    text-white text-xs font-heading appearance-none cursor-pointer
    focus:outline-none focus:border-accet/50 transition-all"
            >
              <option value="" className="bg-[#0a0a0a] text-white py-2">All Status</option>
              <option value="verified" className="bg-[#0a0a0a] text-white py-2">Verified</option>
              <option value="pending" className="bg-[#0a0a0a] text-white py-2">Pending</option>
              <option value="rejected" className="bg-[#0a0a0a] text-white py-2">Rejected</option>
            </select>
            <Icon
              icon="lucide:chevron-down"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              width={14}
            />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/30 
                text-red-400 rounded-sm hover:bg-red-500/20 transition-all font-heading text-xs 
                uppercase tracking-wider"
            >
              <Icon icon="lucide:x" width={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/40 text-xs font-heading">Active Filters:</span>

          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-accet/10 border border-accet/30 
              rounded-sm text-accet text-[10px] font-heading uppercase tracking-wider">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="hover:text-white transition-colors">
                <Icon icon="lucide:x" width={10} />
              </button>
            </span>
          )}

          {regionFilter && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 
              rounded-sm text-indigo-400 text-[10px] font-heading uppercase tracking-wider">
              Region: {regionFilter}
              <button onClick={() => setRegionFilter('')} className="hover:text-white transition-colors">
                <Icon icon="lucide:x" width={10} />
              </button>
            </span>
          )}

          {statusFilter && (
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] 
              font-heading uppercase tracking-wider
              ${statusFilter === 'verified' ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
                statusFilter === 'pending' ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400' :
                  'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
              Status: {statusFilter}
              <button onClick={() => setStatusFilter('')} className="hover:text-white transition-colors">
                <Icon icon="lucide:x" width={10} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-xs font-heading">
          Showing <span className="text-accet font-bold">{filteredVoters.length}</span> of {voters.length} voters
        </p>
      </div>

      {/* Table */}
      <div className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accet/10">
                <th className="text-left p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-white/20 bg-transparent" />
                </th>
                <th className="text-left p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider">
                  Voter ID
                </th>
                <th className="text-left p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="text-left p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider hidden lg:table-cell">
                  Region
                </th>
                <th className="text-left p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider hidden lg:table-cell">
                  Voted At
                </th>
                <th className="text-right p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVoters.length > 0 ? (
                filteredVoters.map((voter) => (
                  <tr key={voter.id} className="border-b border-accet/5 hover:bg-accet/5 transition-colors">
                    <td className="p-4">
                      <input type="checkbox" className="rounded border-white/20 bg-transparent" />
                    </td>
                    <td className="p-4">
                      <span className="text-accet text-xs font-mono">{voter.voterId}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 
                          flex items-center justify-center border border-white/10">
                          <span className="text-white text-xs font-heading">
                            {voter.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <span className="text-white text-sm">{voter.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white/60 text-xs hidden md:table-cell">{voter.email}</td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-white/60 text-xs px-2 py-1 bg-white/5 rounded-sm">
                        {voter.region}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-[9px] 
                        font-heading uppercase tracking-wider
                        ${voter.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                          voter.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${voter.status === 'verified' ? 'bg-green-400' :
                          voter.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                          } animate-pulse`} />
                        {voter.status}
                      </span>
                    </td>
                    <td className="p-4 text-white/40 text-xs hidden lg:table-cell">
                      {voter.votedAt ? (
                        <span className="flex items-center gap-1">
                          <Icon icon="lucide:check-circle" className="text-green-400" width={12} />
                          {voter.votedAt}
                        </span>
                      ) : (
                        <span className="text-white/20">Not voted</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => playClick()}
                          className="p-2 hover:bg-accet/10 rounded transition-colors group"
                          title="View Details"
                        >
                          <Icon icon="lucide:eye" className="text-white/40 group-hover:text-accet" width={16} />
                        </button>
                        {/* <button
                          onClick={() => playClick()}
                          className="p-2 hover:bg-indigo-500/10 rounded transition-colors group"
                          title="Edit Voter"
                        >
                          <Icon icon="lucide:edit-2" className="text-white/40 group-hover:text-indigo-400" width={16} />
                        </button> */}
                        {/* <button
                          onClick={() => playClick()}
                          className="p-2 hover:bg-red-500/10 rounded transition-colors group"
                          title="Delete Voter"
                        >
                          <Icon icon="lucide:trash-2" className="text-white/40 group-hover:text-red-400" width={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // No Results Found
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Icon icon="lucide:search-x" className="text-white/20" width={32} />
                      </div>
                      <p className="text-white/60 text-sm font-heading mb-2">No voters found</p>
                      <p className="text-white/30 text-xs mb-4">
                        Try adjusting your search or filter criteria
                      </p>
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-2 bg-accet/20 border border-accet/50 
                          text-accet rounded-sm hover:bg-accet/30 transition-all font-heading text-xs 
                          uppercase tracking-wider"
                      >
                        <Icon icon="lucide:refresh-cw" width={14} />
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Only show if there are results */}
        {filteredVoters.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-accet/10">
            <p className="text-white/40 text-xs">
              Showing <span className="text-accet">{filteredVoters.length}</span> voters
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playClick()}
                className="p-2 bg-white/5 border border-white/10 rounded-sm hover:bg-accet/10 
                  hover:border-accet/30 transition-all disabled:opacity-50"
              >
                <Icon icon="lucide:chevron-left" className="text-white/60" width={16} />
              </button>
              {[1, 2, 3].map((page, i) => (
                <button
                  key={i}
                  onClick={() => {
                    playClick();
                    setCurrentPage(page);
                  }}
                  className={`px-3 py-1.5 text-xs font-heading rounded-sm transition-all
                    ${page === currentPage
                      ? 'bg-accet/20 text-accet border border-accet/50'
                      : 'text-white/40 hover:bg-white/5'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => playClick()}
                className="p-2 bg-white/5 border border-white/10 rounded-sm hover:bg-accet/10 
                  hover:border-accet/30 transition-all"
              >
                <Icon icon="lucide:chevron-right" className="text-white/60" width={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotersPage;