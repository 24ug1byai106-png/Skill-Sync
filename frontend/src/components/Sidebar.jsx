import React from 'react';
import { 
  LayoutDashboard, 
  Dna, 
  FileText, 
  Github, 
  FolderGit2, 
  Target, 
  ShieldCheck, 
  Map, 
  CheckSquare, 
  Award, 
  Code2, 
  Bot, 
  Trophy, 
  Settings, 
  LogOut, 
  Cpu 
} from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'career_dna', label: 'Career DNA', icon: Dna },
  { id: 'resume', label: 'Resume Intelligence', icon: FileText },
  { id: 'github', label: 'GitHub Intelligence', icon: Github },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'skill_gap', label: 'Skill Gap', icon: Target },
  { id: 'readiness', label: 'Career Readiness', icon: ShieldCheck },
  { id: 'roadmap', label: 'Learning Roadmap', icon: Map },
  { id: 'missions', label: 'Weekly AI Missions', icon: CheckSquare },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'coding', label: 'Coding Challenges', icon: Code2 },
  { id: 'mentor', label: 'AI Career Mentor', icon: Bot },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <aside style={{
      width: '260px',
      background: 'rgba(13, 17, 26, 0.95)',
      borderRight: '1px solid var(--border-color)',
      padding: '20px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '6px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--accent-glow)'
        }}>
          <Cpu color="#fff" size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', lineHeight: '1.1' }}>SkillSync <span className="gradient-text">AI</span></h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Career Operating System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: isActive ? 'rgba(59, 130, 246, 0.35)' : 'transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition)'
              }}
            >
              <Icon size={16} color={isActive ? '#3b82f6' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Action */}
      <button
        onClick={onLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(236, 72, 153, 0.08)',
          color: '#ec4899',
          border: '1px solid rgba(236, 72, 153, 0.2)',
          fontWeight: 600,
          fontSize: '0.85rem',
          cursor: 'pointer',
          marginTop: 'auto'
        }}
      >
        <LogOut size={16} />
        <span>Log Out</span>
      </button>
    </aside>
  );
}
