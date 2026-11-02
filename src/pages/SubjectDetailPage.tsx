import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateSubjectProgress, formatMinutes, isTaskOverdue, isTaskDueToday } from '../services/calculations';
import { ConfirmModal } from '../components/ConfirmModal';
import { Task } from '../types';

export const SubjectDetailPage: React.FC = () => {
  const {
    selectedSubjectId,
    subjects,
    tasks,
    setActivePage,
    setSelectedSubjectId,
    addTopicToSubject,
    setEditingSubject,
    setIsSubjectModalOpen,
    deleteSubject,
    setIsTaskModalOpen,
    setEditingTask,
    deleteTask,
    toggleTaskCompletion,
    updateTaskProgress,
  } = useApp();

  const [newTopicName, setNewTopicName] = useState('');
  const [isDeletingSubject, setIsDeletingSubject] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const subject = subjects.find(s => s.id === selectedSubjectId);

  if (!subject) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Disciplina não encontrada.</p>
        <button
          onClick={() => setActivePage('dashboard')}
          className="mt-3 px-4 py-2 rounded-xl bg-cyan-500 text-slate-900 font-bold text-xs"
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
  const progress = calculateSubjectProgress(subject.id, tasks);
  const completedTasks = subjectTasks.filter(t => t.status === 'concluida' || t.progress >= 100);
  const totalMinutes = subjectTasks.reduce((acc, t) => acc + (t.studiedMinutes || 0), 0);
  const todayIso = new Date().toISOString().split('T')[0];

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    await addTopicToSubject(subject.id, newTopicName.trim());
    setNewTopicName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setSelectedSubjectId(null);
            setActivePage('dashboard');
          }}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Painel</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingSubject(subject);
              setIsSubjectModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-300 hover:text-white text-xs font-semibold"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editar Matéria</span>
          </button>
          <button
            onClick={() => setIsDeletingSubject(true)}
            className="p-2 rounded-xl bg-[#151D36] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-[#1E294B] transition-colors"
            title="Excluir Matéria"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subject Hero Header */}
      <div className="p-6 rounded-2xl bg-[#0E1326] text-white border border-[#1A233D] shadow-lg relative overflow-hidden">
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: subject.color || '#38BDF8' }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span
                className="w-4 h-4 rounded-full shadow-md"
                style={{ backgroundColor: subject.color || '#38BDF8' }}
              />
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                DISCIPLINA CADASTRADA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              {subject.name}
            </h1>
            {subject.description && (
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {subject.description}
              </p>
            )}
          </div>

          {/* Stats Cluster */}
          <div className="flex items-center gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#1B233D]">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#A3E635] tabular-nums">
                {progress}%
              </div>
              <div className="text-[11px] text-slate-400">Progresso</div>
            </div>

            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white tabular-nums">
                {completedTasks.length}/{subjectTasks.length}
              </div>
              <div className="text-[11px] text-slate-400">Tarefas Concluídas</div>
            </div>

            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-400 tabular-nums">
                {formatMinutes(totalMinutes)}
              </div>
              <div className="text-[11px] text-slate-400">Tempo de Foco</div>
            </div>
          </div>
        </div>

        {/* Global Subject Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#18213D] overflow-hidden mt-6">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: subject.color || '#A3E635',
            }}
          />
        </div>
      </div>

      {/* 2-Column: Topics (Temas) on left + Tasks on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Topics List Card */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0E1326] text-white border border-[#1A233D] p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A233D]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Temas & Subtópicos ({subject.topics?.length || 0})
            </h3>
          </div>

          {/* Add topic input */}
          <form onSubmit={handleAddTopic} className="flex gap-2">
            <input
              type="text"
              value={newTopicName}
              onChange={e => setNewTopicName(e.target.value)}
              placeholder="Novo tema ou subtópico..."
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#141B33] border border-[#1E294B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-cyan-500 text-[#090D1A] hover:bg-cyan-400 transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Topics List */}
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {(!subject.topics || subject.topics.length === 0) ? (
              <div className="text-xs text-slate-500 py-4 text-center">
                Nenhum subtópico adicionado ainda.
              </div>
            ) : (
              subject.topics.map(topic => {
                const topicTasks = subjectTasks.filter(t => t.topicId === topic.id);
                return (
                  <div
                    key={topic.id}
                    className="p-2.5 rounded-xl bg-[#141B33] border border-[#1C2542] flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-200">{topic.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {topicTasks.length} tarefas
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Tasks for this subject */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0E1326] text-white border border-[#1A233D] p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A233D]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Tarefas da Disciplina ({subjectTasks.length})
            </h3>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#090D1A] font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Adicionar Tarefa</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {subjectTasks.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                Nenhuma tarefa associada a esta matéria ainda.
              </div>
            ) : (
              subjectTasks.map(task => {
                const isOverdue = isTaskOverdue(task, todayIso);
                const isToday = isTaskDueToday(task, todayIso);
                const isDone = task.status === 'concluida' || task.progress >= 100;

                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-[#141B33] border border-[#1E294B] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5 flex-1">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`mt-0.5 w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 ${
                          isDone
                            ? 'bg-[#A3E635] border-[#A3E635] text-[#0A0E1C]'
                            : 'border-slate-500 hover:border-cyan-400 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              isDone ? 'line-through text-slate-500' : 'text-white'
                            }`}
                          >
                            {task.title}
                          </span>
                          {isOverdue && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500 text-white">
                              Atrasada
                            </span>
                          )}
                          {isToday && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                              Hoje
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                          {task.dueDate && <span>Prazo: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString()}</span>}
                          <span>Prioridade: {task.priority}</span>
                          <span>Foco: {formatMinutes(task.studiedMinutes)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Slider & Edit */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono font-bold">
                          <span className="text-slate-400">Progresso</span>
                          <span className="text-[#A3E635]">{task.progress}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={task.progress}
                          onChange={e => updateTaskProgress(task.id, Number(e.target.value))}
                          className="w-full accent-cyan-400 h-1 bg-[#1B233D] rounded-full"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setIsTaskModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-[#18213D] text-slate-300 hover:text-white"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setTaskToDelete(task)}
                        className="p-1.5 rounded-lg bg-[#18213D] text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Confirm Subject Delete */}
      {isDeletingSubject && (
        <ConfirmModal
          isOpen={true}
          title={`Excluir Disciplina "${subject.name}"`}
          message="Tem certeza que deseja excluir esta disciplina e todas as suas tarefas associadas? Esta operação não pode ser desfeita."
          onConfirm={() => {
            deleteSubject(subject.id);
            setIsDeletingSubject(false);
          }}
          onCancel={() => setIsDeletingSubject(false)}
        />
      )}

      {/* Confirm Task Delete */}
      {taskToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Excluir Tarefa"
          message={`Tem certeza que deseja excluir a tarefa "${taskToDelete.title}"?`}
          onConfirm={() => {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </div>
  );
};
