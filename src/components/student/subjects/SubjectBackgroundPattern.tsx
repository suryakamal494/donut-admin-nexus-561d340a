// Subject Background Pattern - Decorative SVG patterns for each subject

import { cn } from "@/lib/utils";
import type { SubjectPattern } from "@/components/student/shared/subjectColors";

interface SubjectBackgroundPatternProps {
  pattern: SubjectPattern;
  className?: string;
}

// Mathematics: Grid lines with equation fragments
const MathPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="30" x2="200" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="0" y1="60" x2="200" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="0" y1="90" x2="200" y2="90" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="50" y1="0" x2="50" y2="120" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="100" y1="0" x2="100" y2="120" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="150" y1="0" x2="150" y2="120" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <path d="M 20 100 Q 100 -20 180 100" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
    <text x="160" y="40" fill="currentColor" fontSize="24" opacity="0.3" fontFamily="serif">π</text>
    <text x="30" y="50" fill="currentColor" fontSize="20" opacity="0.25" fontFamily="serif">Σ</text>
  </svg>
);

const PhysicsPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="160" cy="60" rx="35" ry="15" stroke="currentColor" strokeWidth="1" opacity="0.3" transform="rotate(-30 160 60)" />
    <ellipse cx="160" cy="60" rx="35" ry="15" stroke="currentColor" strokeWidth="1" opacity="0.3" transform="rotate(30 160 60)" />
    <ellipse cx="160" cy="60" rx="35" ry="15" stroke="currentColor" strokeWidth="1" opacity="0.3" transform="rotate(90 160 60)" />
    <circle cx="160" cy="60" r="5" fill="currentColor" opacity="0.4" />
    <path d="M 10 80 Q 30 60 50 80 T 90 80 T 130 80" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.35" />
    <circle cx="130" cy="50" r="2" fill="currentColor" opacity="0.4" />
    <circle cx="175" cy="85" r="2" fill="currentColor" opacity="0.4" />
  </svg>
);

const ChemistryPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 150 30 L 170 42 L 170 66 L 150 78 L 130 66 L 130 42 Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.35" />
    <path d="M 145 38 L 158 46 L 158 62 L 145 70 L 132 62 L 132 46 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <line x1="170" y1="54" x2="190" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="130" y1="54" x2="110" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <circle cx="105" cy="54" r="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    <circle cx="40" cy="80" r="6" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <circle cx="60" cy="70" r="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <line x1="46" y1="76" x2="56" y2="72" stroke="currentColor" strokeWidth="1" opacity="0.25" />
  </svg>
);

const BiologyPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="155" cy="60" rx="35" ry="28" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <ellipse cx="155" cy="60" rx="12" ry="10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
    <ellipse cx="170" cy="45" rx="8" ry="4" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.25" transform="rotate(20 170 45)" />
    <ellipse cx="140" cy="75" rx="7" ry="3" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.25" transform="rotate(-15 140 75)" />
    <path d="M 30 90 Q 50 50 30 20 Q 70 50 30 90" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    <path d="M 30 90 Q 45 60 30 35" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.25" />
  </svg>
);

const EnglishPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="140" y="45" fill="currentColor" fontSize="48" opacity="0.2" fontFamily="serif">"</text>
    <text x="175" y="95" fill="currentColor" fontSize="48" opacity="0.2" fontFamily="serif">"</text>
    <line x1="20" y1="70" x2="80" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
    <line x1="20" y1="82" x2="60" y2="82" stroke="currentColor" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
    <line x1="20" y1="94" x2="70" y2="94" stroke="currentColor" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
    <path d="M 95 95 L 105 85 L 108 92 Z" fill="currentColor" opacity="0.25" />
    <line x1="105" y1="85" x2="115" y2="75" stroke="currentColor" strokeWidth="2" opacity="0.25" />
  </svg>
);

const CSPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="140" y="70" fill="currentColor" fontSize="56" opacity="0.25" fontFamily="monospace">{"{"}</text>
    <text x="175" y="70" fill="currentColor" fontSize="56" opacity="0.25" fontFamily="monospace">{"}"}</text>
    <circle cx="155" cy="45" r="2" fill="currentColor" opacity="0.3" />
    <circle cx="163" cy="45" r="2" fill="currentColor" opacity="0.3" />
    <circle cx="171" cy="45" r="2" fill="currentColor" opacity="0.3" />
    <text x="25" y="85" fill="currentColor" fontSize="10" opacity="0.2" fontFamily="monospace">01101</text>
    <text x="25" y="98" fill="currentColor" fontSize="10" opacity="0.15" fontFamily="monospace">10110</text>
    <text x="70" y="50" fill="currentColor" fontSize="20" opacity="0.3" fontFamily="monospace">&lt;/&gt;</text>
  </svg>
);

