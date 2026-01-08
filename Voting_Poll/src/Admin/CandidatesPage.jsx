import { useState } from "react";
import useSound from "use-sound";
import scifi from "../assets/scifi.wav";
import { Icon } from "@iconify/react";
import candidates from '../jsondata/candidatelist.js';
const CandidatesPage = () => {
  // const [candidates, setCandidates] = useState(candidates);
  const [playClick] = useSound(scifi);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const totalVotes = candidates.reduce(
    (sum, c) => sum + c.votes,
    0
  );
  
  // const candidates = [
  //   {
  //     id: 1,
  //     name: "Alexander Mitchell",
  //     party: "Progressive Alliance",
  //     votes: 4520,
  //     percentage: 32.5,
  //     status: "active",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  //     region: "North District"
  //   },
  //   {
  //     id: 2,
  //     name: "Sarah Chen",
  //     party: "Unity Party",
  //     votes: 3890,
  //     percentage: 28.0,
  //     status: "active",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  //     region: "South District"
  //   },
  //   {
  //     id: 3,
  //     name: "Michael Johnson",
  //     party: "People's Front",
  //     votes: 2850,
  //     percentage: 20.5,
  //     status: "active",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  //     region: "East District"
  //   },
  //   {
  //     id: 4,
  //     name: "Emily Rodriguez",
  //     party: "Reform Coalition",
  //     votes: 2640,
  //     percentage: 19.0,
  //     status: "pending",
  //     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  //     region: "West District"
  //   },
  // ];

  const filteredCandidates = candidates.filter(candidate => {
  const search = searchTerm?.toLowerCase() || '';
  const name = candidate?.name?.toLowerCase() || '';
  const party = candidate?.party?.toLowerCase() || '';
  
  return name.includes(search) || party.includes(search);
});
  
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-indigo-400 rounded-full" />
            <h1 className="font-heading text-xl md:text-3xl text-white font-bold tracking-wide">
              Candidates
            </h1>
          </div>
          <p className="text-white/40 text-xs md:text-sm font-heading pl-4">
            Manage election candidates
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white/5 border border-accet/20 rounded-sm p-1">
            <button
              onClick={() => {
                playClick();
                setViewMode("grid");
              }}
              className={`p-2 rounded-sm transition-all ${
                viewMode === "grid" ? 'bg-accet/20 text-accet' : 'text-white/40 hover:text-white'
              }`}
            >
              <Icon icon="lucide:grid-3x3" width={16} />
            </button>
            <button
              onClick={() => {
                playClick();
                setViewMode("list");
              }}
              className={`p-2 rounded-sm transition-all ${
                viewMode === "list" ? 'bg-accet/20 text-accet' : 'text-white/40 hover:text-white'
              }`}
            >
              <Icon icon="lucide:list" width={16} />
            </button>
          </div>

          {/* Add Button */}
          {/* <button
            onClick={() => {
              playClick();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-accet/20 border border-accet/50 
              text-accet rounded-sm hover:bg-accet/30 transition-all font-heading text-xs 
              uppercase tracking-wider group"
          >
            <Icon icon="lucide:plus" width={16} />
            <span className="hidden sm:inline">Add Candidate</span>
          </button> */}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Icon 
            icon="lucide:search" 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" 
            width={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>{ setSearchTerm(e.target.value)
                console.log(searchTerm)

            }}
            placeholder="Search candidates..."
            className="w-full bg-white/5 border border-accet/20 rounded-sm pl-10 pr-4 py-2.5 
              text-white text-xs font-heading placeholder:text-white/30
              focus:outline-none focus:border-accet/50 focus:bg-accet/5 transition-all"
          />
        </div>

        <div className="flex gap-2">
          <select className="bg-white/5 border border-accet/20 rounded-sm px-4 py-2.5 
            text-white text-xs font-heading appearance-none cursor-pointer
            focus:outline-none focus:border-accet/50">
            <option value="">All Parties</option>
            <option value="progressive">Progressive Alliance</option>
            <option value="unity">Unity Party</option>
            <option value="peoples">People's Front</option>
          </select>

          <select className="bg-white/5 border border-accet/20 rounded-sm px-4 py-2.5 
            text-white text-xs font-heading appearance-none cursor-pointer
            focus:outline-none focus:border-accet/50">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Candidates Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredCandidates.map((candidate, index) =>{
            const percentage = ((candidate.votes / totalVotes) * 100).toFixed(2);
              //  setPercent(percentage);
             return (
            
            <div
              key={candidate.id}
              className="group relative bg-black/40 backdrop-blur-xl border border-accet/10 
                hover:border-accet/30 rounded-sm overflow-hidden transition-all duration-500
                hover:shadow-[0_0_40px_rgba(0,212,170,0.1)]"
            >
              {/* Status Badge */}
              {/* <div className={`absolute top-3 right-3 px-2 py-1 rounded-sm text-[9px] 
                font-heading uppercase tracking-wider flex items-center gap-1
                ${candidate.status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  candidate.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                } animate-pulse`} />
                {candidate.status}
              </div> */}

              {/* Content */}
              <div className="p-4 md:p-6">
                {/* Avatar */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-accet/20 to-indigo-500/20 
                    rounded-full animate-pulse" />
                  <img 
                    src={candidate.avatar} 
                    alt={candidate.name}
                    className="relative w-full h-full rounded-full border-2 border-accet/30 
                      object-cover group-hover:border-accet/60 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black border-2 border-accet 
                    rounded-full flex items-center justify-center">
                    <span className="text-accet text-[8px] font-bold">#{index + 1}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="font-heading text-sm md:text-base text-white font-semibold mb-1">
                    {candidate.name}
                  </h3>
                  <p className="text-indigo-400 text-[10px] md:text-xs font-heading uppercase tracking-wider mb-3">
                    {candidate.party}
                  </p>
                  {/* <p className="text-white/40 text-[10px] mb-4">
                    {candidate.region}
                  </p> */}

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 py-3 border-t border-accet/10">
                    <div className="text-center">
                      <p className="text-accet text-lg font-heading font-bold">
                        {candidate.votes.toLocaleString()}
                      </p>
                      <p className="text-white/30 text-[9px] uppercase tracking-wider">Votes</p>
                    </div>
                    <div className="w-px h-8 bg-accet/20" />
                    <div className="text-center">
                      <p className="text-cyan-400 text-lg font-heading font-bold">
                        {/* {candidate.percentage */}
                        {percentage}
                      </p>
                      <p className="text-white/30 text-[9px] uppercase tracking-wider">Share</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 py-2 bg-white/5 border border-white/10 rounded-sm 
                    text-white/60 text-[10px] font-heading uppercase tracking-wider
                    hover:bg-accet/10 hover:border-accet/30 hover:text-accet transition-all
                    flex items-center justify-center gap-1">
                    <Icon icon="lucide:eye" width={12} />
                    View
                  </button>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                from-transparent via-accet to-transparent opacity-0 group-hover:opacity-100 
                transition-opacity duration-500" />
            </div>
          )})}
        </div>
      ) : (
        /* List View */
        <div className="bg-black/40 backdrop-blur-xl border border-accet/10 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-accet/10">
                <th className="text-left p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider">
                  Candidate
                </th>
                <th className="text-left p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider hidden md:table-cell">
                  Party
                </th>
                <th className="text-left p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider hidden lg:table-cell">
                  Region
                </th>
                <th className="text-right p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider">
                  Votes
                </th>
                <th className="text-right p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right p-4 text-white/40 text-[10px] font-heading uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="border-b border-accet/5 hover:bg-accet/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={candidate.avatar} 
                        alt={candidate.name}
                        className="w-10 h-10 rounded-full border border-accet/20"
                      />
                      <div>
                        <p className="text-white text-sm font-heading">{candidate.name}</p>
                        <p className="text-white/40 text-[10px] md:hidden">{candidate.party}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-indigo-400 text-xs hidden md:table-cell">
                    {candidate.party}
                  </td>
                  <td className="p-4 text-white/60 text-xs hidden lg:table-cell">
                    {candidate.region}
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-accet text-sm font-heading font-bold">
                      {candidate.votes.toLocaleString()}
                    </span>
                    {/* <span className="text-white/30 text-xs ml-2">
                      ({candidate.percentage}%)
                    </span> */}
                  </td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[9px] 
                      font-heading uppercase tracking-wider
                      ${candidate.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        candidate.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                      }`} />
                      {candidate.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-accet/10 rounded transition-colors">
                        <Icon icon="lucide:eye" className="text-white/40 hover:text-accet" width={16} />
                      </button>
                      {/* <button className="p-2 hover:bg-indigo-500/10 rounded transition-colors">
                        <Icon icon="lucide:edit-2" className="text-white/40 hover:text-indigo-400" width={16} />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded transition-colors">
                        <Icon icon="lucide:trash-2" className="text-white/40 hover:text-red-400" width={16} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <AddCandidateModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

// Add Candidate Modal Component
const AddCandidateModal = ({ onClose }) => {
  const [playClick] = useSound(scifi);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => {
          playClick();
          onClose();
        }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-black/90 backdrop-blur-xl border border-accet/30 
        rounded-sm overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-accet/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-accet/10 border border-accet/30 
              flex items-center justify-center">
              <Icon icon="lucide:user-plus" className="text-accet" width={20} />
            </div>
            <div>
              <h3 className="font-heading text-lg text-white font-semibold">Add Candidate</h3>
              <p className="text-white/40 text-xs">Fill in candidate details</p>
            </div>
          </div>
          <button 
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <Icon icon="lucide:x" className="text-white/60" width={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 md:p-6 space-y-4">
          <div>
            <label className="block text-white/60 text-xs font-heading uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              className="w-full bg-white/5 border border-accet/20 rounded-sm px-4 py-3 
                text-white text-sm font-heading placeholder:text-white/30
                focus:outline-none focus:border-accet/50 focus:bg-accet/5 transition-all"
              placeholder="Enter candidate name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 text-xs font-heading uppercase tracking-wider mb-2">
                Party
              </label>
              <select className="w-full bg-white/5 border border-accet/20 rounded-sm px-4 py-3 
                text-white text-sm font-heading appearance-none cursor-pointer
                focus:outline-none focus:border-accet/50">
                <option value="">Select Party</option>
                <option value="progressive">Progressive Alliance</option>
                <option value="unity">Unity Party</option>
                <option value="peoples">People's Front</option>
              </select>
            </div>

            <div>
              <label className="block text-white/60 text-xs font-heading uppercase tracking-wider mb-2">
                Region
              </label>
              <select className="w-full bg-white/5 border border-accet/20 rounded-sm px-4 py-3 
                text-white text-sm font-heading appearance-none cursor-pointer
                focus:outline-none focus:border-accet/50">
                <option value="">Select Region</option>
                <option value="north">North District</option>
                <option value="south">South District</option>
                <option value="east">East District</option>
                <option value="west">West District</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-xs font-heading uppercase tracking-wider mb-2">
              Bio
            </label>
            <textarea
              rows={3}
              className="w-full bg-white/5 border border-accet/20 rounded-sm px-4 py-3 
                text-white text-sm font-heading placeholder:text-white/30
                focus:outline-none focus:border-accet/50 focus:bg-accet/5 transition-all resize-none"
              placeholder="Brief description..."
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs font-heading uppercase tracking-wider mb-2">
              Photo
            </label>
            <div className="border-2 border-dashed border-accet/20 rounded-sm p-6 text-center 
              hover:border-accet/40 hover:bg-accet/5 transition-all cursor-pointer">
              <Icon icon="lucide:upload-cloud" className="text-white/30 mx-auto mb-2" width={32} />
              <p className="text-white/40 text-xs">Click or drag to upload</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 md:p-6 border-t border-accet/10">
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="flex-1 py-3 bg-white/5 border border-white/10 rounded-sm 
              text-white/60 text-xs font-heading uppercase tracking-wider
              hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => playClick()}
            className="flex-1 py-3 bg-accet/20 border border-accet/50 rounded-sm 
              text-accet text-xs font-heading uppercase tracking-wider
              hover:bg-accet/30 transition-all flex items-center justify-center gap-2"
          >
            <Icon icon="lucide:plus" width={14} />
            Add Candidate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidatesPage;