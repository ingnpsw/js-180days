import { useState, useEffect, useCallback } from "react";

const AI_TEMPLATES = {
  quiz: `You are my JavaScript quiz master. I just finished Day [N] studying [topic].

Rules:
1. Ask me 5 questions one at a time
2. After each answer, tell me only "correct" or "incorrect" — do NOT explain
3. At the end, tell me my score
4. For wrong answers, ask a follow-up question WITHOUT the answer
5. Do NOT write any code
6. Do NOT tell me what I missed — let me figure it out

Ready? Start with question 1.`,

  review: `I'm on Day [N] of my 180-day plan. Please review my code.

STRICT RULES:
- Do NOT rewrite any of my code
- Do NOT show "the correct way"
- Phrase all feedback as questions
- Max 3 improvements
- If bugs exist, say "line [X] has an issue" without fixing
- Ask ONE question that tests if I understand what I wrote

My code:
[paste your code here]`,

  hint: `I'm stuck on [problem description].

What I've tried:
1. [tried X, result Y]
2. [tried A, result B]

My current theory: [your hypothesis]

Rules:
- Do NOT give me code
- Do NOT tell me the answer
- Ask ONE question that would unlock my thinking
- If I'm heading wrong, just say "wrong direction"`,

  debug: `I have a bug. I've debugged for 15+ minutes.

Error: [paste error]

What I tried:
1. [X — didn't work because Y]
2. [A — didn't work because B]

Hypothesis: [what I think is wrong]

Rules:
- Don't fix the bug
- Don't show code
- Tell me what CATEGORY of bug (syntax/logic/async/scope)
- Ask ONE question to help me find it`,

  concept: `I've been struggling with [concept] for 20+ minutes.

What I understand: [what you know]
What confuses me: [specific confusion]

Rules:
- Explain using an analogy, not code
- Don't give me the full answer
- End with a question I should answer if I understand`,

  retro: `I just finished Week [N]. Self-assessment: [X/10]

My capstone code:
[paste]

Rules:
- Don't rewrite code
- Identify the ONE weakest concept
- Ask 3 test questions (don't answer)
- Flag bugs by line number only
- What should I prioritize Week [N+1]?`,
};

const PHASES = [
  { id: 1, title: "JS Foundation",       color: "#E8A838", range: [1,   21],  icon: "⚡" },
  { id: 2, title: "React + Tailwind",    color: "#3B82F6", range: [22,  45],  icon: "⚛️" },
  { id: 3, title: "Full-stack + DB",     color: "#8B5CF6", range: [46,  70],  icon: "🗄️" },
  { id: 4, title: "Portfolio + Freelance",color: "#10B981", range: [71,  90],  icon: "🚀" },
  { id: 5, title: "JS Deep Dive",        color: "#EF4444", range: [91,  115], icon: "🔬" },
  { id: 6, title: "DS & Algorithms",     color: "#F97316", range: [116, 150], icon: "🧠" },
  { id: 7, title: "System Design",       color: "#06B6D4", range: [151, 170], icon: "🏗️" },
  { id: 8, title: "Mock Interview",      color: "#D946EF", range: [171, 180], icon: "👑" },
];

const PORTFOLIO_PROJECTS = [
  { id: 1, phase: 1, day: 21,  emoji: "✅", title: "To-Do App",           tech: "HTML/CSS/JS",             desc: "Full CRUD + localStorage + filter + animations — deployed on GitHub Pages" },
  { id: 2, phase: 2, day: 28,  emoji: "⚛️", title: "React To-Do",         tech: "React + Hooks",           desc: "Rebuilt with useState/useEffect/useLocalStorage — hooks practice" },
  { id: 3, phase: 2, day: 33,  emoji: "🌤️", title: "Weather App",         tech: "React + OpenWeather API", desc: "Search city, 5-day forecast, loading/error states" },
  { id: 4, phase: 2, day: 40,  emoji: "🎨", title: "Landing Page Clone",  tech: "React + Tailwind",        desc: "Speed-built responsive clone — dark mode + animations" },
  { id: 5, phase: 2, day: 43,  emoji: "📦", title: "Component Library",   tech: "React + Tailwind",        desc: "Button, Input, Modal, Form, Toast — reusable design system" },
  { id: 6, phase: 3, day: 59,  emoji: "📝", title: "CRUD Blog",           tech: "Next.js + Supabase",      desc: "Auth, posts CRUD, search — production deployed" },
  { id: 7, phase: 3, day: 70,  emoji: "🛠️", title: "Mini SaaS App",       tech: "Next.js + Supabase + RLS",desc: "Full SaaS: auth, dashboard, file upload, mobile ready" },
  { id: 8, phase: 4, day: 75,  emoji: "🌟", title: "Portfolio Website",   tech: "Next.js / React",         desc: "Hero, projects, contact form — Lighthouse >90, deployed" },
  { id: 9, phase: 4, day: 90,  emoji: "💼", title: "Freelance Profiles",  tech: "Upwork + Fastwork",       desc: "Live profiles, 10+ proposals sent, first client pipeline" },
  { id: 10, phase: 5, day: 97,  emoji: "🤖", title: "AI-Powered SaaS",     tech: "Next.js + Claude API",      desc: "AI summarization + streaming UI + cost tracking dashboard — production-ready • AI dev premium rate 40-44%" },
  { id: 11, phase: 5, day: 103, emoji: "💳", title: "Multi-Gateway Checkout", tech: "Stripe + Omise + PayPal", desc: "3 payment gateways + refund + reconciliation report — งานแบบนี้ราคา ฿50K-150K/project" },
  { id: 12, phase: 7, day: 165, emoji: "🔄", title: "Legacy Migration Case", tech: "PHP/jQuery → Next.js",     desc: "Before/after architecture diagram + migration playbook + perf benchmark — Migration specialist niche" },
];

const PORTFOLIO_STATUS = [
  { key: "notstarted", label: "ยังไม่เริ่ม", color: "#6B7280" },
  { key: "building",   label: "กำลังทำ",     color: "#F59E0B" },
  { key: "done",       label: "เสร็จแล้ว",   color: "#3B82F6" },
  { key: "live",       label: "🚀 Live!",    color: "#10B981" },
];

const UPGRADE_TRACK = [
  { phase: "Day 5-14", focus: "JS Core", goal: "Functions, arrays, objects, scope, pattern logic" },
  { phase: "Day 15-30", focus: "DOM + Async + API", goal: "Events, fetch, loading/error states, mini CRUD app" },
  { phase: "Day 31-45", focus: "React + TypeScript", goal: "Typed components, props/state/events, dashboard app" },
  { phase: "Day 46-60", focus: "Production Mindset", goal: "Performance, testing, accessibility, portfolio polish" },
];

// ─── DAY OVERRIDES (Business/Sales + AI + Specialized) ─────────────
// Inject high-market-value content into specific days. Applied after DAYS is built.

