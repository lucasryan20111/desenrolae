export type Priority = 'baixa' | 'media' | 'alta';
export type TaskStatus = 'nao_iniciada' | 'em_andamento' | 'concluida';
export type GoalType = 'hours' | 'tasks' | 'exercises';
export type GoalPeriod = 'diario' | 'semanal' | 'mensal';

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  topics: Topic[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  topicId?: string;
  startDate: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD
  priority: Priority;
  status: TaskStatus;
  progress: number; // 0 to 100
  estimatedMinutes: number;
  studiedMinutes: number;
  notes?: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: GoalType;
  period: GoalPeriod;
  targetValue: number; // e.g., 5 (hours) or 10 (tasks/exercises)
  currentValue: number; // dynamic or accumulated
  subjectId?: string; // optional subject link
  startDate: string;
  dueDate: string;
  status: 'em_andamento' | 'concluida' | 'expirada';
  createdAt: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  taskId?: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  startedAt: string; // ISO
  endedAt: string; // ISO
  type: 'pomodoro' | 'cronometro' | 'manual';
  notes?: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  badgeType: 'bronze' | 'silver' | 'gold' | 'platinum';
  category: 'tarefas' | 'metas' | 'sequencia' | 'materias' | 'tempo';
  unlockedAt: string | null;
  threshold: number;
}

export interface AuditLog {
  id: string;
  type: 'task_created' | 'task_completed' | 'task_reopened' | 'task_updated' | 'task_deleted' | 'goal_completed' | 'subject_created' | 'session_logged' | 'backup_restored';
  title: string;
  details: string;
  timestamp: string;
  entityId?: string;
}

export interface DashboardMetrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  activeGoals: number;
  overallProgress: number; // 0 to 100
  totalStudiedMinutes: number;
  currentStreakDays: number;
}
