import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, Code, HelpCircle, Briefcase, Terminal } from 'lucide-react';

function generateIntelligentMentorReply(query) {
  const q = query.toLowerCase().trim();

  // 1. Google / Big Tech Interview Questions
  if (q.includes('google')) {
    return `🎯 **Google Technical Interview Breakdown & Requirements:**\n\n` +
           `1. **Data Structures & Algorithms (3-4 Coding Rounds):**\n` +
           `   • **Top Topics:** Graphs (BFS/DFS, Dijkstra), Dynamic Programming, Trees & Tries, Sliding Window, Segment Trees.\n` +
           `   • **Difficulty Level:** LeetCode Medium to Hard.\n` +
           `   • **Key Expectation:** Clean code, optimal time/space complexity analysis, and dry-running code manually on edge cases.\n\n` +
           `2. **System Design (for Mid/Senior or Generalist rounds):**\n` +
           `   • Scalability, Load Balancing, Distributed Caching (Redis), Database Sharding & CAP Theorem.\n\n` +
           `3. **Googleness & Leadership (1 Round):**\n` +
           `   • Behavioral questions assessing collaboration, adaptability to ambiguity, and user-centric problem solving.\n\n` +
           `💡 **Pro Tip:** Google interviewers value active communication — think out loud as you analyze the problem!`;
  }

  // 2. Amazon
  if (q.includes('amazon')) {
    return `📦 **Amazon Interview Focus & Key Requirements:**\n\n` +
           `1. **16 Leadership Principles:** Crucial for all rounds (e.g. Customer Obsession, Ownership, Bias for Action). Format your answers using the STAR method (Situation, Task, Action, Result).\n` +
           `2. **Coding Rounds:** Heavy emphasis on HashMaps, Trees, Priority Queues (Heaps), and Object-Oriented Design (OOD).\n` +
           `3. **System Architecture:** Distributed systems, microservices, Amazon SQS/DynamoDB event-driven design.`;
  }

  // 3. Placement / Campus Recruitment / Job Preparation
  if (q.includes('placement') || q.includes('placements') || q.includes('job') || q.includes('campus') || q.includes('learn')) {
    return `🎓 **Placement Preparation Roadmap (Targeting Top Tech Roles):**\n\n` +
           `1. **Core Problem Solving & DSA (Daily Target: 2-3 Problems):**\n` +
           `   • Focus on Arrays, Two Pointers, Binary Search, Trees, Graphs, and Dynamic Programming.\n\n` +
           `2. **Core CS Subjects (High Weightage in Technical Rounds):**\n` +
           `   • **DBMS:** SQL Queries, Joins, Indexing, Transactions & ACID properties.\n` +
           `   • **Operating Systems:** Threads vs Processes, Deadlocks, Memory Management.\n` +
           `   • **Computer Networks:** TCP/IP model, HTTP/HTTPS, DNS, WebSockets.\n\n` +
           `3. **2 Strong Industry-Grade Projects:**\n` +
           `   • Build projects featuring Docker containerization, REST APIs (FastAPI/Express), and Redis caching.\n\n` +
           `4. **Mock Interviews & Speed Coding:**\n` +
           `   • Practice writing clean, bug-free code under a 30-minute timer.`;
  }

  // 4. System Design / Caching / Architecture
  if (q.includes('system design') || q.includes('architecture') || q.includes('scale') || q.includes('redis') || q.includes('docker')) {
    return `🏗️ **System Design & High-Throughput Architecture:**\n\n` +
           `• **Caching Strategy:** Use Redis for sub-millisecond data retrieval. Implement Cache-Aside or Write-Through patterns to reduce DB query load.\n` +
           `• **Database Scaling:** Vertical scaling vs Read Replicas (PostgreSQL) and partitioning/sharding.\n` +
           `• **Microservices:** Containerize applications using Docker and orchestrate with Kubernetes or Docker Compose.\n` +
           `• **API Gateway & Rate Limiting:** Implement NGINX or FastAPI middleware to prevent API abuse and handle high concurrency.`;
  }

  // 5. Resume / Portfolio / Projects Guidance
  if (q.includes('resume') || q.includes('project') || q.includes('portfolio') || q.includes('skill')) {
    return `📄 **Resume & Skill Optimization Advice:**\n\n` +
           `• **Use the Google XYZ Bullet Formula:** *"Accomplished X, measured by Y, by implementing Z."*\n` +
           `• **Highlight Tech Stack:** FastAPI, PostgreSQL, Redis, Docker, React, Next.js, CI/CD.\n` +
           `• **Include Proof Links:** Add GitHub repository links, live deployment URLs, and Docker Hub image links.\n` +
           `• **Remove Fluff:** Replace vague statements with concrete quantitative metrics (e.g. "Reduced query response time by 45%").`;
  }

  // 6. Mock Interview / Technical Questions
  if (q.includes('interview') || q.includes('mock') || q.includes('question')) {
    return `🎯 **Here are 3 Recommended Mock Technical Interview Questions:**\n\n` +
           `1. **Python/AsyncIO:** How does Python's event loop handle thousands of concurrent connections compared to multi-threading?\n` +
           `2. **PostgreSQL:** What is the structural difference between a B-Tree index and a Hash index, and when should each be used?\n` +
           `3. **System Design:** How do you handle cache stampedes (thundering herd problem) in a high-traffic production system?`;
  }

  // 7. Dynamic Analyzer Fallback for any specific user question
  const uppercaseKeywords = query.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `💡 **Analysis for your query:** "${query}"\n\n` +
         `Here is the AI Mentor recommendation tailored to your request:\n\n` +
         `1. **Key Focus Areas:** When addressing **${uppercaseKeywords}**, concentrate on core engineering principles, practical code implementations, and clear problem decomposition.\n` +
         `2. **Actionable Steps:**\n` +
         `   • Review relevant Data Structures & Algorithm patterns.\n` +
         `   • Build verifiable project proof demonstrating clean architecture.\n` +
         `   • Prepare STAR-format examples for behavioral and technical discussions.\n\n` +
         `3. **Follow-up:** Feel free to ask me about specific companies (e.g. Google, Amazon), resume bullet tailoring, or system design topics!`;
}

