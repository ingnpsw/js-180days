import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// EXPERT TRACKER — Interactive 180-Day Companion
// Pairs with EXPERT_PLAYBOOK.md
// Pre-Assessment → Learn → Build → Debrief protocol
// ═══════════════════════════════════════════════════════════════

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
  { id: 1, title: "JS Foundation", color: "#E8A838", range: [1, 21], icon: "⚡" },
  { id: 2, title: "React + Tailwind", color: "#3B82F6", range: [22, 45], icon: "⚛️" },
  { id: 3, title: "Full-stack + DB", color: "#8B5CF6", range: [46, 70], icon: "🗄️" },
  { id: 4, title: "Portfolio + Freelance", color: "#10B981", range: [71, 90], icon: "🚀" },
  { id: 5, title: "JS Deep Dive", color: "#EF4444", range: [91, 115], icon: "🔬" },
  { id: 6, title: "DS & Algorithms", color: "#F97316", range: [116, 150], icon: "🧠" },
  { id: 7, title: "System Design", color: "#06B6D4", range: [151, 170], icon: "🏗️" },
  { id: 8, title: "Mock Interview", color: "#D946EF", range: [171, 180], icon: "👑" },
];

// Daily structure: 4 phases (pretest, learn, build, debrief)
// For brevity, I'll define metadata for all 180 days but only first 7 have full detail
// Days 8-180 follow the same pattern — full details in the Playbook

