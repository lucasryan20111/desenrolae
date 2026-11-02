import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GoalPeriod, GoalType } from '../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose }) => {
  const { subjects, createGoal } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('hours');
  const [period, setPeriod] = useState<GoalPeriod>('semanal');
  const [targetValue, setTargetValue] = useState<number>(5);
  const [subjectId, setSubjectId] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    const dueDateObj = new Date(today);
    if (period === 'diario') dueDateObj.setDate(dueDateObj.getDate() + 1);
    else if (period === 'semanal') dueDateObj.setDate(dueDateObj.getDate() + 7);
    else dueDateObj.setMonth(dueDateObj.getMonth() + 1);

    await createGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      period,
      targetValue: Number(targetValue) || 1,
      currentValue: 0,
      subjectId: subjectId || undefined,
      startDate,
      dueDate: dueDateObj.toISOString().split('T')[0],
      status: 'em_andamento',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#0E1326] dark:bg-[#0E1326] text-white border border-[#1A233D] shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A233D] mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">Nova Meta de Estudo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A233D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Título da Meta
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Estudar 5 horas de Sistemas Distribuídos"
              className="w-full py-2.5 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tipo de Meta
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as GoalType)}
                className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="hours">Horas de Estudo</option>
                <option value="tasks">Quantidade de Tarefas</option>
                <option value="exercises">Exercícios Resolvidos</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Período
              </label>
              <select
                value={period}
                onChange={e => setPeriod(e.target.value as GoalPeriod)}
                className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="diario">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Meta Alvo {type === 'hours' ? '(Horas)' : '(Qtd)'}
              </label>
              <input
                type="number"
                min="1"
                step={type === 'hours' ? '0.5' : '1'}
                value={targetValue}
                onChange={e => setTargetValue(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Disciplina (Opcional)
              </label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="">Geral (Todas)</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Descrição (Opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Motivação ou plano de execução..."
              className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1A233D]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#090D1A] font-bold shadow-md shadow-cyan-500/15 transition-all"
            >
              Criar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
