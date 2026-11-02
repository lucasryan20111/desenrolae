import { Achievement, Task, Goal, StudySession, Subject, AuditLog } from '../types';
import { calculateSubjectProgress, calculateTasksAverageProgress } from './calculations';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_task',
    code: 'first_task',
    title: 'Primeiro Passo',
    description: 'Concluiu a sua primeira tarefa de estudos.',
    icon: 'CheckCircle2',
    badgeType: 'bronze',
    category: 'tarefas',
    unlockedAt: null,
    threshold: 1,
  },
  {
    id: 'ach_tasks_5',
    code: 'tasks_5',
    title: 'Ritmo Constante',
    description: 'Completou 5 tarefas com sucesso.',
    icon: 'Flame',
    badgeType: 'bronze',
    category: 'tarefas',
    unlockedAt: null,
    threshold: 5,
  },
  {
    id: 'ach_tasks_10',
    code: 'tasks_10',
    title: 'Dedicação Diária',
    description: 'Alcançou a marca de 10 tarefas concluídas.',
    icon: 'Award',
    badgeType: 'silver',
    category: 'tarefas',
    unlockedAt: null,
    threshold: 10,
  },
  {
    id: 'ach_tasks_25',
    code: 'tasks_25',
    title: 'Estudante Focado',
    description: 'Superou 25 tarefas finalizadas na plataforma.',
    icon: 'Trophy',
    badgeType: 'silver',
    category: 'tarefas',
    unlockedAt: null,
    threshold: 25,
  },
  {
    id: 'ach_tasks_50',
    code: 'tasks_50',
    title: 'Mestre da Execução',
    description: 'Completou 50 tarefas de estudo.',
    icon: 'Zap',
    badgeType: 'gold',
    category: 'tarefas',
    unlockedAt: null,
    threshold: 50,
  },
  {
    id: 'ach_tasks_100',
    code: 'tasks_100',
    title: 'Centurião do Saber',
    description: 'Atingiu a marca lendária de 100 tarefas concluídas!',
    icon: 'Crown',
    badgeType: 'platinum',
    category: 'tarefas',
    unlockedAt: null,
    threshold: 100,
  },
  {
    id: 'ach_first_goal',
    code: 'first_goal',
    title: 'Meta Batida',
    description: 'Concluiu sua primeira meta planejada.',
    icon: 'Target',
    badgeType: 'bronze',
    category: 'metas',
    unlockedAt: null,
    threshold: 1,
  },
  {
    id: 'ach_weekly_goal',
    code: 'weekly_goal',
    title: 'Foco Semanal',
    description: 'Alcançou uma meta com período semanal.',
    icon: 'CalendarCheck',
    badgeType: 'silver',
    category: 'metas',
    unlockedAt: null,
    threshold: 1,
  },
  {
    id: 'ach_streak_3',
    code: 'streak_3',
    title: 'Tríade do Hábito',
    description: 'Manteve 3 dias consecutivos de dedicação aos estudos.',
    icon: 'Flame',
    badgeType: 'bronze',
    category: 'sequencia',
    unlockedAt: null,
    threshold: 3,
  },
  {
    id: 'ach_streak_7',
    code: 'streak_7',
    title: 'Semana Imbatível',
    description: 'Completou 7 dias ininterruptos na sequência de estudos.',
    icon: 'Zap',
    badgeType: 'silver',
    category: 'sequencia',
    unlockedAt: null,
    threshold: 7,
  },
  {
    id: 'ach_streak_14',
    code: 'streak_14',
    title: 'Duas Semanas de Aço',
    description: 'Manteve 14 dias seguidos na rotina de aprendizado.',
    icon: 'ShieldCheck',
    badgeType: 'gold',
    category: 'sequencia',
    unlockedAt: null,
    threshold: 14,
  },
  {
    id: 'ach_streak_30',
    code: 'streak_30',
    title: 'Mestre da Disciplina',
    description: 'Alcançou incríveis 30 dias consecutivos de estudo!',
    icon: 'Crown',
    badgeType: 'platinum',
    category: 'sequencia',
    unlockedAt: null,
    threshold: 30,
  },
  {
    id: 'ach_subject_complete',
    code: 'subject_complete',
    title: 'Matéria Gabaritada',
    description: 'Concluiu 100% de todas as tarefas de uma matéria.',
    icon: 'BookCheck',
    badgeType: 'gold',
    category: 'materias',
    unlockedAt: null,
    threshold: 1,
  },
  {
    id: 'ach_study_hours_5',
    code: 'study_hours_5',
    title: 'Imersão Inicial',
    description: 'Acumulou mais de 5 horas de estudo registrado.',
    icon: 'Clock',
    badgeType: 'bronze',
    category: 'tempo',
    unlockedAt: null,
    threshold: 300, // minutes
  },
  {
    id: 'ach_study_hours_20',
    code: 'study_hours_20',
    title: 'Estudioso Dedicado',
    description: 'Acumulou mais de 20 horas de estudo registrado.',
    icon: 'Clock',
    badgeType: 'gold',
    category: 'tempo',
    unlockedAt: null,
    threshold: 1200, // minutes
  },
  {
    id: 'ach_progress_50',
    code: 'progress_50',
    title: 'Meio Caminho Andado',
    description: 'Atingiu 50% de progresso geral em suas tarefas.',
    icon: 'TrendingUp',
    badgeType: 'silver',
    category: 'materias',
    unlockedAt: null,
    threshold: 50,
  },
];

