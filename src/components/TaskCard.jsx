import React, { useState } from 'react';
import { 
  Check, Trash2, Calendar, BookOpen, AlertCircle, 
  FileText, FolderGit2, FlaskConical, Clock, AlertTriangle, ChevronDown, ChevronUp, Edit3 
} from 'lucide-react';
import { CATEGORIES, PRIORITIES } from '../constants/initialTasks';
import confetti from 'canvas-confetti';

export default function TaskCard({ task, onToggleComplete, onDelete, onEdit }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryMeta = CATEGORIES[task.category] || CATEGORIES.Assignment;
  const priorityMeta = PRIORITIES[task.priority] || PRIORITIES.medium;

  // Calculate overdue status
  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;
  const isDueToday = !task.completed && task.dueDate === todayStr;

  // Icon mapping for categories
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Exam': case 'AlertCircle': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'Project': case 'FolderGit2': return <FolderGit2 className="w-3.5 h-3.5" />;
      case 'Lab': case 'FlaskConical': return <FlaskConical className="w-3.5 h-3.5" />;
      case 'Reading': case 'BookOpen': return <BookOpen className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const handleToggle = () => {
    if (!task.completed) {
      // Fire tiny confetti celebratory effect
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    onToggleComplete(task.id);
  };

  return (
    <div 
      className={`glass-panel rounded-2xl p-5 border transition-all duration-300 relative group ${
        task.completed 
          ? 'border-slate-800/60 bg-slate-950/40 opacity-75' 
          : isOverdue
          ? 'border-rose-500/40 bg-slate-900/90 shadow-lg shadow-rose-950/20'
          : 'border-slate-800/80 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/20'
      }`}
    >
      
      {/* Top Meta Bar: Category, Priority & Subject */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Subject Badge */}
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800/90 text-slate-300 border border-slate-700/60">
            {task.subject}
          </span>

          {/* Category Badge */}
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1.5 ${categoryMeta.color}`}>
            {getCategoryIcon(categoryMeta.icon)}
            {categoryMeta.label}
          </span>

        </div>

        {/* Priority Pill */}
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border flex items-center gap-1.5 ${priorityMeta.badgeBg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priorityMeta.dotColor}`} />
          {priorityMeta.label}
        </span>
      </div>

      {/* Main Task Content */}
      <div className="flex items-start gap-3">
        
        {/* Custom Checkbox */}
        <button
          onClick={handleToggle}
          className={`mt-1 w-5 h-5 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
            task.completed
              ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
              : 'border-slate-700 bg-slate-900 hover:border-indigo-500 hover:bg-slate-800'
          }`}
          title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <h3 
            className={`font-semibold text-base leading-snug transition-all cursor-pointer ${
              task.completed 
                ? 'line-through text-slate-500' 
                : 'text-slate-100 hover:text-indigo-200'
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {task.title}
          </h3>

          {/* Description snippet or expanded text */}
          {task.description && (
            <div className="mt-1">
              <p className={`text-xs text-slate-400 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
                {task.description}
              </p>
              {task.description.length > 100 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
                >
                  {isExpanded ? (
                    <>Show less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Read full note <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Footer: Due Date & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        
        {/* Due Date Indicator */}
        <div className="flex items-center gap-1.5">
          <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-400' : isDueToday ? 'text-amber-400' : 'text-slate-400'}`} />
          <span className={`font-medium ${
            isOverdue 
              ? 'text-rose-400 font-semibold' 
              : isDueToday 
              ? 'text-amber-400 font-semibold' 
              : 'text-slate-400'
          }`}>
            {task.dueDate ? `Due ${task.dueDate}` : 'No deadline'}
          </span>
          {isOverdue && (
            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold flex items-center gap-1 border border-rose-500/30">
              <AlertTriangle className="w-2.5 h-2.5" /> OVERDUE
            </span>
          )}
          {isDueToday && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1 border border-amber-500/30">
              <Clock className="w-2.5 h-2.5" /> DUE TODAY
            </span>
          )}
        </div>

        {/* Action Buttons: Edit & Delete */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
