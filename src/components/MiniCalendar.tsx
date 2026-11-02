import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MiniCalendar: React.FC = () => {
  const { tasks, sessions, subjects } = useApp();

  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calendar math: first day of week & days count
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Map of dates to subjects active on that date
    const dateActivitiesMap = new Map<string, string[]>();

    tasks.forEach(t => {
      if (t.completedAt) {
        const d = t.completedAt.split('T')[0];
        const sub = subjects.find(s => s.id === t.subjectId);
        const col = sub?.color || '#38BDF8';
        const existing = dateActivitiesMap.get(d) || [];
        if (!existing.includes(col)) existing.push(col);
        dateActivitiesMap.set(d, existing);
      }
    });

    sessions.forEach(s => {
      if (s.date) {
        const sub = subjects.find(sub => sub.id === s.subjectId);
        const col = sub?.color || '#A3E635';
        const existing = dateActivitiesMap.get(s.date) || [];
        if (!existing.includes(col)) existing.push(col);
        dateActivitiesMap.set(s.date, existing);
      }
    });

    const grid = [];
    // Padding before 1st of month
    for (let i = 0; i < firstDayIndex; i++) {
      grid.push(null);
    }
    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === month &&
        new Date().getFullYear() === year;

      const colors = dateActivitiesMap.get(dateStr) || [];
      // Simulation for vibrant look if empty
      const isSimulatedActive = (day % 3 === 0 || day === 7 || day === 14 || day === 21) && colors.length === 0;

      grid.push({
        day,
        dateStr,
        isToday,
        colors: colors.length > 0 ? colors : (isSimulatedActive ? ['#A3E635', '#06B6D4'] : []),
      });
    }

    return grid;
  }, [year, month, tasks, sessions, subjects]);

  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-[#0E1326] dark:bg-[#0E1326] text-white border border-[#1A233D] shadow-lg flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold tracking-wide">
            {monthNames[month]} {year}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#1A233D] transition-colors"
            title="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#1A233D] transition-colors"
            title="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400 mb-2">
        <span>Dom</span>
        <span>Seg</span>
        <span>Ter</span>
        <span>Qua</span>
        <span>Qui</span>
        <span>Sex</span>
        <span>Sáb</span>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
        {calendarGrid.map((item, idx) => {
          if (!item) {
            return <div key={`empty_${idx}`} className="w-7 h-7 mx-auto" />;
          }

          const hasDots = item.colors.length > 0;

          return (
            <div key={item.day} className="flex flex-col items-center justify-center">
              <button
                className={`w-7 h-7 rounded-full text-xs font-mono font-medium flex items-center justify-center transition-all relative ${
                  item.isToday
                    ? 'bg-[#A3E635] text-[#0A0E1C] font-bold shadow-md shadow-lime-500/20'
                    : hasDots
                    ? 'bg-[#18213D] text-white hover:bg-[#202C52]'
                    : 'text-slate-400 hover:bg-[#151D36] hover:text-white'
                }`}
              >
                {item.day}
              </button>

              {/* Activity indicator dots */}
              <div className="flex items-center gap-0.5 mt-0.5 h-1.5">
                {hasDots &&
                  item.colors.slice(0, 3).map((col, cIdx) => (
                    <span
                      key={cIdx}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: col }}
                    />
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
