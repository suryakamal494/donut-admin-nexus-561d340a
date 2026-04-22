// Comprehensive mock data for Student Copilot seeding
// Matches exact content interfaces consumed by all 9 artifact view components

const STUDENT_ID = "student-001";

// ─── Routines ───
export const MOCK_ROUTINES = [
  {
    key: "s_doubt",
    label: "Ask a Doubt",
    icon: "MessageSquare",
    description: "Get instant explanations for any concept or problem",
    default_system_prompt: "You are a friendly CBSE Class 10 tutor. Explain concepts step-by-step with examples. Use LaTeX for math.",
    quick_start_chips: ["Explain Newton's Third Law", "What is pH scale?", "Solve this quadratic equation", "Difference between mitosis and meiosis"],
    audience: "student",
    is_active: true,
    sort_order: 0,
  },
  {
    key: "s_practice",
    label: "Practice",
    icon: "Dumbbell",
    description: "Practice questions on any topic with instant feedback",
    default_system_prompt: "Generate practice questions for CBSE Class 10. Include explanations for each answer.",
    quick_start_chips: ["5 MCQs on Optics", "Practice Trigonometry", "Chemical Reactions quiz", "Test me on Heredity"],
    audience: "student",
    is_active: true,
    sort_order: 1,
  },
  {
    key: "s_exam_prep",
    label: "Exam Prep",
    icon: "Target",
    description: "Set exam targets and get personalized preparation plans",
    default_system_prompt: "Help the student prepare for upcoming exams. Create target trackers and study plans.",
    quick_start_chips: ["Prepare for Unit Test", "JEE Mains plan", "Board exam strategy"],
    audience: "student",
    is_active: true,
    sort_order: 2,
  },
  {
    key: "s_roadmap",
    label: "Study Roadmap",
    icon: "Map",
    description: "Create structured study plans for any topic or exam",
    default_system_prompt: "Create detailed study plans with daily tasks, durations, and resources.",
    quick_start_chips: ["5-day Physics plan", "Weekly Math revision", "Chapter-wise Chemistry plan"],
    audience: "student",
    is_active: true,
    sort_order: 3,
  },
  {
    key: "s_progress",
    label: "My Progress",
    icon: "TrendingUp",
    description: "View your mastery map, progress reports, and test analysis",
    default_system_prompt: "Analyze the student's performance data and provide insights and recommendations.",
    quick_start_chips: ["Show my mastery map", "Weekly progress report", "Analyze last test"],
    audience: "student",
    is_active: true,
    sort_order: 4,
  },
];

// ─── Thread IDs (deterministic for seeding) ───
const T1 = "t-mock-doubt-001";
const T2 = "t-mock-doubt-002";
const T3 = "t-mock-practice-001";
const T4 = "t-mock-exam-001";
const T5 = "t-mock-roadmap-001";
const T6 = "t-mock-progress-001";

// ─── Artifact IDs ───
const A1 = "a-mock-concept-001";
const A2 = "a-mock-solution-001";
const A3 = "a-mock-formula-001";
const A4 = "a-mock-practice-001";
const A5 = "a-mock-studyplan-001";
const A6 = "a-mock-target-001";
const A7 = "a-mock-mastery-001";
const A8 = "a-mock-progress-001";
const A9 = "a-mock-debrief-001";

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
          { topic: "Motion", accuracy: 85, attempts: 32, band: "mastery_ready" },
          { topic: "Force & Laws", accuracy: 78, attempts: 28, band: "stable" },
          { topic: "Gravitation", accuracy: 62, attempts: 15, band: "reinforcement" },
          { topic: "Work & Energy", accuracy: 45, attempts: 8, band: "foundational_risk" },
        ]},
        { subject: "Chemistry", overall_accuracy: 65, topics: [
          { topic: "Chemical Reactions", accuracy: 72, attempts: 25, band: "stable" },
          { topic: "Acids, Bases & Salts", accuracy: 68, attempts: 20, band: "reinforcement" },
          { topic: "Metals & Non-metals", accuracy: 55, attempts: 12, band: "foundational_risk" },
        ]},
      ],
      strongest: ["Motion", "Chemical Reactions"],
      weakest: ["Work & Energy", "Metals & Non-metals"],
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
      total_attempts: 156,
      subjects: [
        { subject: "Physics", accuracy: 78, trend: "up", total_attempts: 65, mastery_topics: 2, weak_topics: 1 },
        { subject: "Chemistry", accuracy: 65, trend: "flat", total_attempts: 45, mastery_topics: 1, weak_topics: 2 },
        { subject: "Math", accuracy: 71, trend: "up", total_attempts: 46, mastery_topics: 1, weak_topics: 1 },
      ],
      weekly_activity: [
        { week: "W1", attempts: 28, accuracy: 65 },
        { week: "W2", attempts: 35, accuracy: 68 },
        { week: "W3", attempts: 42, accuracy: 71 },
        { week: "W4", attempts: 51, accuracy: 72 },
      ],
      recommendations: [
        "Focus on Chemistry — Metals & Non-metals needs 15+ more practice attempts",
        "Your Physics is improving steadily — keep practicing Work & Energy",
        "Try timed practice sessions to improve speed",
        "Review incorrect answers from last week's practice",
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
    title: "Physics Practice Due",
    body: "You have 5 practice questions on Gravitation due today. Complete them to maintain your streak!",
    subject: "Physics",
    priority: 2,
    dismissed: false,
    acted_on: false,
  },
  {
    student_id: STUDENT_ID,
    type: "exam_reminder",
    title: "Unit Test 3 in 7 days",
    body: "Your Unit Test 3 is coming up. Start with the target tracker to identify focus areas.",
    priority: 3,
    dismissed: false,
    acted_on: false,
  },
  {
    student_id: STUDENT_ID,
    type: "chapter_today",
    title: "Today's Chapter: Work & Energy",
    body: "Your class is covering Work & Energy today. Ask doubts to prepare!",
    subject: "Physics",
    priority: 1,
    dismissed: false,
    acted_on: false,
  },
];