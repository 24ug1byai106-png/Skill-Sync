import React, { useState } from 'react';
import { Dna, Target, Cpu, Check, AlertTriangle } from 'lucide-react';
import { computeCareerAnalysis, ROLE_REQUIREMENTS } from '../services/analysisEngine';

const roles = Object.keys(ROLE_REQUIREMENTS);

export default function CareerDnaView({ userData = {} }) {
  const [selectedRole, setSelectedRole] = useState(userData.selectedGoal || "Backend Developer");
  
  const analysis = computeCareerAnalysis({
    ...userData,
    selectedGoal: selectedRole
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Career DNA & Skill Gap Engine</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Select target industry role to analyze calculated match vs required competencies.
          </p>
        </div>
      </div>

      {/* Role Catalog Selector */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: selectedRole === role ? '#6366f1' : 'var(--border-color)',
              background: selectedRole === role ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
              color: selectedRole === role ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Matrix Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Acquired Skills */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Check size={20} color="#10b981" />
            <h3>Acquired Competencies ({analysis.matchedSkills.length})</h3>
          </div>
          {analysis.matchedSkills.length > 0 ? (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {analysis.matchedSkills.map(skill => (
                <div key={skill} style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Check size={14} />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No acquired skills detected yet for this role.</p>
          )}
        </div>

        {/* Skill Gaps */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="#ec4899" />
            <h3>Required Target Gaps ({analysis.missingSkills.length})</h3>
          </div>
          {analysis.missingSkills.length > 0 ? (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {analysis.missingSkills.map(skill => (
                <div key={skill} style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  color: '#ec4899',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertTriangle size={14} />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: '#10b981' }}>🎉 100% Skill coverage achieved for {selectedRole}!</p>
          )}
        </div>
      </div>
    </div>
  );
}
