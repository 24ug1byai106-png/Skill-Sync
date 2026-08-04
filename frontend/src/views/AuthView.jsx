import React, { useState } from 'react';
import { Cpu, Lock, Mail, User, Check, X, ArrowRight } from 'lucide-react';
import { signUpUser, signInUser } from '../services/supabase';

export default function AuthView({ initialMode = 'signup', onSuccess, onSwitchToLanding }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password rules validation
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isLogin) {
      if (!isPasswordValid) {
        setErrorMsg('Please satisfy all password complexity rules before proceeding.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    let res;
    if (isLogin) {
      res = await signInUser(email, password);
    } else {
      res = await signUpUser(email, password, fullName);
    }

    setLoading(false);
    if (res.success) {
      onSuccess(res.user, isLogin);
    } else {
      setErrorMsg('Authentication error. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div
            onClick={onSwitchToLanding}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              cursor: 'pointer'
            }}
          >
            <Cpu size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.6rem' }}>
            {isLogin ? "Welcome Back to " : "Create your "}
            <span className="gradient-text">SkillSync AI</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Bridge Your Skills to Success
          </p>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#ec4899', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Vishnu Karanth"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Live Password Rules Validator (For Signup) */}
          {!isLogin && (
            <div style={{ background: 'rgba(10, 14, 23, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Password Complexity Rules:</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <span style={{ color: rules.length ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {rules.length ? <Check size={12} /> : <X size={12} />} 8+ Characters
                </span>
                <span style={{ color: rules.uppercase ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {rules.uppercase ? <Check size={12} /> : <X size={12} />} 1 Uppercase Letter
                </span>
                <span style={{ color: rules.lowercase ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {rules.lowercase ? <Check size={12} /> : <X size={12} />} 1 Lowercase Letter
                </span>
                <span style={{ color: rules.number ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {rules.number ? <Check size={12} /> : <X size={12} />} 1 Number
                </span>
                <span style={{ color: rules.special ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {rules.special ? <Check size={12} /> : <X size={12} />} 1 Special Character
                </span>
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Confirm Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '8px' }} disabled={loading}>
            {loading ? "Authenticating..." : isLogin ? "Sign In to SkillSync AI" : "Create Account & Continue"}
          </button>
        </form>

        {/* Toggle Login / Signup */}
        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isLogin ? (
            <>Don't have an account? <span style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }} onClick={() => setIsLogin(false)}>Sign Up</span></>
          ) : (
            <>Already have an account? <span style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }} onClick={() => setIsLogin(true)}>Log In</span></>
          )}
        </div>
      </div>
    </div>
  );
}
