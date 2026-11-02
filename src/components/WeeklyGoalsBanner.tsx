import React from 'react';
import { CheckSquare, MoreHorizontal, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateGoalProgress } from '../services/calculations';

export const WeeklyGoalsBanner: React.FC = () => {
  const { goals, tasks, sessions, setActivePage } = useApp();

  // Weekly goals
  const weeklyGoals = goals.filter(g => g.period === 'semanal');

  // Calculate average percentage across weekly goals
  const goalProgresses = weeklyGoals.map(g => {
    return {
      goal: g,
      ...calculateGoalProgress(g, tasks, sessions),
    };
  });

  const averageWeeklyProgress =
    goalProgresses.length > 0
      ? Math.round(
          goalProgresses.reduce((acc, gp) => acc + gp.percentage, 0) /
            goalProgresses.length
        )
      : 65;

  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-[#0E1326] dark:bg-[#0E1326] text-white border border-[#1A233D] shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
      {/* Left Title Lockup */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <CheckSquare className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            METAS
          </div>
          <div className="text-sm font-extrabold uppercase tracking-tight text-white -mt-0.5">
            SEMANAIS
          </div>
        </div>
      </div>

      {/* Middle: Progress bars for weekly goals */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        {goalProgresses.slice(0, 3).map((gp, idx) => {
          // Palette
          const colors = ['#A3E635', '#FBBF24', '#38BDF8'];
          const barColor = colors[idx % colors.length];

          // Format target/current display
          const displayDetails =
            gp.goal.type === 'hours'
              ? `${Math.floor(gp.current)}h${Math.round((gp.current % 1) * 60)}min / ${Math.floor(gp.target)}h${Math.round((gp.target % 1) * 60)}min`
              : `${gp.current} / ${gp.target} concl.`;

          return (
            <div key={gp.goal.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 truncate pr-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: barColor }}
                  />
                  <span className="font-bold text-slate-200 truncate uppercase text-[11px]">
                    {gp.goal.title}
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-300 text-[11px] shrink-0">
                  {gp.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-[#1A233D] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${gp.percentage}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>

              <div className="text-[10px] font-mono text-slate-400">
                {displayDetails}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Big weekly percentage badge */}
      <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#1B2440]">
        <div className="text-left lg:text-right">
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#A3E635] tracking-tight tabular-nums leading-none">
            {averageWeeklyProgress}%
          </div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">
            Progresso semanal
          </div>
        </div>

        <button
          onClick={() => setActivePage('goals')}
          title="Ver todas as metas"
          className="p-2 rounded-xl bg-[#161F38] hover:bg-[#1E2A4D] text-slate-300 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