/**
 * Checks all criteria and returns newly unlocked achievements (preventing duplicates).
 */
export function checkAchievements(
  currentAchievements: Achievement[],
  tasks: Task[],
  goals: Goal[],
  subjects: Subject[],
  sessions: StudySession[],
  streakDays: number
): { updatedList: Achievement[]; newlyUnlocked: Achievement[]; newLogs: AuditLog[] } {
  const now = new Date().toISOString();
  const newlyUnlocked: Achievement[] = [];
  const newLogs: AuditLog[] = [];

  const completedTasksCount = tasks.filter(t => t.status === 'concluida' || t.progress >= 100).length;
  const completedGoals = goals.filter(g => g.status === 'concluida');
  const weeklyGoalsCompleted = completedGoals.filter(g => g.period === 'semanal').length;
  
  // Total study minutes from sessions and tasks
  const totalMinutes = Math.max(
    sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0),
    tasks.reduce((acc, t) => acc + (t.studiedMinutes || 0), 0)
  );

  // Overall progress
  const overallProgress = calculateTasksAverageProgress(tasks);

  // Any subject with at least 1 task and 100% progress
  const hasCompletedSubject = subjects.some(s => {
    const sTasks = tasks.filter(t => t.subjectId === s.id);
    return sTasks.length > 0 && calculateSubjectProgress(s.id, tasks) === 100;
  });

  const updatedList = currentAchievements.map(ach => {
    if (ach.unlockedAt) return ach; // Already unlocked

    let shouldUnlock = false;

    switch (ach.code) {
      case 'first_task':
        shouldUnlock = completedTasksCount >= 1;
        break;
      case 'tasks_5':
        shouldUnlock = completedTasksCount >= 5;
        break;
      case 'tasks_10':
        shouldUnlock = completedTasksCount >= 10;
        break;
      case 'tasks_25':
        shouldUnlock = completedTasksCount >= 25;
        break;
      case 'tasks_50':
        shouldUnlock = completedTasksCount >= 50;
        break;
      case 'tasks_100':
        shouldUnlock = completedTasksCount >= 100;
        break;
      case 'first_goal':
        shouldUnlock = completedGoals.length >= 1;
        break;
      case 'weekly_goal':
        shouldUnlock = weeklyGoalsCompleted >= 1;
        break;
      case 'streak_3':
        shouldUnlock = streakDays >= 3;
        break;
      case 'streak_7':
        shouldUnlock = streakDays >= 7;
        break;
      case 'streak_14':
        shouldUnlock = streakDays >= 14;
        break;
      case 'streak_30':
        shouldUnlock = streakDays >= 30;
        break;
      case 'subject_complete':
        shouldUnlock = hasCompletedSubject;
        break;
      case 'study_hours_5':
        shouldUnlock = totalMinutes >= 300;
        break;
      case 'study_hours_20':
        shouldUnlock = totalMinutes >= 1200;
        break;
      case 'progress_50':
        shouldUnlock = tasks.length >= 4 && overallProgress >= 50;
        break;
    }

    if (shouldUnlock) {
      const unlockedAch: Achievement = { ...ach, unlockedAt: now };
      newlyUnlocked.push(unlockedAch);
      newLogs.push({
        id: `log_${Date.now()}_${ach.code}`,
        type: 'goal_completed',
        title: `Conquista Desbloqueada: ${ach.title}`,
        details: ach.description,
        timestamp: now,
        entityId: ach.id,
      });
      return unlockedAch;
    }

    return ach;
  });

  return { updatedList, newlyUnlocked, newLogs };
}
