import React from 'react';
import { CheckCircle2, Clock, Flame, ListTodo, TrendingUp } from 'lucide-react';

export default function StatsOverview({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Total Tasks Card */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <ListTodo className="w-16 h-16 text-indigo-400" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ListTodo className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</span>
        </div>
        <div className="flex items-baseline justify-between mt-3">
          <span className="text-3xl font-bold text-white tracking-tight">{total}</span>
          <span className="text-xs text-slate-400 font-medium">All registered</span>
        </div>
      </div>

      {/* Pending Tasks Card */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group border border-slate-800/80 hover:border-amber-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Clock className="w-16 h-16 text-amber-400" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress</span>
        </div>
        <div className="flex items-baseline justify-between mt-3">
          <span className="text-3xl font-bold text-white tracking-tight">{pending}</span>
          <span className="text-xs text-amber-400 font-medium">{pending === 1 ? '1 task active' : `${pending} tasks active`}</span>
        </div>
      </div>

      {/* Completed Tasks Card */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <CheckCircle2 className="w-16 h-16 text-emerald-400" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</span>
        </div>
        <div className="flex items-baseline justify-between mt-3">
          <span className="text-3xl font-bold text-white tracking-tight">{completed}</span>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{completionPercentage}% Rate</span>
          </div>
        </div>
      </div>

      {/* High Priority Urgency Card */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group border border-slate-800/80 hover:border-rose-500/30 transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Flame className="w-16 h-16 text-rose-400" />
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Priority</span>
        </div>
        <div className="flex items-baseline justify-between mt-3">
          <span className="text-3xl font-bold text-white tracking-tight">{highPriority}</span>
          <span className={`text-xs font-medium ${highPriority > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
            {highPriority > 0 ? 'Urgent attention' : 'No urgent items'}
          </span>
        </div>
      </div>

    </div>
  );
}
