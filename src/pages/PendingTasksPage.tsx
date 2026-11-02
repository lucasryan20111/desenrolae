import React, { useState, useMemo } from 'react';
import {
  CalendarClock,
  AlertCircle,
  Clock,
  Calendar,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  Plus,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Priority, Task, TaskStatus } from '../types';
import { isTaskOverdue, isTaskDueToday, formatMinutes } from '../services/calculations';
import { ConfirmModal } from '../components/ConfirmModal';

type FilterTab = 'todas' | 'atrasadas' | 'hoje' | 'proximos' | 'sem_prazo' | 'em_andamento';

export const PendingTasksPage: React.FC = () => {
  const {
    tasks,
    subjects,
    updateTaskProgress,
    toggleTaskCompletion,
    deleteTask,
    setIsTaskModalOpen,
    setEditingTask,
  } = useApp();

  const [activeTab, setActiveTab] = useState<FilterTab>('todas');
  const [viewMode, setViewMode] = useState<'lista' | 'kanban'>('lista');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'prazo' | 'prioridade' | 'progresso'>('prazo');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const todayIso = new Date().toISOString().split('T')[0];

  // Map subjects for quick lookup
  const subjectMap = useMemo(() => {
    return new Map(subjects.map(s => [s.id, s]));
  }, [subjects]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      todas: tasks.length,
      atrasadas: tasks.filter(t => isTaskOverdue(t, todayIso)).length,
      hoje: tasks.filter(t => isTaskDueToday(t, todayIso)).length,
      proximos: tasks.filter(t => t.dueDate && t.dueDate > todayIso && t.status !== 'concluida').length,
      sem_prazo: tasks.filter(t => !t.dueDate && t.status !== 'concluida').length,
      em_andamento: tasks.filter(t => t.status === 'em_andamento').length,
    };
  }, [tasks, todayIso]);

  // Filtered & sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Tab filter
      if (activeTab === 'atrasadas' && !isTaskOverdue(task, todayIso)) return false;
      if (activeTab === 'hoje' && !isTaskDueToday(task, todayIso)) return false;
      if (activeTab === 'proximos' && !(task.dueDate && task.dueDate > todayIso && task.status !== 'concluida')) return false;
      if (activeTab === 'sem_prazo' && (task.dueDate || task.status === 'concluida')) return false;
      if (activeTab === 'em_andamento' && task.status !== 'em_andamento') return false;

      // Subject filter
      if (subjectFilter !== 'all' && task.subjectId !== subjectFilter) return false;

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description?.toLowerCase().includes(q);
        const sub = subjectMap.get(task.subjectId);
        const matchSub = sub?.name.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchSub) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'prazo') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate > b.dueDate ? 1 : -1;
      }
      if (sortBy === 'prioridade') {
        const order: Record<Priority, number> = { alta: 3, media: 2, baixa: 1 };
        return order[b.priority] - order[a.priority];
      }
      if (sortBy === 'progresso') {
        return b.progress - a.progress;
      }
      return 0;
    });
  }, [tasks, activeTab, subjectFilter, priorityFilter, statusFilter, sortBy, searchQuery, todayIso, subjectMap]);

  // Kanban columns
  const kanbanColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'nao_iniciada', label: 'Não Iniciadas', color: '#64748B' },
    { id: 'em_andamento', label: 'Em Andamento', color: '#38BDF8' },
    { id: 'concluida', label: 'Concluídas', color: '#A3E635' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl p-5 bg-[#0E1326] text-white border border-[#1A233D] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold">Gestão de Pendências & Tarefas</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize prazos, monitore itens atrasados e acompanhe o progresso em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle (Lista / Kanban) */}
          <div className="flex items-center p-1 rounded-xl bg-[#151D36] border border-[#1E294B] text-xs font-semibold">
            <button
              onClick={() => setViewMode('lista')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'lista'
                  ? 'bg-cyan-500 text-[#090D1A] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-cyan-500 text-[#090D1A] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#090D1A] font-bold text-xs shadow-md shadow-cyan-500/15 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Criar Tarefa</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: 'todas', label: 'Todas as Tarefas', count: counts.todas, color: 'text-slate-200' },
          { id: 'atrasadas', label: 'Atrasadas', count: counts.atrasadas, color: 'text-rose-400', alert: true },
          { id: 'hoje', label: 'Para Hoje', count: counts.hoje, color: 'text-amber-400' },
          { id: 'proximos', label: 'Próximos Dias', count: counts.proximos, color: 'text-cyan-400' },
          { id: 'em_andamento', label: 'Em Andamento', count: counts.em_andamento, color: 'text-blue-400' },
          { id: 'sem_prazo', label: 'Sem Prazo', count: counts.sem_prazo, color: 'text-slate-400' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FilterTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-[#090D1A] shadow-md shadow-cyan-500/20'
                  : 'bg-[#0E1326] text-slate-300 hover:bg-[#161F38] border border-[#1A233D]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md font-mono text-[11px] ${
                  isActive
                    ? 'bg-[#090D1A]/20 text-[#090D1A]'
                    : tab.alert && tab.count > 0
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-[#18213D] text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0E1326] text-white border border-[#1A233D] shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, descrição ou matéria..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141B33] border border-[#1C2542] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filter Selects */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Disciplina */}
          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="py-2 px-3 rounded-xl bg-[#141B33] border border-[#1C2542] text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Todas as Disciplinas</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Prioridade */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="py-2 px-3 rounded-xl bg-[#141B33] border border-[#1C2542] text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Todas Prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          {/* Ordenar por */}
          <div className="flex items-center gap-1.5 pl-1 border-l border-[#1C2542]">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="py-2 px-3 rounded-xl bg-[#141B33] border border-[#1C2542] text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="prazo">Ordenar por Prazo</option>
              <option value="prioridade">Ordenar por Prioridade</option>
              <option value="progresso">Ordenar por Progresso</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content: List or Kanban */}
      {viewMode === 'lista' ? (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0E1326] border border-[#1A233D] text-slate-400 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="text-base font-bold text-white">Nenhuma tarefa encontrada</div>
              <p className="text-xs max-w-sm mx-auto">
                Não há itens correspondentes aos filtros selecionados. Crie uma nova tarefa para começar.
              </p>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-[#090D1A] font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Tarefa</span>
              </button>
            </div>
          ) : (
            filteredTasks.map(task => {
              const sub = subjectMap.get(task.subjectId);
              const isOverdue = isTaskOverdue(task, todayIso);
              const isToday = isTaskDueToday(task, todayIso);
              const isDone = task.status === 'concluida' || task.progress >= 100;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl bg-[#0E1326] text-white border transition-all hover:bg-[#121931] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
                    isOverdue
                      ? 'border-rose-500/40 shadow-sm shadow-rose-500/5'
                      : isToday
                      ? 'border-amber-500/40 shadow-sm shadow-amber-500/5'
                      : 'border-[#1A233D]'
                  }`}
                >
                  {/* Left: Checkbox + Title + Metadata */}
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                        isDone
                          ? 'bg-[#A3E635] border-[#A3E635] text-[#0A0E1C]'
                          : 'border-slate-500 hover:border-cyan-400 text-transparent hover:text-slate-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Discipline tag */}
                        {sub && (
                          <span
                            className="text-[11px] font-bold tracking-wide flex items-center gap-1.5"
                            style={{ color: sub.color || '#38BDF8' }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: sub.color || '#38BDF8' }}
                            />
                            {sub.name}
                          </span>
                        )}

                        {/* Priority Badge */}
                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                            task.priority === 'alta'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : task.priority === 'media'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Overdue Warning Flag */}
                        {isOverdue && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-rose-500 text-white flex items-center gap-1 shadow-sm">
                            <AlertCircle className="w-3 h-3" />
                            ATRASADA
                          </span>
                        )}

                        {/* Due Today Flag */}
                        {isToday && (
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                            <Clock className="w-3 h-3" />
                            HOJE
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm font-bold transition-all ${
                          isDone ? 'line-through text-slate-500' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        {task.dueDate ? (
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Prazo: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString()}
                          </span>
                        ) : (
                          <span>Sem prazo definido</span>
                        )}

                        <span>·</span>
                        <span>Foco: {formatMinutes(task.studiedMinutes)} / {formatMinutes(task.estimatedMinutes)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Progress Slider & Actions */}
                  <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1B233D]">
                    {/* Progress Slider */}
                    <div className="w-36 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono font-bold">
                        <span className="text-slate-400">Progresso</span>
                        <span className={isDone ? 'text-[#A3E635]' : 'text-cyan-400'}>
                          {task.progress}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={task.progress}
                        onChange={e => updateTaskProgress(task.id, Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-[#1B233D] rounded-full"
                      />
                    </div>

                    {/* Quick Edit */}
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setIsTaskModalOpen(true);
                      }}
                      title="Editar Tarefa"
                      className="p-2 rounded-xl bg-[#141B33] hover:bg-[#1E294B] text-slate-300 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setTaskToDelete(task)}
                      title="Excluir Tarefa"
                      className="p-2 rounded-xl bg-[#141B33] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {kanbanColumns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);

            return (
              <div
                key={col.id}
                className="rounded-2xl bg-[#0E1326] border border-[#1A233D] shadow-lg flex flex-col max-h-[80vh]"
              >
                {/* Column Header */}
                <div className="p-4 border-b border-[#1A233D] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: col.color }}
                    />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      {col.label}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#161F38] text-xs font-mono font-bold text-slate-300">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="p-3 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
                  {colTasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-500">
                      Nenhuma tarefa nesta coluna
                    </div>
                  ) : (
                    colTasks.map(task => {
                      const sub = subjectMap.get(task.subjectId);
                      const isOverdue = isTaskOverdue(task, todayIso);
                      const isToday = isTaskDueToday(task, todayIso);

                      return (
                        <div
                          key={task.id}
                          className="p-3.5 rounded-xl bg-[#141B33] border border-[#1E294B] hover:border-cyan-500/40 transition-all space-y-2 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2">
                            {sub && (
                              <span
                                className="text-[10px] font-bold uppercase truncate"
                                style={{ color: sub.color || '#38BDF8' }}
                              >
                                {sub.name}
                              </span>
                            )}
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                task.priority === 'alta'
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : task.priority === 'media'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <h5 className="text-xs font-bold text-white line-clamp-2">
                            {task.title}
                          </h5>

                          {/* Progress */}
                          <div className="space-y-1 pt-1">
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                              <span className="text-slate-400">Progresso</span>
                              <span className="text-[#A3E635]">{task.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#1B233D] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#A3E635]"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Bottom Row */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#1C2542] text-[10px] text-slate-400">
                            {isOverdue ? (
                              <span className="text-rose-400 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Atrasada
                              </span>
                            ) : isToday ? (
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Hoje
                              </span>
                            ) : task.dueDate ? (
                              <span>{new Date(task.dueDate + 'T00:00:00').toLocaleDateString()}</span>
                            ) : (
                              <span>Sem prazo</span>
                            )}

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingTask(task);
                                  setIsTaskModalOpen(true);
                                }}
                                className="p-1 hover:text-white"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setTaskToDelete(task)}
                                className="p-1 hover:text-rose-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <ConfirmModal
          isOpen={true}
          title="Excluir Tarefa de Estudo"
          message={`Tem certeza que deseja excluir a tarefa "${taskToDelete.title}"? Esta ação removerá a tarefa do painel e recalculará os indicadores.`}
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
