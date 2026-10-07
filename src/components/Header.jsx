import React from 'react';
import { GraduationCap, Plus, Sparkles, CheckCircle2, LogOut, User } from 'lucide-react';

export default function Header({ onOpenAddModal, totalTasks, completedCount, user, onLogout }) {
  const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800/80 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                TaskCraft Student
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> JWT Auth Active
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Organize assignments, exams & projects effortlessly
            </p>
          </div>
        </div>

        {/* Action & Stats Quick View */}
        <div className="flex items-center gap-4">
          
          {/* Quick Progress Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-medium">{completedCount} of {totalTasks} Completed</span>
            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Add Task Button */}
          <button
            onClick={onOpenAddModal}
            className="group relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            <span>Add Task</span>
          </button>

          {/* User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <div className="font-semibold text-slate-200 leading-tight">
                    {user.fullName || user.username}
                  </div>
                  <div className="text-[10px] text-slate-400">@{user.username}</div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log Out"
                className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
