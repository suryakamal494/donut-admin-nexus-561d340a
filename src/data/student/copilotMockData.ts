// Comprehensive mock data for Student Copilot seeding
// All IDs are valid UUIDs for database compatibility

const STUDENT_ID = "student-001";

// ─── Routines ───
export const MOCK_ROUTINES = [
  {
    key: "s_doubt",
    label: "Ask a Doubt",
    icon: "MessageSquare",
    description: "Get step-by-step help with any concept or problem",
    default_system_prompt: "You are a patient tutor. Help the student understand concepts step by step.",
    quick_start_chips: ["Explain Newton's laws of motion", "What is the mole concept?", "Help me with integration by parts", "Explain photosynthesis"],
    audience: "student",
    is_active: true,
    sort_order: 0,
  },
  {
    key: "s_practice",
    label: "Practice",
    icon: "Dumbbell",
    description: "Adaptive practice sessions calibrated to your weak areas",
    default_system_prompt: "You are a practice coach. Generate challenging questions calibrated to the student's level.",
    quick_start_chips: ["10 MCQs on Kinematics", "Quick quiz on organic chemistry", "Practice integration problems", "Test me on cell biology"],
    audience: "student",
    is_active: true,
    sort_order: 1,
  },
  {
    key: "s_exam_prep",
    label: "Exam Prep",
    icon: "Target",
    description: "Set targets and get personalized study plans",
    default_system_prompt: "You are an exam preparation strategist. Help the student plan and track their preparation.",
    quick_start_chips: ["I have JEE in 45 days", "Set target score for boards", "Create a study plan for physics"],
    audience: "student",
    is_active: true,
    sort_order: 2,
  },
  {
    key: "s_roadmap",
    label: "Study Roadmap",
    icon: "Map",
    description: "Get a day-by-day study plan for any topic or exam",
    default_system_prompt: "You create structured study roadmaps. Build detailed day-by-day plans.",
    quick_start_chips: ["7-day plan for Thermodynamics", "Plan for organic chemistry in 2 weeks", "Revision roadmap for Math boards"],
    audience: "student",
    is_active: true,
    sort_order: 3,
  },
  {
    key: "s_progress",
    label: "My Progress",
    icon: "TrendingUp",
    description: "See your mastery map and track improvement",
    default_system_prompt: "You are a progress analyst. Show the student where they stand and what to focus on next.",
    quick_start_chips: ["How am I doing in Physics?", "Show my weak topics", "My overall progress report"],
    audience: "student",
    is_active: true,
    sort_order: 4,
  },
];

// ─── Deterministic UUIDs for threads ───
const T1 = "a0a0a0a0-1111-4000-8000-000000000001";
const T2 = "a0a0a0a0-1111-4000-8000-000000000002";
const T3 = "a0a0a0a0-1111-4000-8000-000000000003";
const T4 = "a0a0a0a0-1111-4000-8000-000000000004";
const T5 = "a0a0a0a0-1111-4000-8000-000000000005";
const T6 = "a0a0a0a0-1111-4000-8000-000000000006";

// ─── Deterministic UUIDs for artifacts ───
const A1 = "b0b0b0b0-2222-4000-8000-000000000001";
const A2 = "b0b0b0b0-2222-4000-8000-000000000002";
const A3 = "b0b0b0b0-2222-4000-8000-000000000003";
const A4 = "b0b0b0b0-2222-4000-8000-000000000004";
const A5 = "b0b0b0b0-2222-4000-8000-000000000005";
const A6 = "b0b0b0b0-2222-4000-8000-000000000006";
const A7 = "b0b0b0b0-2222-4000-8000-000000000007";
const A8 = "b0b0b0b0-2222-4000-8000-000000000008";
const A9 = "b0b0b0b0-2222-4000-8000-000000000009";

// ─── Exam UUIDs ───
const E1 = "e0e0e0e0-3333-4000-8000-000000000001";
const E2 = "e0e0e0e0-3333-4000-8000-000000000002";

