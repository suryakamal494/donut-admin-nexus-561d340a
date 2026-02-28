// Static mock questions for the Generate Homework UI prototype
// Returns instant results for all 4 bands without API calls

interface GeneratedQuestion {
  id: string;
  text: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  difficulty: string;
  topic: string;
}

interface BandResult {
  questions: GeneratedQuestion[];
}

const questionPool: Record<string, GeneratedQuestion[]> = {
  mastery: [
    { id: "m1", text: "A particle moves in a circle of radius 10 m with a constant speed of 5 m/s. What is the magnitude of the centripetal acceleration?", options: [{ label: "A", text: "2.5 m/s²" }, { label: "B", text: "5.0 m/s²" }, { label: "C", text: "0.5 m/s²" }, { label: "D", text: "25 m/s²" }], correctAnswer: "A", difficulty: "hard", topic: "Circular Motion" },
    { id: "m2", text: "Two blocks of masses 2 kg and 3 kg are connected by a light string over a frictionless pulley. What is the acceleration of the system?", options: [{ label: "A", text: "1.96 m/s²" }, { label: "B", text: "3.92 m/s²" }, { label: "C", text: "4.9 m/s²" }, { label: "D", text: "2.45 m/s²" }], correctAnswer: "A", difficulty: "hard", topic: "Newton's Laws" },
    { id: "m3", text: "A projectile is launched at 60° with initial speed 20 m/s. What is the maximum height reached?", options: [{ label: "A", text: "15.3 m" }, { label: "B", text: "10.2 m" }, { label: "C", text: "20.4 m" }, { label: "D", text: "5.1 m" }], correctAnswer: "A", difficulty: "hard", topic: "Projectile Motion" },
    { id: "m4", text: "An object of mass 5 kg is placed on an inclined plane at 30°. If μ = 0.3, find the net force along the plane.", options: [{ label: "A", text: "11.8 N" }, { label: "B", text: "24.5 N" }, { label: "C", text: "12.3 N" }, { label: "D", text: "37.2 N" }], correctAnswer: "A", difficulty: "hard", topic: "Friction" },
    { id: "m5", text: "A 2 kg ball is thrown vertically upward with velocity 15 m/s. What is the kinetic energy at the highest point?", options: [{ label: "A", text: "0 J" }, { label: "B", text: "225 J" }, { label: "C", text: "112.5 J" }, { label: "D", text: "30 J" }], correctAnswer: "A", difficulty: "medium", topic: "Energy Conservation" },
    { id: "m6", text: "What is the work done by gravity on a 10 kg object falling freely through 5 m?", options: [{ label: "A", text: "490 J" }, { label: "B", text: "50 J" }, { label: "C", text: "245 J" }, { label: "D", text: "100 J" }], correctAnswer: "A", difficulty: "medium", topic: "Work & Energy" },
    { id: "m7", text: "A car accelerates uniformly from 10 m/s to 30 m/s in 5 s. Find the distance covered.", options: [{ label: "A", text: "100 m" }, { label: "B", text: "75 m" }, { label: "C", text: "150 m" }, { label: "D", text: "200 m" }], correctAnswer: "A", difficulty: "medium", topic: "Kinematics" },
    { id: "m8", text: "A force of 10 N acts on a body of mass 2 kg at an angle of 60° to the horizontal. What is the horizontal acceleration?", options: [{ label: "A", text: "2.5 m/s²" }, { label: "B", text: "5.0 m/s²" }, { label: "C", text: "4.33 m/s²" }, { label: "D", text: "1.25 m/s²" }], correctAnswer: "A", difficulty: "hard", topic: "Newton's Laws" },
    { id: "m9", text: "The escape velocity from the surface of Earth is approximately:", options: [{ label: "A", text: "11.2 km/s" }, { label: "B", text: "7.9 km/s" }, { label: "C", text: "3.1 km/s" }, { label: "D", text: "15.4 km/s" }], correctAnswer: "A", difficulty: "medium", topic: "Gravitation" },
    { id: "m10", text: "A spring of constant 200 N/m is compressed by 0.1 m. What is the potential energy stored?", options: [{ label: "A", text: "1 J" }, { label: "B", text: "2 J" }, { label: "C", text: "10 J" }, { label: "D", text: "0.5 J" }], correctAnswer: "A", difficulty: "medium", topic: "Energy Conservation" },
  ],
  stable: [
    { id: "s1", text: "An object is moving in a straight line with velocity v = 3t² + 2t. What is the acceleration at t = 2s?", options: [{ label: "A", text: "14 m/s²" }, { label: "B", text: "12 m/s²" }, { label: "C", text: "16 m/s²" }, { label: "D", text: "10 m/s²" }], correctAnswer: "A", difficulty: "medium", topic: "Kinematics" },
    { id: "s2", text: "A body of mass 4 kg is acted upon by a force F = (3î + 4ĵ) N. What is the magnitude of acceleration?", options: [{ label: "A", text: "1.25 m/s²" }, { label: "B", text: "1.75 m/s²" }, { label: "C", text: "5.0 m/s²" }, { label: "D", text: "0.75 m/s²" }], correctAnswer: "A", difficulty: "medium", topic: "Newton's Laws" },
    { id: "s3", text: "A ball is dropped from a height of 20 m. How long does it take to reach the ground? (g = 10 m/s²)", options: [{ label: "A", text: "2 s" }, { label: "B", text: "4 s" }, { label: "C", text: "1 s" }, { label: "D", text: "3 s" }], correctAnswer: "A", difficulty: "easy", topic: "Free Fall" },
    { id: "s4", text: "The momentum of a 3 kg object moving at 4 m/s is:", options: [{ label: "A", text: "12 kg·m/s" }, { label: "B", text: "7 kg·m/s" }, { label: "C", text: "1.33 kg·m/s" }, { label: "D", text: "0.75 kg·m/s" }], correctAnswer: "A", difficulty: "easy", topic: "Momentum" },
    { id: "s5", text: "What is the SI unit of force?", options: [{ label: "A", text: "Newton" }, { label: "B", text: "Joule" }, { label: "C", text: "Watt" }, { label: "D", text: "Pascal" }], correctAnswer: "A", difficulty: "easy", topic: "Units" },
    { id: "s6", text: "A cyclist goes around a circular track of radius 50 m in 10 s. What is the speed?", options: [{ label: "A", text: "31.4 m/s" }, { label: "B", text: "15.7 m/s" }, { label: "C", text: "5 m/s" }, { label: "D", text: "10 m/s" }], correctAnswer: "A", difficulty: "medium", topic: "Circular Motion" },
    { id: "s7", text: "A force of 50 N is applied to push a 10 kg box across a floor with μ = 0.2. What is the acceleration?", options: [{ label: "A", text: "3.04 m/s²" }, { label: "B", text: "5.0 m/s²" }, { label: "C", text: "2.0 m/s²" }, { label: "D", text: "1.0 m/s²" }], correctAnswer: "A", difficulty: "medium", topic: "Friction" },
    { id: "s8", text: "Which law states that every action has an equal and opposite reaction?", options: [{ label: "A", text: "Newton's Third Law" }, { label: "B", text: "Newton's First Law" }, { label: "C", text: "Newton's Second Law" }, { label: "D", text: "Law of Gravitation" }], correctAnswer: "A", difficulty: "easy", topic: "Newton's Laws" },
    { id: "s9", text: "What is the displacement of a body moving with uniform velocity 5 m/s for 10 s?", options: [{ label: "A", text: "50 m" }, { label: "B", text: "15 m" }, { label: "C", text: "2 m" }, { label: "D", text: "0.5 m" }], correctAnswer: "A", difficulty: "easy", topic: "Kinematics" },
    { id: "s10", text: "The gravitational acceleration on the Moon is approximately what fraction of Earth's?", options: [{ label: "A", text: "1/6" }, { label: "B", text: "1/3" }, { label: "C", text: "1/2" }, { label: "D", text: "1/10" }], correctAnswer: "A", difficulty: "easy", topic: "Gravitation" },
  ],
  reinforcement: [
    { id: "r1", text: "What is the formula for velocity?", options: [{ label: "A", text: "Displacement / Time" }, { label: "B", text: "Distance × Time" }, { label: "C", text: "Force / Mass" }, { label: "D", text: "Mass × Acceleration" }], correctAnswer: "A", difficulty: "easy", topic: "Kinematics" },
    { id: "r2", text: "If a net force is applied to an object, it will:", options: [{ label: "A", text: "Accelerate" }, { label: "B", text: "Remain stationary" }, { label: "C", text: "Move at constant speed" }, { label: "D", text: "Decelerate only" }], correctAnswer: "A", difficulty: "easy", topic: "Newton's Laws" },
    { id: "r3", text: "What is the unit of work?", options: [{ label: "A", text: "Joule" }, { label: "B", text: "Newton" }, { label: "C", text: "Watt" }, { label: "D", text: "Metre" }], correctAnswer: "A", difficulty: "easy", topic: "Work & Energy" },
    { id: "r4", text: "A car travels 100 m in 10 s at constant speed. What is the speed?", options: [{ label: "A", text: "10 m/s" }, { label: "B", text: "100 m/s" }, { label: "C", text: "1000 m/s" }, { label: "D", text: "1 m/s" }], correctAnswer: "A", difficulty: "easy", topic: "Kinematics" },
    { id: "r5", text: "Friction always acts in the _____ direction to motion.", options: [{ label: "A", text: "Opposite" }, { label: "B", text: "Same" }, { label: "C", text: "Perpendicular" }, { label: "D", text: "Random" }], correctAnswer: "A", difficulty: "easy", topic: "Friction" },
    { id: "r6", text: "Which of the following is a vector quantity?", options: [{ label: "A", text: "Displacement" }, { label: "B", text: "Speed" }, { label: "C", text: "Mass" }, { label: "D", text: "Temperature" }], correctAnswer: "A", difficulty: "easy", topic: "Vectors" },
    { id: "r7", text: "What does an object at rest have?", options: [{ label: "A", text: "Zero velocity" }, { label: "B", text: "Maximum acceleration" }, { label: "C", text: "Constant speed" }, { label: "D", text: "Negative displacement" }], correctAnswer: "A", difficulty: "easy", topic: "Kinematics" },
    { id: "r8", text: "What is Newton's First Law also called?", options: [{ label: "A", text: "Law of Inertia" }, { label: "B", text: "Law of Momentum" }, { label: "C", text: "Law of Energy" }, { label: "D", text: "Law of Gravity" }], correctAnswer: "A", difficulty: "easy", topic: "Newton's Laws" },
    { id: "r9", text: "The acceleration due to gravity on Earth's surface is approximately:", options: [{ label: "A", text: "9.8 m/s²" }, { label: "B", text: "6.7 m/s²" }, { label: "C", text: "3.2 m/s²" }, { label: "D", text: "15 m/s²" }], correctAnswer: "A", difficulty: "easy", topic: "Gravitation" },
    { id: "r10", text: "What is the kinetic energy formula?", options: [{ label: "A", text: "½mv²" }, { label: "B", text: "mgh" }, { label: "C", text: "Fd" }, { label: "D", text: "mv" }], correctAnswer: "A", difficulty: "easy", topic: "Energy Conservation" },
  ],
  risk: [
    { id: "k1", text: "What is meant by 'displacement'?", options: [{ label: "A", text: "Shortest distance between start and end point with direction" }, { label: "B", text: "Total path length" }, { label: "C", text: "Speed multiplied by time" }, { label: "D", text: "The force applied" }], correctAnswer: "A", difficulty: "easy", topic: "Kinematics" },
    { id: "k2", text: "Which of the following is a push or pull?", options: [{ label: "A", text: "Force" }, { label: "B", text: "Energy" }, { label: "C", text: "Power" }, { label: "D", text: "Work" }], correctAnswer: "A", difficulty: "easy", topic: "Force" },
    { id: "k3", text: "Objects fall to the ground because of:", options: [{ label: "A", text: "Gravity" }, { label: "B", text: "Friction" }, { label: "C", text: "Magnetism" }, { label: "D", text: "Air pressure" }], correctAnswer: "A", difficulty: "easy", topic: "Gravitation" },
    { id: "k4", text: "What is the SI unit of mass?", options: [{ label: "A", text: "Kilogram" }, { label: "B", text: "Newton" }, { label: "C", text: "Metre" }, { label: "D", text: "Second" }], correctAnswer: "A", difficulty: "easy", topic: "Units" },
    { id: "k5", text: "Speed is defined as:", options: [{ label: "A", text: "Distance covered per unit time" }, { label: "B", text: "Force per unit mass" }, { label: "C", text: "Change in velocity" }, { label: "D", text: "Work done per second" }], correctAnswer: "A", difficulty: "easy", topic: "Kinematics" },
    { id: "k6", text: "If no force acts on a moving body, it will:", options: [{ label: "A", text: "Continue at the same speed" }, { label: "B", text: "Slow down" }, { label: "C", text: "Speed up" }, { label: "D", text: "Stop immediately" }], correctAnswer: "A", difficulty: "easy", topic: "Newton's Laws" },
    { id: "k7", text: "What does a speedometer measure?", options: [{ label: "A", text: "Speed of the vehicle" }, { label: "B", text: "Distance travelled" }, { label: "C", text: "Fuel consumed" }, { label: "D", text: "Engine temperature" }], correctAnswer: "A", difficulty: "easy", topic: "Measurement" },
    { id: "k8", text: "Which one is heavier — 1 kg of iron or 1 kg of cotton?", options: [{ label: "A", text: "Both are equal" }, { label: "B", text: "Iron" }, { label: "C", text: "Cotton" }, { label: "D", text: "Cannot determine" }], correctAnswer: "A", difficulty: "easy", topic: "Mass & Weight" },
    { id: "k9", text: "What instrument is used to measure force?", options: [{ label: "A", text: "Spring balance" }, { label: "B", text: "Thermometer" }, { label: "C", text: "Voltmeter" }, { label: "D", text: "Barometer" }], correctAnswer: "A", difficulty: "easy", topic: "Measurement" },
    { id: "k10", text: "An object in motion tends to stay in motion. This is described by:", options: [{ label: "A", text: "Inertia" }, { label: "B", text: "Friction" }, { label: "C", text: "Gravity" }, { label: "D", text: "Buoyancy" }], correctAnswer: "A", difficulty: "easy", topic: "Newton's Laws" },
  ],
};

export function generateMockQuestions(
  bandKeys: string[],
  questionCount: number
): Record<string, BandResult> {
  const results: Record<string, BandResult> = {};
  for (const key of bandKeys) {
    const pool = questionPool[key] || questionPool.reinforcement;
    results[key] = {
      questions: pool.slice(0, Math.min(questionCount, pool.length)),
    };
  }
  return results;
}

/**
 * Get replacement questions for a band that aren't already used.
 * Returns `count` new questions from the pool, excluding `usedIds`.
 */
export function getReplacementQuestions(
  bandKey: string,
  usedIds: Set<string>,
  count: number
): GeneratedQuestion[] {
  const pool = questionPool[bandKey] || questionPool.reinforcement;
  const available = pool.filter(q => !usedIds.has(q.id));
  // If pool is exhausted, create variants with new IDs
  const result: GeneratedQuestion[] = [];
  for (let i = 0; i < count; i++) {
    if (i < available.length) {
      result.push(available[i]);
    } else {
      // Clone from pool with a unique id
      const source = pool[i % pool.length];
      result.push({ ...source, id: `${source.id}_regen_${Date.now()}_${i}` });
    }
  }
  return result;
}
