import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Layout, { type PageId } from '@/components/Layout';
import Mascot from '@/components/Mascot';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import UniversityPortal from '@/pages/UniversityPortal';
import ClassroomPage from '@/pages/ClassroomPage';
import SubjectsPage from '@/pages/SubjectsPage';
import CampusPage from '@/pages/CampusPage';
import CommunityPage from '@/pages/CommunityPage';
import UtilitiesPage from '@/pages/UtilitiesPage';
import NewsPage from '@/pages/NewsPage';
import PremiumPage from '@/pages/PremiumPage';
import SettingsPage from '@/pages/SettingsPage';
import QuizzesPage from '@/pages/QuizzesPage';
import AITutorPage from '@/pages/AITutorPage';
import PerformanceAnalyticsPage from '@/pages/PerformanceAnalyticsPage';
import OfflineSyllabusPage from '@/pages/OfflineSyllabusPage';
import BookShopPage from '@/pages/BookShopPage';

function AppContent() {
  const { profile, loading } = useAuth();
  const [page, setPage] = useState<PageId>('dashboard');
  const [highFive, setHighFive] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Loading SipArana Educational Platform...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <AuthPage />;
  }

  const handleNavigate = (p: PageId) => {
    setPage(p);
    if (p === 'dashboard') {
      setHighFive(true);
      setTimeout(() => setHighFive(false), 100);
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'book_shop':
        return <BookShopPage />;
      case 'quizzes':
        return <QuizzesPage onNavigateAnalytics={() => handleNavigate('analytics')} />;
      case 'ai_tutor':
        return <AITutorPage />;
      case 'analytics':
        return (
          <PerformanceAnalyticsPage
            onNavigateQuizzes={() => handleNavigate('quizzes')}
            onNavigateSyllabus={() => handleNavigate('offline_syllabus')}
            onNavigateTutor={() => handleNavigate('ai_tutor')}
          />
        );
      case 'offline_syllabus':
        return <OfflineSyllabusPage />;
      case 'university':
        return <UniversityPortal />;
      case 'classroom':
        return <ClassroomPage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'campus':
        return <CampusPage />;
      case 'community':
        return <CommunityPage />;
      case 'utilities':
        return <UtilitiesPage />;
      case 'news':
        return <NewsPage />;
      case 'premium':
        return <PremiumPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Layout current={page} onNavigate={handleNavigate}>
        {renderPage()}
      </Layout>
      <Mascot trigger={highFive} />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
