import React from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  AlertCircle,
  Target,
  TrendingUp,
  ListTodo,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConsistencyCalendar } from '../components/ConsistencyCalendar';
import { MiniCalendar } from '../components/MiniCalendar';
import { BurnupChart } from '../components/BurnupChart';
import { WeeklyGoalsBanner } from '../components/WeeklyGoalsBanner';
import { DisciplinesRankingTable } from '../components/DisciplinesRankingTable';
import { formatMinutes } from '../services/calculations';

export const DashboardPage: React.FC = () => {
  const { metrics, tasks, setActivePage } = useApp();

  return (
    <div className="space-y-6">
      {/* 8 Primary KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Total Tarefas */}
        <div
          onClick={() => setActivePage('pending')}
          className="p-3 rounded-2xl bg-white dark:bg-[#0E1326] border border-slate-200 dark:border-[#1A233D] hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Total
            </span>
            <ListTodo className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
            {metrics.totalTasks}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            Cadastradas
          </div>
        </div>

        {/* Concluídas */}
        <div
          onClick={() => setActivePage('pending')}
          className="p-3 rounded-2xl bg-white dark:bg-[#0E1326] border border-slate-200 dark:border-[#1A233D] hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Concluídas
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold font-mono text-emerald-500 tabular-nums">
            {metrics.completedTasks}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            Finalizadas
          </div>
        </div>

        {/* Pendentes */}
        <div
          onClick={() => setActivePage('pending')}
          className="p-3 rounded-2xl bg-white dark:bg-[#0E1326] border border-slate-200 dark:border-[#1A233D] hover:border-amber-500/50 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Pendentes
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold font-mono text-amber-400 tabular-nums">
            {metrics.pendingTasks}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            A fazer
          </div>
        </div>

        {/* Atrasadas */}
        <div
          onClick={() => setActivePage('pending')}
          className="p-3 rounded-2xl bg-white dark:bg-[#0E1326] border border-slate-200 dark:border-[#1A233D] hover:border-rose-500/50 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
              Atrasadas
            </span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-extrabold font-mono text-rose-500 tabular-nums">
            {metrics.overdueTasks}
          </div>
          <div className="text-[10px] text-rose-400 truncate font-semibold">
            Requer atenção
          </div>
        </div>

        {/* Metas Ativas */}
        <div
          onClick={() => setActivePage('goals')}
          className="p-3 rounded-2xl bg-white dark:bg-[#0E1326] border border-slate-200 dark:border-[#1A233D] hover:border-purple-500/50 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Metas
            </span>
            <Target className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-extrabold font-mono text-purple-400 tabular-nums">
            {metrics.activeGoals}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            Em andamento
          </div>
        </div>

        {/* Progresso Geral */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#0E1326] border border-slate-200 dark:border-[#1A233D] shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Progresso
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-[#A3E635]" />
          </div>
          <div className="text-xl font-extrabold font-mono text-[#A3E635] tabular-nums">
            {metrics.overallProgress}%
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            Geral
          </div>
        </div>

        {/* Tempo Dedicado */}
        <div
          onClick={() => setActivePage('timer')}
          className="p-3 rounded-2xl bg-white dark:bg-[#0E1326] border border-slate-200 dark:border-[#1A233D] hover:border-cyan-400 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Dedicação
            </span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-base font-extrabold font-mono text-slate-900 dark:text-white tabular-nums leading-tight pt-1">
            {formatMinutes(metrics.totalStudiedMinutes)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            Horas de estudo
          </div>
        </div>

        {/* Sequência (Streak) */}
        <div
          onClick={() => setActivePage('achievements')}
          className="p-3 rounded-2xl bg-white dark:bg-[#0E1326] border border-slate-200 dark:border-[#1A233D] hover:border-amber-400 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
              Streak
            </span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold font-mono text-amber-500 tabular-nums">
            {metrics.currentStreakDays}d
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            Dias seguidos
          </div>
        </div>
      </div>

      {/* Top Banner: Calendário de Consistência */}
      <ConsistencyCalendar />

      {/* Middle Row Grid: Mini Calendário (Left) + Gráfico Burnup (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 h-full">
          <MiniCalendar />
        </div>
        <div className="lg:col-span-7 h-full">
          <BurnupChart />
        </div>
      </div>

      {/* Middle-Lower Row: METAS SEMANAIS */}
      <WeeklyGoalsBanner />

      {/* Bottom Table: DISCIPLINAS — ranking */}
      <DisciplinesRankingTable />
    </div>
  );
};
