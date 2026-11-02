import React, { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  CalendarClock,
  BookOpen,
  Target,
  BookMarked,
  Trophy,
  Database,
  Plus,
  Sun,
  Moon,
  Settings,
  LogOut,
  GripVertical,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp, PageId } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    subjects,
    selectedSubjectId,
    setSelectedSubjectId,
    setIsSubjectModalOpen,
    isDarkMode,
    toggleTheme,
    tasks,
    metrics,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const overdueCount = tasks.filter(t => t.dueDate && t.status !== 'concluida' && t.dueDate < new Date().toISOString().split('T')[0]).length;
  const dueTodayCount = tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0] && t.status !== 'concluida').length;

  const handleNavClick = (page: PageId) => {
    setActivePage(page);
    setSelectedSubjectId(null);
    setIsMobileMenuOpen(false);
  };

  const handleSubjectClick = (subId: string) => {
    setSelectedSubjectId(subId);
    setActivePage('subject_detail');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger toggle bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#0E1326] text-white border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-wider text-base text-white">DESENROLAE</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-[#151C33] text-slate-300 hover:text-white"
        >
          <LayoutDashboard className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 lg:static lg:block transition-transform duration-200 ease-in-out shrink-0 bg-[#0E1326] dark:bg-[#0A0E1C] border-r border-[#1B233D] flex flex-col justify-between ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header & Logo */}
          <div className="p-5 flex items-center justify-between border-b border-[#1A223B]">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  DESENROLAE
                </div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-0.5">
                  Focus Organizer
                </div>
              </div>
            </button>

            {/* Sun / Moon Toggle */}
            <button
              onClick={toggleTheme}
              title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161E38] transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            <div className="space-y-1 text-sm font-medium">
              {/* Visão Geral */}
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  activePage === 'dashboard'
                    ? 'bg-[#182242] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#131A33]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Visão Geral</span>
              </button>

              {/* Relatórios & Estatísticas */}
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  activePage === 'dashboard' && !selectedSubjectId
                    ? 'text-slate-300'
                    : 'text-slate-400 hover:text-white hover:bg-[#131A33]'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Relatórios</span>
              </button>

              {/* Pendências */}
              <button
                onClick={() => handleNavClick('pending')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activePage === 'pending'
                    ? 'bg-[#182242] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#131A33]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CalendarClock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pendências</span>
                </div>
                {(overdueCount > 0 || dueTodayCount > 0) && (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {overdueCount + dueTodayCount}
                  </span>
                )}
              </button>

              {/* Planejamento / Metas */}
              <button
                onClick={() => handleNavClick('goals')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activePage === 'goals'
                    ? 'bg-[#182242] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#131A33]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Planejamento</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-500 text-white shadow-sm">
                  » New
                </span>
              </button>

              {/* Cronômetro & Pomodoro */}
              <button
                onClick={() => handleNavClick('timer')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  activePage === 'timer'
                    ? 'bg-[#182242] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#131A33]'
                }`}
              >
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Foco & Pomodoro</span>
              </button>

              {/* Conquistas & Histórico */}
              <button
                onClick={() => handleNavClick('achievements')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  activePage === 'achievements'
                    ? 'bg-[#182242] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#131A33]'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Conquistas</span>
              </button>

              {/* Backup & Dados */}
              <button
                onClick={() => handleNavClick('backup')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  activePage === 'backup'
                    ? 'bg-[#182242] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#131A33]'
                }`}
              >
                <Database className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Backup & Dados</span>
              </button>
            </div>

            {/* MINHAS DISCIPLINAS */}
            <div className="pt-2 border-t border-[#1A223B]">
              <div className="flex items-center justify-between px-2 mb-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Minhas Disciplinas
                  </span>
                </div>
                <button
                  onClick={() => setIsSubjectModalOpen(true)}
                  title="Adicionar nova disciplina"
                  className="w-5 h-5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-[#0A0E1C] flex items-center justify-center transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
              <p className="px-2 text-[11px] text-slate-500 mb-2">
                » Adicione suas tarefas e disciplinas
              </p>

              {/* Disciplines List */}
              <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
                {subjects.map(sub => {
                  const isSelected = selectedSubjectId === sub.id && activePage === 'subject_detail';
                  const subTasks = tasks.filter(t => t.subjectId === sub.id);
                  const isComplete = subTasks.length > 0 && subTasks.every(t => t.status === 'concluida');

                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSubjectClick(sub.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                        isSelected
                          ? 'bg-[#182242] text-white'
                          : 'text-slate-400 hover:text-white hover:bg-[#131A33]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <GripVertical className="w-3 h-3 text-slate-600 shrink-0" />
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: sub.color || '#38BDF8' }}
                        />
                        <span className="truncate uppercase">{sub.name}</span>
                      </div>
                      {isComplete && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Info & Settings */}
          <div className="p-3 border-t border-[#1A223B] text-[11px] text-slate-400 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-300">Desenrolae App v2.1.0</div>
              <div className="text-[10px] text-slate-400">© 2026 DevCons.</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNavClick('backup')}
                title="Configurações"
                className="p-1.5 rounded-md hover:bg-[#161E38] text-slate-400 hover:text-white"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleNavClick('backup')}
                title="Exportar Dados"
                className="p-1.5 rounded-md hover:bg-[#161E38] text-slate-400 hover:text-white"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}
    </>
  );
};