const DAY_OVERRIDES = {
  // ── PHASE 4: Business / Sales (replaces generic Upwork/bid content) ──
  78: {
    title: "Niche Selection 🎯",
    topic: "positioning + market fit",
    hasPretest: true,
    pretest: "วิเคราะห์ skill ตัวเอง 10 ทักษะ + research Upwork (filter: 'Most Recent') ดู niche ไหน competition < 50 proposals แต่ rate > $30/hr — เลือก 1 niche",
    build: [
      "Research 3 niches: Shopify dev / Stripe integration / AI app dev — บันทึก rate range + demand",
      "ดู Upwork + Toptal — niche ไหน competition น้อย rate สูง (เก็บ screenshot 3 jobs/niche)",
      "เขียน positioning statement 1 ประโยค: 'ผมช่วย [target customer] solve [problem] ด้วย [solution]'",
      "อัพเดต portfolio ให้ focus niche เดียว — ลบงานที่ไม่เกี่ยว (ดูแล้วงงน้อยกว่าครบ)"
    ],
    challenge: "เลือก 1 niche จาก: E-commerce dev / AI integration specialist / SaaS builder / Migration expert — เขียน 1-page positioning doc + ลิสต์ case studies 5 อันที่ match niche",
    value: "Generalist freelancer rate $20-30/hr • Specialist $80-150/hr — niche selection = 3-5x rate multiplier",
  },
  79: {
    title: "Outcome-Based Pricing 💰",
    topic: "value pricing vs hourly",
    hasPretest: true,
    pretest: "คำนวณ value ของโปรเจกต์เก่า 1 ตัว: ลูกค้าจ่ายเท่าไหร่ vs สร้าง revenue/saved cost ให้เท่าไหร่ — คำนวณ ROI multiplier (ปกติ 5x-20x)",
    build: [
      "อ่าน 'Hourly vs Value Pricing' (Jonathan Stark / Brennan Dunn) — 30 นาที",
      "เขียน 3 service packages: Basic / Pro / Premium พร้อม deliverables + pricing + timeline",
      "Calculate ROI: ถ้า checkout integration เพิ่ม conversion 5% × traffic 10K/เดือน × AOV ฿500 = ฿250K/เดือน → คิดเงิน ฿50K-100K สมเหตุสมผล",
      "Practice quote 5 imaginary projects ด้วย value-based pricing (ไม่ใช่ hourly)"
    ],
    challenge: "เปลี่ยน hourly rate $30/hr → project pricing เฉลี่ย $5K (basic) / $15K (pro) / $30K+ (premium) — เขียน pricing page ลง portfolio",
    value: "Hourly cap ≈ ฿15K/mo เพดาน (160hrs × ฿1K) • Value pricing = ไม่มีเพดาน",
  },
  81: {
    title: "Cold Outreach 📧",
    topic: "non-platform client acquisition",
    hasPretest: true,
    pretest: "หาธุรกิจในเชียงใหม่/กรุงเทพ 10 ที่: (a) เว็บ load > 5s, (b) ไม่ responsive, (c) ไม่มีเว็บเลย — บันทึก contact email/LINE OA",
    build: [
      "เขียน cold email template 3 versions: problem-first / social-proof-first / ROI-first",
      "Personalize 10 emails — research แต่ละธุรกิจ + reference เฉพาะเจาะจง 1 อย่าง (ไม่ใช่ template ดิบๆ)",
      "ส่ง 10 emails ผ่าน Gmail — track ด้วย Mailtrack หรือ Streak (free tier)",
      "Setup spreadsheet: target, email date, opened, replied, meeting booked — conversion funnel"
    ],
    challenge: "ส่ง 20 cold emails จริง (ไม่ใช่ Upwork proposal) — เป้า reply rate ≥10% + 1 meeting booked",
    value: "Upwork = แข่ง 50 bidders/job • Cold outreach = 1-on-1 ไม่มีคู่แข่ง + rate สูงกว่า 2-3x",
  },
  86: {
    title: "Retainer Strategy 🔁",
    topic: "monthly recurring revenue (MRR)",
    hasPretest: true,
    pretest: "วิเคราะห์ LTV ของ 1 client: one-time ฿50K vs retainer ฿15K/เดือน × 12 = ฿180K — กำไรไหนเยอะกว่า + ทำไม",
    build: [
      "เรียน retainer models: maintenance (bug fix), hosting (DevOps), monthly updates (feature), monitoring (uptime/Sentry)",
      "เขียน retainer agreement template: scope, hours/month, rollover policy, 30-day cancellation, kill-switch",
      "Calculate break-even: 5 retainers × ฿15K = ฿75K/mo guaranteed (ก่อนหา project ใหม่)",
      "Pitch retainer ให้ client เก่า 3 คน: 'หลัง launch ผมดูแลต่อ ฿15K/mo + priority response'"
    ],
    challenge: "Convert 1 one-time client → retainer ฿15K/mo (3-month minimum + auto-renew)",
    value: "5 retainers = ฿75K/mo base income — แม้ไม่มี project ใหม่ยังมี cashflow",
  },
  87: {
    title: "Scope Creep Management 🚧",
    topic: "difficult client conversations",
    hasPretest: true,
    pretest: "ลูกค้าขอ feature เพิ่มกลางทาง ('แค่นิดเดียว เพิ่ม dashboard นิดนึง') — เขียน response 3 versions: (a) ปฏิเสธ, (b) ยอมฟรี, (c) charge extra — version ไหนดีที่สุดและทำไม",
    build: [
      "อ่านสรุป 'Difficult Conversations' (Stone & Patton) — focus chapter 3 (feelings) + 5 (purpose)",
      "Practice 5 scope creep scenarios ด้วย AI roleplay: 'pretend you are a client demanding...'",
      "เขียน change order template: original scope / new request / time impact / cost impact / approval signature",
      "Roleplay 3 conversations กับ AI จนคำตอบไหลลื่น — ก่อนเจอ client จริง"
    ],
    challenge: "Handle 3 scope creep requests จริง — maintain relationship + charge extra ≥฿5K per request",
    value: "1 unmanaged scope creep = -50% project margin • Managing well = +30% revenue per project",
  },
  88: {
    title: "Estimation Accuracy ⏱️",
    topic: "project breakdown + buffer",
    hasPretest: true,
    pretest: "Project ที่เพิ่งทำเสร็จ — ตอนแรก estimate กี่ชั่วโมง? ใช้จริงกี่ชั่วโมง? ผิดพลาดกี่ % (signed +/-)",
    build: [
      "Break down 1 project เป็น 20+ tasks: frontend / backend / deploy / testing / revision / meetings / debug buffer",
      "Estimate per task ด้วย 3-point: best + 4×likely + worst, หารด้วย 6 (PERT)",
      "Add 30% buffer สำหรับ unknowns + 20% สำหรับ communication/meetings",
      "Track actual time ทุก task ด้วย Toggl free — compare estimate vs actual ทุกวัน"
    ],
    challenge: "Estimate 1 project (≥20 tasks) ให้ accuracy ±20% — บันทึก variance per task ทุกอัน",
    value: "Underestimate = ทำฟรี/ขาดทุน • ±20% accuracy = predictable margin = sustainable freelance business",
  },

  // ── PHASE 5: AI Integration (replaces 'this'/proto/classes — high-value pivot) ──
  95: {
    title: "AI Features P1 — Claude API 🤖",
    topic: "API integration + auth + cost",
    hasPretest: true,
    pretest: "ออกแบบ feature ที่ใช้ AI ใน todo app — เขียน user story + cost estimate ต่อ request (input tokens + output tokens × price)",
    build: [
      "Setup Anthropic SDK + .env API key (อย่า hardcode ใน client!)",
      "เรียก claude-sonnet-4 จาก Next.js API route (server-side only)",
      "Error handling: rate limit 429 / invalid key 401 / content policy 400 — ทุก case มี user-friendly message",
      "Token counting + cost calculation: input × $3/MT + output × $15/MT — แสดง cost real-time"
    ],
    challenge: "Build /api/summarize endpoint รับ text → return AI summary + cost in cents — handle 3 error cases + log ทุก call",
    value: "AI dev rate $80-200/hr (40-44% premium vs general dev) — 2026 fastest growing niche ใน freelance",
  },
  96: {
    title: "AI Features P2 — Streaming UX 🌊",
    topic: "Server-Sent Events + token streaming",
    hasPretest: true,
    pretest: "ทำไม streaming ดีกว่า full response? เขียน UX comparison: user waits 8s blank screen vs sees text typing wordwise",
    build: [
      "Implement Claude API streaming: messages.stream() + iterate event chunks",
      "Server-Sent Events จาก Next.js Route Handler — content-type: text/event-stream",
      "React UI: accumulate chunks ใน useState + auto-scroll + 'AI is typing...' indicator",
      "Abort controller: ปุ่ม Stop generation ที่ทำงานจริง (cancel stream + bill เฉพาะ tokens ที่ใช้)"
    ],
    challenge: "Build AI chat UI ที่ stream response real-time + stop button + token counter live update + retry on disconnect",
    value: "Streaming UX = production-grade ฿30K+/project • Non-streaming UI = junior tier ฿5K — ลูกค้ารู้สึก premium ทันที",
  },
  97: {
    title: "AI Features P3 — Cost + Caching 💸",
    topic: "production AI economics",
    hasPretest: true,
    pretest: "ถ้า user ถาม 'สรุป docs' บ่อยๆ ด้วย context เดียวกัน — ลด cost 90% ยังไง?",
    build: [
      "Implement Anthropic prompt caching (cache_control: ephemeral) — 5-min TTL — เห็น cache hit rate",
      "Cost monitoring dashboard: total cost today / per-user / per-feature — chart bar",
      "Rate limiting per user (Upstash Redis free tier): 50 requests/day, sliding window",
      "Fallback chain: Opus → Sonnet → Haiku ถ้า rate limit / error — cost descending"
    ],
    challenge: "เพิ่ม AI summarization ให้ blog app + cost tracking dashboard + ลด cost 70% ด้วย prompt caching (วัดก่อน/หลัง)",
    value: "AI app ที่ไม่มี cost control = bankrupt ใน 1 สัปดาห์ • Cost-optimized = scalable SaaS ที่ขายได้จริง",
  },

  // ── PHASE 5 end: Payment Integration (replaces some advanced TS) ──
  102: {
    title: "Payment Integration P1 — Stripe ⚡",
    topic: "Stripe Checkout + webhooks",
    hasPretest: true,
    pretest: "ออกแบบ payment flow: user → Stripe Checkout → success page → DB update — วาด sequence diagram ก่อน code (10 นาที)",
    build: [
      "Setup Stripe test mode + .env keys (publishable client / secret server)",
      "Create /api/checkout: stripe.checkout.sessions.create พร้อม metadata orderId",
      "Webhook handler /api/webhook/stripe: verify signature (constructEvent) + handle checkout.session.completed + idempotency",
      "Test ด้วย Stripe CLI + test cards: 4242 success / 4000 0027 6000 3184 3DS / 4000 0000 0000 0002 decline"
    ],
    challenge: "Build full checkout: cart → Stripe Checkout → webhook → save order Supabase → email receipt — handle replay + double-charge",
    value: "งาน Stripe integration ราคา ฿50K-150K/project — ลูกค้าหาคนทำได้ยากเพราะ in-house dev กลัวพลาด",
  },
  103: {
    title: "Payment Integration P2 — Omise + PayPal 🇹🇭",
    topic: "Thai gateway + refunds + reconciliation",
    hasPretest: true,
    pretest: "ทำไมต้อง Omise ในไทย (PromptPay/TrueMoney/Rabbit LINE Pay)? เขียน trade-off matrix vs Stripe (fee, settle time, payment methods)",
    build: [
      "Omise SDK setup — รองรับ PromptPay QR + credit card (3DS) + Internet Banking",
      "PayPal Checkout integration (Standard Integration v2 API)",
      "Refund logic: full refund + partial refund + reason tracking + DB sync",
      "Reconciliation report: รายวันเทียบ payment gateway balance vs DB orders — ใช้ cron"
    ],
    challenge: "ต่อ 3 gateways (Stripe + Omise + PayPal) เข้า 1 checkout page — user เลือกได้ + handle refund 3 ทาง + daily recon",
    value: "Multi-gateway integration = niche ที่จ่ายแพง — Thai businesses ต้องการแต่ developer ส่วนใหญ่ทำไม่เป็น (ค่าตัว ฿80K+/project)",
  },

  // ── PHASE 5 end: Integration Architecture ──
  113: {
    title: "Integration Architecture P1 — Webhooks 🪝",
    topic: "event-driven integration",
    hasPretest: true,
    pretest: "ทำไม polling แย่กว่า webhooks? เขียน comparison: latency / cost / reliability / scalability (4 dimensions)",
    build: [
      "Design webhook receiver pattern: verify signature + idempotency key (X-Idempotency-Key header) + retry logic",
      "Use ngrok + Cloudflare Tunnel สำหรับ local webhook testing",
      "Implement retry queue ด้วย Upstash QStash (free tier 500/day) — exponential backoff",
      "Dead letter queue: ถ้า retry 3 ครั้ง fail → log to DB + alert (Discord webhook / email)"
    ],
    challenge: "Build webhook receiver ที่ idempotent + retry + DLQ — test ด้วย 1000 events จาก Stripe CLI replay",
    value: "Integration specialist niche — ลูกค้าจ่าย ฿50K-100K/integration เพราะ in-house team ทำ reliability ไม่เป็น",
  },
  114: {
    title: "Integration Architecture P2 — Multi-API 🔗",
    topic: "3rd party orchestration + saga pattern",
    hasPretest: true,
    pretest: "Order มาเข้า → ต้อง: (1) charge Stripe, (2) ส่ง LINE notify, (3) email confirmation, (4) update inventory — ถ้า step 3 fail ทำยังไง? (ไม่ refund ใช่ไหม?)",
    build: [
      "LINE OA Messaging API: push notification เมื่อมี order (verify webhook signature)",
      "Email ด้วย Resend (free 100/day) — template + retry on bounce",
      "Saga pattern: ถ้า step ไหน fail → compensate (refund + cancel order + notify user)",
      "Observability: trace ID propagate ทุก service (X-Request-ID header) — debug ได้ใน 1 search"
    ],
    challenge: "ต่อ 3 APIs (LINE OA + Stripe + Resend) เข้าใน 1 order flow + saga rollback + trace ID + integration test",
    value: "Integration architect rate $100-150/hr — เพราะ system ที่ unreliable = ลูกค้าเสียเงินทุกวัน, ROI ของการจ้างคนแก้สูงมาก",
  },

  // ── PHASE 7: Production-grade skills ──
  158: {
    title: "Production Debugging 🚨",
    topic: "incident response + observability",
    hasPretest: true,
    pretest: "Production พังตี 2 — เขียน checklist 10 ขั้น: what to do first / never do / who to notify / when to escalate",
    build: [
      "Setup Sentry: error tracking + performance + session replay (free tier 5K events/month)",
      "Structured logging: pino + log levels (error/warn/info/debug) + correlation ID ทุก request",
      "Replay user session ใน Sentry — ดู actual user clicks/network ก่อน error เกิด",
      "Hotfix workflow: branch → minimal fix → test → deploy → post-mortem doc (blameless)"
    ],
    challenge: "Debug bug จาก production log จริง (Sentry alert + user complaint) — fix + write post-mortem 1 page",
    value: "Senior dev = แก้ prod bug ใน 1 hr • Junior = panic 6 hr → รายได้ต่างกัน 2-3x เพราะ ลูกค้าจ่ายเพื่อ peace of mind",
  },
  162: {
    title: "Database Scaling 🗄️",
    topic: "query optimization + indexes + pooling",
    hasPretest: true,
    pretest: "Query ช้า 5 วินาที (รัน 100×/min) — เขียน 5 hypotheses ก่อนเช็ค + plan investigation step-by-step",
    build: [
      "EXPLAIN ANALYZE ใน PostgreSQL — อ่าน execution plan + cost + actual time",
      "Add indexes: B-tree / partial / composite — เลือกใช้เมื่อไหร่ + cost ของ index write",
      "N+1 query detection + fix ด้วย .select() join หรือ DataLoader",
      "Connection pooling ด้วย PgBouncer / Supabase pooler — transaction vs session mode"
    ],
    challenge: "Optimize slow query จริง (Supabase production data ≥10K rows) จาก 5s → <100ms + benchmark before/after",
    value: "Performance engineer rate $120-200/hr • DB scaling skill = lifetime employable (ทุก app โต = ต้องการ)",
  },
};

// ─── DAYS DATA ───────────────────────────────────────────────────

