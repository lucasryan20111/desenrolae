import React, { useState, useRef } from 'react';
import {
  Database,
  Download,
  Upload,
  FileSpreadsheet,
  RotateCcw,
  ShieldCheck,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const BackupSettingsPage: React.FC = () => {
  const {
    exportBackupJson,
    importBackupJson,
    exportTasksCsv,
    resetToDefaults,
    subjects,
    tasks,
    goals,
    sessions,
    achievements,
    auditLogs,
    addToast,
  } = useApp();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadBackup = () => {
    try {
      const jsonStr = exportBackupJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `desenrolae_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Backup JSON exportado com sucesso!');
    } catch (e) {
      addToast('Erro ao exportar backup', 'error');
    }
  };

  const handleDownloadCsv = () => {
    try {
      const csvStr = exportTasksCsv();
      const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `desenrolae_tarefas_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Planilha CSV de tarefas exportada!');
    } catch (e) {
      addToast('Erro ao exportar CSV', 'error');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async event => {
        const content = event.target?.result as string;
        if (content) {
          const success = await importBackupJson(content);
          if (success && fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };
      reader.readAsText(file);
    } catch (err) {
      addToast('Erro ao processar arquivo de backup.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 bg-[#0E1326] text-white border border-[#1A233D] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold">Armazenamento & Backup de Dados</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Persistência em IndexedDB e LocalStorage. Exporte e restaure cópias de segurança a qualquer momento.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Persistência Ativa (IndexedDB)</span>
        </div>
      </div>

      {/* Database Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
        <div className="p-4 rounded-xl bg-[#0E1326] border border-[#1A233D]">
          <div className="text-2xl font-mono font-extrabold text-white">{subjects.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Disciplinas</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0E1326] border border-[#1A233D]">
          <div className="text-2xl font-mono font-extrabold text-cyan-400">{tasks.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Tarefas</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0E1326] border border-[#1A233D]">
          <div className="text-2xl font-mono font-extrabold text-amber-400">{goals.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Metas</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0E1326] border border-[#1A233D]">
          <div className="text-2xl font-mono font-extrabold text-purple-400">{sessions.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Sessões Foco</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0E1326] border border-[#1A233D]">
          <div className="text-2xl font-mono font-extrabold text-[#A3E635]">
            {achievements.filter(a => a.unlockedAt).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Conquistas</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0E1326] border border-[#1A233D]">
          <div className="text-2xl font-mono font-extrabold text-slate-300">{auditLogs.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Logs Histórico</div>
        </div>
      </div>

      {/* Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export JSON & CSV */}
        <div className="p-6 rounded-2xl bg-[#0E1326] text-white border border-[#1A233D] shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold">Exportação de Dados</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Baixe seus dados completos em formato JSON estruturado para guardar uma cópia segura ou migrar para outro dispositivo. Você também pode exportar suas tarefas em formato CSV compatível com Excel e Google Sheets.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleDownloadBackup}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#090D1A] font-bold text-xs shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Backup Completo (.JSON)</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#151D36] hover:bg-[#1E294B] text-slate-200 border border-[#1E294B] font-semibold text-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar Tarefas (.CSV)</span>
            </button>
          </div>
        </div>

        {/* Restore Backup */}
        <div className="p-6 rounded-2xl bg-[#0E1326] text-white border border-[#1A233D] shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">Restaurar Cópia de Segurança</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Selecione um arquivo de backup (.JSON) gerado anteriormente para restaurar todas as suas disciplinas, tópicos, tarefas, metas e conquistas na íntegra.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Selecionar Arquivo de Backup</span>
            </button>
          </div>
        </div>

        {/* Reset to Demo Defaults */}
        <div className="col-span-full p-6 rounded-2xl bg-[#0E1326] text-white border border-rose-500/20 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Restaurar Dados Padrão de Demonstração
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Recarrega o conjunto de disciplinas e tarefas iniciais (Faculdade, Concursos, Criptografia, Inglês, Sistemas Distribuídos, etc.) mantendo a plataforma completamente preenchida e demonstrável.
            </p>
          </div>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold text-xs transition-colors shrink-0"
          >
            Restaurar Dados Padrão
          </button>
        </div>
      </div>

      {isResetModalOpen && (
        <ConfirmModal
          isOpen={true}
          title="Restaurar Dados Padrão?"
          message="Isso redefinirá as matérias, tarefas e sessões para os valores iniciais da demonstração."
          confirmLabel="Restaurar Padrão"
          onConfirm={() => {
            resetToDefaults();
            setIsResetModalOpen(false);
          }}
          onCancel={() => setIsResetModalOpen(false)}
        />
      )}
    </div>
  );
};
