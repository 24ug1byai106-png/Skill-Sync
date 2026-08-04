import React, { useState } from 'react';
import { Play, Code2, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

const languages = ["Python", "Java", "C++", "JavaScript", "Go", "Rust"];

const sampleCodes = {
  Python: `def solution(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []\n\nprint(solution([2, 7, 11, 15], 9))`,
  JavaScript: `function solution(nums, target) {\n    const seen = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (seen.has(diff)) return [seen.get(diff), i];\n        seen.set(nums[i], i);\n    }\n    return [];\n}\nconsole.log(solution([2, 7, 11, 15], 9));`,
  "C++": `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    cout << "[0, 1]" << endl;\n    return 0;\n}`,
  Java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("[0, 1]");\n    }\n}`,
  Go: `package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("[0, 1]")\n}`,
  Rust: `fn main() {\n    println!("[0, 1]");\n}`
};

export default function Judge0View() {
  const [lang, setLang] = useState("Python");
  const [code, setCode] = useState(sampleCodes.Python);
  const [stdin, setStdin] = useState("2 7 11 15\n9");
  const [output, setOutput] = useState(null);
  const [executing, setExecuting] = useState(false);

  const handleSelectLang = (l) => {
    setLang(l);
    setCode(sampleCodes[l] || "");
  };

  const handleRunCode = () => {
    setExecuting(true);
    // Simulate backend call /api/v1/judge0/execute
    setTimeout(() => {
      setOutput({
        status: "Accepted",
        stdout: "[0, 1]\n",
        time_seconds: 0.042,
        memory_kb: 3412,
        score: 85.0
      });
      setExecuting(false);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Judge0 Code Playground</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Execute code live across 6 languages with real-time test cases & coding score updates.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>
          <Cpu size={16} /> Coding Score: 85/100
        </div>
      </div>

      {/* Language Selector */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {languages.map(l => (
          <button
            key={l}
            onClick={() => handleSelectLang(l)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: lang === l ? '#6366f1' : 'var(--border-color)',
              background: lang === l ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)',
              color: lang === l ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Main Code Editor & Output */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Code Input */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Source Code ({lang})</span>
            <button className="btn-primary" onClick={handleRunCode} disabled={executing}>
              <Play size={16} /> {executing ? "Executing..." : "Run Code"}
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: '100%',
              height: '320px',
              background: '#090d16',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '14px',
              color: '#38bdf8',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>

        {/* Console Output */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3>Execution Result</h3>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>STDIN (Test Input)</span>
            <input
              type="text"
              className="form-input"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              style={{ marginTop: '4px', fontSize: '0.85rem' }}
            />
          </div>

          {output ? (
            <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>
                <CheckCircle2 size={16} /> {output.status}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time: {output.time_seconds}s | Memory: {output.memory_kb} KB</p>
              <pre style={{ color: '#f8fafc', fontSize: '0.85rem', marginTop: '8px' }}>{output.stdout}</pre>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Click <strong>Run Code</strong> to execute your submission on Judge0 sandbox.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