const RAW_DAYS = [
  // ═══ PHASE 1: JS FOUNDATION (Day 1-21) ═══
  { day: 1, phase: 1, title: "Setup + Variables & Data Types", topic: "let, const, typeof",
    files: ["day01.js", "day01-challenge.js", "day01-notes.md"],
    hasPretest: false,
    learnUrl: "javascript.info/variables",
    build: ["พิมพ์ตัวอย่าง let/const/typeof (ห้าม copy)", "ทดลอง: const PI = 3.14 แล้ว reassign → จดerror", "ทดลอง block scope { let x }", "Challenge: Student Profile Calculator"],
    challenge: "สร้าง const student object ที่มี name, studentId, subjects (array ของ {name, score} 3 วิชา), คำนวณ total + average, ใช้ typeof เช็คทุก property, console.log ภาษาไทย" },

  { day: 2, phase: 1, title: "Operators + Type Conversion", topic: "+ - * / %, ==, ===",
    files: ["day02.js", "day02-pretest.js", "day02-challenge.js"],
    hasPretest: true,
    pretest: "สร้าง const student ที่มี name, age, isActive, grades (array 3 เลข) console.log ทุก property + typeof, ทดลอง student.name = 'x' ได้ไหม และ student = {} ได้ไหม",
    learnUrl: "javascript.info/operators",
    build: ["BMI Calculator (weight/height²)", "Temperature Converter C↔F", "ทดลอง '5'+3 vs '5'-3", "Challenge: Tip Calculator"],
    challenge: "const bill=1250, people=4, tip=10%. คำนวณ: tip amount, total, คนละเท่าไหร่, ถ้าหารไม่ลงเหลือเศษเท่าไหร่ (%)" },

  { day: 3, phase: 1, title: "if/else + Conditional Logic", topic: "if, else, ternary, switch",
    files: ["day03.js", "day03-pretest.js", "day03-challenge.js"],
    hasPretest: true,
    pretest: "Grade Calculator — hardcode 3 วิชา (math=75, eng=82, sci=68), คำนวณเฉลี่ย, แสดงทุกอย่าง + typeof, เช็คเฉลี่ยคู่/คี่ด้วย %",
    learnUrl: "javascript.info/ifelse",
    build: ["พิมพ์ if/else if/else grade calculator", "Leap year checker (400/100/4 rule)", "ทดลอง if(0), if('0'), if([])", "Challenge: Rock Paper Scissors"],
    challenge: "const playerChoice, computerChoice (hardcode). Logic rock>scissors>paper>rock. เสมอ = 'เสมอ'. ทดสอบ 5 ครั้งด้วยค่าต่างกัน" },

  { day: 4, phase: 1, title: "Loops — for, while", topic: "for, while, break, continue",
    files: ["day04.js", "day04-pretest.js", "day04-challenge.js"],
    hasPretest: true,
    pretest: "RPS 3 รอบ — สะสม totalScore (ชนะ+10, เสมอ+5), จบแล้วแสดงคะแนน + grade A/B/C/D/F",
    learnUrl: "javascript.info/while-for",
    build: ["สูตรคูณแม่ 7 ด้วย for", "Sum 1-100", "While countdown 10→1", "FizzBuzz 1-100", "Challenge: Star Patterns"],
    challenge: "Pattern 1: สามเหลี่ยมชิดซ้าย, Pattern 2: สามเหลี่ยมชิดขวา (มี space), Pattern 3: พีระมิดตรงกลาง — คุมด้วย const size=5" },

  { day: 5, phase: 1, title: "Functions", topic: "declaration, expression, arrow, params",
    files: ["day05.js", "day05-pretest.js", "day05-utils.js"],
    hasPretest: true,
    pretest: "Pattern Builder — ทำพีระมิดจากวาน แต่ต้องทำกับ size 3, 5, 7, 10 (เห็นปัญหาไหม? ต้อง copy-paste)",
    learnUrl: "javascript.info/function-basics",
    build: ["function declaration 2 ตัว + expression 2 ตัว + arrow 2 ตัว", "Refactor pyramid → drawPyramid(size)", "ทดลอง default params", "Challenge: Utility Library"],
    challenge: "สร้าง day05-utils.js มี: isEven, isOdd, isPrime, factorial (loop), max(a,b,c), celsiusToF — ทดสอบทุกตัวด้วย console.log" },

  { day: 6, phase: 1, title: "Arrays พื้นฐาน", topic: "push, pop, length, indexOf, loop",
    files: ["day06.js", "day06-pretest.js", "day06-challenge.js"],
    hasPretest: true,
    pretest: "Score Tracker — 5 คน, หาคะแนนสูงสุด, ค่าเฉลี่ย, นับคนผ่าน (≥50) — ถ้าใช้ let s1..s5 คิดว่ามีวิธีดีกว่าไหม?",
    learnUrl: "javascript.info/array",
    build: ["สร้าง, access, modify, loop array ด้วย for + for...of", "Refactor Score Tracker ใช้ array", "Challenge: Array Manipulation (ห้ามใช้ .reverse() .sort())"],
    challenge: "เขียนเอง: reverse, findMax, findMin, sum, นับคู่/คี่ — ห้ามใช้ built-in methods อย่าง .reverse() หรือ .sort()" },

  { day: 7, phase: 1, title: "🏆 Week 1 Capstone — Grade Management", topic: "ทบทวนทั้งสัปดาห์",
    files: ["week1-capstone.js", "week1-reflection.md"],
    hasPretest: true,
    pretest: "CLOSE-BOOK EXAM 30 นาที — ไม่เปิดไฟล์เก่า",
    learnUrl: "",
    build: ["Capstone: Grade Management System", "Self-assessment rubric /10", "Deep reflection markdown", "AI Weekly Retrospective (template #6)"],
    challenge: "Array of 5 students ({name, scores[3]}), calculateAverage(), getGrade(), loop แสดงทุกคน, หาคนสูงสุด, นับเกรด A — 30 นาที close book" },

  // ═══ Week 2: Day 8-14 ═══
  { day: 8, phase: 1, title: "Array Methods — map, filter, reduce", topic: "higher-order functions",
    files: ["day08.js", "day08-pretest.js", "day08-challenge.js"],
    hasPretest: true,
    pretest: "Week 1 Recap — สร้าง array นักเรียน 5 คน หาคนที่คะแนนเฉลี่ย > 70 ด้วย for loop (ไม่ใช้ method ใหม่)",
    learnUrl: "javascript.info/array-methods",
    build: ["พิมพ์ map, filter, find, some, every ทีละตัว", "Refactor pretest ให้ใช้ filter + map", "ฝึก reduce: sum, average, max", "Challenge: Data Pipeline"],
    challenge: "Array of products [{name, price, category}]. ใช้ chain: filter category='food' → map เพิ่ม vat 7% → reduce หาราคารวม" },

  { day: 9, phase: 1, title: "Objects พื้นฐาน", topic: "literal, methods, this, Object.*",
    files: ["day09.js", "day09-pretest.js", "day09-challenge.js"],
    hasPretest: true,
    pretest: "Data Pipeline ซ้ำ — แต่คราวนี้ hardcode array products 5 ตัว แล้วทำ chain filter→map→reduce จากความจำ",
    learnUrl: "javascript.info/object",
    build: ["พิมพ์ object ที่มี method", "ทดลอง this ใน method", "Object.keys/values/entries + loop", "Challenge: Phonebook CRUD"],
    challenge: "Phonebook object ที่เก็บ {name: phone} — methods: add(name, phone), remove(name), search(name), listAll(). ทดสอบทุก method" },

  { day: 10, phase: 1, title: "Destructuring + Spread", topic: "{} = obj, ...rest, ...spread",
    files: ["day10.js", "day10-pretest.js", "day10-challenge.js"],
    hasPretest: true,
    pretest: "Phonebook จากความจำ — สร้างใหม่โดยไม่เปิดไฟล์เก่า (15 นาที)",
    learnUrl: "javascript.info/destructuring-assignment",
    build: ["Array destructuring: [a, b] = arr", "Object destructuring: {name, age} = user", "Spread: merge arrays/objects", "Rest params in functions", "Challenge: Student Filter"],
    challenge: "Array of students → function ที่รับ criteria และ return filtered list ด้วย destructuring params" },

  { day: 11, phase: 1, title: "String Methods + Regex เบื้องต้น", topic: "includes, split, replace, /regex/",
    files: ["day11.js", "day11-pretest.js", "day11-challenge.js"],
    hasPretest: true,
    pretest: "Array destructuring + spread — สร้าง 2 arrays แล้ว merge, แปลง user object เป็น array ด้วย Object.entries, ใช้ destructuring loop",
    learnUrl: "javascript.info/string",
    build: ["includes, indexOf, split, join", "replace + template literals", "Regex พื้นฐาน: .test(), .match()", "Challenge: Password Validator"],
    challenge: "function validatePassword(str): ≥8 ตัว, มีตัวเลข, มีตัวพิมพ์ใหญ่, มี special char. return {valid: bool, errors: []}" },

  { day: 12, phase: 1, title: "Scope, Closures & Error Handling", topic: "closure, try/catch",
    files: ["day12.js", "day12-pretest.js", "day12-challenge.js"],
    hasPretest: true,
    pretest: "Password Validator จากความจำ — ต้องเขียนจบใน 15 นาที",
    learnUrl: "javascript.info/closure",
    build: ["Global vs function vs block scope", "Closure: counter factory", "try/catch/finally", "Custom Error throw", "Challenge: Safe Calculator"],
    challenge: "function safeCalc(a, b, op) — รองรับ +, -, *, /. throw error ถ้า: หารศูนย์, type ผิด, operator ไม่รู้จัก. ใช้ try/catch caller" },

  { day: 13, phase: 1, title: "Async — Callbacks & Promises", topic: "setTimeout, Promise",
    files: ["day13.js", "day13-pretest.js", "day13-challenge.js"],
    hasPretest: true,
    pretest: "Closure Counter — สร้าง function makeCounter() return function ที่นับทีละ 1 ทุกครั้งที่เรียก",
    learnUrl: "javascript.info/promise-basics",
    build: ["setTimeout + callback", "new Promise + resolve/reject", "then/catch chain", "Mock API delay function", "Challenge: Sequential Promises"],
    challenge: "เขียน fakeApi(id, delay) ที่ return Promise. แล้วเรียก 3 ครั้งต่อเนื่อง (ไม่ parallel) ด้วย promise chain" },

  { day: 14, phase: 1, title: "🏆 Async/Await + Fetch", topic: "async, await, fetch",
    files: ["day14.js", "day14-pretest.js", "day14-challenge.js"],
    hasPretest: true,
    pretest: "Promise Chain — fakeApi 3 ครั้งจากความจำ (15 นาที)",
    learnUrl: "javascript.info/async-await",
    build: ["แปลง promise chain → async/await", "fetch() จาก JSONPlaceholder", "Error handling ด้วย try/catch + async", "Challenge: User Posts Fetcher"],
    challenge: "fetch jsonplaceholder.typicode.com/users → เลือก 3 คนแรก → สำหรับแต่ละคน fetch posts ของเขา → console.log {userName, postCount}" },

  // ═══ Week 3: Day 15-21 (DOM + Events) ═══
  { day: 15, phase: 1, title: "HTML + CSS เร็ว", topic: "tags, Flexbox",
    files: ["day15.html", "day15.css", "day15-challenge.html"],
    hasPretest: true,
    pretest: "User Posts Fetcher — เขียนใหม่จากความจำ 15 นาที",
    learnUrl: "web.dev/learn/css",
    build: ["สร้าง profile card ด้วย HTML/CSS", "Flexbox: justify, align, direction", "Responsive basics", "Challenge: Business Card Page"],
    challenge: "Static HTML หน้า business card สวยๆ — รูป + ชื่อ + ตำแหน่ง + contact icons, ใช้ Flexbox จัด" },

  { day: 16, phase: 1, title: "DOM Manipulation", topic: "querySelector, createElement",
    files: ["day16.html", "day16.js", "day16-challenge.html"],
    hasPretest: true,
    pretest: "Business Card HTML — สร้างจากความจำ (ไม่ต้องสวย แค่โครงถูก)",
    learnUrl: "javascript.info/document",
    build: ["querySelector vs getElementById", "textContent vs innerHTML", "createElement + appendChild", "classList.add/remove/toggle", "Challenge: Color Changer"],
    challenge: "หน้าที่มีปุ่ม 5 ปุ่ม (สีต่างกัน) — คลิกปุ่มไหน background เปลี่ยนเป็นสีนั้น + ข้อความ 'Current: [color]'" },

  { day: 17, phase: 1, title: "Events + Forms", topic: "addEventListener, preventDefault",
    files: ["day17.html", "day17.js", "day17-challenge.html"],
    hasPretest: true,
    pretest: "Color Changer จากความจำ",
    learnUrl: "javascript.info/events",
    build: ["click, submit, input, keydown events", "event.target, event.preventDefault", "Form handling", "Challenge: Real-time Search Filter"],
    challenge: "List รายชื่อผลไม้ 10 ชนิด + input search — พิมพ์แล้วกรอง list real-time (case-insensitive)" },

  { day: 18, phase: 1, title: "localStorage + JSON", topic: "setItem, getItem, parse",
    files: ["day18.html", "day18.js", "day18-challenge.html"],
    hasPretest: true,
    pretest: "Real-time Search — ทำซ้ำจากความจำ",
    learnUrl: "javascript.info/localstorage",
    build: ["localStorage setItem/getItem", "JSON.stringify/parse", "Save/load array of objects", "Challenge: Notes App"],
    challenge: "Notes app: เพิ่ม/ลบ note, บันทึก localStorage, refresh ไม่หาย, แต่ละ note มี timestamp" },

  { day: 19, phase: 1, title: "To-Do App Part 1", topic: "build from scratch",
    files: ["day19-todo/"],
    hasPretest: true,
    pretest: "Notes App สร้างใหม่ 15 นาที — โครงพื้นฐานเท่านั้น",
    learnUrl: "",
    build: ["HTML structure + CSS", "Add task + render list", "Delete task", "Toggle complete", "Save to localStorage"],
    challenge: "To-Do ที่ครบ CRUD พื้นฐาน + persistent ด้วย localStorage" },

  { day: 20, phase: 1, title: "To-Do App Part 2 — Polish", topic: "edit, filter, animations",
    files: ["day19-todo/"],
    hasPretest: true,
    pretest: "Open day19-todo → ลบ localStorage → ทดสอบว่าทุกฟีเจอร์ยังทำงาน",
    learnUrl: "",
    build: ["Edit mode (inline)", "Filter: All/Active/Completed", "CSS animations", "Clear completed button", "Task counter"],
    challenge: "เพิ่ม edit/filter/animations ให้ to-do จากวาน" },

  { day: 21, phase: 1, title: "🏆 PHASE 1 COMPLETE — Deploy", topic: "deploy + review",
    files: ["phase1-reflection.md"],
    hasPretest: true,
    pretest: "Close-book quiz 30 ข้อ (AI template #1) — ต้องได้ ≥ 24/30",
    learnUrl: "pages.github.com",
    build: ["Deploy to-do to GitHub Pages", "เขียน README มืออาชีพ", "Phase 1 reflection", "เขียน JS cheat sheet ส่วนตัว", "🎉 Celebrate!"],
    challenge: "Deploy + Phase 1 review" },

  // ═══ PHASE 2: React + Tailwind (Day 22-45) ═══
  ...generatePhaseMeta(22, 45, 2, [
    ["React Setup + JSX",           "create-react-app / Vite",    "วิธีสร้าง project + JSX syntax, component แรก, hot reload", "สร้าง Greeting component รับ props name, แสดง 'Hello, [name]!' — ห้ามดู tutorial"],
    ["Components + Props",          "reusable components",         "props passing, children, prop types, component composition", "สร้าง Card component รับ title/body/color — ใช้ 3 ครั้งด้วยข้อมูลต่างกัน"],
    ["useState — Forms",            "controlled inputs",           "useState hook, controlled input, form submit, validation", "Form ที่มี name/email/age — validate ก่อน submit, แสดง error inline"],
    ["useState — Objects/Arrays",   "immutable updates",           "spread update, array methods ใน state, อย่า mutate โดยตรง", "Shopping cart: add item, remove item, update quantity — ไม่ใช้ library"],
    ["useEffect basics",            "dependency array",            "mount/unmount/update lifecycle, cleanup, dep array", "Timer ที่นับขึ้น, pause/resume, reset — cleanup เมื่อ unmount"],
    ["Fetching Data",               "loading + error states",      "fetch ใน useEffect, loading/error/data state pattern", "Fetch users จาก JSONPlaceholder, แสดง skeleton loading + error message"],
    ["🏆 React To-Do",             "rebuild with React",          "rebuild To-Do App จาก Phase 1 ด้วย React", "To-Do ครบ CRUD + filter + localStorage hook — ห้ามดูโค้ดเก่า"],
    ["React Router",                "multi-page apps",             "BrowserRouter, Route, Link, useParams, useNavigate", "3 pages: Home/About/Users — navigate ด้วย Link + back button"],
    ["Weather App P1",              "API integration",             "fetch real API, API key, env variables, conditional render", "Fetch OpenWeather API ด้วย city name — แสดง temp/weather/icon"],
    ["Weather App P2",              "5-day forecast",              "map over data, date formatting, responsive card layout", "5-day forecast cards + search history 5 รายการสุดท้าย"],
    ["Custom Hooks",                "useFetch, useLocalStorage",   "extract logic ออกจาก component, reusable hook pattern", "สร้าง useFetch(url) และ useLocalStorage(key) — ใช้ใน Weather App"],
    ["Context API",                 "theme context",               "createContext, Provider, useContext — global state", "Dark/Light theme toggle ที่ทำงานทุก component โดยไม่ prop drill"],
    ["useReducer",                  "complex state",               "reducer pattern, action types, dispatch, vs useState", "Refactor cart จาก Day 25 ให้ใช้ useReducer"],
    ["🏆 Review + Refactor",       "code quality",                "code review checklist, extract components, naming", "Review Weather App — extract 3 custom components, ตั้งชื่อดีขึ้น"],
    ["Tailwind Setup",              "utility classes",             "install Tailwind, config, basic classes, responsive prefix", "Rebuild business card จาก Phase 1 ด้วย Tailwind — ห้าม inline style"],
    ["Tailwind Layout",             "flex + grid responsive",      "flex/grid utility, responsive breakpoints, container", "Responsive 3-column grid: mobile=1col, tablet=2col, desktop=3col"],
    ["Tailwind Animation",          "hover + dark mode",           "transition, hover:, dark:, group, peer modifier", "Card ที่ animate scale เมื่อ hover + dark mode toggle"],
    ["Clone Landing P1",            "pick a famous site",          "เลือก site จริง, วิเคราะห์ layout, สร้าง structure", "Hero section + Navbar ของ site ที่เลือก — pixel perfect"],
    ["Clone Landing P2",            "complete + deploy",           "ทำ section ที่เหลือ, deploy Vercel/Netlify", "ทำให้ครบทุก section + deploy + แนบ URL"],
    ["Clone Landing Speed Run",     "speed run 2hr",               "ทำ landing page ใหม่อีกครั้งด้วย speed — จับเวลา", "Landing page ใหม่ใน 2 ชั่วโมง — บันทึกเวลาจริง"],
    ["Component Library",           "Button, Input, Modal, etc.",  "variant props, size props, compound components", "Button (variant/size/loading), Input (label/error), Modal (open/close)"],
    ["Form UI + Validation",        "controlled + errors",         "react-hook-form หรือ custom, field validation, error display", "Registration form ที่ validate ทุก field + error message สวยงาม"],
    ["Dashboard UI",                "sidebar + charts",            "sidebar layout, recharts/chart.js, responsive collapse", "Admin dashboard: sidebar + 3 stat cards + 1 line chart"],
    ["🏆 Phase 2 Complete",        "deploy all",                  "review ทุก project, deploy, อัพ portfolio", "Deploy ทุก project + เขียน Phase 2 reflection 1 หน้า"],
  ]),

  // ═══ PHASE 3: Full-stack + DB (Day 46-70) ═══
  ...generatePhaseMeta(46, 70, 3, [
    ["Next.js Setup + Routing",     "App Router",                  "create next app, App Router structure, layout.js, page.js", "สร้าง Next.js app + 3 routes: / /about /contact — shared layout"],
    ["Server vs Client Components", "when to use which",           "'use client', async server components, data fetching server-side", "Page ที่ fetch data server-side + interactive client component"],
    ["API Routes",                  "route handlers",              "route.js, GET/POST/PUT/DELETE, request/response", "REST API: GET /api/posts, POST /api/posts — in-memory storage"],
    ["CRUD Blog P1",                "in-memory",                   "ต่อจาก API Route, read + create posts, list view", "Blog: list posts + create form — ข้อมูลใน memory"],
    ["CRUD Blog P2",                "edit + delete + search",      "edit form, confirm delete, search filter, pagination", "เพิ่ม edit/delete/search ให้ blog + paginate 5 posts/page"],
    ["TypeScript Basics",           "types + interfaces",          "type, interface, generic เบื้องต้น, strict mode", "Add TypeScript ให้ Blog — type ทุก prop, api response, state"],
    ["🏆 Server Actions",          "form without API",            "server action, revalidatePath, form + action attribute", "Blog ใช้ Server Action แทน API route — ลบ API files"],
    ["Supabase Setup",              "Postgres + client",           "สร้าง project, Table Editor, JS client, env vars", "สร้าง posts table + query จาก Next.js — แสดงข้อมูลจริง"],
    ["Supabase CRUD",               "real DB operations",          "select, insert, update, delete, error handling", "Blog CRUD ทำงานกับ Supabase จริง — ทดสอบ create/read/update/delete"],
    ["Supabase Auth",               "login/register",              "signUp, signIn, session, middleware protect route", "Login/Register page + protect /dashboard route"],
    ["Row Level Security",          "user data isolation",         "RLS policy, auth.uid(), user-scoped data", "เปิด RLS — user เห็นแค่ posts ตัวเอง + test ด้วย 2 accounts"],
    ["File Upload",                 "Supabase Storage",            "storage bucket, upload, getPublicUrl, image preview", "Upload thumbnail ให้ blog post + preview ก่อน submit"],
    ["Relations + Profiles",        "joins",                       "profiles table, foreign key, join query, author display", "แสดงชื่อ author ใน blog post — join users + profiles"],
    ["🏆 Blog Deploy",             "production ready",            "Vercel deploy, env vars production, domain, test live", "Blog live บน Vercel + ทดสอบทุก feature บน production"],
    ["Mini SaaS Plan",              "wireframe + schema",          "เลือก idea, wireframe 5 หน้า, DB schema, user flow", "Wireframe + schema + ลิสต์ features MVP"],
    ["SaaS Auth + Layout",          "dashboard",                   "auth flow, dashboard layout, sidebar, protected pages", "Login → Dashboard layout พร้อม sidebar + user info"],
    ["SaaS Core P1",                "main feature",                "core feature แรก, CRUD, real-time ถ้าเหมาะ", "Main feature ทำงานได้ end-to-end"],
    ["SaaS Core P2",                "CRUD complete",               "ทำ feature ให้ครบ, edge cases, empty states", "CRUD ครบทุก operation + empty state + loading state"],
    ["SaaS Advanced",               "PDF/calendar/DnD",            "เลือก advanced feature 1 อย่าง", "เพิ่ม 1 advanced feature (PDF export / date picker / drag-drop)"],
    ["SaaS Mobile Polish",          "responsive",                  "mobile nav, touch targets, responsive breakpoints", "ทดสอบบน mobile + แก้ทุก layout ที่พัง"],
    ["Security + Env",              ".env + RLS audit",            "audit .env, RLS policies, input validation, CORS", "Security checklist ✓ — ไม่มี secret ใน client code"],
    ["Testing Basics",              "Vitest + RTL",                "unit test, component test, mock, assertion", "Test 3 functions + 2 components — coverage >70%"],
    ["Performance + SEO",           "Lighthouse >90",              "metadata, og tags, image optimization, lazy load", "Lighthouse score >90 ทุก category"],
    ["Git Workflow",                "branches + PRs",              "feature branch, PR description, squash merge, tag", "สร้าง v1.0 tag + เขียน CHANGELOG.md"],
    ["🏆 Phase 3 Deploy",          "SaaS live",                   "deploy SaaS + domain + share", "SaaS live + share URL + Phase 3 reflection"],
  ]),

  // ═══ PHASE 4: Portfolio + Freelance (Day 71-90) ═══
  ...generatePhaseMeta(71, 90, 4, [
    ["Portfolio Plan",              "layout + design system",      "เลือก style, color palette, font, wireframe 5 sections", "Wireframe + color system + font pairing — บันทึกเป็น design-doc.md"],
    ["Hero + About",                "animated sections",           "hero animation, typing effect, about section, avatar", "Hero + About sections live — animation smooth"],
    ["Projects Section",            "3-4 best works",              "project card, case study link, tech tags, live demo", "Projects section แสดง 3-4 งานดีที่สุดพร้อม screenshot"],
    ["Contact + Deploy",            "form + social",               "contact form (Formspree/EmailJS), social links, deploy", "Contact form ส่งอีเมลได้จริง + Portfolio live"],
    ["Polish + Lighthouse",         "score >90",                   "optimize images, fix CLS, meta tags, og image", "Lighthouse >90 ทุก category — screenshot เก็บไว้"],
    ["Refine Old Projects",         "portfolio ready",             "เลือก 3 project เก่า, เพิ่ม README, fix bugs, screenshot", "3 projects พร้อม demo + README + live URL"],
    ["Case Study Write-up",         "1 deep project",              "เลือก SaaS, เขียน problem/solution/tech/lesson 500 คำ", "Case study หนึ่งหน้าพร้อม screenshots"],
    ["Upwork Profile",              "title + overview",            "headline, overview, skills, rate, portfolio section", "Upwork profile 100% complete + 1st proposal sent"],
    ["Fastwork + LinkedIn",         "Thai market",                 "Fastwork profile, LinkedIn summary, connect 50+ คน", "ทั้ง 2 platform active + LinkedIn 50+ connections"],
    ["Bid Training",                "proposal writing",            "วิเคราะห์งานที่ชนะ, สร้าง proposal template, personalize", "ส่ง 5 proposals จริง — บันทึก win/lose ใน spreadsheet"],
    ["More Bids + Comm",           "follow up",                   "follow up message, handling questions, negotiation", "ส่งอีก 5 proposals + follow up งานที่ไม่ตอบ"],
    ["Figma Basics",                "inspect + export",            "inspect panel, copy CSS, export assets, component inspect", "Export 5 assets จาก Figma design จริง + implement ใน code"],
    ["Speed Coding",                "landing in 2hr",              "จับเวลา, build จาก Figma mockup ให้ครบใน 2hr", "Landing page จาก mockup ใน 2 ชั่วโมง — บันทึกเวลา"],
    ["🏆 Bid Day",                 "10-15 proposals",             "ส่ง proposals เต็ม, track ทุกอัน, อ่าน feedback", "ส่ง 10-15 proposals วันเดียว + spreadsheet tracking"],
    ["Service Packages",            "tiered pricing",              "สร้าง Basic/Standard/Premium package + pricing", "Service packages พร้อมใช้บน Upwork/Fastwork"],
    ["Spec + Contract",             "protect yourself",            "scope of work, revision policy, payment terms template", "Contract template 1 หน้าพร้อมใช้จริง"],
    ["Continuous Bidding",          "daily routine",               "establish daily bid routine, track conversion rate", "Bid routine เป็น habit — บันทึก 7 วันติดต่อกัน"],
    ["Learn from Work",             "real project",                "ถ้าได้งาน: เรียนจากโปรเจค, ถ้าไม่: audit proposal ที่แพ้", "Project log หรือ proposal audit — lesson learned"],
    ["Freelance Review",            "plan next 90",                "review income/proposals/skills, วางแผน Day 91-180", "Freelance report + goal setting Day 91-180"],
    ["🏆 Day 90 — Freelance Ready","level up time",               "celebrate Phase 4, review ทั้งหมด, share achievement", "Phase 4 complete — share portfolio URL"],
  ]),

  // ═══ PHASE 5: JS Deep Dive (Day 91-115) ═══
  ...generatePhaseMeta(91, 115, 5, [
    ["Execution Context",           "call stack visualization",    "global EC, function EC, creation/execution phase, call stack", "วาด call stack diagram ของโค้ด 3 ตัวอย่าง — อธิบายปากเปล่า"],
    ["Hoisting + TDZ",              "var vs let/const",            "var hoisting, function hoisting, TDZ, temporal dead zone", "เขียน 5 snippet ที่ predict output ก่อน run — อธิบาย why"],
    ["Scope Chain + Lexical Env",   "closure foundation",          "scope chain lookup, lexical environment, outer reference", "วาด scope chain ของ nested function 3 ชั้น"],
    ["Closures Mastery",            "memoize, modules",            "closure use cases: memoize, partial apply, module pattern", "สร้าง memoize() function + module pattern ด้วย closure"],
    ["'this' Mastery",              "call/apply/bind",             "4 rules ของ this, arrow vs regular, call/apply/bind", "เขียน 10 this prediction — อธิบาย rule ที่ใช้ทุก case"],
    ["Prototype Chain",             "before ES6 classes",          "[[Prototype]], __proto__, Object.create, prototype chain", "สร้าง Animal → Dog chain ด้วย Object.create (ไม่ใช้ class)"],
    ["🏆 Classes Deep Dive",       "sugar over prototypes",       "class, extends, super, static, private field, ทำงานยังไง", "Class Animal → Dog → GoldenRetriever — อธิบาย prototype ที่อยู่เบื้องหลัง"],
    ["Event Loop Basics",           "micro vs macro task",         "call stack, web APIs, callback queue, microtask queue", "วาด event loop diagram ขณะ run โค้ด async 3 ตัวอย่าง"],
    ["Event Loop Advanced",         "rAF, queueMicrotask",         "requestAnimationFrame, queueMicrotask, NodeJS event loop", "predict output ของ setTimeout+Promise+queueMicrotask combo"],
    ["Promises Advanced",           "all, race, allSettled",       "Promise.all/race/allSettled/any — use cases ของแต่ละตัว", "Implement Promise.all จากศูนย์ด้วย new Promise"],
    ["Generators + Iterators",      "yield, Symbol.iterator",      "function*, yield, iterator protocol, for...of custom", "สร้าง infinite range generator + custom iterable object"],
    ["Proxy + Reflect + Symbols",   "metaprogramming",             "Proxy handler traps, Reflect, Symbol.iterator/toPrimitive", "Observable object ด้วย Proxy — log ทุก property access"],
    ["WeakMap + Memory",            "GC + leaks",                  "WeakMap/WeakSet, GC, memory leak patterns, DevTools heap", "หา memory leak ใน code snippet + fix ด้วย WeakMap"],
    ["🏆 Async Mastery Quiz",      "20 questions",                "close-book quiz — predict all async outputs correctly", "20 async output predictions — ต้องถูก ≥18/20"],
    ["Functional Programming",      "pure, compose, pipe",         "pure functions, immutability, compose, pipe operator", "Implement compose() และ pipe() — ใช้กับ 5 transformations"],
    ["Currying + Partial",          "higher-order tricks",         "curry function, partial application, point-free style", "Implement curry() generically — ทดสอบกับ 3+ arguments"],
    ["Design Patterns P1",          "singleton, observer, factory","Singleton, Observer, Factory — when to use, trade-offs", "สร้าง Event Emitter (Observer pattern) จากศูนย์"],
    ["Design Patterns P2",          "strategy, decorator, module", "Strategy, Decorator, Module — use cases จริง", "ใช้ Strategy pattern ทำ discount calculator หลาย algorithm"],
    ["Error Handling Mastery",      "custom errors + boundaries",  "custom Error classes, error hierarchy, async error patterns", "สร้าง error hierarchy: AppError → NetworkError / ValidationError"],
    ["Module Systems",              "CJS vs ESM, dynamic import",  "require vs import, tree shaking, dynamic import(), circular dep", "อธิบาย difference + dynamic import lazy component"],
    ["🏆 Internals Final",         "30 questions >90%",           "close-book exam ทุกหัวข้อ Phase 5 — ต้องได้ >90%", "30 questions — ≥27/30 ผ่าน"],
    ["TS Generics",                 "generic functions/classes",   "generic type parameter, constraint, infer, utility types", "สร้าง generic Stack<T> class + generic fetch wrapper"],
    ["TS Conditional + Mapped",     "advanced types",              "conditional type, mapped type, Template Literal Type", "Implement Partial<T>, Required<T>, Pick<T,K> จากศูนย์"],
    ["TS Type Guards",              "narrowing",                   "typeof, instanceof, discriminated union, assertion function", "Type-safe API response handler ด้วย discriminated union"],
    ["🏆 Phase 5 Complete",        "JS Expert unlocked",          "review Phase 5 ทั้งหมด + celebrate", "เขียน JS Internals cheat sheet 2 หน้า"],
  ]),

  // ═══ PHASE 6: DS & Algorithms (Day 116-150) ═══
  ...generatePhaseMeta(116, 150, 6, [
    ["Big-O Notation",              "time + space complexity",     "O(1) O(n) O(n²) O(log n) — analyze จาก code", "Analyze complexity ของ 10 function — อธิบายทุกตัว"],
    ["Arrays + Two Pointers",       "LC #1, #11, #26",            "two pointer technique, sliding window เบื้องต้น", "Solve LC #1 Two Sum + #11 Container Water + #26 Remove Dups"],
    ["Sliding Window",              "LC #3, #53, #121",           "fixed vs dynamic window, max subarray", "Solve LC #3 Longest Substring + #53 Max Subarray + #121 Stock"],
    ["Hash Map Pattern",            "LC #49, #128, #242",         "frequency map, grouping, anagram detection", "Solve LC #49 Group Anagram + #128 Consecutive + #242 Anagram"],
    ["String Problems",             "LC #8, #14, #125, #344",     "string parsing, two pointer on string, palindrome", "Solve 4 string problems — explain approach ก่อน code"],
    ["Stack",                       "LC #20, #155, #739",         "LIFO, monotonic stack, min stack pattern", "Solve LC #20 Valid Parentheses + #155 Min Stack + #739 Daily Temp"],
    ["🏆 Week 18 — 5 problems",   "timed drill",                 "5 problems ผสม 45 นาที — simulate interview", "5 problems จาก Array/Hash/Stack ใน 45 นาที — บันทึกเวลา"],
    ["Queue + Deque",               "LC #232, BFS setup",          "FIFO queue, deque, stack-to-queue implementation", "Implement Queue ด้วย 2 Stacks + LC #232"],
    ["Linked List P1",              "LC #21, #141, #206",          "reverse, detect cycle, merge sorted", "Solve LC #21 Merge Sorted + #141 Cycle + #206 Reverse"],
    ["Linked List P2",              "LC #2, #19, Floyd's",         "add numbers, remove Nth, Floyd's cycle detection", "Solve LC #2 Add Numbers + #19 Remove Nth + implement Floyd's"],
    ["Recursion",                   "LC #70, #326",               "base case, recursive case, recursion tree, tail call", "Solve LC #70 Climbing Stairs + #326 Power of 3 — วาด recursion tree"],
    ["Backtracking",                "LC #39, #46, #78",           "decision tree, pruning, choose/explore/unchoose", "Solve LC #39 Combination Sum + #46 Permutations + #78 Subsets"],
    ["Binary Search",               "LC #35, #153, #704",         "left/right boundary, rotated array, search space", "Solve LC #704 Binary Search + #35 Insert + #153 Find Min Rotated"],
    ["🏆 Week 19 — 5 problems",   "timed",                       "5 problems จาก List/Recursion/Binary Search ใน 45 นาที", "5 problems — บันทึก runtime + space complexity ทุกข้อ"],
    ["Binary Tree",                 "LC #100, #104, #226",         "DFS preorder/inorder/postorder, BFS, height", "Solve LC #100 Same Tree + #104 Max Depth + #226 Invert"],
    ["Tree BFS + DFS",              "LC #98, #102, #112",          "level order, validate BST, path sum", "Solve LC #98 Validate BST + #102 Level Order + #112 Path Sum"],
    ["BST",                         "LC #230, #235",              "inorder = sorted, LCA of BST, BST property", "Solve LC #230 Kth Smallest + #235 LCA of BST"],
    ["Heap / PQ",                   "LC #215, #347",              "min/max heap, heapify, top-K pattern", "Solve LC #215 Kth Largest + #347 Top K Frequent — implement MinHeap"],
    ["Trie",                        "LC #208, #212",              "prefix tree, insert/search/startsWith, word search", "Implement Trie จากศูนย์ + Solve LC #208 + #212"],
    ["Sorting Algorithms",          "merge, quick, heap",         "implement merge sort + quick sort + heap sort", "Implement ทั้ง 3 sorts + benchmark บน array 10000 elements"],
    ["🏆 Week 20 — Trees",        "5 tree problems",             "5 tree problems ใน 45 นาที", "5 tree/heap/trie problems — บันทึกเวลาทุกข้อ"],
    ["Graph Basics",                "adjacency list",             "adjacency list/matrix, directed/undirected, BFS/DFS setup", "สร้าง Graph class + BFS/DFS traversal จากศูนย์"],
    ["Graph BFS + DFS",             "LC #133, #200",              "clone graph, number of islands, connected components", "Solve LC #133 Clone Graph + #200 Number of Islands"],
    ["Topological Sort",            "LC #207, #210",              "DAG, Kahn's algorithm, DFS topological sort", "Solve LC #207 Course Schedule + #210 Course Schedule II"],
    ["Shortest Path",               "Dijkstra, LC #743",          "Dijkstra's algorithm, priority queue, network delay", "Implement Dijkstra + Solve LC #743 Network Delay Time"],
    ["DP Part 1",                   "LC #70, #198",               "top-down memo, bottom-up tabulation, 1D DP", "Solve LC #70 Climbing Stairs + #198 House Robber — both approaches"],
    ["DP Part 2",                   "LC #139, #300, #322",        "word break, LIS, coin change", "Solve LC #139 Word Break + #300 LIS + #322 Coin Change"],
    ["🏆 DP + Graph Review",       "6 problems",                 "6 problems DP+Graph ใน 60 นาที", "6 problems — explain approach ก่อน code ทุกข้อ"],
    ["DP 2D",                       "LC #62, #64, #1143",         "2D grid DP, unique paths, LCS", "Solve LC #62 Unique Paths + #64 Min Path + #1143 LCS"],
    ["Greedy",                      "LC #55, #134, #621",         "greedy choice, proof of correctness, local optimum", "Solve LC #55 Jump Game + #134 Gas Station + #621 Task Scheduler"],
    ["Intervals",                   "LC #56, #57, #435",          "sort by start, merge intervals, min removal", "Solve LC #56 Merge + #57 Insert + #435 Non-overlap Intervals"],
    ["Bit Manipulation",            "LC #136, #191, #338",         "AND/OR/XOR/NOT, bit tricks, count bits", "Solve LC #136 Single Number + #191 Hamming Weight + #338 Count Bits"],
    ["Pattern Recognition",         "choose right approach",       "flowchart: array/tree/graph/dp/greedy — เลือก pattern", "วาด decision flowchart ส่วนตัว + classify 10 random problems"],
    ["Speed Drill — 6 in 2hr",     "interview simulation",        "6 problems mixed difficulty ใน 2 ชั่วโมง — บันทึกทุกอย่าง", "6 problems timed — analyze ว่าตัวเองช้าตรงไหน"],
    ["🏆 Phase 6 — 10 Medium test","≥ 7/10 to pass",             "10 Mediums จาก random selection ใน 2hr — ≥7 ผ่าน", "10 LeetCode Mediums — screenshot score"],
  ]),

  // ═══ PHASE 7: System Design (Day 151-170) ═══
  ...generatePhaseMeta(151, 170, 7, [
    ["REST API Design",             "RESTful + Richardson",        "resource naming, HTTP methods, status codes, versioning, Richardson Maturity Model", "Design REST API สำหรับ Twitter-like app — endpoints + payloads"],
    ["Auth Deep Dive",              "JWT + OAuth2 internals",      "JWT structure, refresh token, OAuth2 flows, session vs token", "Sequence diagram: OAuth2 Authorization Code flow ทั้งหมด"],
    ["SQL Design",                  "normalization + indexes",      "1NF/2NF/3NF, index types, query optimization, EXPLAIN", "Design schema สำหรับ e-commerce — normalize + add indexes"],
    ["NoSQL + Caching",             "Redis patterns",              "Redis data structures, cache-aside, write-through, TTL, eviction", "Design caching layer สำหรับ read-heavy API — อธิบาย cache invalidation"],
    ["System Design Fundamentals",  "CAP + scalability",           "CAP theorem, horizontal/vertical scaling, load balancer, CDN", "อธิบาย trade-offs ของ CP vs AP system — ยกตัวอย่าง real system"],
    ["WebSocket + Real-time",       "SSE vs WebSocket",            "WebSocket protocol, SSE, long polling — เลือกอะไรใช้เมื่อไหร่", "Design real-time notification system — architecture diagram"],
    ["🏆 Design: URL Shortener",   "full exercise",               "45 นาที full system design: URL shortener (bit.ly clone)", "Diagram + คำอธิบาย: storage, hashing, redirect, analytics, scale"],
    ["Microservices vs Monolith",   "trade-offs",                  "monolith → service decomposition, inter-service comm, saga pattern", "เมื่อไหร่ควร split service — เขียน decision framework"],
    ["Message Queues",              "Kafka + RabbitMQ",            "pub/sub, topic, partition, consumer group, at-least-once delivery", "Design async order processing ด้วย message queue"],
    ["CI/CD + Docker",              "pipelines",                   "Dockerfile, multi-stage build, GitHub Actions, deploy pipeline", "เขียน Dockerfile + GitHub Actions workflow สำหรับ Next.js app"],
    ["Design: Twitter Feed",        "fan-out patterns",            "fan-out on write vs read, timeline generation, celebrity problem", "Full design: Twitter feed — อธิบาย trade-off ของ approach"],
    ["Design: Chat App",            "WhatsApp clone",              "message storage, delivery receipt, group chat, WebSocket at scale", "Full design: WhatsApp — diagram + explain each component"],
    ["Design: E-commerce",          "flash sales + payment",       "inventory lock, payment gateway, idempotency, flash sale handling", "Full design: flash sale system — prevent oversell"],
    ["🏆 Mock System Design",      "45min timed",                 "เพื่อน/AI เป็น interviewer — present + defend design", "Record หรือ transcript 45min mock — self-grade rubric"],
    ["Advanced React Patterns",     "render props, HOC",           "render props, HOC, compound components, headless components", "สร้าง headless Dropdown component ด้วย render props"],
    ["State Management",            "Zustand, React Query",        "Zustand store, React Query caching/mutation, เลือกอะไรใช้เมื่อไหร่", "Refactor SaaS app ให้ใช้ Zustand + React Query"],
    ["Advanced Next.js",            "middleware, edge",            "Middleware, Edge Runtime, ISR, on-demand revalidation", "เพิ่ม middleware auth + ISR ให้ blog จาก Phase 3"],
    ["GraphQL Fundamentals",        "vs REST",                     "schema, resolver, query/mutation/subscription, N+1 problem", "สร้าง simple GraphQL API + เปรียบเทียบ REST vs GraphQL"],
    ["Monitoring + Observability",  "logs, traces, alerts",        "structured logging, distributed tracing, Sentry, uptime monitor", "เพิ่ม Sentry error tracking + structured logs ให้ SaaS app"],
    ["🏆 Phase 7 Complete",        "System Architect",             "review Phase 7 ทั้งหมด + เขียน System Design cheat sheet", "System Design cheat sheet 2 หน้า + Phase 7 reflection"],
  ]),

  // ═══ PHASE 8: Mock Interview (Day 171-180) ═══
  ...generatePhaseMeta(171, 180, 8, [
    ["Mock: JS Trivia (30 questions)","≥27/30",                   "30 คำถาม JS internals, async, closures, this — ต้องได้ ≥27", "30 questions — screenshot score + review ทุก wrong answer"],
    ["Mock: Live Code #1",          "2 Mediums in 45min",         "simulate: 2 LeetCode Medium ใน 45 นาที พร้อม explain", "Record (ใช้ Loom) + replay ดูตัวเอง"],
    ["Mock: Live Code #2",          "1 Medium + 1 Hard",          "simulate: 1 Medium + 1 Hard ใน 60 นาที", "บันทึก: ใช้เวลาแต่ละข้อเท่าไหร่, ติดตรงไหน"],
    ["Mock: System Design",         "45min structured",           "full mock: clarify → estimate → design → deep dive → trade-off", "บันทึก transcript + diagram + self-score ด้วย rubric"],
    ["Mock: React Live Build",      "60min component",            "build React feature จาก spec ใน 60 นาที — clean code", "สร้าง component ตาม spec: 3 features, accessible, tested"],
    ["Mock: Full Stack Build",      "90min deploy",               "build + deploy mini app ใน 90 นาที — บอก requirements ตอนเริ่ม", "App live URL + code พร้อมส่ง"],
    ["🏆 Weakness Drill",          "weakest topic 2hr",          "identify 1-2 weakest areas จาก mocks ที่ผ่านมา — drill 2hr", "เพิ่ม score อย่างน้อย 20% ในหัวข้อที่อ่อน"],
    ["Expert Cheat Sheet",          "ultimate reference",         "สรุปทุกอย่าง: patterns, complexity, design vocab, JS gotchas", "Cheat sheet 4 หน้า — ส่วนตัว พร้อมใช้วันสัมภาษณ์"],
    ["Full Mock Day",               "3hr simulation",             "3 hr mock: 1hr coding + 1hr system design + 1hr behavioral", "Full mock บันทึก + score ทุก section"],
    ["👑 DAY 180 — EXPERT!",       "you made it",                "🎉 180 วันเสร็จ — เป็น JS Expert พร้อมสัมภาษณ์งาน", "🎉 Celebrate + share achievement + apply ≥5 jobs"],
  ]),
];