// Hindi: Devanagari-inspired lines and script motifs
const HindiPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="120" y1="25" x2="190" y2="25" stroke="currentColor" strokeWidth="2" opacity="0.35" />
    <path d="M 135 25 L 135 60 Q 135 75 145 75" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <path d="M 155 25 L 155 50 Q 155 65 165 65 Q 175 65 175 50 L 175 25" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <circle cx="140" cy="80" r="3" fill="currentColor" opacity="0.25" />
    <text x="25" y="90" fill="currentColor" fontSize="28" opacity="0.2" fontFamily="serif">अ</text>
    <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
    <path d="M 40 50 L 40 70 Q 40 80 50 80" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
  </svg>
);

// Sanskrit: Ancient scroll motifs
const SanskritPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 130 20 L 130 100 Q 130 110 140 110 L 190 110" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <path d="M 190 20 L 190 100 Q 190 110 180 110" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <line x1="140" y1="40" x2="180" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.25" />
    <line x1="140" y1="55" x2="175" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <line x1="140" y1="70" x2="180" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.25" />
    <text x="30" y="80" fill="currentColor" fontSize="24" opacity="0.2" fontFamily="serif">ॐ</text>
    <circle cx="50" cy="40" r="12" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    <circle cx="50" cy="40" r="5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.25" />
  </svg>
);

// Social Science: Map contour lines with compass
const SocialSciencePattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="160" cy="60" r="30" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    <ellipse cx="160" cy="60" rx="30" ry="12" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.25" />
    <line x1="130" y1="60" x2="190" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="160" y1="30" x2="160" y2="90" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <path d="M 30 40 Q 50 35 60 50 Q 70 65 90 60" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.25" />
    <path d="M 25 55 Q 45 50 55 65 Q 65 80 85 75" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
  </svg>
);

// History: Pillars and timeline dots
const HistoryPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="150" y="30" width="8" height="60" rx="1" fill="currentColor" opacity="0.2" />
    <rect x="148" y="25" width="12" height="6" rx="1" fill="currentColor" opacity="0.25" />
    <rect x="148" y="88" width="12" height="6" rx="1" fill="currentColor" opacity="0.25" />
    <rect x="170" y="40" width="6" height="50" rx="1" fill="currentColor" opacity="0.15" />
    <rect x="168" y="35" width="10" height="5" rx="1" fill="currentColor" opacity="0.2" />
    <rect x="168" y="88" width="10" height="5" rx="1" fill="currentColor" opacity="0.2" />
    <line x1="20" y1="80" x2="120" y2="80" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
    <circle cx="30" cy="80" r="3" fill="currentColor" opacity="0.3" />
    <circle cx="55" cy="80" r="3" fill="currentColor" opacity="0.3" />
    <circle cx="80" cy="80" r="3" fill="currentColor" opacity="0.3" />
    <circle cx="105" cy="80" r="3" fill="currentColor" opacity="0.3" />
  </svg>
);

// Geography: Mountain contours and compass rose
const GeographyPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 120 90 L 150 40 L 165 60 L 180 30 L 195 90" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <path d="M 130 90 L 150 55 L 160 65 L 175 45 L 190 90" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    <circle cx="50" cy="60" r="20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <line x1="50" y1="38" x2="50" y2="82" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    <line x1="28" y1="60" x2="72" y2="60" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
    <text x="47" y="42" fill="currentColor" fontSize="8" opacity="0.3">N</text>
  </svg>
);

// Civics: Balance scale outline
const CivicsPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="160" y1="25" x2="160" y2="95" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <line x1="130" y1="35" x2="190" y2="35" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <path d="M 130 35 L 125 55 Q 130 65 140 55 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <path d="M 190 35 L 185 55 Q 190 65 200 55 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <rect x="150" y="92" width="20" height="4" rx="2" fill="currentColor" opacity="0.25" />
    <circle cx="40" cy="70" r="15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    <text x="35" y="75" fill="currentColor" fontSize="14" opacity="0.25">⚖</text>
  </svg>
);

// Economics: Rising chart line with bar graph
const EconomicsPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="140" y="70" width="10" height="30" rx="1" fill="currentColor" opacity="0.2" />
    <rect x="155" y="55" width="10" height="45" rx="1" fill="currentColor" opacity="0.25" />
    <rect x="170" y="40" width="10" height="60" rx="1" fill="currentColor" opacity="0.3" />
    <rect x="185" y="50" width="10" height="50" rx="1" fill="currentColor" opacity="0.2" />
    <path d="M 20 85 Q 50 75 80 60 Q 110 45 130 30" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <polygon points="130,25 135,35 125,35" fill="currentColor" opacity="0.3" />
    <text x="30" y="55" fill="currentColor" fontSize="20" opacity="0.2">₹</text>
  </svg>
);

