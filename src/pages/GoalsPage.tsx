import React, { useState } from 'react';
import { Target, Plus, CheckCircle2, Clock, Calendar, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GoalModal } from '../components/GoalModal';
import { calculateGoalProgress } from '../services/calculations';
import { ConfirmModal } from '../components/ConfirmModal';
import { Goal } from '../types';

export const GoalsPage: React.FC = () => {
  const { goals, tasks, sessions, subjects, deleteGoal, updateGoal } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'diario' | 'semanal' | 'mensal'>('all');

  const filteredGoals = goals.filter(g => {
    if (filterPeriod !== 'all' && g.period !== filterPeriod) return false;
    return true;
  });

  const subjectMap = new Map(subjects.map(s => [s.id, s]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-5 bg-[#0E1326] text-white border border-[#1A233D] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold">Metas & Planejamento de Estudo</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Defina metas diárias, semanais e mensais baseadas em horas ou quantidade de tarefas e exercícios.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#090D1A] font-bold text-xs shadow-md shadow-cyan-500/15 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Period filter buttons */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: 'Todas as Metas' },
          { id: 'diario', label: 'Diárias' },
          { id: 'semanal', label: 'Semanais' },
          { id: 'mensal', label: 'Mensais' },
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setFilterPeriod(p.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterPeriod === p.id
                ? 'bg-cyan-500 text-[#090D1A]'
                : 'bg-[#0E1326] text-slate-300 hover:bg-[#161F38] border border-[#1A233D]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGoals.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-[#0E1326] border border-[#1A233D] text-slate-400">
            Nenhuma meta cadastrada neste período. Clique em "Nova Meta" para planejar.
          </div>
        ) : (
          filteredGoals.map(goal => {
            const progressInfo = calculateGoalProgress(goal, tasks, sessions);
            const isCompleted = progressInfo.percentage >= 100 || goal.status === 'concluida';
            const sub = goal.subjectId ? subjectMap.get(goal.subjectId) : null;

            return (
              <div
                key={goal.id}
                className={`p-5 rounded-2xl bg-[#0E1326] text-white border transition-all flex flex-col justify-between space-y-4 shadow-lg ${
                  isCompleted ? 'border-emerald-500/40 bg-[#0E182A]' : 'border-[#1A233D]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#161F38] text-cyan-400 font-mono">
                      {goal.period}
                    </span>
                    <button
                      onClick={() => setGoalToDelete(goal)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {goal.title}
                  </h4>

                  {goal.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  {sub && (
                    <div className="mt-2 text-[11px] font-bold flex items-center gap-1.5" style={{ color: sub.color || '#38BDF8' }}>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color || '#38BDF8' }} />
                      {sub.name}
                    </div>
                  )}
                </div>

                {/* Progress bar & details */}
                <div className="space-y-2 pt-2 border-t border-[#18213D]">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-slate-400">
                      {goal.type === 'hours'
                        ? `${progressInfo.current}h de ${progressInfo.target}h`
                        : `${progressInfo.current} de ${progressInfo.target} itens`}
                    </span>
                    <span className={isCompleted ? 'text-[#A3E635]' : 'text-cyan-400'}>
                      {progressInfo.percentage}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#18213D] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressInfo.percentage}%`,
                        backgroundColor: isCompleted ? '#A3E635' : '#38BDF8',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>Prazo: {goal.dueDate ? new Date(goal.dueDate + 'T00:00:00').toLocaleDateString() : 'Sem prazo'}</span>
                    {isCompleted ? (
                      <span className="text-[#A3E635] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Concluída!
                      </span>
                    ) : (
                      <span>Em andamento</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <GoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {goalToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Excluir Meta de Estudo"
          message={`Tem certeza que deseja excluir a meta "${goalToDelete.title}"?`}
          onConfirm={() => {
            deleteGoal(goalToDelete.id);
            setGoalToDelete(null);
          }}
          onCancel={() => setGoalToDelete(null)}
        />
      )}
    </div>
  );
};
