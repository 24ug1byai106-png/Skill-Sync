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
  Briefcase,
  Trophy, 
  Settings, 
  LogOut 
} from 'lucide-react';
import SkillSyncLogo from './SkillSyncLogo';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jobs', label: 'Job Opportunities', icon: Briefcase },
  { id: 'career_dna', label: 'Career DNA', icon: Dna },
  { id: 'resume', label: 'Resume Intelligence', icon: FileText },
  { id: 'github', label: 'GitHub Intelligence', icon: Github },
  { id: 'projects', label: 'Recommended Projects', icon: FolderGit2 },
  { id: 'skill_gap', label: 'Skill Gap', icon: Target },
  { id: 'readiness', label: 'Placement Score', icon: ShieldCheck },
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
      background: 'var(--bg-panel)',
      borderRight: '1px solid var(--border-cyan)',
      padding: '20px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      fontFamily: "'Share Tech Mono', monospace"
    }}>
      {/* Brand Header with New SkillSync AI Logo */}
      <div style={{ paddingLeft: '4px', paddingTop: '4px' }}>
        <SkillSyncLogo size={36} showText={true} />
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
              className={isActive ? 'hud-panel' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                background: isActive ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
                color: isActive ? 'var(--hud-cyan-bright)' : 'var(--text-secondary)',
                border: '1px solid',
                borderLeft: isActive ? '3px solid var(--hud-cyan-bright)' : '1px solid transparent',
                borderColor: isActive ? 'var(--hud-cyan-bright)' : 'transparent',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '1px',
                cursor: 'pointer',
                textAlign: 'left',
                textTransform: 'uppercase',
                fontFamily: "'Share Tech Mono', monospace",
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderLeft = '3px solid rgba(0, 229, 255, 0.5)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderLeft = '1px solid transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon size={15} color={isActive ? 'var(--hud-cyan-bright)' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Action Button */}
      <button
        onClick={onLogout}
        className="btn-hud-amber"
        style={{
          width: '100%',
          justifyContent: 'center',
          fontSize: '0.82rem',
          padding: '10px 12px',
          fontFamily: "'Share Tech Mono', monospace"
        }}
      >
        <LogOut size={15} />
        <span>LOG OUT</span>
      </button>
    </aside>
  );
}
