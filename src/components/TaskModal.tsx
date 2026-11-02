import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Priority, Task } from '../types';
import { getStatusFromProgress } from '../services/calculations';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    setIsTaskModalOpen,
    editingTask,
    setEditingTask,
    subjects,
    createTask,
    updateTask,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('media');
  const [progress, setProgress] = useState<number>(0);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(60);
  const [studiedMinutes, setStudiedMinutes] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Hydrate form on edit or open
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setSubjectId(editingTask.subjectId);
      setTopicId(editingTask.topicId || '');
      setStartDate(editingTask.startDate);
      setDueDate(editingTask.dueDate || '');
      setPriority(editingTask.priority);
      setProgress(editingTask.progress);
      setEstimatedMinutes(editingTask.estimatedMinutes || 60);
      setStudiedMinutes(editingTask.studiedMinutes || 0);
      setNotes(editingTask.notes || '');
    } else {
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setDescription('');
      setSubjectId(subjects[0]?.id || '');
      setTopicId('');
      setStartDate(today);
      setDueDate('');
      setPriority('media');
      setProgress(0);
      setEstimatedMinutes(60);
      setStudiedMinutes(0);
      setNotes('');
    }
    setError('');
  }, [editingTask, isTaskModalOpen, subjects]);

  if (!isTaskModalOpen) return null;

  const currentSubject = subjects.find(s => s.id === subjectId);
  const currentTopics = currentSubject?.topics || [];
  const statusCalculated = getStatusFromProgress(progress);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da tarefa.');
      return;
    }
    if (!subjectId) {
      setError('Selecione uma disciplina.');
      return;
    }

    if (editingTask) {
      await updateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim() || undefined,
        subjectId,
        topicId: topicId || undefined,
        startDate: startDate || new Date().toISOString().split('T')[0],
        dueDate: dueDate || undefined,
        priority,
        progress,
        status: statusCalculated,
        estimatedMinutes: Number(estimatedMinutes) || 0,
        studiedMinutes: Number(studiedMinutes) || 0,
        notes: notes.trim() || undefined,
      });
    } else {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        subjectId,
        topicId: topicId || undefined,
        startDate: startDate || new Date().toISOString().split('T')[0],
        dueDate: dueDate || undefined,
        priority,
        status: statusCalculated,
        progress,
        estimatedMinutes: Number(estimatedMinutes) || 0,
        studiedMinutes: Number(studiedMinutes) || 0,
        notes: notes.trim() || undefined,
        completedAt: null,
      });
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#0E1326] dark:bg-[#0E1326] text-white border border-[#1A233D] shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1A233D] mb-4">
          <h3 className="text-base font-bold text-white">
            {editingTask ? 'Editar Tarefa de Estudo' : 'Nova Tarefa de Estudo'}
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A233D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Título da Tarefa <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Resolver 20 exercícios de grafos"
              className="w-full py-2.5 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Descrição (Opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detalhes ou objetivos específicos..."
              className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
            />
          </div>

          {/* Subject & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Disciplina <span className="text-rose-400">*</span>
              </label>
              <select
                value={subjectId}
                onChange={e => {
                  setSubjectId(e.target.value);
                  setTopicId('');
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tema / Subtópico
              </label>
              <select
                value={topicId}
                onChange={e => setTopicId(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="">Geral / Sem subtópico</option>
                {currentTopics.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates: Start & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Prazo de Conclusão (Opcional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Prioridade
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#151D36] rounded-xl">
                {(['baixa', 'media', 'alta'] as Priority[]).map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-1.5 rounded-lg text-center font-bold capitalize transition-all ${
                      priority === p
                        ? p === 'alta'
                          ? 'bg-rose-500 text-white'
                          : p === 'media'
                          ? 'bg-amber-500 text-[#090D1A]'
                          : 'bg-emerald-500 text-[#090D1A]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Status Automático
              </label>
              <div className="py-2.5 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-300 font-semibold flex items-center justify-between">
                <span>
                  {statusCalculated === 'concluida'
                    ? 'Concluída'
                    : statusCalculated === 'em_andamento'
                    ? 'Em andamento'
                    : 'Não iniciada'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    statusCalculated === 'concluida'
                      ? 'bg-emerald-400'
                      : statusCalculated === 'em_andamento'
                      ? 'bg-cyan-400'
                      : 'bg-slate-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Progress Slider (0% - 100%) */}
          <div className="p-3.5 rounded-xl bg-[#12182E] border border-[#1A233D] space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-300">Progresso da Tarefa</span>
              <span className="text-sm font-mono font-extrabold text-[#A3E635]">
                {progress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="w-full accent-[#A3E635] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <button
                type="button"
                onClick={() => setProgress(0)}
                className="hover:text-white"
              >
                0% (Não iniciada)
              </button>
              <button
                type="button"
                onClick={() => setProgress(50)}
                className="hover:text-white"
              >
                50% (Metade)
              </button>
              <button
                type="button"
                onClick={() => setProgress(100)}
                className="hover:text-[#A3E635] font-bold"
              >
                100% (Concluir)
              </button>
            </div>
          </div>

          {/* Times: Estimated & Studied */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tempo Estimado (minutos)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tempo Estudado (minutos)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={studiedMinutes}
                onChange={e => setStudiedMinutes(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Observações (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Revisar capítulo 3 antes de fazer os exercícios"
              className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1A233D]">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#090D1A] font-bold shadow-md shadow-cyan-500/15 transition-all"
            >
              {editingTask ? 'Salvar Alterações' : 'Cadastrar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
