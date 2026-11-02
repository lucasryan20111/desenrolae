import React from 'react';
import { Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickTimerFloatingButton: React.FC = () => {
  const { setIsTimerModalOpen } = useApp();

  return (
    <button
      onClick={() => setIsTimerModalOpen(true)}
      title="Iniciar Sessão de Foco / Pomodoro"
      className="fixed bottom-6 right-6 z-30 w-13 h-13 rounded-full bg-cyan-500 hover:bg-cyan-400 text-[#090D1A] flex items-center justify-center shadow-xl shadow-cyan-500/25 border-2 border-white/80 dark:border-[#0E1326] transition-transform active:scale-90 hover:scale-105 cursor-pointer group"
    >
      <Clock className="w-6 h-6 stroke-[2.2] group-hover:rotate-12 transition-transform" />
    </button>
  );
};
