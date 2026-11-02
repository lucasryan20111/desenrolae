import React from 'react';
import {
  Trophy,
  ArrowUpDown,
  Plus,
  Clock,
  Calendar,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  calculateSubjectProgress,
  formatMinutes,
} from '../services/calculations';

export const DisciplinesRankingTable: React.FC = () => {
  const {
    subjects,
    tasks,
    sessions,
    setSelectedSubjectId,
    setActivePage,
    setIsTaskModalOpen,
  } = useApp();

  // Compute stats per discipline
  const disciplinesData = subjects.map(sub => {
    const subTasks = tasks.filter(t => t.subjectId === sub.id);
    const progress = calculateSubjectProgress(sub.id, tasks);

    // Sum focus time
    const sessionMins = sessions
      .filter(s => s.subjectId === sub.id)
      .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const taskMins = subTasks.reduce((acc, t) => acc + (t.studiedMinutes || 0), 0);
    const totalMinutes = Math.max(sessionMins, taskMins);

    // Next due task
    const pendingTasks = subTasks
      .filter(t => t.status !== 'concluida' && t.dueDate)
      .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1));
    const nextDueDate = pendingTasks.length > 0 ? pendingTasks[0].dueDate : null;

    return {
      subject: sub,
      progress,
      tasksCount: subTasks.length,
      completedCount: subTasks.filter(t => t.status === 'concluida').length,
      totalMinutes,
      nextDueDate,
    };
  });

  // Sort by studied minutes / progress descending
  disciplinesData.sort((a, b) => b.totalMinutes - a.totalMinutes);

  const handleSelectSubject = (id: string) => {
    setSelectedSubjectId(id);
    setActivePage('subject_detail');
  };

  return (
    <div className="rounded-2xl bg-[#0E1326] dark:bg-[#0E1326] text-white border border-[#1A233D] shadow-lg overflow-hidden">
      {/* Table Header Bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#1A233D]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
            DISCIPLINAS — ranking
          </h2>
        </div>
        <div className="text-[11px] text-slate-400">
          Ordenado por dedicação e progresso
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#1A233D] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">DISCIPLINA</th>
              <th className="py-3 px-4 text-center">TEMPO DE FOCO</th>
              <th className="py-3 px-4 text-center">Nº TAREFAS</th>
              <th className="py-3 px-4 text-center">PRÓXIMO PRAZO</th>
              <th className="py-3 px-4 text-center">PROGRESSO</th>
              <th className="py-3 px-4 text-right">AÇÃO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#161D36]">
            {disciplinesData.map((item, index) => {
              const isTop = index === 0;

              return (
                <tr
                  key={item.subject.id}
                  className="hover:bg-[#141B33] transition-colors cursor-pointer group"
                  onClick={() => handleSelectSubject(item.subject.id)}
                >
                  {/* Subject Name & Indicator */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      {isTop ? (
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          <Trophy className="w-3 h-3" />
                        </div>
                      ) : (
                        <span className="w-5 text-center font-mono font-bold text-slate-500 text-[11px]">
                          {index + 1}
                        </span>
                      )}
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.subject.color || '#38BDF8' }}
                      />
                      <span className="font-bold text-white uppercase tracking-wide group-hover:text-cyan-400 transition-colors">
                        {item.subject.name}
                      </span>
                    </div>
                  </td>

                  {/* Tempo de Foco pill */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                      <Clock className="w-3 h-3" />
                      {formatMinutes(item.totalMinutes || 45)}
                    </span>
                  </td>

                  {/* Nº Tarefas */}
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-300">
                    {item.completedCount}/{item.tasksCount}
                  </td>

                  {/* Próximo Prazo */}
                  <td className="py-3.5 px-4 text-center font-mono text-slate-300 text-[11px]">
                    {item.nextDueDate ? (
                      <span className="inline-flex items-center gap-1 text-slate-300">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(item.nextDueDate + 'T00:00:00').toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  {/* Progresso com barra */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1 w-28 mx-auto">
                      <div className="flex items-center justify-between w-full text-[11px] font-mono font-bold">
                        <span className="text-slate-400">{item.tasksCount} itens</span>
                        <span className="text-[#A3E635]">{item.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#1B233D] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#A3E635] transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Ação rápida (+) */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setIsTaskModalOpen(true);
                      }}
                      title="Adicionar tarefa para esta matéria"
                      className="p-1.5 rounded-lg bg-[#1B2440] hover:bg-cyan-500 hover:text-[#090D1A] text-slate-300 transition-colors inline-flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
