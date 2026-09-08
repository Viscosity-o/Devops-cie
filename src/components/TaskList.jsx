import React from 'react';
import TaskCard from './TaskCard';
import { ClipboardList, Plus } from 'lucide-react';

export default function TaskList({ tasks, onToggleComplete, onDeleteRequest, onEditRequest, onOpenAddModal }) {
  if (tasks.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800/80 my-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No tasks found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
          There are no tasks matching your current filter criteria or search query. Create a new task to stay organized!
        </p>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDeleteRequest}
          onEdit={onEditRequest}
        />
      ))}
    </div>
  );
}
