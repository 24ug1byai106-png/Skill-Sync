import React, { useState, useEffect } from 'react';
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

import { loadUserAnalysis, saveUserAnalysis } from './services/analysisEngine';

export default function App() {
  // Application Stage: 'landing' | 'auth' | 'onboarding' | 'processing' | 'dashboard'
  const [stage, setStage] = useState('landing');
  const [authMode, setAuthMode] = useState('signup');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(() => loadUserAnalysis() || {});

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
    const existing = loadUserAnalysis();
    
    const fullNameVal = authenticatedUser?.full_name || authenticatedUser?.user_metadata?.full_name || existing?.profile?.fullName || (authenticatedUser?.email ? authenticatedUser.email.split('@')[0] : 'Student');

    const mergedProfile = {
      ...(existing?.profile || {}),
      fullName: fullNameVal,
      email: authenticatedUser?.email || existing?.profile?.email || '',
      phone: existing?.profile?.phone || '',
      location: existing?.profile?.location || '',
      branch: existing?.profile?.branch || '',
      preferredCareer: existing?.profile?.preferredCareer || 'Software Engineer'
    };

    const updatedUser = {
      ...(existing || {}),
      profile: mergedProfile
    };

    setUserData(updatedUser);
    saveUserAnalysis(updatedUser);

    if (isLogin) {
      setStage('dashboard');
    } else {
      setStage('onboarding');
    }
  };

  const handleCompleteOnboarding = (onboardingData) => {
    console.log("Onboarding complete:", onboardingData);
    setUserData(onboardingData);
    saveUserAnalysis(onboardingData);
    setStage('processing');
  };

  const handleUpdateUserData = (updatedFields) => {
    setUserData(prev => {
      const merged = { ...prev, ...updatedFields };
      saveUserAnalysis(merged);
      return merged;
    });
  };

  const handleFinishAiProcessing = () => {
    setStage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setStage('landing');
  };

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

  const renderSubView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView userData={userData} />;
      case 'career_dna':
        return <CareerDnaView userData={userData} />;
      case 'resume':
        return <ResumeView userData={userData} onUpdateUserData={handleUpdateUserData} />;
      case 'github':
        return <GithubView userData={userData} onUpdateUserData={handleUpdateUserData} />;
      case 'projects':
        return <ProjectsView userData={userData} />;
      case 'skill_gap':
        return <SkillGapView userData={userData} />;
      case 'readiness':
        return <CareerReadinessView userData={userData} />;
      case 'roadmap':
        return <RoadmapView userData={userData} />;
      case 'missions':
        return <MissionsView userData={userData} />;
      case 'certificates':
        return <CertificatesView userData={userData} onUpdateUserData={handleUpdateUserData} />;
      case 'coding':
        return <Judge0View userData={userData} />;
      case 'mentor':
        return <MentorView userData={userData} />;
      case 'achievements':
        return <AchievementsView userData={userData} />;
      case 'settings':
        return <SettingsView userData={userData} />;
      default:
        return <DashboardView userData={userData} />;
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <GlobalAIAmbience activeTab={activeTab} />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header user={user} onSearch={(q) => alert(`SkillSync AI Search: "${q}"`)} />
        <main style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {renderSubView()}
        </main>
      </div>
    </div>
  );
}
