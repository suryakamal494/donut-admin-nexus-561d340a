// Student Copilot — Chat helper utilities
import { SUBJECTS, type Subject } from "./types";
import type { TopicMastery } from "./types";
import { getWeakestTopics } from "./context/bandContext";

// ---------- Subject classification ----------

const SUBJECT_KEYWORDS: Record<Subject, string[]> = {
  Physics: [
    "physics", "newton", "force", "velocity", "acceleration", "momentum",
    "kinematics", "dynamics", "optics", "lens", "mirror", "wave", "sound",
    "light", "electromagnetic", "electric", "magnetic", "current", "voltage",
    "resistance", "capacitor", "inductor", "thermodynamics", "heat", "entropy",
    "gravitation", "friction", "torque", "energy", "work", "power", "pressure",
    "fluid", "oscillation", "pendulum", "projectile", "vector", "scalar",
  ],
  Chemistry: [
    "chemistry", "chemical", "reaction", "mole", "atom", "molecule", "bond",
    "ionic", "covalent", "organic", "inorganic", "acid", "base", "pH",
    "oxidation", "reduction", "redox", "electron", "proton", "neutron",
    "periodic", "element", "compound", "solution", "titration", "equilibrium",
    "catalyst", "polymer", "hydrocarbon", "aldehyde", "ketone", "alcohol",
    "ester", "amine", "benzene", "isomer", "stoichiometry", "enthalpy",
  ],
  Math: [
    "math", "mathematics", "algebra", "calculus", "integral", "derivative",
    "differentiation", "integration", "equation", "polynomial", "quadratic",
    "matrix", "determinant", "vector", "trigonometry", "sin", "cos", "tan",
    "geometry", "circle", "triangle", "probability", "statistics", "mean",
    "median", "permutation", "combination", "sequence", "series", "limit",
    "function", "logarithm", "exponential", "coordinate", "conic",
  ],
  Biology: [
    "biology", "cell", "dna", "rna", "gene", "chromosome", "mitosis",
    "meiosis", "photosynthesis", "respiration", "ecosystem", "evolution",
    "taxonomy", "anatomy", "physiology", "enzyme", "protein", "virus",
    "bacteria", "fungi", "plant", "animal", "organ", "tissue", "blood",
    "heart", "nervous", "hormone", "reproduction", "genetics", "ecology",
  ],
  English: [
    "english", "grammar", "essay", "comprehension", "vocabulary", "poem",
    "poetry", "prose", "literature", "writing", "sentence", "paragraph",
    "tense", "verb", "noun", "adjective", "adverb", "preposition",
    "conjunction", "clause", "phrase", "narrative", "figurative",
  ],
};

export function classifySubject(text: string): Subject | null {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};
  for (const subj of SUBJECTS) {
    scores[subj] = 0;
    for (const kw of SUBJECT_KEYWORDS[subj]) {
      if (lower.includes(kw)) scores[subj]++;
    }
  }
  const best = SUBJECTS.reduce((a, b) => (scores[a] >= scores[b] ? a : b));
  return scores[best] > 0 ? best : null;
}

// ---------- Image marker helpers ----------

const IMG_MARKER_RE = /\[\[IMG\]\]\((data:image\/[^)]+)\)/g;

export function splitStoredContent(stored: string): {
  text: string;
  images: string[];
} {
  const images: string[] = [];
  const text = stored.replace(IMG_MARKER_RE, (_, url) => {
    images.push(url);
    return "";
  }).trim();
  return { text, images };
}

export function embedImages(text: string, images: string[]): string {
  let content = text;
  for (const img of images) {
    content += `\n[[IMG]](${img})`;
  }
  return content;
}

// ---------- Adaptive practice context ----------

/**
 * Build extra system prompt context that focuses practice on weak topics.
 * Called when the routine is s_practice to weight 60-70% of questions toward weakest areas.
 */
export function buildAdaptivePracticeContext(mastery: TopicMastery[]): string {
  const weakest = getWeakestTopics(mastery, 3);
  if (weakest.length === 0) return "";

  let ctx = "ADAPTIVE PRACTICE INSTRUCTIONS:";
  ctx += "\nThe student has weak spots. When generating practice questions:";
  ctx += "\n- 60-70% of questions should focus on these weak topics:";
  for (const w of weakest) {
    ctx += `\n  • ${w.subject}/${w.topic} (${w.accuracy}% accuracy, band: ${w.band})`;
  }
  ctx += "\n- 30-40% can be from other topics for variety and confidence building.";
  ctx += "\n- Gradually increase difficulty as accuracy improves (scaffold upward).";
  ctx += "\n- Do NOT tell the student which topics are weak — present all questions naturally.";

  return ctx;
}