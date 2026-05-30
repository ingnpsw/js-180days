import { useEffect, useMemo, useState } from "react";
import "./App.css";

const SCORE_LABELS = {
  0: "0 ยังไม่มี",
  1: "1 ทดลองแล้ว",
  2: "2 ใช้งานจริงบางส่วน",
  3: "3 พร้อม production",
};

const LEVELS = [
  { min: 111, label: "Big-Tech Grade", tone: "elite" },
  { min: 96, label: "Enterprise-Ready", tone: "strong" },
  { min: 71, label: "Production SMB", tone: "good" },
  { min: 36, label: "MVP", tone: "mid" },
  { min: 0, label: "Prototype", tone: "low" },
];

const CHECKLIST = [
  {
    id: "architecture",
    title: "Architecture & Scale",
    items: [
      "แยก bounded context/service ชัดเจน",
      "Stateless app + scale ออกหลาย instance ได้",
      "มี cache strategy และ invalidation",
      "มี async job/queue สำหรับงานหนัก",
      "ทบทวน DB index/query plan แล้ว",
    ],
  },
  {
    id: "reliability",
    title: "Reliability & SRE",
    items: [
      "กำหนด SLI/SLO (latency, error rate, uptime)",
      "มี /live และ /ready + graceful shutdown",
      "มี timeout/retry/backoff มาตรฐานเดียวกัน",
      "Critical endpoint มี idempotency key",
      "มี circuit breaker/fallback",
    ],
  },
  {
    id: "observability",
    title: "Observability",
    items: [
      "Structured logs + request/correlation ID",
      "Metrics dashboard (API/DB/queue/business)",
      "Distributed tracing",
      "Alerting ชัดเจนและ actionable",
      "Error tracking ผูกกับ release",
    ],
  },
  {
    id: "security",
    title: "Security & Compliance",
    items: [
      "Secret management (ไม่ hardcode)",
      "Encryption in transit + at rest",
      "RBAC/ABAC ระดับ action + data scope",
      "Audit log ระดับ field change",
      "Retention/masking/deletion ตาม PDPA/GDPR baseline",
    ],
  },
  {
    id: "data",
    title: "Data Integrity",
    items: [
      "Critical flow มี transaction boundary ชัด",
      "มี concurrency control (optimistic lock/version)",
      "Unique constraints + validation ครบ",
      "Backup + restore test ผ่านจริง",
      "มี retention/archival policy",
    ],
  },
  {
    id: "delivery",
    title: "Delivery & DevEx",
    items: [
      "CI ครบ (lint/test/build/security scan)",
      "CD + promotion dev → stg → prod",
      "มี blue/green หรือ canary deploy",
      "มี rollback ง่ายและเร็ว",
      "มี feature flags + staged rollout",
    ],
  },
  {
    id: "testing",
    title: "Testing Strategy",
    items: [
      "Unit test ครอบคลุม business logic หลัก",
      "Integration tests (DB/API/queue)",
      "E2E ของ critical journeys",
      "Load/performance baseline",
      "Chaos/failure test ของ dependency",
    ],
  },
  {
    id: "operations",
    title: "Product Operations",
    items: [
      "Incident runbook + on-call flow",
      "Postmortem process",
      "Release note/change management",
      "รองรับ multi-tenant/org structure (ถ้าจำเป็น)",
      "มี cost monitoring (infra/db/egress)",
    ],
  },
];

const DEFAULT_SCORES = Object.fromEntries(
  CHECKLIST.map((group) => [
    group.id,
    Object.fromEntries(group.items.map((_, idx) => [idx, 0])),
  ]),
);