// Science (combined): Microscope silhouette with beaker
const SciencePattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="165" cy="35" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <line x1="165" y1="47" x2="165" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    <line x1="155" y1="80" x2="175" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.3" />
    <rect x="160" y="60" width="10" height="5" rx="1" fill="currentColor" opacity="0.2" />
    <path d="M 30 95 L 40 50 L 70 50 L 80 95 Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.25" />
    <line x1="35" y1="50" x2="35" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <line x1="75" y1="50" x2="75" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path d="M 40 80 Q 55 70 70 80" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
  </svg>
);

// Zoology: Animal cell with organelles
const ZoologyPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 160 30 Q 190 40 190 60 Q 190 85 160 90 Q 130 85 130 60 Q 130 35 160 30" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <ellipse cx="160" cy="55" rx="10" ry="8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
    <circle cx="155" cy="53" r="3" fill="currentColor" opacity="0.25" />
    <ellipse cx="175" cy="45" rx="6" ry="3" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2" transform="rotate(30 175 45)" />
    <ellipse cx="145" cy="72" rx="5" ry="3" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2" transform="rotate(-20 145 72)" />
    <path d="M 30 60 Q 45 40 60 60 Q 50 50 40 60" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    <circle cx="50" cy="85" r="8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
  </svg>
);

// Botany: Plant cell with chloroplast shapes
const BotanyPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="130" y="25" width="60" height="70" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <rect x="140" y="35" width="40" height="50" rx="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    <ellipse cx="155" cy="55" rx="8" ry="5" fill="currentColor" opacity="0.2" transform="rotate(30 155 55)" />
    <ellipse cx="170" cy="65" rx="7" ry="4" fill="currentColor" opacity="0.15" transform="rotate(-20 170 65)" />
    <ellipse cx="150" cy="72" rx="6" ry="4" fill="currentColor" opacity="0.15" transform="rotate(45 150 72)" />
    <path d="M 40 90 L 40 50 Q 40 30 55 25" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.25" />
    <path d="M 40 65 Q 25 55 20 40" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    <path d="M 40 50 Q 55 45 65 35" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
  </svg>
);

// EVS: Trees and nature elements
const EVSPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 160 90 L 160 55 L 145 55 L 160 30 L 175 55 L 160 55" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <path d="M 180 90 L 180 65 L 172 65 L 180 50 L 188 65 L 180 65" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    <circle cx="40" cy="50" r="15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    <path d="M 40 50 L 55 50 M 40 50 L 40 35 M 40 50 L 30 40 M 40 50 L 50 40" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
    <path d="M 20 90 Q 60 85 100 90" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
  </svg>
);

// Art: Paint palette and brush strokes
const ArtPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="160" cy="60" rx="30" ry="25" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <circle cx="150" cy="48" r="4" fill="currentColor" opacity="0.25" />
    <circle cx="165" cy="45" r="3" fill="currentColor" opacity="0.2" />
    <circle cx="175" cy="55" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="170" cy="70" r="3" fill="currentColor" opacity="0.2" />
    <circle cx="155" cy="72" r="4" fill="currentColor" opacity="0.25" />
    <ellipse cx="145" cy="60" rx="5" ry="4" fill="currentColor" opacity="0.15" />
    <path d="M 30 85 Q 50 40 80 70" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.2" strokeLinecap="round" />
    <path d="M 50 90 Q 70 50 95 75" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.15" strokeLinecap="round" />
  </svg>
);

// Physical Education: Sports elements
const PEPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="165" cy="55" r="20" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <path d="M 150 42 Q 165 55 180 42" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <path d="M 150 68 Q 165 55 180 68" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <line x1="145" y1="55" x2="185" y2="55" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <path d="M 30 90 L 30 50 L 60 50 L 60 90" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2" />
    <rect x="25" y="48" width="40" height="4" rx="2" fill="currentColor" opacity="0.25" />
    <circle cx="30" cy="42" r="5" fill="currentColor" opacity="0.15" />
    <circle cx="60" cy="42" r="5" fill="currentColor" opacity="0.15" />
  </svg>
);

// Accountancy: Ledger lines with currency
const AccountancyPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="130" y1="25" x2="130" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="120" y1="35" x2="195" y2="35" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
    <line x1="120" y1="50" x2="195" y2="50" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <line x1="120" y1="65" x2="195" y2="65" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <line x1="120" y1="80" x2="195" y2="80" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
    <line x1="160" y1="25" x2="160" y2="95" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <text x="30" y="70" fill="currentColor" fontSize="32" opacity="0.2" fontFamily="serif">₹</text>
    <text x="60" y="55" fill="currentColor" fontSize="20" opacity="0.15" fontFamily="serif">$</text>
  </svg>
);