export const MOCK_THREADS = [
  { id: T1, student_id: STUDENT_ID, routine_key: "s_doubt", title: "Newton's Laws of Motion", subject: "Physics", last_message_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: T2, student_id: STUDENT_ID, routine_key: "s_doubt", title: "Acids, Bases and Salts", subject: "Chemistry", last_message_at: new Date(Date.now() - 86400000).toISOString(), created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: T3, student_id: STUDENT_ID, routine_key: "s_practice", title: "Mechanics MCQ Practice", subject: "Physics", last_message_at: new Date(Date.now() - 43200000).toISOString(), created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: T4, student_id: STUDENT_ID, routine_key: "s_exam_prep", title: "Unit Test 3 Preparation", subject: null, last_message_at: new Date(Date.now() - 129600000).toISOString(), created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: T5, student_id: STUDENT_ID, routine_key: "s_roadmap", title: "Physics Chapter 1-4 Revision", subject: "Physics", last_message_at: new Date(Date.now() - 172800000).toISOString(), created_at: new Date(Date.now() - 345600000).toISOString() },
  { id: T6, student_id: STUDENT_ID, routine_key: "s_progress", title: "Weekly Progress Check", subject: null, last_message_at: new Date(Date.now() - 259200000).toISOString(), created_at: new Date(Date.now() - 432000000).toISOString() },
];

export const MOCK_MESSAGES = [
  // Thread 1 — Newton's Laws
  { thread_id: T1, role: "user", content: "Explain Newton's Third Law with real-life examples" },
  { thread_id: T1, role: "assistant", content: "Great question! Newton's Third Law states:\n\n> **For every action, there is an equal and opposite reaction.**\n\nHere are some real-life examples:\n\n1. **Walking**: When you push the ground backward with your foot (action), the ground pushes you forward (reaction).\n\n2. **Swimming**: You push water backward (action), and water pushes you forward (reaction).\n\n3. **Rocket Launch**: Hot gases are expelled downward (action), and the rocket moves upward (reaction).\n\nThe key point is that action and reaction forces act on **different bodies**, not on the same body. That's why they don't cancel each other!\n\nWant me to create a detailed concept explainer for this?" },
  { thread_id: T1, role: "user", content: "Yes, create a concept explainer" },
  { thread_id: T1, role: "assistant", content: "I've created a detailed concept explainer for Newton's Third Law. You can see it in the artifacts panel on the right. It includes step-by-step explanations and a challenge question!" },

  // Thread 2 — Chemistry
  { thread_id: T2, role: "user", content: "What is the pH scale? How does it work?" },
  { thread_id: T2, role: "assistant", content: "The **pH scale** measures how acidic or basic a solution is.\n\n- Range: **0 to 14**\n- pH < 7 → **Acidic** (e.g., lemon juice pH ≈ 2)\n- pH = 7 → **Neutral** (pure water)\n- pH > 7 → **Basic/Alkaline** (e.g., soap pH ≈ 10)\n\n**pH** stands for 'potential of Hydrogen' and is defined as:\n$$pH = -\\log[H^+]$$\n\nThe lower the pH, the higher the concentration of $H^+$ ions, and the more acidic the solution.\n\nWould you like a formula sheet for Acids, Bases and Salts?" },

  // Thread 3 — Practice
  { thread_id: T3, role: "user", content: "Give me 5 MCQs on Mechanics" },
  { thread_id: T3, role: "assistant", content: "I've generated a practice session with 5 MCQ questions on Mechanics covering Newton's Laws, friction, and momentum. You can attempt them interactively!" },

  // Thread 4 — Exam prep
  { thread_id: T4, role: "user", content: "Help me prepare for Unit Test 3. I need to score at least 85 out of 100." },
  { thread_id: T4, role: "assistant", content: "I've created a target tracker for your Unit Test 3. It shows your current estimated score, subject-wise gaps, and a daily plan to help you reach 85. Check the artifacts panel!" },

  // Thread 5 — Roadmap
  { thread_id: T5, role: "user", content: "Create a 5-day revision plan for Physics chapters 1-4" },
  { thread_id: T5, role: "assistant", content: "Here's your 5-day Physics revision plan covering Motion, Force & Laws, Gravitation, and Work & Energy. Each day has specific tasks with estimated durations. You can track your progress by checking off completed tasks!" },

  // Thread 6 — Progress
  { thread_id: T6, role: "user", content: "Show me my weekly progress report" },
  { thread_id: T6, role: "assistant", content: "Here's your weekly progress report! Your overall accuracy is 72% with an upward trend. Physics is your strongest subject at 78%, while Chemistry needs some work at 65%. I've also included recommendations to improve." },
];

