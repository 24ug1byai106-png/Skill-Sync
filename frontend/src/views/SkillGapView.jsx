import React, { useState } from 'react';
import { Target, Check, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export default function SkillGapView() {
  const [targetRole, setTargetRole] = useState("Backend Developer");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2>Skill Gap Matrix & Priority Order</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Comparative analysis between your current acquired skills and target role requirements.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Acquired Skills */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={20} /> Acquired Skills (7)
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {["Python", "FastAPI", "PostgreSQL", "Docker", "REST APIs", "Git", "Pytest"].map(s => (
              <span key={s} style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '6px 12px', borderRadius: '12px', fontSize: '0.85rem' }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ color: '#ec4899', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} /> Missing Skills (4)
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {["Kubernetes", "Redis Caching", "Kafka Event Streams", "AWS Lambda"].map(s => (
              <span key={s} style={{ background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#ec4899', padding: '6px 12px', borderRadius: '12px', fontSize: '0.85rem' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
