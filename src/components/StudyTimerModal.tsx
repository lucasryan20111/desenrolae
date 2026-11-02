import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StudyTimerModal: React.FC = () => {
  const {
    isTimerModalOpen,
    setIsTimerModalOpen,
    subjects,
    tasks,
    logStudySession,
  } = useApp();

  const [mode, setMode] = useState<'pomodoro' | 'cronometro'>('pomodoro');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || ''
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [notes, setNotes] = useState('');

  const timerRef = useRef<any>(null);

  // When subjects change, keep selection valid
  useEffect(() => {
    if (!selectedSubjectId && subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (mode === 'pomodoro') {
          setSecondsLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setIsRunning(false);
              handleFinishSession(25);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setElapsedSeconds(prev => prev + 1);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      setSecondsLeft(25 * 60);
    } else {
      setElapsedSeconds(0);
    }
  };

  const handleFinishSession = (forcedMinutes?: number) => {
    setIsRunning(false);
    let minutes = 0;
    if (typeof forcedMinutes === 'number') {
      minutes = forcedMinutes;
    } else if (mode === 'pomodoro') {
      minutes = Math.max(1, Math.round((25 * 60 - secondsLeft) / 60));
    } else {
      minutes = Math.max(1, Math.round(elapsedSeconds / 60));
    }

    if (!selectedSubjectId && subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }

    const now = new Date();
    logStudySession({
      subjectId: selectedSubjectId || subjects[0]?.id || 'sub_geral',
      taskId: selectedTaskId || undefined,
      durationMinutes: minutes,
      date: now.toISOString().split('T')[0],
      startedAt: new Date(now.getTime() - minutes * 60000).toISOString(),
      endedAt: now.toISOString(),
      type: mode,
      notes: notes || undefined,
    });

    handleReset();
    setIsTimerModalOpen(false);
  };

  if (!isTimerModalOpen) return null;

  const currentSeconds = mode === 'pomodoro' ? secondsLeft : elapsedSeconds;
  const minutesDisplay = String(Math.floor(currentSeconds / 60)).padStart(2, '0');
  const secondsDisplay = String(currentSeconds % 60).padStart(2, '0');

  // Filter tasks for selected subject
  const availableTasks = tasks.filter(
    t => t.subjectId === selectedSubjectId && t.status !== 'concluida'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-[#0E1326] dark:bg-[#0E1326] text-white border border-[#1A233D] shadow-2xl p-6 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1A233D] mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold tracking-tight">
              Sessão de Foco & Estudo
            </h3>
          </div>
          <button
            onClick={() => setIsTimerModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A233D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex rounded-xl bg-[#151D36] p-1 mb-6">
          <button
            onClick={() => {
              setMode('pomodoro');
              setIsRunning(false);
              setSecondsLeft(25 * 60);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'pomodoro'
                ? 'bg-cyan-500 text-[#090D1A] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pomodoro (25 min)
          </button>
          <button
            onClick={() => {
              setMode('cronometro');
              setIsRunning(false);
              setElapsedSeconds(0);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'cronometro'
                ? 'bg-cyan-500 text-[#090D1A] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cronômetro Livre
          </button>
        </div>

        {/* Big Digital Display */}
        <div className="text-center py-6 my-2 bg-[#12182E] rounded-2xl border border-[#1B2440] shadow-inner">
          <div className="text-5xl sm:text-6xl font-mono font-extrabold tracking-wider text-white tabular-nums drop-shadow-md">
            {minutesDisplay}:{secondsDisplay}
          </div>
          <div className="text-xs uppercase tracking-widest text-[#A3E635] font-semibold mt-2">
            {isRunning ? 'Em foco ativo' : 'Pronto para iniciar'}
          </div>
        </div>

        {/* Subject & Task Selection */}
        <div className="space-y-3 my-5 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Disciplina de Estudo
            </label>
            <select
              value={selectedSubjectId}
              onChange={e => {
                setSelectedSubjectId(e.target.value);
                setSelectedTaskId('');
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

          {availableTasks.length > 0 && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tarefa Associada (Opcional)
              </label>
              <select
                value={selectedTaskId}
                onChange={e => setSelectedTaskId(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-[#151D36] border border-[#1E294B] text-slate-200 focus:outline-none focus:border-cyan-400 truncate"
              >
                <option value="">Nenhuma tarefa específica</option>
                {availableTasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartPause}
            className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-900'
                : 'bg-cyan-500 hover:bg-cyan-400 text-[#090D1A]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{currentSeconds > 0 && mode === 'pomodoro' && currentSeconds < 25 * 60 ? 'Continuar' : 'Iniciar Foco'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            title="Reiniciar tempo"
            className="p-3 rounded-xl bg-[#151D36] hover:bg-[#1C2542] text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {(mode === 'cronometro' ? elapsedSeconds >= 60 : secondsLeft < 25 * 60) && (
            <button
              onClick={() => handleFinishSession()}
              className="px-4 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
