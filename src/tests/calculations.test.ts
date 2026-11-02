import {
  clampProgress,
  getStatusFromProgress,
  calculateTasksAverageProgress,
  calculateSubjectProgress,
  isTaskOverdue,
  isTaskDueToday,
  calculateGoalProgress,
  calculateStudyStreak,
  calculateDashboardMetrics,
  formatMinutes,
} from '../services/calculations';
import { Task, Goal, StudySession, Subject } from '../types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
  console.log(`✓ PASS: ${message}`);
}

console.log('\n--- EXECUTING BUSINESS LOGIC TESTS FOR DESENROLAE ---\n');

// 1. Clamp & Division by zero tests
assert(clampProgress(120) === 100, 'Clamps > 100% to 100%');
assert(clampProgress(-15) === 0, 'Clamps < 0% to 0%');
assert(clampProgress(NaN) === 0, 'Handles NaN gracefully (returns 0%)');
assert(clampProgress(Infinity) === 0, 'Handles Infinity without crashing');

// 2. Status from progress rules
assert(getStatusFromProgress(0) === 'nao_iniciada', '0% is nao_iniciada');
assert(getStatusFromProgress(50) === 'em_andamento', '50% is em_andamento');
assert(getStatusFromProgress(1) === 'em_andamento', '1% is em_andamento');
assert(getStatusFromProgress(99) === 'em_andamento', '99% is em_andamento');
assert(getStatusFromProgress(100) === 'concluida', '100% is concluida');

// 3. Average progress calculation
const sampleTasks: Task[] = [
  {
    id: 't1',
    title: 'Task 1',
    subjectId: 'sub1',
    startDate: '2026-10-01',
    dueDate: '2026-10-10',
    priority: 'alta',
    status: 'concluida',
    progress: 100,
    estimatedMinutes: 60,
    studiedMinutes: 60,
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
  {
    id: 't2',
    title: 'Task 2',
    subjectId: 'sub1',
    startDate: '2026-10-01',
    dueDate: '2026-10-15',
    priority: 'media',
    status: 'em_andamento',
    progress: 50,
    estimatedMinutes: 60,
    studiedMinutes: 30,
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
  {
    id: 't3',
    title: 'Task 3',
    subjectId: 'sub2',
    startDate: '2026-10-01',
    dueDate: '2026-10-20',
    priority: 'baixa',
    status: 'nao_iniciada',
    progress: 0,
    estimatedMinutes: 60,
    studiedMinutes: 0,
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  },
];

assert(calculateTasksAverageProgress(sampleTasks) === 50, 'Average of 100%, 50%, 0% is 50%');
assert(calculateTasksAverageProgress([]) === 0, 'Empty task list returns 0% (prevent division by zero)');

// 4. Subject individual progress
assert(calculateSubjectProgress('sub1', sampleTasks) === 75, 'Sub1 progress is 75% (100 + 50 / 2)');
assert(calculateSubjectProgress('sub2', sampleTasks) === 0, 'Sub2 progress is 0%');

// 5. Overdue and Due Today rules
const overdueTask = { ...sampleTasks[0], dueDate: '2026-10-01', status: 'em_andamento' as const, progress: 40 };
assert(isTaskOverdue(overdueTask, '2026-10-31') === true, 'Task due on Oct 1 is overdue on Oct 31');
assert(isTaskOverdue({ ...overdueTask, status: 'concluida' as const, progress: 100 }, '2026-10-31') === false, 'Completed task is not overdue');

const todayTask = { ...sampleTasks[0], dueDate: '2026-10-31', status: 'em_andamento' as const, progress: 20 };
assert(isTaskDueToday(todayTask, '2026-10-31') === true, 'Identifies task due today');

// 6. Goals calculation
const hourGoal: Goal = {
  id: 'g1',
  title: 'Estudar 2h de sub1',
  type: 'hours',
  period: 'semanal',
  targetValue: 2,
  currentValue: 0,
  subjectId: 'sub1',
  startDate: '2026-10-25',
  dueDate: '2026-10-31',
  status: 'em_andamento',
  createdAt: '2026-10-25',
};

const sessions: StudySession[] = [
  {
    id: 's1',
    subjectId: 'sub1',
    durationMinutes: 90, // 1.5h
    date: '2026-10-30',
    startedAt: '2026-10-30T10:00:00Z',
    endedAt: '2026-10-30T11:30:00Z',
    type: 'pomodoro',
  },
];

const goalRes = calculateGoalProgress(hourGoal, sampleTasks, sessions);
assert(goalRes.current === 1.5, 'Goal accumulated 1.5 hours');
assert(goalRes.percentage === 75, '1.5h out of 2h target is 75%');

// 7. Streak calculation
const streak = calculateStudyStreak(sampleTasks, sessions, '2026-10-31');
assert(typeof streak === 'number' && streak >= 0, 'Streak calculated as valid number');

// 8. Time formatting
assert(formatMinutes(45) === '45 min', 'Formats 45 minutes as "45 min"');
assert(formatMinutes(120) === '2h', 'Formats 120 minutes as "2h"');
assert(formatMinutes(150) === '2h 30min', 'Formats 150 minutes as "2h 30min"');

console.log('\n--- ALL BUSINESS LOGIC AND CONSISTENCY TESTS PASSED! ---\n');
