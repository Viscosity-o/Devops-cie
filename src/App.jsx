import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskFormModal from './components/TaskFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AuthPage from './components/AuthPage';
import { apiService } from './services/api';
import { INITIAL_TASKS } from './constants/initialTasks';
import { CheckCircle2, Trash2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'taskcraft_student_tasks_v1';
const JWT_TOKEN_KEY = 'taskcraft_jwt_token';

export default function App() {
  // Auth State
  const [token, setToken] = useState(() => localStorage.getItem(JWT_TOKEN_KEY) || '');
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Task State
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

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

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Verify Auth Session on Mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await apiService.getCurrentUser();
          if (userData) {
            setUser(userData);
          } else {
            // Token expired or invalid
            localStorage.removeItem(JWT_TOKEN_KEY);
            setToken('');
          }
        } catch (e) {
          console.error('Session restoration error:', e);
        }
      }
      setAuthLoading(false);
    };
    initAuth();
  }, [token]);

  // Load Tasks when authenticated or guest
  useEffect(() => {
    if (authLoading) return;

    if (token && user) {
      loadBackendTasks();
    } else if (isGuest) {
      loadLocalTasks();
    }
  }, [token, user, isGuest, authLoading]);

  const loadBackendTasks = async () => {
    setTasksLoading(true);
    try {
      const fetched = await apiService.getTasks();
      setTasks(fetched);
    } catch (err) {
      console.warn('Backend tasks failed to load, using local cache:', err);
      loadLocalTasks();
      showToast('Backend offline. Loaded cached tasks.', 'info');
    } finally {
      setTasksLoading(false);
    }
  };

  const loadLocalTasks = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setTasks(JSON.parse(saved));
        return;
      }
    } catch (e) {
      console.error('Failed to load local tasks', e);
    }
    setTasks(INITIAL_TASKS);
  };

  // Login handler called from AuthPage
  const handleLoginSuccess = async (credentials) => {
    try {
      const data = await apiService.login(credentials.username, credentials.password);
      localStorage.setItem(JWT_TOKEN_KEY, data.token);
      setToken(data.token);
      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
        fullName: data.fullName
      });
      setIsGuest(false);
      showToast(`Welcome back, ${data.fullName || data.username}!`, 'success');
    } catch (err) {
      throw err;
    }
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
    setUser({ username: 'guest_user', fullName: 'Demo Guest' });
    loadLocalTasks();
    showToast('Entered Demo Guest Mode', 'info');
  };

  const handleLogout = () => {
    localStorage.removeItem(JWT_TOKEN_KEY);
    setToken('');
    setUser(null);
    setIsGuest(false);
    showToast('Logged out successfully', 'info');
  };

  // Task Operations (Backend Sync with Local Fallback)
  const handleSaveTask = async (taskData) => {
    if (token && user) {
      try {
        if (editingTask) {
          const updated = await apiService.updateTask(taskData.id, taskData);
          setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
          showToast(`Task "${taskData.title}" updated!`);
        } else {
          const created = await apiService.createTask(taskData);
          setTasks(prev => [created, ...prev]);
          showToast(`Task "${taskData.title}" created successfully!`);
        }
      } catch (err) {
        showToast('Error saving task to server.', 'danger');
      }
    } else {
      // Local Guest Mode
      if (editingTask) {
        setTasks(prev => prev.map(t => t.id === taskData.id ? taskData : t));
        showToast(`Task "${taskData.title}" updated!`);
      } else {
        setTasks(prev => [taskData, ...prev]);
        showToast(`Task "${taskData.title}" added!`);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }
    setEditingTask(null);
  };

  const handleToggleComplete = async (id) => {
    const targetTask = tasks.find(t => t.id === id);
    if (!targetTask) return;

    const updatedTask = { ...targetTask, completed: !targetTask.completed };

    if (token && user) {
      try {
        const saved = await apiService.updateTask(id, updatedTask);
        setTasks(prev => prev.map(t => t.id === id ? saved : t));
        showToast(
          saved.completed ? `Completed "${saved.title}"! 🎉` : `Reopened "${saved.title}"`,
          saved.completed ? 'success' : 'info'
        );
      } catch (err) {
        showToast('Failed to update task completion.', 'danger');
      }
    } else {
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      showToast(
        updatedTask.completed ? `Completed "${updatedTask.title}"! 🎉` : `Reopened "${updatedTask.title}"`,
        updatedTask.completed ? 'success' : 'info'
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const targetTask = tasks.find(t => t.id === deleteTargetId);

    if (token && user) {
      try {
        await apiService.deleteTask(deleteTargetId);
        setTasks(prev => prev.filter(t => t.id !== deleteTargetId));
        showToast(`Deleted task "${targetTask?.title || ''}"`, 'danger');
      } catch (err) {
        showToast('Failed to delete task from server.', 'danger');
      }
    } else {
      setTasks(prev => prev.filter(t => t.id !== deleteTargetId));
      showToast(`Deleted task "${targetTask?.title || ''}"`, 'danger');
    }
    setDeleteTargetId(null);
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
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        (task.title && task.title.toLowerCase().includes(query)) ||
        (task.subject && task.subject.toLowerCase().includes(query)) ||
        (task.description && task.description.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (statusFilter === 'active' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;
      if (statusFilter === 'high' && (task.priority !== 'high' || task.completed)) return false;

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
        return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });
  }, [tasks, searchQuery, statusFilter, subjectFilter, sortBy]);

  // Loading Screen during Auth verification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-medium animate-pulse">Initializing TaskCraft Authentication...</p>
      </div>
    );
  }

  // Show Auth Page if not logged in
  if (!user && !isGuest) {
    return (
      <AuthPage 
        onLoginSuccess={handleLoginSuccess}
        onGuestLogin={handleGuestLogin}
      />
    );
  }

  const targetDeleteTask = tasks.find(t => t.id === deleteTargetId);
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans pb-16">
      
      {/* Top Navbar */}
      <Header
        onOpenAddModal={() => { setEditingTask(null); setIsFormModalOpen(true); }}
        totalTasks={tasks.length}
        completedCount={completedCount}
        user={user}
        onLogout={handleLogout}
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

        {/* Task Loading Spinner or Task Grid */}
        {tasksLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Syncing tasks with Spring Boot PostgreSQL Database...</p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDeleteRequest={(id) => setDeleteTargetId(id)}
            onEditRequest={(task) => { setEditingTask(task); setIsFormModalOpen(true); }}
            onOpenAddModal={() => { setEditingTask(null); setIsFormModalOpen(true); }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} TaskCraft Student Manager • Powered by Spring Boot JWT & PostgreSQL</p>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {token ? 'Authenticated JWT Session' : 'Guest Demo Mode'}
            </span>
          </div>
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