// ─── Artifacts ───
export const MOCK_ARTIFACTS = [
  {
    id: A1, student_id: STUDENT_ID, thread_id: T1, type: "concept_explainer",
    title: "Newton's Third Law of Motion",
    source: "ai",
    content: {
      topic: "Newton's Third Law of Motion",
      subject: "Physics",
      summary: "For every action, there is an equal and opposite reaction. Action and reaction forces act on **different bodies** simultaneously and are equal in magnitude but opposite in direction.",
      steps: [
        { title: "Understanding Action-Reaction Pairs", explanation: "When body A exerts a force on body B (action), body B simultaneously exerts a force of equal magnitude on body A in the opposite direction (reaction). These two forces are called an **action-reaction pair**.", hint: "Remember: action and reaction never act on the same body!" },
        { title: "Why Don't They Cancel?", explanation: "Action and reaction forces act on **different objects**. For forces to cancel, they must act on the **same object**. Since they act on different bodies, each body accelerates independently according to $F = ma$.", hint: "Think of it this way: you push the wall, the wall pushes you. You move, the wall doesn't (because it has much more mass)." },
        { title: "Mathematical Form", explanation: "$$\\vec{F}_{AB} = -\\vec{F}_{BA}$$\n\nThe force exerted by A on B is equal in magnitude and opposite in direction to the force exerted by B on A." },
        { title: "Real-World Applications", explanation: "1. **Rocket propulsion**: Exhaust gases are pushed downward, rocket moves upward\n2. **Walking**: Foot pushes ground backward, ground pushes you forward\n3. **Gun recoil**: Bullet goes forward, gun kicks backward" },
      ],
      challenge: "A 50 kg person stands on a scale in an elevator. If the elevator accelerates upward at $2 \\text{ m/s}^2$, what does the scale read? (Hint: Draw a free body diagram and apply Newton's Third Law at the contact surface)",
      key_takeaway: "Newton's Third Law is about **interactions** — forces always come in pairs. You cannot have a single isolated force in nature.",
    },
  },
  {
    id: A2, student_id: STUDENT_ID, thread_id: T1, type: "worked_solution",
    title: "Projectile Motion — Maximum Height",
    source: "ai",
    content: {
      problem: "A ball is thrown vertically upward with an initial velocity of $20 \\text{ m/s}$. Find the maximum height reached. Take $g = 10 \\text{ m/s}^2$.",
      given: "$u = 20 \\text{ m/s}$, $g = 10 \\text{ m/s}^2$, $v = 0$ (at max height)",
      to_find: "Maximum height $h$",
      steps: [
        { step_number: 1, description: "Identify the equation", working: "Using $v^2 = u^2 - 2gh$ (taking upward as positive)" },
        { step_number: 2, description: "Substitute known values", working: "$0 = (20)^2 - 2(10)(h)$\n\n$0 = 400 - 20h$" },
        { step_number: 3, description: "Solve for h", working: "$20h = 400$\n\n$h = \\frac{400}{20} = 20 \\text{ m}$" },
      ],
      final_answer: "The maximum height reached is $h = 20 \\text{ m}$",
      common_mistakes: [
        "Forgetting that velocity at maximum height is zero",
        "Using wrong sign convention for $g$",
        "Confusing $v^2 = u^2 + 2as$ with $v^2 = u^2 - 2gh$",
      ],
      marks_breakdown: [
        { step: "Writing the correct equation", marks: 1 },
        { step: "Correct substitution", marks: 1 },
        { step: "Final answer with unit", marks: 1 },
      ],
    },
  },
  {
    id: A3, student_id: STUDENT_ID, thread_id: T2, type: "formula_sheet",
    title: "Kinematics — Key Formulas",
    source: "ai",
    content: {
      topic: "Kinematics",
      subject: "Physics",
      formulas: [
        { name: "First Equation of Motion", expression: "v = u + at", when_to_use: "When displacement is not given", variables: [{ symbol: "v", name: "Final velocity", unit: "m/s" }, { symbol: "u", name: "Initial velocity", unit: "m/s" }, { symbol: "a", name: "Acceleration", unit: "m/s²" }, { symbol: "t", name: "Time", unit: "s" }] },
        { name: "Second Equation of Motion", expression: "s = ut + \\frac{1}{2}at^2", when_to_use: "When final velocity is not given", variables: [{ symbol: "s", name: "Displacement", unit: "m" }] },
        { name: "Third Equation of Motion", expression: "v^2 = u^2 + 2as", when_to_use: "When time is not given" },
        { name: "Average Velocity", expression: "v_{avg} = \\frac{u + v}{2}", when_to_use: "For uniform acceleration only" },
      ],
    },
  },
  {
    id: A4, student_id: STUDENT_ID, thread_id: T3, type: "practice_session",
    title: "Mechanics MCQ Practice",
    source: "ai",
    content: {
      title: "Mechanics MCQ Practice",
      subject: "Physics",
      topic: "Mechanics",
      questions: [
        { id: "pq1", type: "mcq", question: "A body of mass 5 kg is acted upon by a net force of 10 N. What is its acceleration?", options: [{ label: "A", text: "$1 \\text{ m/s}^2$" }, { label: "B", text: "$2 \\text{ m/s}^2$" }, { label: "C", text: "$5 \\text{ m/s}^2$" }, { label: "D", text: "$50 \\text{ m/s}^2$" }], correct_answer: "B", explanation: "Using $F = ma$, we get $a = F/m = 10/5 = 2 \\text{ m/s}^2$", topic: "Newton's Second Law", difficulty: "easy" },
        { id: "pq2", type: "mcq", question: "Which of the following is a unit of momentum?", options: [{ label: "A", text: "kg⋅m/s²" }, { label: "B", text: "kg⋅m/s" }, { label: "C", text: "N⋅m" }, { label: "D", text: "J/s" }], correct_answer: "B", explanation: "Momentum $p = mv$. Units: kg × m/s = kg⋅m/s", topic: "Momentum", difficulty: "easy" },
        { id: "pq3", type: "mcq", question: "A car of mass 1000 kg moving at 20 m/s brakes to a stop in 10 s. What is the braking force?", options: [{ label: "A", text: "1000 N" }, { label: "B", text: "2000 N" }, { label: "C", text: "10000 N" }, { label: "D", text: "20000 N" }], correct_answer: "B", explanation: "Deceleration $a = \\Delta v / t = 20/10 = 2$ m/s². Force $F = ma = 1000 \\times 2 = 2000$ N", topic: "Newton's Second Law", difficulty: "medium" },
        { id: "pq4", type: "mcq", question: "The coefficient of friction between a block and a surface is 0.4. If the block weighs 50 N, what is the frictional force?", options: [{ label: "A", text: "12.5 N" }, { label: "B", text: "20 N" }, { label: "C", text: "125 N" }, { label: "D", text: "200 N" }], correct_answer: "B", explanation: "$f = \\mu N = 0.4 \\times 50 = 20$ N", topic: "Friction", difficulty: "medium" },
        { id: "pq5", type: "true_false", question: "The net force on an object moving with constant velocity is zero.", correct_answer: "true", explanation: "By Newton's First Law, an object moving with constant velocity has zero acceleration, so net force is zero.", topic: "Newton's First Law", difficulty: "easy" },
      ],
    },
  },
  {
    id: A5, student_id: STUDENT_ID, thread_id: T5, type: "study_plan",
    title: "5-Day Physics Revision Plan",
    source: "ai",
    content: {
      title: "5-Day Physics Revision Plan (Ch 1-4)",
      subject: "Physics",
      total_days: 5,
      days: [
        { day: 1, label: "Motion in a Straight Line", items: [{ task: "Revise distance, displacement, speed & velocity", duration: "30 min" }, { task: "Solve 10 numericals on equations of motion", duration: "45 min" }, { task: "Practice graphs: s-t, v-t, a-t", duration: "20 min" }] },
        { day: 2, label: "Force and Laws of Motion", items: [{ task: "Revise Newton's 3 Laws with examples", duration: "30 min" }, { task: "Solve problems on F=ma and momentum", duration: "40 min" }, { task: "Practice free body diagrams", duration: "25 min" }] },
        { day: 3, label: "Gravitation", items: [{ task: "Universal Law of Gravitation — derivation", duration: "25 min" }, { task: "Solve numericals on g, weight, mass", duration: "35 min" }, { task: "Revise Kepler's Laws", duration: "15 min" }] },
        { day: 4, label: "Work and Energy", items: [{ task: "Revise Work, Energy & Power formulas", duration: "25 min" }, { task: "Solve 10 problems on KE, PE, conservation", duration: "45 min" }, { task: "Practice work-energy theorem problems", duration: "20 min" }] },
        { day: 5, label: "Mixed Revision & Test", items: [{ task: "Solve previous year questions (Ch 1-4)", duration: "40 min" }, { task: "Take a 30-question mock test", duration: "45 min" }, { task: "Review mistakes and note weak areas", duration: "20 min" }] },
      ],
      tips: [
        "Start each session by reviewing formulas from the formula sheet",
        "Use the practice tool for topic-wise MCQs after each chapter",
        "Take 5-minute breaks between tasks to stay focused",
      ],
    },
  },
  {
    id: A6, student_id: STUDENT_ID, thread_id: T4, type: "target_tracker",
    title: "Unit Test 3 — Target Tracker",
    source: "ai",
    content: {
      exam_name: "Unit Test 3",
      exam_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      current_score: 62,
      target_score: 85,
      max_score: 100,
      days_remaining: 7,
      weekly_target: 15,
      subjects: [
        { subject: "Physics", current: 70, target: 85, gap: 15, priority_topics: ["Gravitation", "Work & Energy"] },
        { subject: "Chemistry", current: 55, target: 80, gap: 25, priority_topics: ["Chemical Reactions", "Acids & Bases", "Metals"] },
        { subject: "Math", current: 68, target: 90, gap: 22, priority_topics: ["Trigonometry", "Statistics"] },
      ],
      today_plan: [
        { task: "Revise Gravitation formulas", subject: "Physics", duration: "30 min" },
        { task: "Practice Chemical Equations", subject: "Chemistry", duration: "40 min" },
        { task: "Solve 5 Trigonometry problems", subject: "Math", duration: "25 min" },
      ],
    },
  },
  {
    id: A7, student_id: STUDENT_ID, thread_id: T6, type: "mastery_map",
    title: "My Mastery Map",
    source: "ai",
    content: {
      title: "My Mastery Map",
      subjects: [
        { subject: "Physics", overall_accuracy: 74, topics: [
          { topic: "Kinematics", accuracy: 75, attempts: 4, band: "stable" },
          { topic: "Newton's Laws", accuracy: 80, attempts: 5, band: "mastery_ready" },
        ]},
        { subject: "Chemistry", overall_accuracy: 50, topics: [
          { topic: "Mole Concept", accuracy: 33, attempts: 3, band: "foundational_risk" },
          { topic: "Atomic Structure", accuracy: 100, attempts: 4, band: "mastery_ready" },
        ]},
        { subject: "Math", overall_accuracy: 57, topics: [
          { topic: "Integration", accuracy: 33, attempts: 3, band: "foundational_risk" },
          { topic: "Differentiation", accuracy: 100, attempts: 4, band: "mastery_ready" },
        ]},
        { subject: "Biology", overall_accuracy: 83, topics: [
          { topic: "Cell Division", accuracy: 67, attempts: 3, band: "stable" },
          { topic: "Photosynthesis", accuracy: 100, attempts: 4, band: "mastery_ready" },
        ]},
      ],
      strongest: ["Newton's Laws", "Atomic Structure", "Differentiation", "Photosynthesis"],
      weakest: ["Integration", "Mole Concept"],
      cold_topics: ["Electricity", "Magnetic Effects", "Carbon Compounds"],
    },
  },
  {
    id: A8, student_id: STUDENT_ID, thread_id: T6, type: "progress_report",
    title: "Weekly Progress Report",
    source: "ai",
    content: {
      title: "Weekly Progress Report",
      period: "Apr 14 – Apr 21",
      overall_accuracy: 72,
      overall_trend: "up",
      total_attempts: 30,
      subjects: [
        { subject: "Physics", accuracy: 78, trend: "up", total_attempts: 9, mastery_topics: 1, weak_topics: 0 },
        { subject: "Chemistry", accuracy: 57, trend: "flat", total_attempts: 7, mastery_topics: 1, weak_topics: 1 },
        { subject: "Math", accuracy: 57, trend: "up", total_attempts: 7, mastery_topics: 1, weak_topics: 1 },
        { subject: "Biology", accuracy: 86, trend: "up", total_attempts: 7, mastery_topics: 1, weak_topics: 0 },
      ],
      weekly_activity: [
        { week: "W1", attempts: 8, accuracy: 63 },
        { week: "W2", attempts: 10, accuracy: 70 },
        { week: "W3", attempts: 12, accuracy: 75 },
      ],
      recommendations: [
        "Focus on Chemistry — Mole Concept needs more practice (only 33% accuracy)",
        "Math Integration is weak at 33% — solve 10 more problems",
        "Biology is your strongest area — keep it up!",
        "Try timed practice sessions to improve speed",
      ],
    },
  },
  {
    id: A9, student_id: STUDENT_ID, thread_id: T3, type: "test_debrief",
    title: "Unit Test 2 — Debrief",
    source: "ai",
    content: {
      title: "Unit Test 2 — Physics Debrief",
      subject: "Physics",
      total_questions: 10,
      correct: 6,
      incorrect: 3,
      unattempted: 1,
      accuracy: 60,
      questions: [
        { question_number: 1, topic: "Motion", correct: true, attempted: true },
        { question_number: 2, topic: "Motion", correct: true, attempted: true },
        { question_number: 3, topic: "Force", correct: true, attempted: true },
        { question_number: 4, topic: "Force", correct: false, attempted: true, question_text: "A 2 kg block on a frictionless surface is pushed with 10 N. Find acceleration.", your_answer: "10 m/s²", correct_answer: "5 m/s²", explanation: "$a = F/m = 10/2 = 5$ m/s². Common mistake: forgetting to divide by mass." },
        { question_number: 5, topic: "Gravitation", correct: true, attempted: true },
        { question_number: 6, topic: "Gravitation", correct: false, attempted: true, question_text: "Calculate the gravitational force between two 10 kg masses 1 m apart.", your_answer: "6.67 × 10⁻⁹ N", correct_answer: "6.67 × 10⁻⁹ N", explanation: "Your numerical answer was actually correct but the unit was missing in the response." },
        { question_number: 7, topic: "Work & Energy", correct: true, attempted: true },
        { question_number: 8, topic: "Work & Energy", correct: false, attempted: true, question_text: "A ball of mass 0.5 kg falls from 20 m. Find its KE just before hitting the ground.", your_answer: "50 J", correct_answer: "100 J", explanation: "$KE = mgh = 0.5 \\times 10 \\times 20 = 100$ J. You forgot to multiply by height correctly." },
        { question_number: 9, topic: "Work & Energy", correct: true, attempted: true },
        { question_number: 10, topic: "Gravitation", correct: false, attempted: false },
      ],
      weak_topics: ["Work & Energy", "Gravitation"],
      follow_up: [
        "Practice 10 more problems on Work-Energy theorem",
        "Revise gravitational force formula and its application",
        "Attempt Q10 topic — universal gravitation numericals",
      ],
    },
  },
];