const DAYS = [
  // ═══ PHASE 1: JS FOUNDATION (Day 1-21) ═══
  { day: 1, phase: 1, title: "Setup + Variables & Data Types", topic: "let, const, typeof",
    files: ["day01.js", "day01-challenge.js", "day01-notes.md"],
    hasPretest: false,
    learnUrl: "javascript.info/variables",
    build: ["พิมพ์ตัวอย่าง let/const/typeof (ห้าม copy)","ทดลอง: const PI = 3.14 แล้ว reassign → จดerror","ทดลอง block scope { let x }","Challenge: Student Profile Calculator"],
    challenge: "สร้าง const student object ที่มี name, studentId, subjects (array ของ {name, score} 3 วิชา), คำนวณ total + average, ใช้ typeof เช็คทุก property, console.log ภาษาไทย" },
  
  { day: 2, phase: 1, title: "Operators + Type Conversion", topic: "+ - * / %, ==, ===",
    files: ["day02.js", "day02-pretest.js", "day02-challenge.js"],
    hasPretest: true,
    pretest: "สร้าง const student ที่มี name, age, isActive, grades (array 3 เลข) console.log ทุก property + typeof, ทดลอง student.name = 'x' ได้ไหม และ student = {} ได้ไหม",
    learnUrl: "javascript.info/operators",
    build: ["BMI Calculator (weight/height²)","Temperature Converter C↔F","ทดลอง '5'+3 vs '5'-3","Challenge: Tip Calculator"],
    challenge: "const bill=1250, people=4, tip=10%. คำนวณ: tip amount, total, คนละเท่าไหร่, ถ้าหารไม่ลงเหลือเศษเท่าไหร่ (%)" },

  { day: 3, phase: 1, title: "if/else + Conditional Logic", topic: "if, else, ternary, switch",
    files: ["day03.js", "day03-pretest.js", "day03-challenge.js"],
    hasPretest: true,
    pretest: "Grade Calculator — hardcode 3 วิชา (math=75, eng=82, sci=68), คำนวณเฉลี่ย, แสดงทุกอย่าง + typeof, เช็คเฉลี่ยคู่/คี่ด้วย %",
    learnUrl: "javascript.info/ifelse",
    build: ["พิมพ์ if/else if/else grade calculator","Leap year checker (400/100/4 rule)","ทดลอง if(0), if('0'), if([])","Challenge: Rock Paper Scissors"],
    challenge: "const playerChoice, computerChoice (hardcode). Logic rock>scissors>paper>rock. เสมอ = 'เสมอ'. ทดสอบ 5 ครั้งด้วยค่าต่างกัน" },

  { day: 4, phase: 1, title: "Loops — for, while", topic: "for, while, break, continue",
    files: ["day04.js", "day04-pretest.js", "day04-challenge.js"],
    hasPretest: true,
    pretest: "RPS 3 รอบ — สะสม totalScore (ชนะ+10, เสมอ+5), จบแล้วแสดงคะแนน + grade A/B/C/D/F",
    learnUrl: "javascript.info/while-for",
    build: ["สูตรคูณแม่ 7 ด้วย for","Sum 1-100","While countdown 10→1","FizzBuzz 1-100","Challenge: Star Patterns"],
    challenge: "Pattern 1: สามเหลี่ยมชิดซ้าย, Pattern 2: สามเหลี่ยมชิดขวา (มี space), Pattern 3: พีระมิดตรงกลาง — คุมด้วย const size=5" },

  { day: 5, phase: 1, title: "Functions", topic: "declaration, expression, arrow, params",
    files: ["day05.js", "day05-pretest.js", "day05-utils.js"],
    hasPretest: true,
    pretest: "Pattern Builder — ทำพีระมิดจากวาน แต่ต้องทำกับ size 3, 5, 7, 10 (เห็นปัญหาไหม? ต้อง copy-paste)",
    learnUrl: "javascript.info/function-basics",
    build: ["function declaration 2 ตัว + expression 2 ตัว + arrow 2 ตัว","Refactor pyramid → drawPyramid(size)","ทดลอง default params","Challenge: Utility Library"],
    challenge: "สร้าง day05-utils.js มี: isEven, isOdd, isPrime, factorial (loop), max(a,b,c), celsiusToF — ทดสอบทุกตัวด้วย console.log" },

  { day: 6, phase: 1, title: "Arrays พื้นฐาน", topic: "push, pop, length, indexOf, loop",
    files: ["day06.js", "day06-pretest.js", "day06-challenge.js"],
    hasPretest: true,
    pretest: "Score Tracker — 5 คน, หาคะแนนสูงสุด, ค่าเฉลี่ย, นับคนผ่าน (≥50) — ถ้าใช้ let s1..s5 คิดว่ามีวิธีดีกว่าไหม?",
    learnUrl: "javascript.info/array",
    build: ["สร้าง, access, modify, loop array ด้วย for + for...of","Refactor Score Tracker ใช้ array","Challenge: Array Manipulation (ห้ามใช้ .reverse() .sort())"],
    challenge: "เขียนเอง: reverse, findMax, findMin, sum, นับคู่/คี่ — ห้ามใช้ built-in methods อย่าง .reverse() หรือ .sort()" },

  { day: 7, phase: 1, title: "🏆 Week 1 Capstone — Grade Management", topic: "ทบทวนทั้งสัปดาห์",
    files: ["week1-capstone.js", "week1-reflection.md"],
    hasPretest: true,
    pretest: "CLOSE-BOOK EXAM 30 นาที — ไม่เปิดไฟล์เก่า",
    learnUrl: "",
    build: ["Capstone: Grade Management System","Self-assessment rubric /10","Deep reflection markdown","AI Weekly Retrospective (template #6)"],
    challenge: "Array of 5 students ({name, scores[3]}), calculateAverage(), getGrade(), loop แสดงทุกคน, หาคนสูงสุด, นับเกรด A — 30 นาที close book" },

  // ═══ Week 2: Day 8-14 ═══
  { day: 8, phase: 1, title: "Array Methods — map, filter, reduce", topic: "higher-order functions",
    files: ["day08.js", "day08-pretest.js", "day08-challenge.js"],
    hasPretest: true,
    pretest: "Week 1 Recap — สร้าง array นักเรียน 5 คน หาคนที่คะแนนเฉลี่ย > 70 ด้วย for loop (ไม่ใช้ method ใหม่)",
    learnUrl: "javascript.info/array-methods",
    build: ["พิมพ์ map, filter, find, some, every ทีละตัว","Refactor pretest ให้ใช้ filter + map","ฝึก reduce: sum, average, max","Challenge: Data Pipeline"],
    challenge: "Array of products [{name, price, category}]. ใช้ chain: filter category='food' → map เพิ่ม vat 7% → reduce หาราคารวม" },

  { day: 9, phase: 1, title: "Objects พื้นฐาน", topic: "literal, methods, this, Object.*",
    files: ["day09.js", "day09-pretest.js", "day09-challenge.js"],
    hasPretest: true,
    pretest: "Data Pipeline ซ้ำ — แต่คราวนี้ hardcode array products 5 ตัว แล้วทำ chain filter→map→reduce จากความจำ",
    learnUrl: "javascript.info/object",
    build: ["พิมพ์ object ที่มี method","ทดลอง this ใน method","Object.keys/values/entries + loop","Challenge: Phonebook CRUD"],
    challenge: "Phonebook object ที่เก็บ {name: phone} — methods: add(name, phone), remove(name), search(name), listAll(). ทดสอบทุก method" },

  { day: 10, phase: 1, title: "Destructuring + Spread", topic: "{} = obj, ...rest, ...spread",
    files: ["day10.js", "day10-pretest.js", "day10-challenge.js"],
    hasPretest: true,
    pretest: "Phonebook จากความจำ — สร้างใหม่โดยไม่เปิดไฟล์เก่า (15 นาที)",
    learnUrl: "javascript.info/destructuring-assignment",
    build: ["Array destructuring: [a, b] = arr","Object destructuring: {name, age} = user","Spread: merge arrays/objects","Rest params in functions","Challenge: Student Filter"],
    challenge: "Array of students → function ที่รับ criteria และ return filtered list ด้วย destructuring params" },

  { day: 11, phase: 1, title: "String Methods + Regex เบื้องต้น", topic: "includes, split, replace, /regex/",
    files: ["day11.js", "day11-pretest.js", "day11-challenge.js"],
    hasPretest: true,
    pretest: "Array destructuring + spread — สร้าง 2 arrays แล้ว merge, แปลง user object เป็น array ด้วย Object.entries, ใช้ destructuring loop",
    learnUrl: "javascript.info/string",
    build: ["includes, indexOf, split, join","replace + template literals","Regex พื้นฐาน: .test(), .match()","Challenge: Password Validator"],
    challenge: "function validatePassword(str): ≥8 ตัว, มีตัวเลข, มีตัวพิมพ์ใหญ่, มี special char. return {valid: bool, errors: []}" },

  { day: 12, phase: 1, title: "Scope, Closures & Error Handling", topic: "closure, try/catch",
    files: ["day12.js", "day12-pretest.js", "day12-challenge.js"],
    hasPretest: true,
    pretest: "Password Validator จากความจำ — ต้องเขียนจบใน 15 นาที",
    learnUrl: "javascript.info/closure",
    build: ["Global vs function vs block scope","Closure: counter factory","try/catch/finally","Custom Error throw","Challenge: Safe Calculator"],
    challenge: "function safeCalc(a, b, op) — รองรับ +, -, *, /. throw error ถ้า: หารศูนย์, type ผิด, operator ไม่รู้จัก. ใช้ try/catch caller" },

  { day: 13, phase: 1, title: "Async — Callbacks & Promises", topic: "setTimeout, Promise",
    files: ["day13.js", "day13-pretest.js", "day13-challenge.js"],
    hasPretest: true,
    pretest: "Closure Counter — สร้าง function makeCounter() return function ที่นับทีละ 1 ทุกครั้งที่เรียก",
    learnUrl: "javascript.info/promise-basics",
    build: ["setTimeout + callback","new Promise + resolve/reject","then/catch chain","Mock API delay function","Challenge: Sequential Promises"],
    challenge: "เขียน fakeApi(id, delay) ที่ return Promise. แล้วเรียก 3 ครั้งต่อเนื่อง (ไม่ parallel) ด้วย promise chain" },

  { day: 14, phase: 1, title: "🏆 Async/Await + Fetch", topic: "async, await, fetch",
    files: ["day14.js", "day14-pretest.js", "day14-challenge.js"],
    hasPretest: true,
    pretest: "Promise Chain — fakeApi 3 ครั้งจากความจำ (15 นาที)",
    learnUrl: "javascript.info/async-await",
    build: ["แปลง promise chain → async/await","fetch() จาก JSONPlaceholder","Error handling ด้วย try/catch + async","Challenge: User Posts Fetcher"],
    challenge: "fetch jsonplaceholder.typicode.com/users → เลือก 3 คนแรก → สำหรับแต่ละคน fetch posts ของเขา → console.log {userName, postCount}" },

  // ═══ Week 3: Day 15-21 (DOM + Events) ═══
  { day: 15, phase: 1, title: "HTML + CSS เร็ว", topic: "tags, Flexbox",
    files: ["day15.html", "day15.css", "day15-challenge.html"],
    hasPretest: true,
    pretest: "User Posts Fetcher — เขียนใหม่จากความจำ 15 นาที",
    learnUrl: "web.dev/learn/css",
    build: ["สร้าง profile card ด้วย HTML/CSS","Flexbox: justify, align, direction","Responsive basics","Challenge: Business Card Page"],
    challenge: "Static HTML หน้า business card สวยๆ — รูป + ชื่อ + ตำแหน่ง + contact icons, ใช้ Flexbox จัด" },

  { day: 16, phase: 1, title: "DOM Manipulation", topic: "querySelector, createElement",
    files: ["day16.html", "day16.js", "day16-challenge.html"],
    hasPretest: true,
    pretest: "Business Card HTML — สร้างจากความจำ (ไม่ต้องสวย แค่โครงถูก)",
    learnUrl: "javascript.info/document",
    build: ["querySelector vs getElementById","textContent vs innerHTML","createElement + appendChild","classList.add/remove/toggle","Challenge: Color Changer"],
    challenge: "หน้าที่มีปุ่ม 5 ปุ่ม (สีต่างกัน) — คลิกปุ่มไหน background เปลี่ยนเป็นสีนั้น + ข้อความ 'Current: [color]'" },

  { day: 17, phase: 1, title: "Events + Forms", topic: "addEventListener, preventDefault",
    files: ["day17.html", "day17.js", "day17-challenge.html"],
    hasPretest: true,
    pretest: "Color Changer จากความจำ",
    learnUrl: "javascript.info/events",
    build: ["click, submit, input, keydown events","event.target, event.preventDefault","Form handling","Challenge: Real-time Search Filter"],
    challenge: "List รายชื่อผลไม้ 10 ชนิด + input search — พิมพ์แล้วกรอง list real-time (case-insensitive)" },

  { day: 18, phase: 1, title: "localStorage + JSON", topic: "setItem, getItem, parse",
    files: ["day18.html", "day18.js", "day18-challenge.html"],
    hasPretest: true,
    pretest: "Real-time Search — ทำซ้ำจากความจำ",
    learnUrl: "javascript.info/localstorage",
    build: ["localStorage setItem/getItem","JSON.stringify/parse","Save/load array of objects","Challenge: Notes App"],
    challenge: "Notes app: เพิ่ม/ลบ note, บันทึก localStorage, refresh ไม่หาย, แต่ละ note มี timestamp" },

  { day: 19, phase: 1, title: "To-Do App Part 1", topic: "build from scratch",
    files: ["day19-todo/"],
    hasPretest: true,
    pretest: "Notes App สร้างใหม่ 15 นาที — โครงพื้นฐานเท่านั้น",
    learnUrl: "",
    build: ["HTML structure + CSS","Add task + render list","Delete task","Toggle complete","Save to localStorage"],
    challenge: "To-Do ที่ครบ CRUD พื้นฐาน + persistent ด้วย localStorage" },

  { day: 20, phase: 1, title: "To-Do App Part 2 — Polish", topic: "edit, filter, animations",
    files: ["day19-todo/"],
    hasPretest: true,
    pretest: "Open day19-todo → ลบ localStorage → ทดสอบว่าทุกฟีเจอร์ยังทำงาน",
    learnUrl: "",
    build: ["Edit mode (inline)","Filter: All/Active/Completed","CSS animations","Clear completed button","Task counter"],
    challenge: "เพิ่ม edit/filter/animations ให้ to-do จากวาน" },

  { day: 21, phase: 1, title: "🏆 PHASE 1 COMPLETE — Deploy", topic: "deploy + review",
    files: ["phase1-reflection.md"],
    hasPretest: true,
    pretest: "Close-book quiz 30 ข้อ (AI template #1) — ต้องได้ ≥ 24/30",
    learnUrl: "pages.github.com",
    build: ["Deploy to-do to GitHub Pages","เขียน README มืออาชีพ","Phase 1 reflection","เขียน JS cheat sheet ส่วนตัว","🎉 Celebrate!"],
    challenge: "Deploy + Phase 1 review" },

  // ═══ PHASE 2-8: metadata only (detailed in Playbook v2) ═══
  // Week 4-6: React + Tailwind
  ...generatePhaseMeta(22, 45, 2, [
    ["React Setup + JSX", "create-react-app / Vite"],
    ["Components + Props", "reusable components"],
    ["useState — Forms", "controlled inputs"],
    ["useState — Objects/Arrays", "immutable updates"],
    ["useEffect basics", "dependency array"],
    ["Fetching Data", "loading + error states"],
    ["🏆 React To-Do", "rebuild with React"],
    ["React Router", "multi-page apps"],
    ["Weather App P1", "API integration"],
    ["Weather App P2", "5-day forecast"],
    ["Custom Hooks", "useFetch, useLocalStorage"],
    ["Context API", "theme context"],
    ["useReducer", "complex state"],
    ["🏆 Review + Refactor", "code quality"],
    ["Tailwind Setup", "utility classes"],
    ["Tailwind Layout", "flex + grid responsive"],
    ["Tailwind Animation", "hover + dark mode"],
    ["Clone Landing P1", "pick a famous site"],
    ["Clone Landing P1 Done", "complete + deploy"],
    ["Clone Landing P2", "speed run"],
    ["Component Library", "Button, Input, Modal, etc."],
    ["Form UI + Validation", "controlled + errors"],
    ["Dashboard UI", "sidebar + charts"],
    ["🏆 Phase 2 Complete", "deploy all"],
  ]),

  // Week 7-10: Full-stack
  ...generatePhaseMeta(46, 70, 3, [
    ["Next.js Setup + Routing", "App Router"],
    ["Server vs Client Components", "when to use which"],
    ["API Routes", "route handlers"],
    ["CRUD Blog P1", "in-memory"],
    ["CRUD Blog P2", "edit + delete + search"],
    ["TypeScript Basics", "types + interfaces"],
    ["🏆 Server Actions", "form without API"],
    ["Supabase Setup", "Postgres + client"],
    ["Supabase CRUD", "real DB operations"],
    ["Supabase Auth", "login/register"],
    ["Row Level Security", "user data isolation"],
    ["File Upload", "Supabase Storage"],
    ["Relations + Profiles", "joins"],
    ["🏆 Blog Deploy", "production ready"],
    ["Mini SaaS Plan", "wireframe + schema"],
    ["SaaS Auth + Layout", "dashboard"],
    ["SaaS Core P1", "main feature"],
    ["SaaS Core P2", "CRUD complete"],
    ["SaaS Advanced", "PDF/calendar/DnD"],
    ["SaaS Mobile Polish", "responsive"],
    ["Security + Env", ".env + RLS audit"],
    ["Testing Basics", "Vitest + RTL"],
    ["Performance + SEO", "Lighthouse >90"],
    ["Git Workflow", "branches + PRs"],
    ["🏆 Phase 3 Deploy", "SaaS live"],
  ]),

  // Week 11-13: Portfolio + Freelance
  ...generatePhaseMeta(71, 90, 4, [
    ["Portfolio Plan", "layout + design system"],
    ["Hero + About", "animated sections"],
    ["Projects Section", "3-4 best works"],
    ["Contact + Deploy", "form + social"],
    ["Polish + Lighthouse", "score >90"],
    ["Refine Old Projects", "portfolio ready"],
    ["Case Study Write-up", "1 deep project"],
    ["Upwork Profile", "title + overview"],
    ["Fastwork + LinkedIn", "Thai market"],
    ["Bid Training", "proposal writing"],
    ["More Bids + Comm", "follow up"],
    ["Figma Basics", "inspect + export"],
    ["Speed Coding", "landing in 2hr"],
    ["🏆 Bid Day", "10-15 proposals"],
    ["Service Packages", "tiered pricing"],
    ["Spec + Contract", "protect yourself"],
    ["Continuous Bidding", "daily routine"],
    ["Learn from Work", "real project"],
    ["Freelance Review", "plan next 90"],
    ["🏆 Day 90 — Freelance Ready", "level up time"],
  ]),

  // Week 14-17: JS Deep Dive
  ...generatePhaseMeta(91, 115, 5, [
    ["Execution Context", "call stack visualization"],
    ["Hoisting + TDZ", "var vs let/const"],
    ["Scope Chain + Lexical Env", "closure foundation"],
    ["Closures Mastery", "memoize, modules"],
    ["'this' Mastery", "call/apply/bind"],
    ["Prototype Chain", "before ES6 classes"],
    ["🏆 Classes Deep Dive", "sugar over prototypes"],
    ["Event Loop Basics", "micro vs macro task"],
    ["Event Loop Advanced", "rAF, queueMicrotask"],
    ["Promises Advanced", "all, race, allSettled"],
    ["Generators + Iterators", "yield, Symbol.iterator"],
    ["Proxy + Reflect + Symbols", "metaprogramming"],
    ["WeakMap + Memory", "GC + leaks"],
    ["🏆 Async Mastery Quiz", "20 questions"],
    ["Functional Programming", "pure, compose, pipe"],
    ["Currying + Partial", "higher-order tricks"],
    ["Design Patterns P1", "singleton, observer, factory"],
    ["Design Patterns P2", "strategy, decorator, module"],
    ["Error Handling Mastery", "custom errors + boundaries"],
    ["Module Systems", "CJS vs ESM, dynamic import"],
    ["🏆 Internals Final", "30 questions >90%"],
    ["TS Generics", "generic functions/classes"],
    ["TS Conditional + Mapped", "advanced types"],
    ["TS Type Guards", "narrowing"],
    ["🏆 Phase 5 Complete", "JS Expert unlocked"],
  ]),

  // Week 18-22: DS & A
  ...generatePhaseMeta(116, 150, 6, [
    ["Big-O Notation", "time + space complexity"],
    ["Arrays + Two Pointers", "LC #1, #11, #26"],
    ["Sliding Window", "LC #3, #53, #121"],
    ["Hash Map Pattern", "LC #49, #128, #242"],
    ["String Problems", "LC #8, #14, #125, #344"],
    ["Stack", "LC #20, #155, #739"],
    ["🏆 Week 18 — 5 problems", "timed drill"],
    ["Queue + Deque", "LC #232, BFS setup"],
    ["Linked List P1", "LC #21, #141, #206"],
    ["Linked List P2", "LC #2, #19, Floyd's"],
    ["Recursion", "LC #70, #326"],
    ["Backtracking", "LC #39, #46, #78"],
    ["Binary Search", "LC #35, #153, #704"],
    ["🏆 Week 19 — 5 problems", "timed"],
    ["Binary Tree", "LC #100, #104, #226"],
    ["Tree BFS + DFS", "LC #98, #102, #112"],
    ["BST", "LC #230, #235"],
    ["Heap / PQ", "LC #215, #347"],
    ["Trie", "LC #208, #212"],
    ["Sorting Algorithms", "merge, quick, heap"],
    ["🏆 Week 20 — Trees", "5 tree problems"],
    ["Graph Basics", "adjacency list"],
    ["Graph BFS + DFS", "LC #133, #200"],
    ["Topological Sort", "LC #207, #210"],
    ["Shortest Path", "Dijkstra, LC #743"],
    ["DP Part 1", "LC #70, #198"],
    ["DP Part 2", "LC #139, #300, #322"],
    ["🏆 DP + Graph Review", "6 problems"],
    ["DP 2D", "LC #62, #64, #1143"],
    ["Greedy", "LC #55, #134, #621"],
    ["Intervals", "LC #56, #57, #435"],
    ["Bit Manipulation", "LC #136, #191, #338"],
    ["Pattern Recognition", "choose right approach"],
    ["Speed Drill — 6 in 2hr", "interview simulation"],
    ["🏆 Phase 6 — 10 Medium test", "≥ 7/10 to pass"],
  ]),

  // Week 23-25: System Design
  ...generatePhaseMeta(151, 170, 7, [
    ["REST API Design", "RESTful + Richardson"],
    ["Auth Deep Dive", "JWT + OAuth2 internals"],
    ["SQL Design", "normalization + indexes"],
    ["NoSQL + Caching", "Redis patterns"],
    ["System Design Fundamentals", "CAP + scalability"],
    ["WebSocket + Real-time", "SSE vs WebSocket"],
    ["🏆 Design: URL Shortener", "full exercise"],
    ["Microservices vs Monolith", "trade-offs"],
    ["Message Queues", "Kafka + RabbitMQ"],
    ["CI/CD + Docker", "pipelines"],
    ["Design: Twitter Feed", "fan-out patterns"],
    ["Design: Chat App", "WhatsApp clone"],
    ["Design: E-commerce", "flash sales + payment"],
    ["🏆 Mock System Design", "45min timed"],
    ["Advanced React Patterns", "render props, HOC"],
    ["State Management", "Zustand, React Query"],
    ["Advanced Next.js", "middleware, edge"],
    ["GraphQL Fundamentals", "vs REST"],
    ["Monitoring + Observability", "logs, traces, alerts"],
    ["🏆 Phase 7 Complete", "System Architect"],
  ]),

  // Week 26: Mock Interview
  ...generatePhaseMeta(171, 180, 8, [
    ["Mock: JS Trivia (30 questions)", "≥27/30"],
    ["Mock: Live Code #1", "2 Mediums in 45min"],
    ["Mock: Live Code #2", "1 Medium + 1 Hard"],
    ["Mock: System Design", "45min structured"],
    ["Mock: React Live Build", "60min component"],
    ["Mock: Full Stack Build", "90min deploy"],
    ["🏆 Weakness Drill", "weakest topic 2hr"],
    ["Expert Cheat Sheet", "ultimate reference"],
    ["Full Mock Day", "3hr simulation"],
    ["👑 DAY 180 — EXPERT!", "you made it"],
  ]),
];

