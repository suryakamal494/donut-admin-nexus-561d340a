// Performance Index (PI) — Advanced Bucketing Logic
// PI = (0.50 × Accuracy) + (0.20 × Consistency) + (0.15 × Time Efficiency) + (0.15 × Attempt Rate)

export type SecondaryTag = "improving" | "declining" | "plateaued" | "inconsistent" | "speed-issue" | "low-attempt";
export type Trend = "up" | "down" | "flat";

export interface ExamHistoryEntry {
  examId: string;
  percentage: number;
  date: string;
  timeEfficiency: number; // 0-100
  attemptRate: number;    // 0-100
}

export interface PIResult {
  performanceIndex: number;
  accuracy: number;
  consistency: number;
  timeEfficiency: number;
  attemptRate: number;
  trend: Trend;
  secondaryTags: SecondaryTag[];
  examHistory: ExamHistoryEntry[];
}

/**
 * Calculate standard deviation of an array of numbers
 */
function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculate linear regression slope for trend detection
 * Returns slope normalized per exam (positive = improving)
 */
function linearSlope(values: number[]): number {
  if (values.length < 2) return 0;
  const n = values.length;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (values[i] - yMean);
    den += (i - xMean) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

/**
 * Convert consistency (inverse variance) to a 0-100 score
 * Low std dev = high consistency
 */
function consistencyScore(examPercentages: number[]): number {
  if (examPercentages.length < 2) return 75; // default for single exam
  const sd = stdDev(examPercentages);
  // Map: sd=0 → 100, sd=30+ → 0
  return Math.max(0, Math.min(100, Math.round(100 - (sd / 30) * 100)));
}

/**
 * Calculate the Performance Index from exam history
 */
export function calculatePI(examHistory: ExamHistoryEntry[]): {
  performanceIndex: number;
  accuracy: number;
  consistency: number;
  avgTimeEfficiency: number;
  avgAttemptRate: number;
} {
  if (examHistory.length === 0) {
    return { performanceIndex: 0, accuracy: 0, consistency: 0, avgTimeEfficiency: 0, avgAttemptRate: 0 };
  }

  const percentages = examHistory.map(e => e.percentage);
  const accuracy = Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length);
  const consistency = consistencyScore(percentages);
  const avgTimeEfficiency = Math.round(examHistory.reduce((s, e) => s + e.timeEfficiency, 0) / examHistory.length);
  const avgAttemptRate = Math.round(examHistory.reduce((s, e) => s + e.attemptRate, 0) / examHistory.length);

  const pi = Math.round(
    0.50 * accuracy +
    0.20 * consistency +
    0.15 * avgTimeEfficiency +
    0.15 * avgAttemptRate
  );

  return {
    performanceIndex: Math.max(0, Math.min(100, pi)),
    accuracy,
    consistency,
    avgTimeEfficiency,
    avgAttemptRate,
  };
}

/**
 * Detect trend direction from exam history (chronological order)
 */
export function detectTrend(examHistory: ExamHistoryEntry[]): Trend {
  if (examHistory.length < 2) return "flat";
  const percentages = examHistory.map(e => e.percentage);
  const slope = linearSlope(percentages);
  // Threshold: slope > 2 per exam = improving, < -2 = declining
  if (slope > 2) return "up";
  if (slope < -2) return "down";
  return "flat";
}

/**
 * Detect if student has plateaued
 * 3+ exams, std dev < 5, slope ≈ 0
 */
export function detectPlateau(examHistory: ExamHistoryEntry[]): boolean {
  if (examHistory.length < 3) return false;
  const recent = examHistory.slice(-3).map(e => e.percentage);
  const sd = stdDev(recent);
  const slope = Math.abs(linearSlope(recent));
  return sd < 5 && slope < 1.5;
}

/**
 * Assign secondary behavioral tags based on exam history and computed metrics
 */
export function assignSecondaryTags(
  examHistory: ExamHistoryEntry[],
  trend: Trend,
  avgTimeEfficiency: number,
  avgAttemptRate: number
): SecondaryTag[] {
  const tags: SecondaryTag[] = [];

  // Trend-based tags
  if (trend === "up" && examHistory.length >= 2) tags.push("improving");
  if (trend === "down" && examHistory.length >= 2) tags.push("declining");

  // Plateau detection (overrides flat trend)
  if (detectPlateau(examHistory)) {
    tags.push("plateaued");
  }

  // Inconsistency: high variance
  if (examHistory.length >= 3) {
    const sd = stdDev(examHistory.map(e => e.percentage));
    if (sd > 15) tags.push("inconsistent");
  }

  // Speed issue: accuracy decent but time usage poor
  if (avgTimeEfficiency < 40) tags.push("speed-issue");

  // Low attempt rate
  if (avgAttemptRate < 60) tags.push("low-attempt");

  // Return max 2 most relevant tags
  return tags.slice(0, 2);
}

/**
 * Full PI computation pipeline for a student
 */
export function computeStudentPI(examHistory: ExamHistoryEntry[]): PIResult {
  const { performanceIndex, accuracy, consistency, avgTimeEfficiency, avgAttemptRate } = calculatePI(examHistory);
  const trend = detectTrend(examHistory);
  const secondaryTags = assignSecondaryTags(examHistory, trend, avgTimeEfficiency, avgAttemptRate);

  return {
    performanceIndex,
    accuracy,
    consistency,
    timeEfficiency: avgTimeEfficiency,
    attemptRate: avgAttemptRate,
    trend,
    secondaryTags,
    examHistory,
  };
}
