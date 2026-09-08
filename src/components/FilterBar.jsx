import React from 'react';
import { Search, Filter, ArrowUpDown, XCircle } from 'lucide-react';
import { SUBJECTS } from '../constants/initialTasks';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  subjectFilter,
  setSubjectFilter,
  sortBy,
  setSortBy,
  onReset
}) {
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || subjectFilter !== 'all' || sortBy !== 'dueDate';

  return (
    <div className="glass-panel p-4 rounded-2xl mb-6 border border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by task title, description, or subject..."
          className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Selectors */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Status Tabs */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'completed', label: 'Completed' },
            { id: 'high', label: '🔥 High Priority' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Subject Dropdown */}
        <div className="relative">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
          >
            <option value="all">All Subjects</option>
            {SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="newest">Sort by Newest</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reset
          </button>
        )}

      </div>

    </div>
  );
}