function generatePhaseMeta(startDay, endDay, phaseId, titles) {
  const days = [];
  for (let i = 0; i < titles.length; i++) {
    const day = startDay + i;
    if (day > endDay) break;
    days.push({
      day,
      phase: phaseId,
      title: titles[i][0],
      topic: titles[i][1],
      files: [`day${String(day).padStart(2, "0")}/`],
      hasPretest: true,
      pretest: "Recap yesterday's work from memory (15 min)",
      learnUrl: "",
      build: ["Follow Playbook Day " + day + " detailed protocol", "4 subtasks as outlined", "Apply 15-min struggle rule", "AI code review at end"],
      challenge: "See Playbook for full details",
      isMeta: true,
    });
  }
  return days;
}

function buildSolidPlan(day, phase) {
  const week = Math.ceil(day / 7);
  const isCheckpoint = day % 14 === 0;
  const isReviewDay = day % 7 === 0;

  if (phase === 3) {
    return {
      learnUrl: "https://roadmap.sh/backend",
      pretest: "เขียน flow ข้อมูลของฟีเจอร์วันนี้จาก memory: request -> validation -> db -> response",
      build: [
        "ออกแบบ schema + relation และเขียนเหตุผลว่าทำไมเลือกแบบนี้",
        "ทำ API พร้อม validation + error code มาตรฐาน",
        "เขียน integration test อย่างน้อย 1 เคสของ flow หลัก",
        "สรุป trade-off วันนี้ 3 ข้อ ลงบันทึก",
      ],
      challenge: isCheckpoint
        ? `Checkpoint W${week}: ทำ mini feature จบครบ CRUD + auth + test + deploy note`
        : "เพิ่ม 1 edge case ที่เคยพังง่าย และเขียนวิธีป้องกัน",
      titleSuffix: isReviewDay ? " • Weekly Review" : "",
      topicSuffix: isReviewDay ? "retrospective + bugfix" : "production feature flow",
    };
  }

  if (phase === 4) {
    return {
      learnUrl: "https://github.com/readme/guides/first-freelance-client",
      pretest: "เขียน requirement ลูกค้าแบบ user story 5 ข้อ โดยไม่เปิดเอกสารเดิม",
      build: [
        "แปลง requirement เป็น task list พร้อม estimate (S/M/L)",
        "ทำ feature ที่ส่งมอบลูกค้าได้จริง 1 ชิ้น พร้อม acceptance criteria",
        "เขียน demo script 2 นาที (problem -> solution -> ROI)",
        "อัปเดต portfolio log: what built / what learned / next fix",
      ],
      challenge: isCheckpoint
        ? `Checkpoint W${week}: ส่งมอบ client-style milestone (docs + demo + changelog)`
        : "เขียน proposal 1 ฉบับ โดยระบุ scope, timeline, risk, payment terms",
      titleSuffix: isReviewDay ? " • Delivery Review" : "",
      topicSuffix: isReviewDay ? "client communication + QA" : "freelance execution",
    };
  }

  if (phase === 5) {
    return {
      learnUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
      pretest: "อธิบาย concept วันนี้แบบไม่ใช้โค้ด 5 บรรทัด (เช่น closure/event loop/prototype)",
      build: [
        "เขียนตัวอย่างโค้ดสั้น 3 แบบที่พิสูจน์ concept เดียวกัน",
        "ทำ debugging drill: หา root cause จาก bug snippet",
        "เพิ่ม test เคส edge case ที่ชอบพลาด",
        "เขียน reflection: concept นี้เจอในโปรเจกต์จริงตรงไหน",
      ],
      challenge: isCheckpoint
        ? `Checkpoint W${week}: เขียนบทสรุป JS Deep Dive 1 หน้า + quiz ตัวเอง 10 ข้อ`
        : "refactor โค้ดเดิม 1 จุดให้ชัดขึ้นโดย behavior ไม่เปลี่ยน",
      titleSuffix: isReviewDay ? " • Concept Review" : "",
      topicSuffix: isReviewDay ? "recap + spaced repetition" : "core internals",
    };
  }

  if (phase === 6) {
    return {
      learnUrl: "https://neetcode.io/roadmap",
      pretest: "เลือก pattern ก่อนเขียนโค้ด: two pointers / sliding window / graph / dp พร้อมเหตุผล",
      build: [
        "แก้โจทย์ 2 ข้อ (1 easy + 1 medium) พร้อม time/space complexity",
        "เขียน brute force ก่อน แล้วค่อย optimize",
        "บันทึก mistake log: จุดพลาด + trigger + วิธีแก้",
        "อธิบายวิธีคิดเป็นภาษาไทย 8-10 บรรทัด",
      ],
      challenge: isCheckpoint
        ? `Checkpoint W${week}: mock coding 45 นาที + retrospective จุดตัน`
        : "ทำ 1 timed problem (25 นาที) แล้วสรุปว่าตันตรงไหน",
      titleSuffix: isReviewDay ? " • Pattern Review" : "",
      topicSuffix: isReviewDay ? "speed + accuracy audit" : "problem solving",
    };
  }

  if (phase === 7) {
    return {
      learnUrl: "https://github.com/donnemartin/system-design-primer",
      pretest: "วาด architecture แบบคร่าวของระบบวันนี้ (API, DB, cache, queue) จาก memory",
      build: [
        "นิยาม functional + non-functional requirements",
        "วาด high-level design และระบุ bottleneck 2 จุด",
        "เลือก data model + scaling strategy พร้อมเหตุผล",
        "สรุป trade-off cost vs performance vs complexity",
      ],
      challenge: isCheckpoint
        ? `Checkpoint W${week}: design review 30 นาที (self-review checklist + alternatives)`
        : "เพิ่ม failure scenario 1 แบบและอธิบาย recovery plan",
      titleSuffix: isReviewDay ? " • Design Review" : "",
      topicSuffix: isReviewDay ? "failure mode analysis" : "scalability thinking",
    };
  }

  if (phase === 8) {
    return {
      learnUrl: "https://www.frontendinterviewhandbook.com",
      pretest: "warm-up 10 นาที: เล่าคำตอบ STAR 1 เรื่อง + code warmup 1 ข้อ",
      build: [
        "mock interview 1 รอบ (coding/design/behavioral ตามวัน)",
        "จับเวลาและบันทึก filler words + จุดที่อธิบายไม่ชัด",
        "ทำ correction round รอบ 2 ให้กระชับขึ้น",
        "เขียน improvement checklist สำหรับรอบถัดไป",
      ],
      challenge: isCheckpoint
        ? `Checkpoint W${week}: full simulation 90 นาที + postmortem`
        : "อัดวิดีโอตอบคำถาม 1 ข้อแล้วรีวิวตัวเอง",
      titleSuffix: isReviewDay ? " • Mock Review" : "",
      topicSuffix: isReviewDay ? "feedback loop" : "interview readiness",
    };
  }

  return null;
}

