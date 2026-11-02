import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Flame,
  Zap,
  Crown,
  CheckCircle2,
  Clock,
  Calendar,
  Lock,
  History,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Achievement } from '../types';

export const AchievementsPage: React.FC = () => {
  const { achievements, auditLogs, metrics } = useApp();
  const [tab, setTab] = useState<'conquistas' | 'historico'>('conquistas');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  const filteredAchievements = achievements.filter(a => {
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    return true;
  });

  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const className = `w-6 h-6 ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}`;
    switch (iconName) {
      case 'Flame':
        return <Flame className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl p-6 bg-[#0E1326] text-white border border-[#1A233D] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold">Conquistas & Histórico de Estudos</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Reconhecimento automático de marcos, sequência de consistência e auditoria de atividades.
          </p>
        </div>

        {/* Big Badge Stats */}
        <div className="flex items-center gap-6 self-start md:self-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-400 tabular-nums">
              {unlockedCount}/{achievements.length}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Medalhas Desbloqueadas</div>
          </div>

          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#A3E635] tabular-nums">
              {metrics.currentStreakDays}d
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Sequência Atual</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Conquistas vs Histórico */}
      <div className="flex items-center justify-between border-b border-[#1A233D] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('conquistas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'conquistas'
                ? 'bg-cyan-500 text-[#090D1A] shadow-md shadow-cyan-500/15'
                : 'text-slate-400 hover:text-white bg-[#0E1326]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Medalhas & Marcos ({unlockedCount})</span>
          </button>

          <button
            onClick={() => setTab('historico')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'historico'
                ? 'bg-cyan-500 text-[#090D1A] shadow-md shadow-cyan-500/15'
                : 'text-slate-400 hover:text-white bg-[#0E1326]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Histórico de Atividades ({auditLogs.length})</span>
          </button>
        </div>

        {tab === 'conquistas' && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['all', 'tarefas', 'metas', 'sequencia', 'materias', 'tempo'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#182242] text-white border border-[#222E54]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View: Conquistas */}
      {tab === 'conquistas' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAchievements.map(ach => {
            const isUnlocked = Boolean(ach.unlockedAt);

            return (
              <div
                key={ach.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isUnlocked
                    ? 'bg-[#0E152B] border-amber-500/30 shadow-lg shadow-amber-500/5'
                    : 'bg-[#0E1326]/60 border-[#1A233D] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-amber-500/10 border border-amber-500/30'
                        : 'bg-slate-800/40 border border-slate-700/40'
                    }`}
                  >
                    {isUnlocked ? (
                      getBadgeIcon(ach.icon, true)
                    ) : (
                      <Lock className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded font-mono text-slate-400 bg-[#141B33]">
                    {ach.badgeType}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#18213D] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  {isUnlocked ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Desbloqueada em {new Date(ach.unlockedAt!).toLocaleDateString()}
                    </span>
                  ) : (
                    <span>Bloqueada</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View: Histórico de Atividades */
        <div className="rounded-2xl bg-[#0E1326] text-white border border-[#1A233D] p-5 shadow-lg">
          <div className="divide-y divide-[#18213D]">
            {auditLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Nenhuma atividade registrada ainda.
              </div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-white">
                      {log.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {log.details}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 shrink-0 text-right">
                    <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                    <div>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
