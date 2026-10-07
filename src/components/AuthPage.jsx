import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react';

export default function AuthPage({ onLoginSuccess, onGuestLogin }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  
  // Form Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // UI Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        if (!username.trim() || !password.trim()) {
          throw new Error('Please fill in both Username and Password.');
        }
        await onLoginSuccess({ username, password });
      } else {
        if (!username.trim() || !email.trim() || !password.trim()) {
          throw new Error('Please fill in all required fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        const response = await fetch('http://localhost:8081/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, fullName }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Registration failed.');
        }

        setSuccessMessage('Account created successfully! Logging you in...');
        setTimeout(async () => {
          await onLoginSuccess({ username, password });
        }, 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername('student1');
    setPassword('Password123!');
    if (activeTab === 'signup') {
      setEmail('student1@university.edu');
      setFullName('Alex Rivera');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Glassmorphic Card Container */}
      <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 z-10">
        
        {/* Left Hero & Branding Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-900/70 via-slate-900 to-purple-950/70 p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80 relative">
          <div>
            {/* App Badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  TaskCraft
                </h1>
                <p className="text-xs text-indigo-400 font-medium">Student Edition</p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold tracking-tight leading-snug text-white">
                Master Your Academic Workflow
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Securely manage homework, deadlines, and group projects with JWT-backed Spring Boot authentication.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Secure JWT Authentication</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span>PostgreSQL Database Storage</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span>Subject & Priority Management</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Spring Boot 3 + PostgreSQL</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Backend Active
            </span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          
          {/* Tab Navigation (Login / Sign Up) */}
          <div className="flex items-center p-1 bg-slate-950/70 border border-slate-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">
              {activeTab === 'login' ? 'Welcome Back!' : 'Create an Account'}
            </h3>
            <p className="text-xs text-slate-400">
              {activeTab === 'login'
                ? 'Enter your credentials to access your student dashboard.'
                : 'Register with your email to start managing tasks seamlessly.'}
            </p>
          </div>

          {/* Alert Notification Messages */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            {/* Full Name field (Only on Sign Up) */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name <span className="text-slate-500">(Optional)</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Username field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="student1"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Email field (Only on Sign Up) */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student1@university.edu"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Password field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Actions & Demo Autofill */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-fill Demo Credentials</span>
              </button>

              {onGuestLogin && (
                <button
                  type="button"
                  onClick={onGuestLogin}
                  className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  Continue as Demo Guest
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{activeTab === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