function defaultLearnUrlForPhase(phase) {
  if (phase === 1) return "https://javascript.info/first-steps";
  if (phase === 2) return "https://react.dev/learn";
  if (phase === 3) return "https://roadmap.sh/backend";
  if (phase === 4) return "https://github.com/readme/guides/first-freelance-client";
  if (phase === 5) return "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide";
  if (phase === 6) return "https://neetcode.io/roadmap";
  if (phase === 7) return "https://github.com/donnemartin/system-design-primer";
  return "https://www.frontendinterviewhandbook.com";
}

const TRACK_DAYS = DAYS.map((day) => {
  if (day.day <= 60) {
    return {
      ...day,
      learnUrl: day.learnUrl || defaultLearnUrlForPhase(day.phase),
    };
  }
  const plan = buildSolidPlan(day.day, day.phase);
  if (!plan) {
    return {
      ...day,
      learnUrl: day.learnUrl || defaultLearnUrlForPhase(day.phase),
    };
  }
  if (day.day % 10 === 0) {
    return {
      ...day,
      title: `Recovery Day • Day ${day.day}`,
      topic: "clear backlog + reinforce weak points",
      hasPretest: true,
      pretest: "ลิสต์งานค้าง + จุดที่ confidence ต่ำสุด 3 เรื่องจาก 9 วันที่ผ่านมา",
      learnUrl: "https://www.atlassian.com/agile/project-management/retrospectives",
      build: [
        "เคลียร์ build tasks ค้างอย่างน้อย 2 งานจาก 9 วันที่ผ่านมา",
        "ทบทวน 1 challenge ที่ทำไม่ผ่าน แล้วแก้ให้จบ",
        "เขียน mistake log: ต้นเหตุ, อาการ, วิธีป้องกัน (อย่างน้อย 3 บรรทัด)",
        "วางแผนสัปดาห์ถัดไป: top 3 priorities + risk",
      ],
      challenge: "ถ้ายังมีงานค้าง ให้ยังไม่เปิดวันใหม่จนกว่า backlog วันนี้จะลดลง",
      isRecovery: true,
      isMeta: false,
    };
  }
  return {
    ...day,
    title: `${day.title}${plan.titleSuffix || ""}`,
    topic: plan.topicSuffix || day.topic,
    hasPretest: true,
    pretest: plan.pretest,
    learnUrl: plan.learnUrl || day.learnUrl || defaultLearnUrlForPhase(day.phase),
    build: plan.build,
    challenge: plan.challenge,
    isMeta: false,
  };
});

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function ExpertTracker() {
  const [done, setDone] = useState({});
  const [pretestResults, setPretestResults] = useState({});
  const [hintsUsed, setHintsUsed] = useState({});
  const [dailyDifficulty, setDailyDifficulty] = useState({});
  const [dailyConfidence, setDailyConfidence] = useState({});
  const [expandedDay, setExpandedDay] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const [view, setView] = useState("overview");
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [showingHintLevel, setShowingHintLevel] = useState(null);

  // Load
  useEffect(() => {
    try {
      const d = localStorage.getItem("expert-v3-done");
      const p = localStorage.getItem("expert-v3-pretest");
      const h = localStorage.getItem("expert-v3-hints");
      const dd = localStorage.getItem("expert-v3-difficulty");
      const dc = localStorage.getItem("expert-v3-confidence");
      if (d) setDone(JSON.parse(d));
      if (p) setPretestResults(JSON.parse(p));
      if (h) setHintsUsed(JSON.parse(h));
      if (dd) setDailyDifficulty(JSON.parse(dd));
      if (dc) setDailyConfidence(JSON.parse(dc));
    } catch {}
  }, []);
  // Save
  useEffect(() => { try { localStorage.setItem("expert-v3-done", JSON.stringify(done)); } catch {} }, [done]);
  useEffect(() => { try { localStorage.setItem("expert-v3-pretest", JSON.stringify(pretestResults)); } catch {} }, [pretestResults]);
  useEffect(() => { try { localStorage.setItem("expert-v3-hints", JSON.stringify(hintsUsed)); } catch {} }, [hintsUsed]);
  useEffect(() => { try { localStorage.setItem("expert-v3-difficulty", JSON.stringify(dailyDifficulty)); } catch {} }, [dailyDifficulty]);
  useEffect(() => { try { localStorage.setItem("expert-v3-confidence", JSON.stringify(dailyConfidence)); } catch {} }, [dailyConfidence]);

  const toggleBuild = useCallback((day, idx) => {
    setDone(p => {
      const k = `${day}-${idx}`;
      const n = { ...p };
      n[k] ? delete n[k] : (n[k] = true);
      return n;
    });
  }, []);

  const setPretest = (day, result) => {
    setPretestResults(p => ({ ...p, [day]: result }));
  };

  const logHint = (day, level) => {
    setHintsUsed(p => ({ ...p, [day]: Math.max(p[day] || 0, level) }));
  };
  const setDifficulty = (day, value) => {
    setDailyDifficulty(p => ({ ...p, [day]: value }));
  };
  const setConfidence = (day, value) => {
    setDailyConfidence(p => ({ ...p, [day]: value }));
  };

  const dayComplete = (day) => {
    const d = TRACK_DAYS.find(x => x.day === day);
    if (!d) return false;
    const buildsDone = d.build.every((_, i) => done[`${day}-${i}`]);
    const pretestOk = !d.hasPretest || pretestResults[day];
    return buildsDone && pretestOk;
  };

  const dayProgress = (day) => {
    const d = TRACK_DAYS.find(x => x.day === day);
    if (!d) return 0;
    const total = d.build.length + (d.hasPretest ? 1 : 0);
    let count = d.build.filter((_, i) => done[`${day}-${i}`]).length;
    if (d.hasPretest && pretestResults[day]) count++;
    return count / total;
  };

  const phaseProgress = (pid) => {
    const phaseDays = TRACK_DAYS.filter(d => d.phase === pid);
    const total = phaseDays.length;
    const done_ = phaseDays.filter(d => dayComplete(d.day)).length;
    return total ? done_ / total : 0;
  };

  const totalDoneDays = TRACK_DAYS.filter(d => dayComplete(d.day)).length;
  const totalProgress = totalDoneDays / 180;

  const streak = (() => {
    let s = 0;
    for (const d of TRACK_DAYS) { if (dayComplete(d.day)) s++; else break; }
    return s;
  })();

  const nextDay = TRACK_DAYS.find(d => !dayComplete(d.day));
  const filtered = activePhase === 0 ? TRACK_DAYS : TRACK_DAYS.filter(d => d.phase === activePhase);
  const currentWeek = nextDay ? Math.ceil(nextDay.day / 7) : Math.ceil(180 / 7);
  const weekStart = Math.max(1, (currentWeek - 1) * 7 + 1);
  const weekEnd = Math.min(180, weekStart + 6);
  const weekDays = TRACK_DAYS.filter(d => d.day >= weekStart && d.day <= weekEnd);
  const weekDoneCount = weekDays.filter(d => dayComplete(d.day)).length;
  const weekAvgConfidence = weekDays.reduce((sum, d) => sum + (Number(dailyConfidence[d.day]) || 0), 0) / (weekDays.length || 1);
  const hardDays = weekDays.filter(d => dailyDifficulty[d.day] === "hard").map(d => d.day);
  const lowConfidenceDays = weekDays.filter(d => (Number(dailyConfidence[d.day]) || 0) > 0 && Number(dailyConfidence[d.day]) <= 2).map(d => d.day);
  const pendingBeforeToday = TRACK_DAYS
    .filter(d => d.day < (nextDay?.day || 181))
    .filter(d => !dayComplete(d.day))
    .length;

  // ─── STYLE CONSTANTS ───
  const BG = "linear-gradient(160deg, #050607 0%, #0A0B10 50%, #0E1015 100%)";
  const CARD = "rgba(255,255,255,0.025)";
  const BORDER = "rgba(255,255,255,0.055)";
  const MUTED = "#6B7280";
  const TEXT = "#D1D5DB";

  // ─── PRETEST CARD ───
  const PretestCard = ({ day }) => {
    const result = pretestResults[day.day];
    const ph = PHASES.find(p => p.id === day.phase);
    
    return (
      <div style={{
        background: result ? `${ph.color}10` : "rgba(239,68,68,0.06)",
        border: `1px solid ${result ? ph.color + "30" : "rgba(239,68,68,0.25)"}`,
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 14 }}>🎯</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: result ? ph.color : "#EF4444", textTransform: "uppercase" }}>
            Pre-Assessment • 15 นาที
          </span>
        </div>
        <div style={{ fontSize: 12, color: TEXT, marginBottom: 10, lineHeight: 1.5 }}>
          {day.pretest}
        </div>
        <div style={{ fontSize: 10, color: "#F59E0B", marginBottom: 10, padding: "6px 8px", background: "rgba(245,158,11,0.08)", borderRadius: 6 }}>
          ⛔ ห้ามเปิด Google / AI / ไฟล์เก่า • เขียนจากความจำล้วน
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { label: "🟢 PASS", key: "pass", color: "#10B981" },
            { label: "🟡 PARTIAL", key: "partial", color: "#F59E0B" },
            { label: "🔴 FAIL", key: "fail", color: "#EF4444" },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setPretest(day.day, opt.key)}
              style={{
                flex: 1,
                padding: "7px 4px",
                borderRadius: 6,
                border: "none",
                background: result === opt.key ? opt.color : "rgba(255,255,255,0.05)",
                color: result === opt.key ? "#fff" : MUTED,
                fontSize: 10,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ─── HINT LAYERS ───
  const HintPanel = ({ day }) => {
    const level = hintsUsed[day.day] || 0;
    const ph = PHASES.find(p => p.id === day.phase);
    
    return (
      <div style={{ marginTop: 10, padding: 10, background: "rgba(255,255,255,0.02)", borderRadius: 8, border: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, marginBottom: 8, letterSpacing: 1 }}>
          💡 HINT SYSTEM (ห้ามข้ามชั้น)
        </div>
        {[
          { lv: 1, icon: "🥉", label: "Self-Hint", desc: "ถามตัวเอง 5 คำถาม" },
          { lv: 2, icon: "🥈", label: "Concept Hint", desc: "จาก Playbook" },
          { lv: 3, icon: "🥇", label: "AI Hint", desc: "Socratic prompt" },
        ].map(h => (
          <div
            key={h.lv}
            onClick={() => { logHint(day.day, h.lv); setShowingHintLevel(h.lv); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              marginBottom: 4,
              background: level >= h.lv ? `${ph.color}15` : "rgba(255,255,255,0.02)",
              borderRadius: 6,
              cursor: "pointer",
              border: `1px solid ${level >= h.lv ? ph.color + "30" : "transparent"}`,
            }}
          >
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

  // ─── AI TEMPLATE MODAL ───
  const AIModal = () => {
    if (!activeTemplate) return null;
    const t = AI_TEMPLATES[activeTemplate];
    const copyPrompt = () => {
      navigator.clipboard?.writeText(t);
    };
    return (
      <div onClick={() => setActiveTemplate(null)} style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: "#0E1015", borderRadius: 14, padding: 20, maxWidth: 500, width: "100%",
          maxHeight: "80vh", overflowY: "auto", border: `1px solid ${BORDER}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
              🤖 AI Prompt Template
            </div>
            <button onClick={() => setActiveTemplate(null)} style={{
              background: "transparent", border: "none", color: MUTED, fontSize: 18, cursor: "pointer",
            }}>✕</button>
          </div>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 10 }}>
            Copy แล้ว paste ใน Claude/ChatGPT — AI จะ guide ไม่ solve ให้
          </div>
          <pre style={{
            background: "rgba(255,255,255,0.03)", padding: 12, borderRadius: 8,
            fontSize: 11, color: TEXT, whiteSpace: "pre-wrap", lineHeight: 1.5,
            border: `1px solid ${BORDER}`, fontFamily: "monospace",
          }}>{t}</pre>
          <button onClick={copyPrompt} style={{
            marginTop: 10, width: "100%", padding: "10px", borderRadius: 8,
            background: "#E8A838", color: "#000", border: "none", fontWeight: 700,
            fontSize: 12, cursor: "pointer",
          }}>
            📋 Copy to Clipboard
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'SF Pro Display', 'Noto Sans Thai', -apple-system, system-ui, sans-serif" }}>
      <AIModal />

      {/* ─── HEADER ─── */}
      <div style={{ padding: "26px 20px 18px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: "0 0 auto 0", height: 220, background: "radial-gradient(ellipse at 50% 0%, rgba(232,168,56,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 10, letterSpacing: 5, color: "#E8A838", fontWeight: 700, textTransform: "uppercase", marginBottom: 6, position: "relative" }}>
          EXPERT TRACK • 180 DAYS
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px", background: "linear-gradient(135deg, #E8A838 0%, #EF4444 35%, #8B5CF6 70%, #10B981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", position: "relative" }}>
          No AI Shortcuts
        </h1>
        <p style={{ margin: 0, fontSize: 11, color: MUTED, position: "relative" }}>
          Self-driven • AI as coach, not crutch • Live code ready
        </p>
      </div>

      {/* ─── STATS ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, padding: "0 14px" }}>
        {[
          { label: "Days", value: totalDoneDays, sub: "/180", c: "#E8A838" },
          { label: "Streak", value: streak, sub: "d", c: "#3B82F6" },
          { label: "Progress", value: Math.round(totalProgress * 100), sub: "%", c: "#10B981" },
          { label: "Phase", value: nextDay ? nextDay.phase : 8, sub: "/8", c: "#8B5CF6" },
        ].map((s, i) => (
          <div key={i} style={{ background: CARD, borderRadius: 10, padding: "10px 4px", textAlign: "center", border: `1px solid ${BORDER}` }}>
            <div>
              <span style={{ fontSize: 19, fontWeight: 800, color: s.c }}>{s.value}</span>
              <span style={{ fontSize: 9, color: MUTED, marginLeft: 1 }}>{s.sub}</span>
            </div>
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

      {/* ─── AI TEMPLATE BAR ─── */}
      <div style={{ padding: "14px 14px 0" }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, color: MUTED, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>
          🤖 AI Toolbox
        </div>
        <div style={{ display: "flex", gap: 5, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {[
            { k: "quiz", l: "Quiz Me", emoji: "❓" },
            { k: "review", l: "Review", emoji: "🔍" },
            { k: "hint", l: "Hint", emoji: "💡" },
            { k: "debug", l: "Debug", emoji: "🐛" },
            { k: "concept", l: "Explain", emoji: "📖" },
            { k: "retro", l: "Weekly", emoji: "📊" },
          ].map(t => (
            <button key={t.k} onClick={() => setActiveTemplate(t.k)} style={{
              flex: "0 0 auto",
              padding: "6px 11px",
              borderRadius: 99,
              background: CARD,
              border: `1px solid ${BORDER}`,
              color: TEXT,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}>
              {t.emoji} {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* ─── PHASE FILTER ─── */}
      <div style={{ padding: "12px 14px 0", overflowX: "auto", whiteSpace: "nowrap", WebkitOverflowScrolling: "touch" }}>
        <button onClick={() => { setActivePhase(0); setView("overview"); }} style={{
          display: "inline-block", padding: "6px 12px", borderRadius: 99, border: "none",
          marginRight: 5, fontSize: 11, fontWeight: 600, cursor: "pointer",
          background: activePhase === 0 ? "rgba(255,255,255,0.1)" : CARD,
          color: activePhase === 0 ? "#fff" : MUTED,
        }}>All</button>
        {PHASES.map(p => (
          <button key={p.id} onClick={() => { setActivePhase(p.id); setView("days"); }} style={{
            display: "inline-block", padding: "6px 12px", borderRadius: 99, border: "none",
            marginRight: 5, fontSize: 11, fontWeight: 600, cursor: "pointer",
            background: activePhase === p.id ? p.color + "25" : CARD,
            color: activePhase === p.id ? p.color : MUTED,
          }}>{p.icon} P{p.id}</button>
        ))}
      </div>

      {/* ─── NEXT UP ─── */}
      {view === "overview" && nextDay && (() => {
        const ph = PHASES.find(p => p.id === nextDay.phase);
        return (
          <div onClick={() => { setActivePhase(nextDay.phase); setView("days"); setExpandedDay(nextDay.day); }} style={{
            margin: "14px 14px 0",
            background: `linear-gradient(135deg, ${ph.color}18, ${ph.color}06)`,
            borderRadius: 12,
            padding: 14,
            border: `1px solid ${ph.color}35`,
            cursor: "pointer",
          }}>
            <div style={{ fontSize: 9, color: ph.color, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              ▶ TODAY'S MISSION
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, color: "#fff" }}>
              Day {nextDay.day}: {nextDay.title}
            </div>
            <div style={{ fontSize: 10, color: MUTED }}>
              {ph.icon} Phase {ph.id} • {nextDay.topic}
            </div>
          </div>
        );
      })()}

      {/* ─── OVERVIEW ─── */}
      {view === "overview" && (
        <div style={{ padding: "14px 14px 80px" }}>
          <div style={{
            marginBottom: 10,
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 10,
            padding: 10,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: "#10B981", marginBottom: 4 }}>
              WEEKLY SUMMARY • W{currentWeek} (Day {weekStart}-{weekEnd})
            </div>
            <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.6 }}>
              Done {weekDoneCount}/{weekDays.length} วัน • Avg confidence {weekAvgConfidence.toFixed(1)}/5
              {hardDays.length > 0 ? ` • Hard days: ${hardDays.join(", ")}` : " • Hard days: none"}
              {lowConfidenceDays.length > 0 ? ` • Low confidence: ${lowConfidenceDays.join(", ")}` : " • Low confidence: none"}
            </div>
          </div>

          {[
            { label: "🎯 FOUNDATION → FREELANCE", phases: PHASES.slice(0, 4) },
            { label: "🔥 ADVANCED → EXPERT", phases: PHASES.slice(4) },
          ].map((sec, si) => (
            <div key={si} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8 }}>
                {sec.label}
              </div>
              {sec.phases.map(ph => {
                const pp = phaseProgress(ph.id);
                const pd = TRACK_DAYS.filter(d => d.phase === ph.id);
                const dc = pd.filter(d => dayComplete(d.day)).length;
                return (
                  <div key={ph.id} onClick={() => { setActivePhase(ph.id); setView("days"); }} style={{
                    background: CARD, borderRadius: 10, padding: 12, marginBottom: 6,
                    border: `1px solid ${BORDER}`, cursor: "pointer",
                  }}>
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

      {/* ─── DAY LIST ─── */}
      {view === "days" && (
        <div style={{ padding: "12px 14px 100px" }}>
          {filtered.map(day => {
            const expanded = expandedDay === day.day;
            const complete = dayComplete(day.day);
            const prog = dayProgress(day.day);
            const ph = PHASES.find(p => p.id === day.phase);
            const pretest = pretestResults[day.day];
            const difficulty = dailyDifficulty[day.day];
            const confidence = Number(dailyConfidence[day.day]) || 0;
            const isRecoveryBlocked = day.isRecovery && pendingBeforeToday > 0;
            const hasFiles = Array.isArray(day.files) && day.files.length > 0;
            const hasLearn = !!(day.learnUrl && String(day.learnUrl).trim());
            const isDataIncomplete = !hasFiles || !hasLearn;

            return (
              <div key={day.day} style={{
                background: complete ? `${ph.color}08` : CARD,
                borderRadius: 10,
                marginBottom: 5,
                border: `1px solid ${complete ? ph.color + "28" : BORDER}`,
                overflow: "hidden",
              }}>
                <div onClick={() => setExpandedDay(expanded ? null : day.day)} style={{
                  padding: "11px 13px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: complete ? ph.color : pretest === "fail" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800,
                    color: complete ? "#fff" : pretest === "fail" ? "#EF4444" : MUTED,
                  }}>
                    {complete ? "✓" : day.day}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: complete ? ph.color : TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {day.title} {day.isRecovery ? "🧰" : ""}
                      {isDataIncomplete ? " ⚠️" : ""}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${prog * 100}%`, background: ph.color }} />
                      </div>
                      <span style={{ fontSize: 9, color: MUTED }}>
                        {day.topic}
                      </span>
                      {difficulty && (
                        <span style={{ fontSize: 9, color: difficulty === "hard" ? "#EF4444" : difficulty === "medium" ? "#F59E0B" : "#10B981" }}>
                          • {difficulty.toUpperCase()}
                        </span>
                      )}
                      {confidence > 0 && (
                        <span style={{ fontSize: 9, color: "#93C5FD" }}>• C{confidence}/5</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: MUTED, transform: expanded ? "rotate(180deg)" : "", transition: "transform 0.2s" }}>▼</div>
                </div>

                {expanded && (
                  <div style={{ padding: "0 13px 12px", borderTop: `1px solid ${BORDER}` }}>
                    <div style={{ padding: "10px 0" }}>
                      {/* Files */}
                      {day.files && day.files.length > 0 && (
                        <div style={{ marginBottom: 10, fontSize: 10, color: MUTED }}>
                          📂 Files: <span style={{ color: ph.color, fontFamily: "monospace" }}>{day.files.join(", ")}</span>
                        </div>
                      )}
                      {!hasFiles && (
                        <div style={{ marginBottom: 10, fontSize: 10, color: "#FCA5A5", padding: "6px 8px", background: "rgba(239,68,68,0.10)", borderRadius: 6, border: "1px solid rgba(239,68,68,0.25)" }}>
                          ⚠️ Missing Files metadata for this day
                        </div>
                      )}

                      {/* Pre-Assessment */}
                      {day.hasPretest && <PretestCard day={day} />}

                      {/* Learn */}
                      {day.learnUrl && (
                        <div style={{ marginBottom: 10, padding: "8px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 6, fontSize: 11 }}>
                          <span style={{ color: MUTED }}>📖 Learn (15 min): </span>
                          <a
                            href={day.learnUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: ph.color, fontFamily: "monospace", fontSize: 10, textDecoration: "underline" }}
                          >
                            {day.learnUrl}
                          </a>
                        </div>
                      )}
                      {!hasLearn && (
                        <div style={{ marginBottom: 10, fontSize: 10, color: "#FCA5A5", padding: "6px 8px", background: "rgba(239,68,68,0.10)", borderRadius: 6, border: "1px solid rgba(239,68,68,0.25)" }}>
                          ⚠️ Missing Learn source for this day
                        </div>
                      )}

                      {/* Build Tasks */}
                      <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>
                        💪 Build (45 min)
                      </div>
                      {day.build.map((task, i) => {
                        const td = !!done[`${day.day}-${i}`];
                        return (
                          <div key={i} onClick={() => toggleBuild(day.day, i)} style={{
                            display: "flex", gap: 8, padding: "7px 0",
                            borderBottom: i < day.build.length - 1 ? `1px solid rgba(255,255,255,0.03)` : "none",
                            cursor: "pointer", alignItems: "flex-start",
                          }}>
                            <div style={{
                              width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                              background: td ? ph.color : "transparent",
                              border: td ? "none" : `2px solid rgba(255,255,255,0.15)`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 10, color: "#fff", fontWeight: 700,
                            }}>{td && "✓"}</div>
                            <span style={{ fontSize: 11, lineHeight: 1.5, color: td ? MUTED : TEXT, textDecoration: td ? "line-through" : "none", flex: 1 }}>
                              {task}
                            </span>
                          </div>
                        );
                      })}

                      {/* Daily Scoring */}
                      <div style={{ marginTop: 10, padding: 10, background: "rgba(255,255,255,0.02)", borderRadius: 8, border: `1px solid ${BORDER}` }}>
                        <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>
                          📈 Daily Scoring
                        </div>
                        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                          {[
                            { key: "easy", label: "Easy", color: "#10B981" },
                            { key: "medium", label: "Medium", color: "#F59E0B" },
                            { key: "hard", label: "Hard", color: "#EF4444" },
                          ].map(opt => (
                            <button
                              key={opt.key}
                              onClick={() => setDifficulty(day.day, opt.key)}
                              style={{
                                flex: 1, padding: "7px 6px", borderRadius: 6, border: "none", cursor: "pointer",
                                background: difficulty === opt.key ? opt.color : "rgba(255,255,255,0.05)",
                                color: difficulty === opt.key ? "#fff" : MUTED, fontSize: 10, fontWeight: 700,
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>Confidence: {confidence || 0}/5</div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {[1, 2, 3, 4, 5].map(v => (
                            <button
                              key={v}
                              onClick={() => setConfidence(day.day, v)}
                              style={{
                                width: 28, height: 28, borderRadius: 6, border: "none", cursor: "pointer",
                                background: confidence >= v ? "#3B82F6" : "rgba(255,255,255,0.05)",
                                color: confidence >= v ? "#fff" : MUTED, fontSize: 10, fontWeight: 700,
                              }}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Challenge */}
                      {day.challenge && (
                        <div style={{ marginTop: 10, padding: 10, background: `${ph.color}08`, borderRadius: 6, border: `1px solid ${ph.color}20` }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: ph.color, letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>
                            🎯 Challenge
                          </div>
                          <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.5 }}>{day.challenge}</div>
                        </div>
                      )}

                      {/* Hint System */}
                      <HintPanel day={day} />

                      {/* Debrief reminder */}
                      <div style={{ marginTop: 10, fontSize: 10, color: MUTED, padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 6 }}>
                        🧠 <strong>Debrief (10 min):</strong> git commit, อธิบายปากเปล่า 30s, เขียน reflection 3 บรรทัด
                      </div>
                      {isRecoveryBlocked && (
                        <div style={{ marginTop: 8, fontSize: 10, color: "#FCA5A5", padding: "6px 8px", background: "rgba(239,68,68,0.10)", borderRadius: 6, border: "1px solid rgba(239,68,68,0.25)" }}>
                          🚧 Recovery Day: ยังมีวันก่อนหน้าที่ไม่ complete {pendingBeforeToday} วัน ควรเคลียร์ก่อน
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── BOTTOM BAR ─── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        padding: "12px 14px", background: "linear-gradient(transparent, #050607 40%)",
        display: "flex", gap: 8, justifyContent: "center",
      }}>
        {view === "days" && (
          <button onClick={() => { setActivePhase(0); setView("overview"); }} style={{
            padding: "7px 16px", borderRadius: 99, border: `1px solid ${BORDER}`,
            background: CARD, color: MUTED, fontSize: 11, cursor: "pointer",
          }}>← Overview</button>
        )}
        <button onClick={() => { if (confirm("ลบ progress ทั้งหมด?")) { setDone({}); setPretestResults({}); setHintsUsed({}); setDailyDifficulty({}); setDailyConfidence({}); } }} style={{
          padding: "7px 16px", borderRadius: 99, border: `1px solid ${BORDER}`,
          background: CARD, color: MUTED, fontSize: 11, cursor: "pointer",
        }}>🔄 Reset</button>
      </div>
    </div>
  );
}
