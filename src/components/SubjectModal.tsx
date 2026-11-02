import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Subject } from '../types';

export const SubjectModal: React.FC = () => {
  const {
    isSubjectModalOpen,
    setIsSubjectModalOpen,
    editingSubject,
    setEditingSubject,
    createSubject,
    updateSubject,
  } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#38BDF8');
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [error, setError] = useState('');

  const PALETTE = [
    '#EF4444', // Red
    '#F43F5E', // Rose
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#6366F1', // Indigo
    '#3B82F6', // Blue
    '#06B6D4', // Cyan
    '#10B981', // Emerald
    '#A3E635', // Lime
    '#F59E0B', // Amber
  ];

  useEffect(() => {
    if (editingSubject) {
      setName(editingSubject.name);
      setDescription(editingSubject.description || '');
      setColor(editingSubject.color || '#38BDF8');
      setTopics(editingSubject.topics ? editingSubject.topics.map(t => t.name) : []);
    } else {
      setName('');
      setDescription('');
      setColor(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
      setTopics([]);
    }
    setNewTopicInput('');
    setError('');
  }, [editingSubject, isSubjectModalOpen]);

  if (!isSubjectModalOpen) return null;

  const handleAddTopic = () => {
    if (!newTopicInput.trim()) return;
    if (topics.includes(newTopicInput.trim())) return;
    setTopics([...topics, newTopicInput.trim()]);
    setNewTopicInput('');
  };

  const handleRemoveTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome da disciplina.');
      return;
    }

    const formattedTopics = topics.map((tName, idx) => ({
      id: `top_${Date.now()}_${idx}`,
      subjectId: editingSubject?.id || '',
      name: tName,
      createdAt: new Date().toISOString().split('T')[0],
    }));

    if (editingSubject) {
      await updateSubject({
        ...editingSubject,
        name: name.trim().toUpperCase(),
        description: description.trim() || undefined,
        color,
        topics: formattedTopics,
      });
    } else {
      await createSubject({
        name: name.trim().toUpperCase(),
        description: description.trim() || undefined,
        color,
        icon: 'BookOpen',
        topics: formattedTopics,
      });
    }

    setIsSubjectModalOpen(false);
    setEditingSubject(null);
  };

  const handleClose = () => {
    setIsSubjectModalOpen(false);
    setEditingSubject(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#0E1326] dark:bg-[#0E1326] text-white border border-[#1A233D] shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A233D] mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold">
              {editingSubject ? 'Editar Disciplina' : 'Nova Disciplina'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A233D]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Nome da Disciplina <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: PROGRAMAÇÃO JAVA, BANCO DE DADOS..."
              className="w-full py-2.5 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 uppercase font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Descrição (Opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Objetivos do semestre, ementa ou foco de estudos..."
              className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Cor Identificadora
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PALETTE.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c
                      ? 'ring-2 ring-white scale-110 shadow-lg'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Topics / Subtopics */}
          <div className="pt-2">
            <label className="block font-semibold text-slate-300 mb-1">
              Temas e Subtópicos Iniciais
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTopicInput}
                onChange={e => setNewTopicInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
                placeholder="Ex: Orientação a Objetos"
                className="flex-1 py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="px-3 py-2 rounded-xl bg-[#1B2440] hover:bg-cyan-500 hover:text-[#090D1A] text-slate-200 font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {topics.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                {topics.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#141B33] text-slate-300"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(idx)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1A233D]">
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
              {editingSubject ? 'Salvar Disciplina' : 'Cadastrar Disciplina'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