// Business Studies: Organization chart nodes
const BusinessPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="150" y="25" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    <line x1="160" y1="37" x2="160" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.25" />
    <line x1="140" y1="50" x2="180" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.25" />
    <rect x="130" y="50" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <rect x="172" y="50" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <line x1="138" y1="60" x2="138" y2="72" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <line x1="180" y1="60" x2="180" y2="72" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <rect x="130" y="72" width="14" height="8" rx="1" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2" />
    <rect x="174" y="72" width="14" height="8" rx="1" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2" />
    <circle cx="45" cy="55" r="12" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    <path d="M 45 45 L 45 50" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
    <circle cx="45" cy="43" r="3" fill="currentColor" opacity="0.2" />
  </svg>
);

// AI: Neural network nodes and connections
const AIPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Input layer */}
    <circle cx="140" cy="30" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="140" cy="60" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="140" cy="90" r="4" fill="currentColor" opacity="0.3" />
    {/* Hidden layer */}
    <circle cx="165" cy="40" r="4" fill="currentColor" opacity="0.35" />
    <circle cx="165" cy="70" r="4" fill="currentColor" opacity="0.35" />
    {/* Output */}
    <circle cx="190" cy="55" r="5" fill="currentColor" opacity="0.4" />
    {/* Connections */}
    <line x1="144" y1="30" x2="161" y2="40" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <line x1="144" y1="30" x2="161" y2="70" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
    <line x1="144" y1="60" x2="161" y2="40" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <line x1="144" y1="60" x2="161" y2="70" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <line x1="144" y1="90" x2="161" y2="70" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
    <line x1="169" y1="40" x2="185" y2="55" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
    <line x1="169" y1="70" x2="185" y2="55" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
    {/* Brain outline */}
    <path d="M 30 55 Q 30 30 50 30 Q 65 30 65 45 Q 75 35 80 50 Q 85 65 70 70 Q 65 80 50 75 Q 35 80 30 65 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
  </svg>
);

// Informatics: Database cylinders and data flow
const InformaticsPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="165" cy="35" rx="20" ry="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <line x1="145" y1="35" x2="145" y2="75" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <line x1="185" y1="35" x2="185" y2="75" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <ellipse cx="165" cy="75" rx="20" ry="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <ellipse cx="165" cy="55" rx="20" ry="8" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2" />
    <path d="M 30 50 L 50 50 L 55 40 L 65 65 L 75 45 L 85 55 L 100 55" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.25" />
    <circle cx="25" cy="50" r="3" fill="currentColor" opacity="0.2" />
    <circle cx="105" cy="55" r="3" fill="currentColor" opacity="0.2" />
  </svg>
);

// Home Science: Home silhouette elements
const HomeSciencePattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M 160 45 L 145 60 L 145 90 L 175 90 L 175 60 Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <rect x="155" y="72" width="10" height="18" rx="1" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <rect x="148" y="62" width="8" height="8" rx="0.5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2" />
    <rect x="164" y="62" width="8" height="8" rx="0.5" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2" />
    <circle cx="50" cy="60" r="15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    <line x1="42" y1="55" x2="42" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <line x1="50" y1="52" x2="50" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
    <line x1="58" y1="55" x2="58" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <circle cx="50" cy="67" r="3" fill="currentColor" opacity="0.15" />
  </svg>
);

const patternComponents: Record<SubjectPattern, React.FC> = {
  math: MathPattern,
  physics: PhysicsPattern,
  chemistry: ChemistryPattern,
  biology: BiologyPattern,
  english: EnglishPattern,
  cs: CSPattern,
  hindi: HindiPattern,
  sanskrit: SanskritPattern,
  "social-science": SocialSciencePattern,
  history: HistoryPattern,
  geography: GeographyPattern,
  civics: CivicsPattern,
  economics: EconomicsPattern,
  science: SciencePattern,
  zoology: ZoologyPattern,
  botany: BotanyPattern,
  evs: EVSPattern,
  art: ArtPattern,
  pe: PEPattern,
  accountancy: AccountancyPattern,
  business: BusinessPattern,
  ai: AIPattern,
  informatics: InformaticsPattern,
  "home-science": HomeSciencePattern,
};

const SubjectBackgroundPattern = ({ pattern, className }: SubjectBackgroundPatternProps) => {
  const PatternComponent = patternComponents[pattern] || MathPattern;

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute top-0 right-0 w-2/3 h-full opacity-60">
        <PatternComponent />
      </div>
    </div>
  );
};

export default SubjectBackgroundPattern;
