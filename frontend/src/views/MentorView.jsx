import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, Code, HelpCircle } from 'lucide-react';

export default function MentorView() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello Vishnu! I am your SkillPilot AI Mentor. I have full context on your resume, GitHub repos, active roadmap, and skill gaps. How can I assist your career preparation today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    // Call backend API /api/v1/mentor/reply
    setTimeout(() => {
      let replyText = "Based on your Career DNA and 78.5% readiness score, I recommend focusing on building a multi-container Docker project with Redis caching. Here is how you can frame this on your resume:\n\n• Architected high-throughput REST API using FastAPI and Redis caching, reducing DB query load by 40%.";
      if (query.includes("Interview")) {
        replyText = "Here are 3 Mock Technical Interview Questions for Backend Engineer:\n\n1. How does Python's AsyncIO event loop manage non-blocking I/O operations compared to multi-threading?\n2. Explain the difference between B-Tree indexes and Hash indexes in PostgreSQL.\n3. What happens under the hood when a Redis key reaches its TTL?";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>AI Career Mentor</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>24/7 AI mentor with full context on your profile, skill gaps, and active roadmap.</p>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => handleSend("Generate 3 Mock Technical Interview Questions for Backend Engineer")}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <Sparkles size={14} color="#a855f7" /> Mock Technical Interview
        </button>
        <button
          onClick={() => handleSend("Give me guidance on designing a Redis caching layer for FastAPI")}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <Code size={14} color="#06b6d4" /> Project Architecture Advice
        </button>
      </div>

      {/* Chat Area */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              {msg.sender === 'ai' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={20} color="#fff" />
                </div>
              )}

              <div style={{
                padding: '14px 18px',
                borderRadius: '16px',
                background: msg.sender === 'user' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid',
                borderColor: msg.sender === 'user' ? 'transparent' : 'var(--border-color)',
                color: '#fff',
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5'
              }}>
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.8rem' }}>
                  VK
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#fff" />
              </div>
              <div style={{ padding: '14px 18px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Groq AI is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Ask your career mentor anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={!input.trim() || loading}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
