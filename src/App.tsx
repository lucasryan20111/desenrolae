import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { PendingTasksPage } from './pages/PendingTasksPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { GoalsPage } from './pages/GoalsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { BackupSettingsPage } from './pages/BackupSettingsPage';
import { StudyTimerModal } from './components/StudyTimerModal';
import { TaskModal } from './components/TaskModal';
import { SubjectModal } from './components/SubjectModal';
import { QuickTimerFloatingButton } from './components/QuickTimerFloatingButton';
import { ToastContainer } from './components/Toast';

const AppContent: React.FC = () => {
  const { activePage, selectedSubjectId, setIsTimerModalOpen } = useApp();

  // If timer page was selected in sidebar, open the timer modal
  useEffect(() => {
    if (activePage === 'timer') {
      setIsTimerModalOpen(true);
    }
  }, [activePage, setIsTimerModalOpen]);

  const renderActivePage = () => {
    if (activePage === 'subject_detail' && selectedSubjectId) {
      return <SubjectDetailPage />;
    }

    switch (activePage) {
      case 'dashboard':
      case 'timer':
        return <DashboardPage />;
      case 'pending':
        return <PendingTasksPage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'achievements':
        return <AchievementsPage />;
      case 'backup':
        return <BackupSettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#070A14] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#0A0E1C] dark:bg-[#070A14]">
        {/* Top Header */}
        <Header />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActivePage()}
          </div>
        </main>
      </div>

      {/* Global Modals & Floating Buttons */}
      <StudyTimerModal />
      <TaskModal />
      <SubjectModal />
      <QuickTimerFloatingButton />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
