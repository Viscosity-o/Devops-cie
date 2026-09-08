import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { INITIAL_TASKS } from './constants/initialTasks';
import { CheckCircle2, Trash2, Sparkles, RefreshCw } from 'lucide-react';


const LOCAL_STORAGE_KEY = 'taskcraft_student_tasks_v1';

export default function App() {
  // Task State initialized from LocalStorage or INITIAL_TASKS
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return INITIAL_TASKS;
  });

  // Modal & Form States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | completed | high
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate | priority | newest | title

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Persist tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Task Operations
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Update existing
      setTasks(prev => prev.map(t => t.id === taskData.id ? taskData : t));
      showToast(`Task "${taskData.title}" updated successfully!`);
    } else {
      // Create new
      setTasks(prev => [taskData, ...prev]);
      showToast(`Task "${taskData.title}" added to your manager!`);
    }
    setEditingTask(null);
  };

  const handleToggleComplete = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updatedStatus = !t.completed;
        showToast(
          updatedStatus ? `Completed "${t.title}"! Great job! 🎉` : `Reopened "${t.title}"`,
          updatedStatus ? 'success' : 'info'
        );
        return { ...t, completed: updatedStatus };
      }
      return t;
    }));
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    const targetTask = tasks.find(t => t.id === deleteTargetId);
    setTasks(prev => prev.filter(t => t.id !== deleteTargetId));
    setDeleteTargetId(null);
    if (targetTask) {
      showToast(`Deleted task "${targetTask.title}"`, 'danger');
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all tasks back to initial sample student data?')) {
      setTasks(INITIAL_TASKS);
      showToast('Reset tasks to sample data', 'info');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSubjectFilter('all');
    setSortBy('dueDate');
  };

  // Filtered & Sorted Tasks Computation
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search match
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(query) ||
        task.subject.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Status Filter
      if (statusFilter === 'active' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      if (statusFilter === 'high' && (task.priority !== 'high' || task.completed)) return false;

      // Subject Filter
      if (subjectFilter !== 'all' && task.subject !== subjectFilter) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, searchQuery, statusFilter, subjectFilter, sortBy]);

  const targetDeleteTask = tasks.find(t => t.id === deleteTargetId);
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans pb-16">
      
      {/* Top Navbar */}
      <Header
        onOpenAddModal={() => { setEditingTask(null); setIsFormModalOpen(true); }}
        totalTasks={tasks.length}
        completedCount={completedCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Statistics Dashboard */}
        <StatsOverview tasks={tasks} />

        {/* Search, Filter & Sort Toolbar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          subjectFilter={subjectFilter}
          setSubjectFilter={setSubjectFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReset={handleResetFilters}
        />

        {/* Task Cards Grid / Empty State */}
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onDeleteRequest={(id) => setDeleteTargetId(id)}
          onEditRequest={(task) => { setEditingTask(task); setIsFormModalOpen(true); }}
          onOpenAddModal={() => { setEditingTask(null); setIsFormModalOpen(true); }}
        />

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} TaskCraft Student Manager • Crafted for productivity</p>
          <button
            onClick={handleResetDemoData}
            className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Tasks</span>
          </button>
        </div>
      </footer>

      {/* Toast Notification Floating Pill */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounceIn">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-md text-xs font-semibold ${
            toast.type === 'danger'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50'
              : toast.type === 'info'
              ? 'bg-indigo-950/90 text-indigo-200 border-indigo-500/40 shadow-indigo-950/50'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50'
          }`}>
            {toast.type === 'danger' ? (
              <Trash2 className="w-4 h-4 text-rose-400" />
            ) : toast.type === 'info' ? (
              <Sparkles className="w-4 h-4 text-indigo-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Add / Edit Task Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        taskTitle={targetDeleteTask ? targetDeleteTask.title : ''}
      />

    </div>
  );
}
