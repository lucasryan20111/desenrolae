import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  Trophy,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    metrics,
    setIsTaskModalOpen,
    setIsSubjectModalOpen,
    setIsTimerModalOpen,
    setActivePage,
    auditLogs,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6 border-b border-slate-200 dark:border-[#1A233D] bg-white/70 dark:bg-[#0B0F1C]/70 backdrop-blur-md">
      {/* Greeting Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Seja bem-vindo, inicie seus estudos!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Acompanhe seu progresso nos estudos de forma simples e otimizada.
        </p>
      </div>

      {/* Action buttons & profile badge */}
      <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">
        {/* Quick Action: Nova Tarefa */}
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#090D1A] font-bold text-xs shadow-md shadow-cyan-500/10 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nova Tarefa</span>
        </button>

        {/* Quick Action: Nova Disciplina */}
        <button
          onClick={() => setIsSubjectModalOpen(true)}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-[#222E4D] hover:bg-slate-100 dark:hover:bg-[#151D36] text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Disciplina</span>
        </button>

        {/* Notification Bell with Popup */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            title="Notificações e Atividades Recentes"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D36] transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {auditLogs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-[#0B0F1C]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#131A33] border border-slate-200 dark:border-[#1E294B] shadow-2xl z-50 overflow-hidden text-xs">
              <div className="p-3 border-b border-slate-100 dark:border-[#1E294B] flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Histórico de Atividades
                </span>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-[#19223F]">
                {auditLogs.slice(0, 8).map(log => (
                  <div key={log.id} className="p-3 hover:bg-slate-50 dark:hover:bg-[#161F3D]">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {log.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {log.details}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Brain / Focus Mode shortcut */}
        <button
          onClick={() => setIsTimerModalOpen(true)}
          title="Iniciar Sessão de Foco / Pomodoro"
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151D36] transition-colors cursor-pointer"
        >
          <Clock className="w-4 h-4 text-purple-400" />
        </button>

        {/* Streak & Trophy shortcut */}
        <button
          onClick={() => setActivePage('achievements')}
          title="Ver Conquistas e Sequência"
          className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 transition-colors cursor-pointer"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold font-mono tabular-nums">
            {metrics.currentStreakDays}d
          </span>
        </button>

        {/* User profile card */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-[#1E294B]">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              DevCons.
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Desenvolvedor
            </div>
          </div>
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-300 dark:border-cyan-500/40 shadow-sm">
            <img
              src="/src/assets/images/avatar_user_profile_1793513257438.jpg"
              alt="Avatar do Desenvolvedor"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={e => {
                // Fallback avatar container
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
