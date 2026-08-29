import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CountryProvider } from '@/context/CountryContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { NewsProvider } from '@/context/NewsContext';
import { CoursesProvider } from '@/context/CoursesContext';
import { LiveSyncProvider } from '@/context/LiveSyncContext';
import Layout, { type PageId } from '@/components/Layout';
import Mascot from '@/components/Mascot';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import StudyPlannerPage from '@/pages/StudyPlannerPage';
import FlashcardsPage from '@/pages/FlashcardsPage';
import AudioSummariesPage from '@/pages/AudioSummariesPage';
import UniversityPortal from '@/pages/UniversityPortal';
import ClassroomPage from '@/pages/ClassroomPage';
import SubjectsPage from '@/pages/SubjectsPage';
import CampusPage from '@/pages/CampusPage';
import UtilitiesPage from '@/pages/UtilitiesPage';
import NewsPage from '@/pages/NewsPage';
import PremiumPage from '@/pages/PremiumPage';
import SettingsPage from '@/pages/SettingsPage';
import QuizzesPage from '@/pages/QuizzesPage';
import AITutorPage from '@/pages/AITutorPage';
import PerformanceAnalyticsPage from '@/pages/PerformanceAnalyticsPage';
import OfflineSyllabusPage from '@/pages/OfflineSyllabusPage';
import BookShopPage from '@/pages/BookShopPage';
import FreeCoursesPage from '@/pages/FreeCoursesPage';
import GoogleStudentHubPage from '@/pages/GoogleStudentHubPage';
import FunEnglishRelaxPage from '@/pages/FunEnglishRelaxPage';
import ModernLanguagesPage from '@/pages/ModernLanguagesPage';
import LanguageAdventurePage from '@/pages/LanguageAdventurePage';
import SmartFileEvaluatorPage from '@/pages/SmartFileEvaluatorPage';
import OnboardingFlow from '@/components/OnboardingFlow';

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

  // If user has not completed multi-step academic onboarding, present the OnboardingFlow
  if (!profile.hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={() => setPage('dashboard')} />;
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
      case 'smart_evaluator':
        return <SmartFileEvaluatorPage onNavigateFlashcards={() => handleNavigate('flashcards')} />;
      case 'planner':
        return <StudyPlannerPage />;
      case 'flashcards':
        return <FlashcardsPage />;
      case 'audio':
        return <AudioSummariesPage />;
      case 'language_adventure':
        return <LanguageAdventurePage onNavigate={handleNavigate} />;
      case 'modern_languages':
        return <ModernLanguagesPage onNavigate={handleNavigate} />;
      case 'fun_english':
        return <FunEnglishRelaxPage onNavigate={handleNavigate} />;
      case 'google_hub':
        return <GoogleStudentHubPage onNavigate={handleNavigate} />;
      case 'free_courses':
        return <FreeCoursesPage onNavigate={handleNavigate} />;
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
      <Mascot trigger={highFive} onNavigate={handleNavigate} />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <CountryProvider>
            <NewsProvider>
              <CoursesProvider>
                <LiveSyncProvider>
                  <AppContent />
                </LiveSyncProvider>
              </CoursesProvider>
            </NewsProvider>
          </CountryProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
