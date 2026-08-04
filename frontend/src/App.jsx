import React, { useState } from 'react';
import LandingPage from './views/LandingPage';
import AuthView from './views/AuthView';
import OnboardingWizard from './views/OnboardingWizard';
import AiProcessingView from './views/AiProcessingView';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GlobalAIAmbience from './components/GlobalAIAmbience';

import DashboardView from './views/DashboardView';
import CareerDnaView from './views/CareerDnaView';
import ResumeView from './views/ResumeView';
import GithubView from './views/GithubView';
import ProjectsView from './views/ProjectsView';
import SkillGapView from './views/SkillGapView';
import CareerReadinessView from './views/CareerReadinessView';
import RoadmapView from './views/RoadmapView';
import MissionsView from './views/MissionsView';
import CertificatesView from './views/CertificatesView';
import Judge0View from './views/Judge0View';
import MentorView from './views/MentorView';
import AchievementsView from './views/AchievementsView';
import SettingsView from './views/SettingsView';

export default function App() {
  // Application Stage: 'landing' | 'auth' | 'onboarding' | 'processing' | 'dashboard'
  const [stage, setStage] = useState('landing');
  const [authMode, setAuthMode] = useState('signup');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleStartOnboarding = () => {
    setAuthMode('signup');
    setStage('auth');
  };

  const handleStartLogin = () => {
    setAuthMode('login');
    setStage('auth');
  };

  const handleAuthSuccess = (authenticatedUser, isLogin) => {
    setUser(authenticatedUser);
    if (isLogin) {
      // Returning user directly opens dashboard
      setStage('dashboard');
    } else {
      // New user goes through 5-step onboarding wizard
      setStage('onboarding');
    }
  };

  const handleCompleteOnboarding = (onboardingData) => {
    console.log("Onboarding complete:", onboardingData);
    setStage('processing');
  };

  const handleFinishAiProcessing = () => {
    setStage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setStage('landing');
  };

  // Render stage screens before reaching dashboard
  if (stage === 'landing') {
    return <LandingPage onGetStarted={handleStartOnboarding} onLogin={handleStartLogin} />;
  }

  if (stage === 'auth') {
    return <AuthView initialMode={authMode} onSuccess={handleAuthSuccess} onSwitchToLanding={() => setStage('landing')} />;
  }

  if (stage === 'onboarding') {
    return <OnboardingWizard onCompleteOnboarding={handleCompleteOnboarding} />;
  }

  if (stage === 'processing') {
    return <AiProcessingView onFinishProcessing={handleFinishAiProcessing} />;
  }

  // Stage === 'dashboard': Main SkillSync AI Workspace
  const renderSubView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'career_dna':
        return <CareerDnaView />;
      case 'resume':
        return <ResumeView />;
      case 'github':
        return <GithubView />;
      case 'projects':
        return <ProjectsView />;
      case 'skill_gap':
        return <SkillGapView />;
      case 'readiness':
        return <CareerReadinessView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'missions':
        return <MissionsView />;
      case 'certificates':
        return <CertificatesView />;
      case 'coding':
        return <Judge0View />;
      case 'mentor':
        return <MentorView />;
      case 'achievements':
        return <AchievementsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <GlobalAIAmbience activeTab={activeTab} />
      
      {/* SkillSync AI Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Workspace Area */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header user={user} onSearch={(q) => alert(`SkillSync AI Search: "${q}"`)} />
        <main style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {renderSubView()}
        </main>
      </div>
    </div>
  );
}
