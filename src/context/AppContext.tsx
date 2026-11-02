import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Subject,
  Task,
  Goal,
  StudySession,
  Achievement,
  AuditLog,
  DashboardMetrics,
} from '../types';
import { storageService, AppDatabaseState } from '../services/storage';
import {
  calculateDashboardMetrics,
  calculateTasksAverageProgress,
  getStatusFromProgress,
} from '../services/calculations';
import { checkAchievements } from '../services/achievements';

export type PageId =
  | 'dashboard'
  | 'pending'
  | 'subjects'
  | 'subject_detail'
  | 'goals'
  | 'timer'
  | 'achievements'
  | 'backup';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  // Navigation & UI state
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Data Collections
  subjects: Subject[];
  tasks: Task[];
  goals: Goal[];
  sessions: StudySession[];
  achievements: Achievement[];
  auditLogs: AuditLog[];
  metrics: DashboardMetrics;
  isLoading: boolean;

  // CRUD Operations - Tasks
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  updateTaskProgress: (taskId: string, newProgress: number) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;

  // CRUD Operations - Subjects
  createSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSubject: (subject: Subject) => Promise<void>;
  deleteSubject: (subjectId: string) => Promise<void>;
  addTopicToSubject: (subjectId: string, topicName: string) => Promise<void>;

  // CRUD Operations - Goals
  createGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;

  // Study Sessions (Focus / Timer)
  logStudySession: (session: Omit<StudySession, 'id'>) => Promise<void>;

  // Backup & Restore
  exportBackupJson: () => string;
  importBackupJson: (rawJson: string) => Promise<boolean>;
  exportTasksCsv: () => string;
  resetToDefaults: () => Promise<void>;

  // Modals state
  isTimerModalOpen: boolean;
  setIsTimerModalOpen: (open: boolean) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  isSubjectModalOpen: boolean;
  setIsSubjectModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  editingSubject: Subject | null;
  setEditingSubject: (subject: Subject | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Core Data
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync theme with HTML class
  useEffect(() => {
    const savedTheme = localStorage.getItem('desenrolae_theme');
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('desenrolae_theme', next ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  };

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await storageService.getInitialData();
        setSubjects(data.subjects);
        setTasks(data.tasks);
        setGoals(data.goals);
        setSessions(data.sessions);
        setAchievements(data.achievements);
        setAuditLogs(data.auditLogs);
      } catch (e) {
        console.error('Failed to load storage data:', e);
        addToast('Erro ao carregar dados do armazenamento', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute metrics
  const metrics = useMemo(() => {
    return calculateDashboardMetrics(tasks, goals, sessions);
  }, [tasks, goals, sessions]);

  // Persist state updates and run achievement checks
  const persistState = async (
    newSubs: Subject[],
    newTasks: Task[],
    newGoals: Goal[],
    newSess: StudySession[],
    newLogs: AuditLog[],
    newAchs: Achievement[]
  ) => {
    // Run achievements check
    const currentStreak = calculateDashboardMetrics(newTasks, newGoals, newSess).currentStreakDays;
    const { updatedList, newlyUnlocked, newLogs: achLogs } = checkAchievements(
      newAchs,
      newTasks,
      newGoals,
      newSubs,
      newSess,
      currentStreak
    );

    const mergedLogs = [...achLogs, ...newLogs].slice(0, 100);

    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(ach => {
        addToast(`🏆 Conquista Desbloqueada: ${ach.title}!`, 'info');
      });
      // Fire subtle celebratory confetti!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#A3E635', '#38BDF8', '#8B5CF6', '#F59E0B'],
        });
      } catch (err) {
        // ignore if confetti fails
      }
    }

    setSubjects(newSubs);
    setTasks(newTasks);
    setGoals(newGoals);
    setSessions(newSess);
    setAchievements(updatedList);
    setAuditLogs(mergedLogs);

    await storageService.saveAll({
      subjects: newSubs,
      tasks: newTasks,
      goals: newGoals,
      sessions: newSess,
      achievements: updatedList,
      auditLogs: mergedLogs,
    });
  };

  // Task actions
  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const isCompleted = taskData.progress >= 100;
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status: isCompleted ? 'concluida' : getStatusFromProgress(taskData.progress),
      completedAt: isCompleted ? now : null,
      createdAt: now,
      updatedAt: now,
    };

    const newLogs: AuditLog[] = [
      {
        id: `log_${Date.now()}`,
        type: 'task_created',
        title: `Nova Tarefa Criada: ${newTask.title}`,
        details: `Prioridade: ${newTask.priority} · Progresso: ${newTask.progress}%`,
        timestamp: now,
        entityId: newTask.id,
      },
    ];

    if (isCompleted) {
      newLogs.push({
        id: `log_${Date.now()}_comp`,
        type: 'task_completed',
        title: `Tarefa Concluída: ${newTask.title}`,
        details: 'Marcada como 100% concluída na criação.',
        timestamp: now,
        entityId: newTask.id,
      });
    }

    const updatedTasks = [newTask, ...tasks];
    await persistState(subjects, updatedTasks, goals, sessions, newLogs, achievements);
    addToast('Tarefa criada com sucesso!');
  };

  const updateTask = async (updatedTask: Task) => {
    const now = new Date().toISOString();
    const oldTask = tasks.find(t => t.id === updatedTask.id);
    const wasCompleted = oldTask && (oldTask.status === 'concluida' || oldTask.progress >= 100);
    const isCompleted = updatedTask.progress >= 100;

    const taskToSave: Task = {
      ...updatedTask,
      status: isCompleted ? 'concluida' : getStatusFromProgress(updatedTask.progress),
      completedAt: isCompleted ? (oldTask?.completedAt || now) : null,
      updatedAt: now,
    };

    const newLogs: AuditLog[] = [];
    if (!wasCompleted && isCompleted) {
      newLogs.push({
        id: `log_${Date.now()}_comp`,
        type: 'task_completed',
        title: `Tarefa Concluída: ${taskToSave.title}`,
        details: 'Progresso atingiu 100%.',
        timestamp: now,
        entityId: taskToSave.id,
      });
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } else if (wasCompleted && !isCompleted) {
      newLogs.push({
        id: `log_${Date.now()}_reopen`,
        type: 'task_reopened',
        title: `Tarefa Reaberta: ${taskToSave.title}`,
        details: `Progresso reajustado para ${taskToSave.progress}%.`,
        timestamp: now,
        entityId: taskToSave.id,
      });
    }

    const updatedTasks = tasks.map(t => (t.id === taskToSave.id ? taskToSave : t));
    await persistState(subjects, updatedTasks, goals, sessions, newLogs, achievements);
    addToast('Tarefa atualizada com sucesso!');
  };

  const updateTaskProgress = async (taskId: string, newProgress: number) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    await updateTask({
      ...target,
      progress: Math.min(100, Math.max(0, newProgress)),
    });
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const isCurrentlyDone = target.status === 'concluida' || target.progress >= 100;
    const nextProgress = isCurrentlyDone ? 0 : 100;
    await updateTask({
      ...target,
      progress: nextProgress,
    });
  };

  const deleteTask = async (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const now = new Date().toISOString();
    const newLogs: AuditLog[] = [
      {
        id: `log_${Date.now()}`,
        type: 'task_deleted',
        title: `Tarefa Excluída: ${target.title}`,
        details: `Removida do painel de estudos.`,
        timestamp: now,
      },
    ];
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    await persistState(subjects, updatedTasks, goals, sessions, newLogs, achievements);
    addToast('Tarefa excluída com sucesso.', 'info');
  };

  // Subject actions
  const createSubject = async (subData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newSub: Subject = {
      ...subData,
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    const newLogs: AuditLog[] = [
      {
        id: `log_${Date.now()}`,
        type: 'subject_created',
        title: `Nova Disciplina: ${newSub.name}`,
        details: newSub.description || 'Cadastrada na plataforma',
        timestamp: now,
        entityId: newSub.id,
      },
    ];
    const updatedSubs = [...subjects, newSub];
    await persistState(updatedSubs, tasks, goals, sessions, newLogs, achievements);
    addToast('Disciplina criada com sucesso!');
  };

  const updateSubject = async (updatedSub: Subject) => {
    const now = new Date().toISOString();
    const subToSave = { ...updatedSub, updatedAt: now };
    const updatedSubs = subjects.map(s => (s.id === subToSave.id ? subToSave : s));
    await persistState(updatedSubs, tasks, goals, sessions, [], achievements);
    addToast('Disciplina atualizada com sucesso!');
  };

  const deleteSubject = async (subjectId: string) => {
    const sub = subjects.find(s => s.id === subjectId);
    if (!sub) return;
    const updatedSubs = subjects.filter(s => s.id !== subjectId);
    // Also remove or detach tasks from this subject
    const updatedTasks = tasks.filter(t => t.subjectId !== subjectId);
    await persistState(updatedSubs, updatedTasks, goals, sessions, [], achievements);
    if (selectedSubjectId === subjectId) {
      setSelectedSubjectId(null);
      setActivePage('subjects');
    }
    addToast(`Disciplina "${sub.name}" excluída.`, 'info');
  };

  const addTopicToSubject = async (subjectId: string, topicName: string) => {
    const target = subjects.find(s => s.id === subjectId);
    if (!target) return;
    const newTopic = {
      id: `top_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      subjectId,
      name: topicName,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedSub = {
      ...target,
      topics: [...(target.topics || []), newTopic],
    };
    await updateSubject(updatedSub);
  };

  // Goals
  const createGoal = async (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updatedGoals = [...goals, newGoal];
    await persistState(subjects, tasks, updatedGoals, sessions, [], achievements);
    addToast('Meta de estudo planejada com sucesso!');
  };

  const updateGoal = async (updatedGoal: Goal) => {
    const updatedGoals = goals.map(g => (g.id === updatedGoal.id ? updatedGoal : g));
    await persistState(subjects, tasks, updatedGoals, sessions, [], achievements);
    addToast('Meta atualizada.');
  };

  const deleteGoal = async (goalId: string) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    await persistState(subjects, tasks, updatedGoals, sessions, [], achievements);
    addToast('Meta removida.', 'info');
  };

  // Study Sessions
  const logStudySession = async (sessionData: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const sub = subjects.find(s => s.id === newSession.subjectId);
    const subName = sub ? sub.name : 'Geral';
    const now = new Date().toISOString();

    const newLogs: AuditLog[] = [
      {
        id: `log_${Date.now()}`,
        type: 'session_logged',
        title: `Sessão de Foco: ${newSession.durationMinutes} min`,
        details: `Dedicado a ${subName} (${newSession.type})`,
        timestamp: now,
        entityId: newSession.id,
      },
    ];

    // If session is tied to a task, update task's studiedMinutes!
    let updatedTasks = tasks;
    if (newSession.taskId) {
      updatedTasks = tasks.map(t => {
        if (t.id === newSession.taskId) {
          return {
            ...t,
            studiedMinutes: (t.studiedMinutes || 0) + newSession.durationMinutes,
            updatedAt: now,
          };
        }
        return t;
      });
    }

    const updatedSessions = [newSession, ...sessions];
    await persistState(subjects, updatedTasks, goals, updatedSessions, newLogs, achievements);
    addToast(`Sessão de ${newSession.durationMinutes} min registrada!`);
  };

  // Backup & Import
  const exportBackupJson = () => {
    return storageService.exportBackupJson({
      subjects,
      tasks,
      goals,
      sessions,
      achievements,
      auditLogs,
    });
  };

  const importBackupJson = async (rawJson: string): Promise<boolean> => {
    try {
      const state = storageService.validateAndImportBackup(rawJson);
      const now = new Date().toISOString();
      const newLogs: AuditLog[] = [
        {
          id: `log_${Date.now()}`,
          type: 'backup_restored',
          title: 'Backup Restaurado com Sucesso',
          details: `${state.tasks.length} tarefas, ${state.subjects.length} disciplinas carregadas.`,
          timestamp: now,
        },
      ];
      state.auditLogs = [...newLogs, ...state.auditLogs];
      await persistState(
        state.subjects,
        state.tasks,
        state.goals,
        state.sessions,
        state.auditLogs,
        state.achievements
      );
      addToast('Backup restaurado com sucesso!');
      return true;
    } catch (e: any) {
      console.error(e);
      addToast(e.message || 'Erro ao importar backup.', 'error');
      return false;
    }
  };

  const exportTasksCsv = () => {
    return storageService.exportTasksCsv(tasks, subjects);
  };

  const resetToDefaults = async () => {
    localStorage.removeItem('desenrolae_app_state_v1');
    const defaultData = await storageService.getInitialData();
    await persistState(
      defaultData.subjects,
      defaultData.tasks,
      defaultData.goals,
      defaultData.sessions,
      defaultData.auditLogs,
      defaultData.achievements
    );
    addToast('Dados restaurados para o padrão.');
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedSubjectId,
        setSelectedSubjectId,
        isDarkMode,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        subjects,
        tasks,
        goals,
        sessions,
        achievements,
        auditLogs,
        metrics,
        isLoading,
        createTask,
        updateTask,
        updateTaskProgress,
        toggleTaskCompletion,
        deleteTask,
        createSubject,
        updateSubject,
        deleteSubject,
        addTopicToSubject,
        createGoal,
        updateGoal,
        deleteGoal,
        logStudySession,
        exportBackupJson,
        importBackupJson,
        exportTasksCsv,
        resetToDefaults,
        isTimerModalOpen,
        setIsTimerModalOpen,
        isTaskModalOpen,
        setIsTaskModalOpen,
        isSubjectModalOpen,
        setIsSubjectModalOpen,
        editingTask,
        setEditingTask,
        editingSubject,
        setEditingSubject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