const PLAN = [
  {
    label: "30 วัน",
    focus: "ทำฐานให้แน่น",
    actions: [
      "ปิด RBAC + API guard",
      "เพิ่ม structured logging + request ID",
      "ทำ backup/restore test",
      "วาง CI ขั้นต่ำ + E2E flow สำคัญ",
    ],
  },
  {
    label: "60 วัน",
    focus: "ยกระดับความเสถียร",
    actions: [
      "วาง SLO + alerting",
      "เพิ่ม queue + idempotency",
      "ทำ performance baseline",
      "ออกแบบ canary + rollback",
    ],
  },
  {
    label: "90 วัน",
    focus: "พร้อมระดับ enterprise",
    actions: [
      "เพิ่ม tracing + chaos tests",
      "ยกระดับ compliance flow",
      "ทำ incident runbook เต็มรูปแบบ",
      "วาง cost monitoring รายบริการ",
    ],
  },
];

function getLevel(score) {
  return LEVELS.find((lv) => score >= lv.min) || LEVELS[LEVELS.length - 1];
}

function App() {
  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem("bigtech-checklist-scores");
      return saved ? JSON.parse(saved) : DEFAULT_SCORES;
    } catch {
      return DEFAULT_SCORES;
    }
  });

  useEffect(() => {
    localStorage.setItem("bigtech-checklist-scores", JSON.stringify(scores));
  }, [scores]);

  const stats = useMemo(() => {
    const categories = CHECKLIST.map((group) => {
      const groupScore = group.items.reduce((sum, _, idx) => {
        return sum + (Number(scores[group.id]?.[idx]) || 0);
      }, 0);
      const max = group.items.length * 3;
      return { ...group, score: groupScore, max, percent: Math.round((groupScore / max) * 100) };
    });

    const total = categories.reduce((sum, g) => sum + g.score, 0);
    const max = categories.reduce((sum, g) => sum + g.max, 0);
    const percent = Math.round((total / max) * 100);

    return { categories, total, max, percent, level: getLevel(total) };
  }, [scores]);

  function updateScore(groupId, itemIdx, value) {
    setScores((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [itemIdx]: value,
      },
    }));
  }

  function resetAll() {
    setScores(DEFAULT_SCORES);
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="kicker">Tracker Upgrade</p>
        <h1>Big-Tech Gap Checklist</h1>
        <p className="subtitle">ใช้ติดตามความพร้อมของโปรเจกต์สำหรับงาน freelance/full-time ระดับ production</p>
      </header>

      <section className="scoreboard">
        <div>
          <p className="metric-label">คะแนนรวม</p>
          <p className="metric-value">{stats.total} / {stats.max}</p>
        </div>
        <div>
          <p className="metric-label">ความคืบหน้า</p>
          <p className="metric-value">{stats.percent}%</p>
        </div>
        <div>
          <p className="metric-label">ระดับปัจจุบัน</p>
          <p className={`badge ${stats.level.tone}`}>{stats.level.label}</p>
        </div>
        <button className="reset-btn" onClick={resetAll}>Reset Scores</button>
      </section>

      <section className="grid">
        {stats.categories.map((group) => (
          <article key={group.id} className="card">
            <div className="card-head">
              <h2>{group.title}</h2>
              <span className="mini-score">{group.score}/{group.max}</span>
            </div>
            <div className="progress">
              <div className="progress-fill" style={{ width: `${group.percent}%` }} />
            </div>
            <ul>
              {group.items.map((item, idx) => (
                <li key={`${group.id}-${idx}`}>
                  <p>{item}</p>
                  <div className="score-actions" role="group" aria-label={`${group.title}-${idx}`}>
                    {[0, 1, 2, 3].map((value) => (
                      <button
                        key={value}
                        className={Number(scores[group.id]?.[idx]) === value ? "score-btn active" : "score-btn"}
                        onClick={() => updateScore(group.id, idx, value)}
                        title={SCORE_LABELS[value]}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="plan">
        <h2>30 / 60 / 90 Day Upgrade Plan</h2>
        <div className="plan-grid">
          {PLAN.map((block) => (
            <article key={block.label} className="plan-card">
              <p className="plan-label">{block.label}</p>
              <h3>{block.focus}</h3>
              <ul>
                {block.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
