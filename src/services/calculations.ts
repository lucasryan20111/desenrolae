import { Task, Subject, Goal, StudySession, DashboardMetrics } from '../types';

/**
 * Normalizes and clamps a progress percentage between 0 and 100.
 */
export function clampProgress(val: number): number {
  if (isNaN(val) || !isFinite(val)) return 0;
  return Math.min(100, Math.max(0, Math.round(val)));
}

/**
 * Returns the automatic status based on progress percentage:
 * - 0% -> 'nao_iniciada'
 * - 1% to 99% -> 'em_andamento'
 * - 100% -> 'concluida'
 */
export function getStatusFromProgress(progress: number): Task['status'] {
  const clamped = clampProgress(progress);
  if (clamped === 0) return 'nao_iniciada';
  if (clamped === 100) return 'concluida';
  return 'em_andamento';
}

/**
 * Calculates progress for a list of tasks.
 * Formula: Sum of progress of each task divided by count, or percentage of completed tasks.
 * As per rule 1: "O progresso de uma matéria deve ser calculado a partir das tarefas associadas."
 * Using average progress of tasks yields the most precise and granular representation (e.g. 50% on task 1 + 100% on task 2 / 2 = 75%).
 */
export function calculateTasksAverageProgress(tasks: Task[]): number {
  if (!tasks || tasks.length === 0) return 0;
  const total = tasks.reduce((acc, t) => acc + (typeof t.progress === 'number' ? t.progress : 0), 0);
  return clampProgress(total / tasks.length);
}

/**
 * Calculates individual subject progress from its associated tasks.
 */
export function calculateSubjectProgress(subjectId: string, tasks: Task[]): number {
  const subjectTasks = tasks.filter(t => t.subjectId === subjectId);
  return calculateTasksAverageProgress(subjectTasks);
}

/**
 * Determines if a task is overdue.
 * Rule: Has a due date, not completed, and due date is strictly before today's date (YYYY-MM-DD).
 */
export function isTaskOverdue(task: Task, todayIso: string = new Date().toISOString().split('T')[0]): boolean {
  if (!task.dueDate) return false;
  if (task.status === 'concluida' || task.progress >= 100) return false;
  return task.dueDate < todayIso;
}

/**
 * Determines if a task is due today.
 */
export function isTaskDueToday(task: Task, todayIso: string = new Date().toISOString().split('T')[0]): boolean {
  if (!task.dueDate) return false;
  if (task.status === 'concluida' || task.progress >= 100) return false;
  return task.dueDate === todayIso;
}

/**
 * Calculates the progress of a study goal.
 * Handles both time-based goals (hours from study sessions) and count-based goals (tasks/exercises).
 */
export function calculateGoalProgress(
  goal: Goal,
  tasks: Task[],
  studySessions: StudySession[]
): { current: number; target: number; percentage: number } {
  const target = Math.max(1, goal.targetValue || 1);
  let current = 0;

  if (goal.type === 'hours') {
    // Filter sessions matching period and optional subject
    const filteredSessions = studySessions.filter(s => {
      if (goal.subjectId && s.subjectId !== goal.subjectId) return false;
      if (goal.startDate && s.date < goal.startDate) return false;
      if (goal.dueDate && s.date > goal.dueDate) return false;
      return true;
    });
    const totalMinutes = filteredSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    // Convert to hours with 1 decimal place
    current = Math.round((totalMinutes / 60) * 10) / 10;
  } else {
    // Tasks or exercises completed within goal bounds
    const filteredTasks = tasks.filter(t => {
      if (goal.subjectId && t.subjectId !== goal.subjectId) return false;
      if (t.status !== 'concluida') return false;
      if (t.completedAt) {
        const completedDate = t.completedAt.split('T')[0];
        if (goal.startDate && completedDate < goal.startDate) return false;
        if (goal.dueDate && completedDate > goal.dueDate) return false;
      }
      return true;
    });
    current = filteredTasks.length;
  }

  const percentage = clampProgress((current / target) * 100);
  return { current, target, percentage };
}

/**
 * Calculates consecutive study days (streak).
 * Counts distinct dates with either a completed task or a study session.
 */
export function calculateStudyStreak(
  tasks: Task[],
  sessions: StudySession[],
  todayIso: string = new Date().toISOString().split('T')[0]
): number {
  const activityDates = new Set<string>();

  tasks.forEach(t => {
    if (t.completedAt) {
      activityDates.add(t.completedAt.split('T')[0]);
    }
  });

  sessions.forEach(s => {
    if (s.date) {
      activityDates.add(s.date);
    }
  });

  if (activityDates.size === 0) return 0;

  let streak = 0;
  const cur = new Date(todayIso + 'T00:00:00');

  // If today has activity, count from today; if not, check if yesterday had activity
  const todayStr = cur.toISOString().split('T')[0];
  const yesterday = new Date(cur);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let checkDate = cur;
  if (!activityDates.has(todayStr)) {
    if (!activityDates.has(yesterdayStr)) {
      return 0; // Streak broken
    }
    checkDate = yesterday;
  }

  while (true) {
    const dStr = checkDate.toISOString().split('T')[0];
    if (activityDates.has(dStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Centralized dashboard metrics calculation.
 */
export function calculateDashboardMetrics(
  tasks: Task[],
  goals: Goal[],
  sessions: StudySession[],
  todayIso: string = new Date().toISOString().split('T')[0]
): DashboardMetrics {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'concluida' || t.progress >= 100).length;
  const pendingTasks = tasks.filter(t => t.status !== 'concluida' && t.progress < 100).length;
  const overdueTasks = tasks.filter(t => isTaskOverdue(t, todayIso)).length;
  const activeGoals = goals.filter(g => g.status === 'em_andamento').length;

  const overallProgress = calculateTasksAverageProgress(tasks);

  // Total studied minutes from sessions + recorded task times
  const sessionMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const taskMinutes = tasks.reduce((acc, t) => acc + (t.studiedMinutes || 0), 0);
  const totalStudiedMinutes = Math.max(sessionMinutes, taskMinutes);

  const currentStreakDays = calculateStudyStreak(tasks, sessions, todayIso);

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    activeGoals,
    overallProgress,
    totalStudiedMinutes,
    currentStreakDays,
  };
}

/**
 * Formats minutes into human-readable Portuguese time: e.g. "12h 45min" or "40min".
 */
export function formatMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
