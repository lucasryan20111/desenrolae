import React from 'react';
import { BookOpen, Plus, Clock, ListTodo, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateSubjectProgress, formatMinutes } from '../services/calculations';

export const SubjectsPage: React.FC = () => {
  const {
    subjects,
    tasks,
    sessions,
    setSelectedSubjectId,
    setActivePage,
    setIsSubjectModalOpen,
  } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-5 bg-[#0E1326] text-white border border-[#1A233D] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold">Minhas Disciplinas & Matérias</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize temas, subtópicos, tarefas associadas e acompanhe a taxa de conclusão individual de cada matéria.
          </p>
        </div>

        <button
          onClick={() => setIsSubjectModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#090D1A] font-bold text-xs shadow-md shadow-cyan-500/15 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nova Disciplina</span>
        </button>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map(subject => {
          const subTasks = tasks.filter(t => t.subjectId === subject.id);
          const progress = calculateSubjectProgress(subject.id, tasks);
          const completedCount = subTasks.filter(t => t.status === 'concluida' || t.progress >= 100).length;

          const sessionMins = sessions
            .filter(s => s.subjectId === subject.id)
            .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
          const taskMins = subTasks.reduce((acc, t) => acc + (t.studiedMinutes || 0), 0);
          const totalMins = Math.max(sessionMins, taskMins);

          return (
            <div
              key={subject.id}
              onClick={() => {
                setSelectedSubjectId(subject.id);
                setActivePage('subject_detail');
              }}
              className="p-5 rounded-2xl bg-[#0E1326] text-white border border-[#1A233D] hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-sm"
                      style={{ backgroundColor: subject.color || '#38BDF8' }}
                    />
                    <h3 className="text-sm font-bold uppercase tracking-wide group-hover:text-cyan-400 transition-colors">
                      {subject.name}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>

                {subject.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {subject.description}
                  </p>
                )}

                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-3 pt-3 border-t border-[#18213D]">
                  <span className="flex items-center gap-1 font-mono">
                    <ListTodo className="w-3 h-3 text-cyan-400" />
                    {completedCount}/{subTasks.length} tarefas
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {formatMinutes(totalMins)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-slate-400">Progresso</span>
                  <span className="text-[#A3E635]">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18213D] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: subject.color || '#A3E635',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