// ─── Notifications ───
export const MOCK_NOTIFICATIONS = [
  {
    student_id: STUDENT_ID,
    type: "homework",
    title: "Kinematics Problem Set",
    body: "Chapter 4 problems 1-15, due tomorrow",
    subject: "Physics",
    priority: 3,
    dismissed: false,
    acted_on: false,
  },
  {
    student_id: STUDENT_ID,
    type: "exam_reminder",
    title: "Physics Unit Test — Mechanics",
    body: "Covers Chapters 3-5, in 5 days",
    subject: "Physics",
    priority: 5,
    dismissed: false,
    acted_on: false,
  },
  {
    student_id: STUDENT_ID,
    type: "chapter_today",
    title: "Cell Division PPT",
    body: "Teacher shared new material on Mitosis & Meiosis",
    subject: "Biology",
    priority: 2,
    dismissed: false,
    acted_on: false,
  },
  {
    student_id: STUDENT_ID,
    type: "debrief_available",
    title: "Review: Chemistry Practice #3",
    body: "You scored 6/10 — let's see what to improve",
    subject: "Chemistry",
    priority: 1,
    dismissed: false,
    acted_on: false,
  },
];

// ─── Student Attempts (for mastery pipeline) ───
export const MOCK_ATTEMPTS = [
  // Physics — Kinematics (3/4 correct = 75%)
  { student_id: STUDENT_ID, subject: "Physics", topic: "Kinematics", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Physics", topic: "Kinematics", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Physics", topic: "Kinematics", question_type: "short", correct: false, source: "practice" },
  { student_id: STUDENT_ID, subject: "Physics", topic: "Kinematics", question_type: "mcq", correct: true, source: "practice" },
  // Physics — Newton's Laws (4/5 correct = 80%)
  { student_id: STUDENT_ID, subject: "Physics", topic: "Newton's Laws", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Physics", topic: "Newton's Laws", question_type: "short", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Physics", topic: "Newton's Laws", question_type: "mcq", correct: false, source: "practice" },
  { student_id: STUDENT_ID, subject: "Physics", topic: "Newton's Laws", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Physics", topic: "Newton's Laws", question_type: "short", correct: true, source: "practice" },
  // Chemistry — Mole Concept (1/3 correct = 33%)
  { student_id: STUDENT_ID, subject: "Chemistry", topic: "Mole Concept", question_type: "mcq", correct: false, source: "practice" },
  { student_id: STUDENT_ID, subject: "Chemistry", topic: "Mole Concept", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Chemistry", topic: "Mole Concept", question_type: "short", correct: false, source: "practice" },
  // Chemistry — Atomic Structure (4/4 correct = 100%)
  { student_id: STUDENT_ID, subject: "Chemistry", topic: "Atomic Structure", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Chemistry", topic: "Atomic Structure", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Chemistry", topic: "Atomic Structure", question_type: "short", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Chemistry", topic: "Atomic Structure", question_type: "mcq", correct: true, source: "practice" },
  // Math — Integration (1/3 correct = 33%)
  { student_id: STUDENT_ID, subject: "Math", topic: "Integration", question_type: "short", correct: false, source: "practice" },
  { student_id: STUDENT_ID, subject: "Math", topic: "Integration", question_type: "short", correct: false, source: "practice" },
  { student_id: STUDENT_ID, subject: "Math", topic: "Integration", question_type: "mcq", correct: true, source: "practice" },
  // Math — Differentiation (4/4 correct = 100%)
  { student_id: STUDENT_ID, subject: "Math", topic: "Differentiation", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Math", topic: "Differentiation", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Math", topic: "Differentiation", question_type: "short", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Math", topic: "Differentiation", question_type: "mcq", correct: true, source: "practice" },
  // Biology — Cell Division (2/3 correct = 67%)
  { student_id: STUDENT_ID, subject: "Biology", topic: "Cell Division", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Biology", topic: "Cell Division", question_type: "mcq", correct: false, source: "practice" },
  { student_id: STUDENT_ID, subject: "Biology", topic: "Cell Division", question_type: "short", correct: true, source: "practice" },
  // Biology — Photosynthesis (4/4 correct = 100%)
  { student_id: STUDENT_ID, subject: "Biology", topic: "Photosynthesis", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Biology", topic: "Photosynthesis", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Biology", topic: "Photosynthesis", question_type: "mcq", correct: true, source: "practice" },
  { student_id: STUDENT_ID, subject: "Biology", topic: "Photosynthesis", question_type: "short", correct: true, source: "practice" },
];

// ─── Exams ───
export const MOCK_EXAMS = [
  {
    id: E1,
    student_id: STUDENT_ID,
    name: "Physics Unit Test — Mechanics",
    exam_date: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    target_score: 85,
    max_score: 100,
  },
  {
    id: E2,
    student_id: STUDENT_ID,
    name: "JEE Main Mock 1",
    exam_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    target_score: 180,
    max_score: 300,
  },
];