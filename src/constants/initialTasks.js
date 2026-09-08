export const CATEGORIES = {
  Assignment: { label: 'Assignment', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: 'FileText' },
  Exam: { label: 'Exam / Quiz', color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: 'AlertCircle' },
  Project: { label: 'Project', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: 'FolderGit2' },
  Lab: { label: 'Lab Work', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: 'FlaskConical' },
  Reading: { label: 'Reading', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: 'BookOpen' }
};

export const PRIORITIES = {
  high: { label: 'High Priority', badgeBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40', dotColor: 'bg-rose-500' },
  medium: { label: 'Medium Priority', badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', dotColor: 'bg-amber-500' },
  low: { label: 'Low Priority', badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', dotColor: 'bg-emerald-500' }
};

export const SUBJECTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Data Structures',
  'Software Engineering',
  'History',
  'Economics',
  'Other'
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Data Structures & Algorithms - Binary Tree Assignment',
    subject: 'Computer Science',
    category: 'Assignment',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
    description: 'Implement AVL Tree balancing algorithms and write benchmark tests for insertion & deletion performance.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'task-2',
    title: 'Calculus II Midterm Exam Preparation',
    subject: 'Mathematics',
    category: 'Exam',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], // 4 days from now
    description: 'Review Integration by Parts, Taylor Series expansions, and practice 15 problem sets from Chapter 7.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'task-3',
    title: 'Physics Lab: Pendulum Oscillations Report',
    subject: 'Physics',
    category: 'Lab',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0], // Tomorrow
    description: 'Plot experimental period length vs amplitude curves using Python Matplotlib and submit PDF report.',
    completed: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'task-4',
    title: 'Full Stack Web App Group Project Architecture',
    subject: 'Software Engineering',
    category: 'Project',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // 1 week
    description: 'Draft REST API endpoints schema, database ER diagram, and assign sprint deliverables to group members.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'task-5',
    title: 'Read Chapter 4: Macroeconomics Fiscal Policy',
    subject: 'Economics',
    category: 'Reading',
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    description: 'Summarize key concepts on interest rates and central bank reserve requirements.',
    completed: false,
    createdAt: new Date().toISOString()
  }
];