// Apply DAY_OVERRIDES on top of generated days
const BASE_DAYS = RAW_DAYS.map(d => DAY_OVERRIDES[d.day] ? { ...d, ...DAY_OVERRIDES[d.day] } : d);

function withTrackGoals(days) {
  return days.map((d) => {
    const build = Array.isArray(d.build) ? [...d.build] : [];
    const challenge = d.challenge || "";

    if (d.phase === 2 || d.phase === 3) {
      build.push("TypeScript track: เขียนงานวันนี้ด้วย type/interface ที่จำเป็น (no any โดยไม่จำเป็น)");
    }

    if (d.phase >= 2 && d.phase <= 7) {
      build.push("Testing habit: เพิ่มอย่างน้อย 1 unit test หรือ 1 component test จากงานวันนี้");
      build.push("A11y + Performance check: keyboard nav + loading state + render/perf sanity check");
    }

    if (d.phase >= 4) {
      build.push("Freelance expert track: บันทึก business outcome/case-study note สำหรับงานวันนี้ 3 บรรทัด");
    }

    if (d.phase >= 5 && d.phase <= 8) {
      build.push("English interview drill 10 นาที: อธิบายสิ่งที่ทำวันนี้เป็นภาษาอังกฤษแบบ concise");
    }

    return {
      ...d,
      build,
      challenge: `${challenge}${challenge ? " | " : ""}Dual Goal: job-ready React/TS + expert freelance outcome`,
    };
  });
}