export default function MentorView({ userData = {} }) {
  const userName = userData.profile?.fullName ? userData.profile.fullName.split(' ')[0] : 'there';

  const [messages, setMessages] = useState([
    { sender: 'ai', text: `Hello ${userName}! I am your SkillSync AI Mentor. I have full context on your resume, GitHub repos, active roadmap, and skill gaps. Ask me anything about placements, company interview formats, or project guidance!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    setTimeout(() => {
      const replyText = generateIntelligentMentorReply(query);
      setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--hud-cyan-bright)', margin: 0, fontFamily: "'Share Tech Mono', monospace" }}>
            AI CAREER MENTOR
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            24/7 AI mentor with full context on your profile, placement preparation, and active roadmap.
          </p>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleSend("Generate 3 Mock Technical Interview Questions")}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
        >
          <Sparkles size={14} color="var(--hud-cyan-bright)" /> Mock Technical Interview
        </button>
        <button
          onClick={() => handleSend("Give me guidance on designing a high-throughput architecture with Redis & FastAPI")}
          className="btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
        >
          <Code size={14} color="var(--hud-amber-bright)" /> Project Architecture Advice
        </button>
      </div>

      {/* Chat Area */}
      <div className="hud-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '12px',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}
            >
              {msg.sender === 'ai' && (
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(0, 229, 255, 0.15)', border: '1px solid var(--border-cyan)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Bot size={20} color="var(--hud-cyan-bright)" />
                </div>
              )}

              <div className="hud-panel" style={{
                padding: '14px 18px',
                borderRadius: '8px',
                background: msg.sender === 'user' ? 'rgba(0, 229, 255, 0.12)' : 'rgba(10, 11, 13, 0.9)',
                borderColor: msg.sender === 'user' ? 'var(--hud-cyan-bright)' : 'var(--border-cyan)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5',
                fontFamily: msg.sender === 'user' ? "'Share Tech Mono', monospace" : 'inherit'
              }}>
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255, 159, 28, 0.2)', border: '1px solid var(--hud-amber)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontWeight: 700, fontSize: '0.8rem', color: 'var(--hud-amber-bright)',
                  fontFamily: "'Share Tech Mono', monospace"
                }}>
                  VK
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.15)', border: '1px solid var(--border-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="var(--hud-cyan-bright)" />
              </div>
              <div className="hud-panel" style={{ padding: '14px 18px', color: 'var(--hud-cyan-bright)', fontSize: '0.85rem', fontFamily: "'Share Tech Mono', monospace" }}>
                AI Mentor is analyzing your question...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-cyan)' }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Ask your career mentor anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-hud-cyan" disabled={!input.trim() || loading} style={{ padding: '10px 20px' }}>
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  );
}