const DAYS = withTrackGoals(BASE_DAYS);

function generatePhaseMeta(startDay, endDay, phaseId, titles) {
  const days = [];
  for (let i = 0; i < titles.length; i++) {
    const day = startDay + i;
    if (day > endDay) break;
    const t = titles[i];
    days.push({
      day,
      phase: phaseId,
      title: t[0],
      topic: t[1],
      files: [`day${String(day).padStart(2, "0")}/`],
      hasPretest: true,
      pretest: t[2] || "Recap yesterday's work from memory (15 min)",
      learnUrl: "",
      build: ["Pre-assessment 15 นาที (ห้าม Google)", "เรียน concept หลัก 15 นาที", "Build / solve ตาม protocol", "AI code review + debrief"],
      challenge: t[3] || "See Playbook for full details",
      isMeta: true,
    });
  }
  return days;
}

// ─── COMPONENT ───────────────────────────────────────────────────

export default function App() {
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem("expert-v3-done")) || {}; } catch { return {}; }
  });
  const [pretestResults, setPretestResults] = useState(() => {
    try { return JSON.parse(localStorage.getItem("expert-v3-pretest")) || {}; } catch { return {}; }
  });
  const [hintsUsed, setHintsUsed] = useState(() => {
    try { return JSON.parse(localStorage.getItem("expert-v3-hints")) || {}; } catch { return {}; }
  });
  const [portfolioData, setPortfolioData] = useState(() => {
    try { return JSON.parse(localStorage.getItem("expert-v3-portfolio")) || {}; } catch { return {}; }
  });
  const [incomeTarget, setIncomeTarget] = useState(() => {
    try { return parseInt(localStorage.getItem("expert-v3-income-target"), 10) || 100000; } catch { return 100000; }
  });
  const [reflections, setReflections] = useState(() => {
    try { return JSON.parse(localStorage.getItem("expert-v3-reflections")) || {}; } catch { return {}; }
  });

  const [expandedDay, setExpandedDay] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const [view, setView] = useState("overview");
  const [activeTab, setActiveTab] = useState("tracker");
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(null);

  useEffect(() => { try { localStorage.setItem("expert-v3-done",      JSON.stringify(done));          } catch {} }, [done]);
  useEffect(() => { try { localStorage.setItem("expert-v3-pretest",   JSON.stringify(pretestResults));} catch {} }, [pretestResults]);
  useEffect(() => { try { localStorage.setItem("expert-v3-hints",     JSON.stringify(hintsUsed));     } catch {} }, [hintsUsed]);
  useEffect(() => { try { localStorage.setItem("expert-v3-portfolio", JSON.stringify(portfolioData)); } catch {} }, [portfolioData]);
  useEffect(() => { try { localStorage.setItem("expert-v3-income-target", String(incomeTarget)); } catch {} }, [incomeTarget]);
  useEffect(() => { try { localStorage.setItem("expert-v3-reflections", JSON.stringify(reflections)); } catch {} }, [reflections]);

  const toggleBuild = useCallback((day, idx) => {
    setDone(p => {
      const k = `${day}-${idx}`;
      const n = { ...p };
      n[k] ? delete n[k] : (n[k] = true);
      return n;
    });
  }, []);

  const setPretest  = (day, result) => setPretestResults(p => ({ ...p, [day]: result }));
  const logHint     = (day, level) => setHintsUsed(p => ({ ...p, [day]: Math.max(p[day] || 0, level) }));

  const setPortfolio = (id, field, val) =>
    setPortfolioData(p => ({ ...p, [id]: { ...(p[id] || {}), [field]: val } }));

  const dayComplete = (day) => {
    const d = DAYS.find(x => x.day === day);
    if (!d) return false;
    return d.build.every((_, i) => done[`${day}-${i}`]) && (!d.hasPretest || pretestResults[day]);
  };

  const dayProgress = (day) => {
    const d = DAYS.find(x => x.day === day);
    if (!d) return 0;
    const total = d.build.length + (d.hasPretest ? 1 : 0);
    let count = d.build.filter((_, i) => done[`${day}-${i}`]).length;
    if (d.hasPretest && pretestResults[day]) count++;
    return count / total;
  };

  const phaseProgress = (pid) => {
    const pd = DAYS.filter(d => d.phase === pid);
    return pd.length ? pd.filter(d => dayComplete(d.day)).length / pd.length : 0;
  };

  const totalDoneDays = DAYS.filter(d => dayComplete(d.day)).length;
  const totalProgress = totalDoneDays / 180;
  const streak = (() => { let s = 0; for (const d of DAYS) { if (dayComplete(d.day)) s++; else break; } return s; })();
  const nextDay = DAYS.find(d => !dayComplete(d.day));
  const filtered = activePhase === 0 ? DAYS : DAYS.filter(d => d.phase === activePhase);

  // ─── STYLE ───
  const BG     = "linear-gradient(160deg, #050607 0%, #0A0B10 50%, #0E1015 100%)";
  const CARD   = "rgba(255,255,255,0.025)";
  const BORDER = "rgba(255,255,255,0.055)";
  const MUTED  = "#6B7280";
  const TEXT   = "#D1D5DB";

  // ─── SUB COMPONENTS ───

  const PretestCard = ({ day }) => {
    const result = pretestResults[day.day];
    const ph = PHASES.find(p => p.id === day.phase);
    return (
      <div style={{ background: result ? `${ph.color}10` : "rgba(239,68,68,0.06)", border: `1px solid ${result ? ph.color + "30" : "rgba(239,68,68,0.25)"}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 14 }}>🎯</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: result ? ph.color : "#EF4444", textTransform: "uppercase" }}>Pre-Assessment • 15 นาที</span>
        </div>
        <div style={{ fontSize: 12, color: TEXT, marginBottom: 10, lineHeight: 1.5 }}>{day.pretest}</div>
        <div style={{ fontSize: 10, color: "#F59E0B", marginBottom: 10, padding: "6px 8px", background: "rgba(245,158,11,0.08)", borderRadius: 6 }}>
          ⛔ ห้ามเปิด Google / AI / ไฟล์เก่า • เขียนจากความจำล้วน
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ label: "🟢 PASS", key: "pass", color: "#10B981" }, { label: "🟡 PARTIAL", key: "partial", color: "#F59E0B" }, { label: "🔴 FAIL", key: "fail", color: "#EF4444" }].map(opt => (
            <button key={opt.key} onClick={() => setPretest(day.day, opt.key)} style={{ flex: 1, padding: "7px 4px", borderRadius: 6, border: "none", background: result === opt.key ? opt.color : "rgba(255,255,255,0.05)", color: result === opt.key ? "#fff" : MUTED, fontSize: 10, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const HintPanel = ({ day }) => {
    const level = hintsUsed[day.day] || 0;
    const ph = PHASES.find(p => p.id === day.phase);
    return (
      <div style={{ marginTop: 10, padding: 10, background: "rgba(255,255,255,0.02)", borderRadius: 8, border: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, marginBottom: 8, letterSpacing: 1 }}>💡 HINT SYSTEM (ห้ามข้ามชั้น)</div>
        {[{ lv: 1, icon: "🥉", label: "Self-Hint", desc: "ถามตัวเอง 5 คำถาม" }, { lv: 2, icon: "🥈", label: "Concept Hint", desc: "จาก Playbook" }, { lv: 3, icon: "🥇", label: "AI Hint", desc: "Socratic prompt" }].map(h => (
          <div key={h.lv} onClick={() => logHint(day.day, h.lv)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", marginBottom: 4, background: level >= h.lv ? `${ph.color}15` : "rgba(255,255,255,0.02)", borderRadius: 6, cursor: "pointer", border: `1px solid ${level >= h.lv ? ph.color + "30" : "transparent"}` }}>
            <span>{h.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>{h.label}</div>
              <div style={{ fontSize: 9, color: MUTED }}>{h.desc}</div>
            </div>
            {level >= h.lv && <span style={{ fontSize: 10, color: ph.color }}>✓</span>}
          </div>
        ))}
      </div>
    );
  };

  const AIModal = () => {
    if (!activeTemplate) return null;
    const t = AI_TEMPLATES[activeTemplate];
    return (
      <div onClick={() => setActiveTemplate(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#0E1015", borderRadius: 14, padding: 20, maxWidth: 500, width: "100%", maxHeight: "80vh", overflowY: "auto", border: `1px solid ${BORDER}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>🤖 AI Prompt Template</div>
            <button onClick={() => setActiveTemplate(null)} style={{ background: "transparent", border: "none", color: MUTED, fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 10 }}>Copy แล้ว paste ใน Claude/ChatGPT — AI จะ guide ไม่ solve ให้</div>
          <pre style={{ background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8, fontSize: 11, color: TEXT, whiteSpace: "pre-wrap", lineHeight: 1.5, border: `1px solid ${BORDER}`, fontFamily: "monospace" }}>{t}</pre>
          <button onClick={() => navigator.clipboard?.writeText(t)} style={{ marginTop: 10, width: "100%", padding: "10px", borderRadius: 8, background: "#E8A838", color: "#000", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            📋 Copy to Clipboard
          </button>
        </div>
      </div>
    );
  };

  // ─── INCOME GOAL VIEW ───
  const IncomeCalcView = () => {
    const target = incomeTarget;
    const fmt = (n) => "฿" + Math.round(n).toLocaleString();

    // Scenarios
    const scenarios = [
      { label: "Hourly @ ฿800 (junior)",   rate: 800,   color: "#6B7280", note: "ต้องทำ " + Math.ceil(target/800)   + " hrs/mo" },
      { label: "Hourly @ ฿1,500 (mid)",    rate: 1500,  color: "#3B82F6", note: "ต้องทำ " + Math.ceil(target/1500)  + " hrs/mo" },
      { label: "Hourly @ ฿3,000 (senior)", rate: 3000,  color: "#8B5CF6", note: "ต้องทำ " + Math.ceil(target/3000)  + " hrs/mo" },
      { label: "Project @ ฿15K avg",        rate: 15000, color: "#F59E0B", note: Math.ceil(target/15000) + " projects/mo" },
      { label: "Project @ ฿50K avg",        rate: 50000, color: "#EF4444", note: Math.ceil(target/50000) + " projects/mo (specialist)" },
      { label: "Retainers ฿15K/mo × N",     rate: 15000, color: "#10B981", note: Math.ceil(target/15000) + " retainers (guaranteed)", isRetainer: true },
    ];

    // Skill gap (income-relevant days)
    const incomeSkills = [
      { day: 78,  label: "Niche Selection",          impact: "3-5x rate multiplier" },
      { day: 79,  label: "Value Pricing",            impact: "ทะลุ hourly ceiling" },
      { day: 81,  label: "Cold Outreach",            impact: "ไม่มี platform fees" },
      { day: 86,  label: "Retainer Strategy",        impact: "MRR ฿75K guaranteed" },
      { day: 87,  label: "Scope Creep Mgmt",         impact: "+30% margin/project" },
      { day: 88,  label: "Estimation Accuracy",      impact: "predictable profit" },
      { day: 97,  label: "AI Integration",           impact: "+40% rate premium" },
      { day: 103, label: "Payment Integration",      impact: "งาน ฿50K-150K" },
      { day: 114, label: "Multi-API Architecture",   impact: "$100-150/hr rate" },
      { day: 158, label: "Production Debugging",     impact: "Senior-tier work" },
    ];
    const gapsDone = incomeSkills.filter(s => dayComplete(s.day)).length;
    const gapsMissing = incomeSkills.length - gapsDone;

    // Realistic timeline based on current pace
    const daysCompleted = totalDoneDays;
    const daysPerWeek = streak > 0 ? Math.min(streak, 7) : 3;
    const weeksToFinish = Math.ceil((180 - daysCompleted) / daysPerWeek);

    return (
      <div style={{ padding: "0 14px 100px" }}>
        {/* Target input */}
        <div style={{ background: CARD, borderRadius: 10, padding: 14, marginBottom: 12, border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>🎯 Monthly Income Target</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 20, color: "#10B981", fontWeight: 800 }}>฿</span>
            <input
              type="number"
              value={incomeTarget}
              onChange={e => setIncomeTarget(parseInt(e.target.value, 10) || 0)}
              style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 20, fontWeight: 800, outline: "none", fontFamily: "monospace" }}
            />
            <span style={{ fontSize: 11, color: MUTED }}>/mo</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {[50000, 100000, 200000, 500000].map(v => (
              <button key={v} onClick={() => setIncomeTarget(v)} style={{ padding: "4px 10px", borderRadius: 99, border: `1px solid ${BORDER}`, background: incomeTarget === v ? "#10B981" : "transparent", color: incomeTarget === v ? "#000" : MUTED, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                ฿{(v/1000).toFixed(0)}K
              </button>
            ))}
          </div>
        </div>

        {/* Scenarios */}
        <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>📊 Realistic Scenarios</div>
        {scenarios.map((s, i) => {
          const hrsNeeded = s.isRetainer ? null : Math.ceil(target / s.rate);
          const feasible = s.isRetainer ? hrsNeeded <= 10 : hrsNeeded <= 160;
          return (
            <div key={i} style={{ background: CARD, borderRadius: 10, padding: 12, marginBottom: 5, border: `1px solid ${feasible ? s.color + "30" : "rgba(239,68,68,0.25)"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{s.label}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: s.color }}>{fmt(s.rate)}{s.isRetainer ? "/mo each" : (s.rate < 10000 ? "/hr" : "/proj")}</div>
              </div>
              <div style={{ fontSize: 11, color: feasible ? TEXT : "#EF4444", lineHeight: 1.5 }}>
                {feasible ? "✓ " : "⚠️ ไม่ realistic — "}{s.note}
              </div>
            </div>
          );
        })}

        {/* Timeline */}
        <div style={{ background: CARD, borderRadius: 10, padding: 14, marginTop: 12, border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>⏱️ Course Timeline (Realistic)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#E8A838" }}>{daysCompleted}</div>
              <div style={{ fontSize: 9, color: MUTED }}>Days done</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#3B82F6" }}>{daysPerWeek}</div>
              <div style={{ fontSize: 9, color: MUTED }}>Days/week pace</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>{weeksToFinish}w</div>
              <div style={{ fontSize: 9, color: MUTED }}>To finish</div>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: TEXT, lineHeight: 1.5, padding: "8px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 6 }}>
            {daysPerWeek >= 6 ? "🔥 ที่ pace นี้คุณจบใน " + weeksToFinish + " สัปดาห์ — บ้าระห่ำ!" : daysPerWeek >= 4 ? "👍 ที่ pace นี้จบใน " + weeksToFinish + " สัปดาห์ — sustainable" : "⚠️ pace ช้าไป — ลอง 5+ วัน/สัปดาห์เพื่อ build momentum"}
          </div>
        </div>

        {/* Skill Gap */}
        <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: 1.5, marginTop: 14, marginBottom: 8, textTransform: "uppercase" }}>
          🔍 Income-Critical Skills ({gapsDone}/{incomeSkills.length} unlocked)
        </div>
        <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.05)", marginBottom: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(gapsDone/incomeSkills.length)*100}%`, background: "linear-gradient(90deg, #10B981, #E8A838)" }} />
        </div>
        {incomeSkills.map(s => {
          const isDone = dayComplete(s.day);
          return (
            <div key={s.day} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: isDone ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.04)", borderRadius: 6, marginBottom: 4, border: `1px solid ${isDone ? "rgba(16,185,129,0.20)" : "rgba(239,68,68,0.15)"}` }}>
              <div style={{ fontSize: 14 }}>{isDone ? "✅" : "🔒"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: isDone ? "#10B981" : TEXT }}>Day {s.day}: {s.label}</div>
                <div style={{ fontSize: 10, color: MUTED }}>{s.impact}</div>
              </div>
            </div>
          );
        })}

        {gapsMissing > 0 && (
          <div style={{ marginTop: 12, padding: 12, background: "linear-gradient(135deg, rgba(232,168,56,0.10), rgba(239,68,68,0.06))", borderRadius: 10, border: "1px solid rgba(232,168,56,0.30)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E8A838", marginBottom: 4 }}>⚡ Gap Analysis</div>
            <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.5 }}>
              ยังขาด {gapsMissing} skills ที่กระทบรายได้โดยตรง — focus เรียงตาม day ascending จะ unlock rate multiplier เร็วสุด
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── WEEKLY REFLECTION VIEW ───
  const ReflectionView = () => {
    const totalWeeks = Math.ceil(180 / 7); // ~26 weeks
    const currentWeek = Math.max(1, Math.ceil((nextDay ? nextDay.day : 180) / 7));

    const setReflection = (week, field, val) => {
      setReflections(p => ({ ...p, [week]: { ...(p[week] || {}), [field]: val } }));
    };

    const questions = [
      { key: "q1", label: "1️⃣ สัปดาห์นี้เรียนอะไรที่เข้าใจจริง?", placeholder: "concept / pattern / aha moment..." },
      { key: "q2", label: "2️⃣ ใช้ AI กี่ครั้ง? (track เพื่อไม่ให้พึ่งมากไป)", placeholder: "0-50 ครั้ง — count quiz, hint, debug, review..." },
      { key: "q3", label: "3️⃣ ส่ง proposal / cold email กี่ครั้ง?", placeholder: "0 ก็เขียน 0 — ความจริงคือ data" },
      { key: "q4", label: "4️⃣ รายได้สัปดาห์นี้?", placeholder: "฿0 ก็โอเค — track เพื่อเห็น trend" },
      { key: "q5", label: "5️⃣ สิ่งที่จะปรับสัปดาห์หน้า?", placeholder: "ลด AI / เพิ่ม build / focus niche..." },
    ];

    const weeksWithData = Object.keys(reflections).map(k => parseInt(k, 10)).filter(n => !isNaN(n)).sort((a, b) => b - a);
    const weeksList = [...new Set([currentWeek, ...weeksWithData])].sort((a, b) => b - a);

    return (
      <div style={{ padding: "0 14px 100px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 14 }}>
          <div style={{ background: CARD, borderRadius: 10, padding: "10px 4px", textAlign: "center", border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: "#E8A838" }}>W{currentWeek}</div>
            <div style={{ fontSize: 9, color: MUTED }}>Current</div>
          </div>
          <div style={{ background: CARD, borderRadius: 10, padding: "10px 4px", textAlign: "center", border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: "#3B82F6" }}>{weeksWithData.length}</div>
            <div style={{ fontSize: 9, color: MUTED }}>Reflected</div>
          </div>
          <div style={{ background: CARD, borderRadius: 10, padding: "10px 4px", textAlign: "center", border: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: "#10B981" }}>{totalWeeks}</div>
            <div style={{ fontSize: 9, color: MUTED }}>Total wks</div>
          </div>
        </div>

        <div style={{ padding: "10px 12px", background: "rgba(232,168,56,0.06)", borderRadius: 8, marginBottom: 12, border: "1px solid rgba(232,168,56,0.20)" }}>
          <div style={{ fontSize: 11, color: "#E8A838", fontWeight: 700, marginBottom: 4 }}>📝 Why weekly reflection?</div>
          <div style={{ fontSize: 10, color: TEXT, lineHeight: 1.5 }}>
            Track AI usage → ไม่ให้พึ่งมาก • Track outreach → ไม่ลืมหารายได้ • Track income → เห็น trend จริง
          </div>
        </div>

        {weeksList.map(w => {
          const r = reflections[w] || {};
          const isExpanded = expandedWeek === w;
          const filled = questions.filter(q => r[q.key] && r[q.key].trim()).length;
          const isCurrent = w === currentWeek;

          return (
            <div key={w} style={{ background: isCurrent ? "rgba(232,168,56,0.06)" : CARD, borderRadius: 10, marginBottom: 6, border: `1px solid ${isCurrent ? "rgba(232,168,56,0.25)" : BORDER}`, overflow: "hidden" }}>
              <div onClick={() => setExpandedWeek(isExpanded ? null : w)} style={{ padding: "12px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: filled === 5 ? "#10B981" : isCurrent ? "#E8A838" : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: filled === 5 || isCurrent ? "#000" : MUTED }}>
                  W{w}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                    Week {w} {isCurrent && <span style={{ fontSize: 9, color: "#E8A838", marginLeft: 4 }}>● CURRENT</span>}
                  </div>
                  <div style={{ fontSize: 10, color: MUTED }}>Day {(w-1)*7+1} - {Math.min(w*7, 180)} • {filled}/5 questions</div>
                </div>
                <div style={{ fontSize: 11, color: MUTED, transform: isExpanded ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▼</div>
              </div>

              {isExpanded && (
                <div style={{ padding: "0 13px 12px", borderTop: `1px solid ${BORDER}` }}>
                  {questions.map((q, qi) => (
                    <div key={q.key} style={{ marginTop: qi === 0 ? 12 : 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginBottom: 4 }}>{q.label}</div>
                      <textarea
                        value={r[q.key] || ""}
                        onChange={e => setReflection(w, q.key, e.target.value)}
                        placeholder={q.placeholder}
                        rows={2}
                        style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.04)", color: TEXT, fontSize: 11, resize: "vertical", outline: "none", lineHeight: 1.5, fontFamily: "inherit", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ─── PORTFOLIO VIEW ───
  const PortfolioView = () => {
    const liveCount = PORTFOLIO_PROJECTS.filter(p => (portfolioData[p.id]?.status || "notstarted") === "live").length;
    const doneCount = PORTFOLIO_PROJECTS.filter(p => ["done", "live"].includes(portfolioData[p.id]?.status || "notstarted")).length;

    return (
      <div style={{ padding: "0 14px 100px" }}>
        {/* Portfolio Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 14 }}>
          {[
            { label: "Projects", value: PORTFOLIO_PROJECTS.length, sub: " total", c: "#E8A838" },
            { label: "Completed", value: doneCount, sub: " done", c: "#3B82F6" },
            { label: "Live", value: liveCount, sub: " deployed", c: "#10B981" },
          ].map((s, i) => (
            <div key={i} style={{ background: CARD, borderRadius: 10, padding: "10px 4px", textAlign: "center", border: `1px solid ${BORDER}` }}>
              <div><span style={{ fontSize: 19, fontWeight: 800, color: s.c }}>{s.value}</span><span style={{ fontSize: 9, color: MUTED }}>{s.sub}</span></div>
              <div style={{ fontSize: 9, color: MUTED, marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: 1.5, marginBottom: 10, textTransform: "uppercase" }}>
          🗂️ Projects ({PORTFOLIO_PROJECTS.length})
        </div>

        {PORTFOLIO_PROJECTS.map(proj => {
          const ph = PHASES.find(p => p.id === proj.phase);
          const pd = portfolioData[proj.id] || {};
          const status = pd.status || "notstarted";
          const st = PORTFOLIO_STATUS.find(s => s.key === status);
          const isExpanded = expandedProject === proj.id;
          const isUnlocked = nextDay ? proj.day <= (nextDay.day - 1) : true;

          return (
            <div key={proj.id} style={{ background: status === "live" ? `${ph.color}08` : CARD, borderRadius: 10, marginBottom: 6, border: `1px solid ${status === "live" ? ph.color + "28" : BORDER}`, overflow: "hidden" }}>
              <div onClick={() => setExpandedProject(isExpanded ? null : proj.id)} style={{ padding: "12px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 24, flexShrink: 0, opacity: isUnlocked ? 1 : 0.3 }}>{proj.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: isUnlocked ? TEXT : MUTED, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {proj.title}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: st.color, padding: "2px 7px", borderRadius: 99, flexShrink: 0 }}>
                      {st.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: ph.color, fontFamily: "monospace" }}>{proj.tech}</div>
                </div>
                <div style={{ fontSize: 11, color: MUTED, transform: isExpanded ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▼</div>
              </div>

              {isExpanded && (
                <div style={{ padding: "0 13px 12px", borderTop: `1px solid ${BORDER}` }}>
                  <div style={{ padding: "10px 0 6px", fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{proj.desc}</div>

                  <div style={{ fontSize: 10, color: MUTED, marginBottom: 6, display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ background: ph.color + "20", color: ph.color, padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>
                      {ph.icon} Phase {ph.id}
                    </span>
                    <span>Day {proj.day}</span>
                    {!isUnlocked && <span style={{ color: "#EF4444" }}>🔒 ยังไม่ถึง</span>}
                  </div>

                  {/* Status Buttons */}
                  <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>สถานะ</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 5, marginBottom: 10 }}>
                    {PORTFOLIO_STATUS.map(s => (
                      <button key={s.key} onClick={() => setPortfolio(proj.id, "status", s.key)} style={{ padding: "6px 4px", borderRadius: 6, border: "none", background: status === s.key ? s.color : "rgba(255,255,255,0.04)", color: status === s.key ? "#fff" : MUTED, fontSize: 9, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}>
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* URL */}
                  <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>Deploy URL</div>
                  <input
                    type="text"
                    placeholder="https://your-project.vercel.app"
                    value={pd.url || ""}
                    onChange={e => setPortfolio(proj.id, "url", e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.04)", color: TEXT, fontSize: 11, fontFamily: "monospace", outline: "none", boxSizing: "border-box", marginBottom: 10 }}
                  />

                  {/* Notes */}
                  <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>Notes / Lessons Learned</div>
                  <textarea
                    placeholder="สิ่งที่เรียนรู้, ปัญหาที่เจอ, improvement ideas..."
                    value={pd.notes || ""}
                    onChange={e => setPortfolio(proj.id, "notes", e.target.value)}
                    rows={3}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: `1px solid ${BORDER}`, background: "rgba(255,255,255,0.04)", color: TEXT, fontSize: 11, resize: "none", outline: "none", lineHeight: 1.5, fontFamily: "inherit", boxSizing: "border-box" }}
                  />

                  {/* Live link */}
                  {pd.url && (
                    <a href={pd.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 8, padding: "7px 12px", borderRadius: 6, background: `${ph.color}20`, color: ph.color, fontSize: 11, fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
                      🔗 Open Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ─── MAIN RENDER ───

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'SF Pro Display', 'Noto Sans Thai', -apple-system, system-ui, sans-serif" }}>
      <AIModal />

      {/* ─── HEADER ─── */}
      <div style={{ padding: "22px 20px 14px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: "0 0 auto 0", height: 200, background: "radial-gradient(ellipse at 50% 0%, rgba(232,168,56,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 10, letterSpacing: 5, color: "#E8A838", fontWeight: 700, textTransform: "uppercase", marginBottom: 4, position: "relative" }}>EXPERT TRACK • 180 DAYS</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 3px", background: "linear-gradient(135deg, #E8A838 0%, #EF4444 35%, #8B5CF6 70%, #10B981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", position: "relative" }}>
          No AI Shortcuts
        </h1>
        <p style={{ margin: 0, fontSize: 11, color: MUTED, position: "relative" }}>Self-driven • AI as coach, not crutch • Live code ready</p>
      </div>

      {/* ─── STATS ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, padding: "0 14px" }}>
        {[
          { label: "Days",     value: totalDoneDays,                   sub: "/180", c: "#E8A838" },
          { label: "Streak",   value: streak,                          sub: "d",    c: "#3B82F6" },
          { label: "Progress", value: Math.round(totalProgress * 100), sub: "%",    c: "#10B981" },
          { label: "Phase",    value: nextDay ? nextDay.phase : 8,     sub: "/8",   c: "#8B5CF6" },
        ].map((s, i) => (
          <div key={i} style={{ background: CARD, borderRadius: 10, padding: "10px 4px", textAlign: "center", border: `1px solid ${BORDER}` }}>
            <div><span style={{ fontSize: 19, fontWeight: 800, color: s.c }}>{s.value}</span><span style={{ fontSize: 9, color: MUTED, marginLeft: 1 }}>{s.sub}</span></div>
            <div style={{ fontSize: 9, color: MUTED, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ─── PROGRESS BAR ─── */}
      <div style={{ padding: "10px 14px 0" }}>
        <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden", position: "relative" }}>
          <div style={{ height: "100%", width: `${totalProgress * 100}%`, background: "linear-gradient(90deg, #E8A838, #EF4444, #F97316, #8B5CF6, #3B82F6, #06B6D4, #10B981, #D946EF)", transition: "width 0.6s" }} />
          {PHASES.slice(0, -1).map(p => (
            <div key={p.id} style={{ position: "absolute", top: -1, left: `${(p.range[1] / 180) * 100}%`, width: 1, height: 8, background: "rgba(255,255,255,0.2)" }} />
          ))}
        </div>
      </div>

      {/* ─── AI TOOLBOX ─── */}
      <div style={{ padding: "12px 14px 0" }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, color: MUTED, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>🤖 AI Toolbox</div>
        <div style={{ display: "flex", gap: 5, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {[{ k: "quiz", l: "Quiz Me", e: "❓" }, { k: "review", l: "Review", e: "🔍" }, { k: "hint", l: "Hint", e: "💡" }, { k: "debug", l: "Debug", e: "🐛" }, { k: "concept", l: "Explain", e: "📖" }, { k: "retro", l: "Weekly", e: "📊" }].map(t => (
            <button key={t.k} onClick={() => setActiveTemplate(t.k)} style={{ flex: "0 0 auto", padding: "6px 11px", borderRadius: 99, background: CARD, border: `1px solid ${BORDER}`, color: TEXT, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              {t.e} {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB SELECTOR ─── */}
      <div style={{ display: "flex", gap: 4, padding: "12px 14px 0", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {[
          { key: "tracker",   label: "📋 Tracker"   },
          { key: "portfolio", label: "🗂️ Portfolio" },
          { key: "income",    label: "💰 Income"    },
          { key: "reflect",   label: "📝 Reflect"   },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex: "1 0 auto", padding: "8px 10px", borderRadius: 8, border: `1px solid ${activeTab === tab.key ? "rgba(255,255,255,0.15)" : BORDER}`, background: activeTab === tab.key ? "rgba(255,255,255,0.08)" : CARD, color: activeTab === tab.key ? "#fff" : MUTED, fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TRACKER TAB ─── */}
      {activeTab === "tracker" && (
        <>
          {/* Phase Filter */}
          <div style={{ padding: "10px 14px 0", overflowX: "auto", whiteSpace: "nowrap", WebkitOverflowScrolling: "touch" }}>
            <button onClick={() => { setActivePhase(0); setView("overview"); }} style={{ display: "inline-block", padding: "6px 12px", borderRadius: 99, border: "none", marginRight: 5, fontSize: 11, fontWeight: 600, cursor: "pointer", background: activePhase === 0 ? "rgba(255,255,255,0.1)" : CARD, color: activePhase === 0 ? "#fff" : MUTED }}>All</button>
            {PHASES.map(p => (
              <button key={p.id} onClick={() => { setActivePhase(p.id); setView("days"); }} style={{ display: "inline-block", padding: "6px 12px", borderRadius: 99, border: "none", marginRight: 5, fontSize: 11, fontWeight: 600, cursor: "pointer", background: activePhase === p.id ? p.color + "25" : CARD, color: activePhase === p.id ? p.color : MUTED }}>
                {p.icon} P{p.id}
              </button>
            ))}
          </div>

          {/* Next Up */}
          {view === "overview" && nextDay && (() => {
            const ph = PHASES.find(p => p.id === nextDay.phase);
            return (
              <div onClick={() => { setActivePhase(nextDay.phase); setView("days"); setExpandedDay(nextDay.day); }} style={{ margin: "12px 14px 0", background: `linear-gradient(135deg, ${ph.color}18, ${ph.color}06)`, borderRadius: 12, padding: 14, border: `1px solid ${ph.color}35`, cursor: "pointer" }}>
                <div style={{ fontSize: 9, color: ph.color, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>▶ TODAY'S MISSION</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: "#fff" }}>Day {nextDay.day}: {nextDay.title}</div>
                <div style={{ fontSize: 10, color: MUTED }}>{ph.icon} Phase {ph.id} • {nextDay.topic}</div>
              </div>
            );
          })()}

          {/* Overview */}
          {view === "overview" && (
            <div style={{ padding: "12px 14px 100px" }}>
              <div style={{ marginBottom: 12, background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.08))", borderRadius: 12, border: "1px solid rgba(16,185,129,0.25)", overflow: "hidden" }}>
                <div style={{ padding: "12px 12px 8px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 10, color: "#10B981", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
                    Upgrade Track
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>
                    Day 5-60 React + TypeScript Job Path
                  </div>
                  <div style={{ fontSize: 10, color: MUTED, lineHeight: 1.45 }}>
                    Goal: move from JS foundation to job-ready portfolio for frontend applications.
                  </div>
                </div>
                <div style={{ padding: 12 }}>
                  {UPGRADE_TRACK.map((item) => (
                    <div key={item.phase} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 10, color: "#93C5FD", fontWeight: 700 }}>{item.phase}</span>
                        <span style={{ fontSize: 10, color: "#34D399", fontWeight: 700 }}>{item.focus}</span>
                      </div>
                      <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.45 }}>{item.goal}</div>
                    </div>
                  ))}
                </div>
              </div>

              {[{ label: "🎯 FOUNDATION → FREELANCE", phases: PHASES.slice(0, 4) }, { label: "🔥 ADVANCED → EXPERT", phases: PHASES.slice(4) }].map((sec, si) => (
                <div key={si} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8 }}>{sec.label}</div>
                  {sec.phases.map(ph => {
                    const pp = phaseProgress(ph.id);
                    const pd = DAYS.filter(d => d.phase === ph.id);
                    const dc = pd.filter(d => dayComplete(d.day)).length;
                    return (
                      <div key={ph.id} onClick={() => { setActivePhase(ph.id); setView("days"); }} style={{ background: CARD, borderRadius: 10, padding: 12, marginBottom: 6, border: `1px solid ${BORDER}`, cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 16 }}>{ph.icon}</span>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Phase {ph.id}: {ph.title}</div>
                              <div style={{ fontSize: 10, color: MUTED }}>Day {ph.range[0]}-{ph.range[1]}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: ph.color }}>{Math.round(pp * 100)}%</div>
                            <div style={{ fontSize: 9, color: MUTED }}>{dc}/{pd.length}</div>
                          </div>
                        </div>
                        <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pp * 100}%`, background: ph.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Day List */}
          {view === "days" && (
            <div style={{ padding: "10px 14px 100px" }}>
              {filtered.map(day => {
                const expanded = expandedDay === day.day;
                const complete = dayComplete(day.day);
                const prog = dayProgress(day.day);
                const ph = PHASES.find(p => p.id === day.phase);
                const pretest = pretestResults[day.day];

                return (
                  <div key={day.day} style={{ background: complete ? `${ph.color}08` : CARD, borderRadius: 10, marginBottom: 5, border: `1px solid ${complete ? ph.color + "28" : BORDER}`, overflow: "hidden" }}>
                    <div onClick={() => setExpandedDay(expanded ? null : day.day)} style={{ padding: "11px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: complete ? ph.color : pretest === "fail" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: complete ? "#fff" : pretest === "fail" ? "#EF4444" : MUTED }}>
                        {complete ? "✓" : day.day}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: complete ? ph.color : TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{day.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                          <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${prog * 100}%`, background: ph.color }} />
                          </div>
                          <span style={{ fontSize: 9, color: MUTED }}>{day.topic}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, transform: expanded ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▼</div>
                    </div>

                    {expanded && (
                      <div style={{ padding: "0 13px 12px", borderTop: `1px solid ${BORDER}` }}>
                        <div style={{ padding: "10px 0" }}>
                          {day.files && day.files.length > 0 && (
                            <div style={{ marginBottom: 10, fontSize: 10, color: MUTED }}>
                              📂 Files: <span style={{ color: ph.color, fontFamily: "monospace" }}>{day.files.join(", ")}</span>
                            </div>
                          )}
                          {day.hasPretest && <PretestCard day={day} />}
                          {day.learnUrl && (
                            <div style={{ marginBottom: 10, padding: "8px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 6, fontSize: 11 }}>
                              <span style={{ color: MUTED }}>📖 Learn (15 min): </span>
                              <span style={{ color: ph.color, fontFamily: "monospace", fontSize: 10 }}>{day.learnUrl}</span>
                            </div>
                          )}
                          <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>💪 Build (45 min)</div>
                          {day.build.map((task, i) => {
                            const td = !!done[`${day.day}-${i}`];
                            return (
                              <div key={i} onClick={() => toggleBuild(day.day, i)} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: i < day.build.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", cursor: "pointer", alignItems: "flex-start" }}>
                                <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1, background: td ? ph.color : "transparent", border: td ? "none" : "2px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 700 }}>{td && "✓"}</div>
                                <span style={{ fontSize: 11, lineHeight: 1.5, color: td ? MUTED : TEXT, textDecoration: td ? "line-through" : "none", flex: 1 }}>{task}</span>
                              </div>
                            );
                          })}
                          {day.challenge && (
                            <div style={{ marginTop: 10, padding: 10, background: `${ph.color}08`, borderRadius: 6, border: `1px solid ${ph.color}20` }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: ph.color, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>🎯 Challenge</div>
                              <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.5 }}>{day.challenge}</div>
                            </div>
                          )}
                          {day.value && (
                            <div style={{ marginTop: 8, padding: 10, background: "linear-gradient(135deg, rgba(16,185,129,0.10), rgba(232,168,56,0.06))", borderRadius: 6, border: "1px solid rgba(16,185,129,0.25)" }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#10B981", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>💰 Market Value</div>
                              <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.5 }}>{day.value}</div>
                            </div>
                          )}
                          <HintPanel day={day} />
                          <div style={{ marginTop: 10, fontSize: 10, color: MUTED, padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 6 }}>
                            🧠 <strong>Debrief (10 min):</strong> git commit, อธิบายปากเปล่า 30s, เขียน reflection 3 บรรทัด
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ─── PORTFOLIO TAB ─── */}
      {activeTab === "portfolio" && <PortfolioView />}

      {/* ─── INCOME GOAL TAB ─── */}
      {activeTab === "income" && (
        <div style={{ marginTop: 12 }}><IncomeCalcView /></div>
      )}

      {/* ─── WEEKLY REFLECTION TAB ─── */}
      {activeTab === "reflect" && (
        <div style={{ marginTop: 12 }}><ReflectionView /></div>
      )}

      {/* ─── BOTTOM BAR ─── */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "10px 14px 14px", background: "linear-gradient(transparent, #050607 40%)", display: "flex", gap: 8, justifyContent: "center" }}>
        {activeTab === "tracker" && view === "days" && (
          <button onClick={() => { setActivePhase(0); setView("overview"); }} style={{ padding: "7px 16px", borderRadius: 99, border: `1px solid ${BORDER}`, background: CARD, color: MUTED, fontSize: 11, cursor: "pointer" }}>← Overview</button>
        )}
        <button onClick={() => { if (window.confirm("ลบ progress ทั้งหมด? (ไม่ลบ income target / reflections)")) { setDone({}); setPretestResults({}); setHintsUsed({}); } }} style={{ padding: "7px 16px", borderRadius: 99, border: `1px solid ${BORDER}`, background: CARD, color: MUTED, fontSize: 11, cursor: "pointer" }}>🔄 Reset</button>
      </div>
    </div>
  );
}
