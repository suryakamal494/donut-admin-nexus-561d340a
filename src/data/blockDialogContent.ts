// Block Dialog Content Library Data
// Extracted from BlockDialog.tsx for better tree-shaking and maintainability

import { Video, Presentation, FileText, Image as ImageIcon, BookOpen, FileSpreadsheet } from "lucide-react";

export type ContentType = 'video' | 'presentation' | 'document' | 'image' | 'animation' | 'simulation';

export interface LibraryContentItem {
  id: string;
  title: string;
  type: ContentType;
  duration: number;
  chapter: string;
  subject: string;
  source: 'global' | 'institute';
}

export const contentTypeConfig: Record<ContentType, { icon: typeof Video; label: string; color: string }> = {
  video: { icon: Video, label: 'Video', color: 'text-red-600 bg-red-50' },
  presentation: { icon: Presentation, label: 'PPT', color: 'text-orange-600 bg-orange-50' },
  document: { icon: FileText, label: 'Doc', color: 'text-blue-600 bg-blue-50' },
  image: { icon: ImageIcon, label: 'Image', color: 'text-green-600 bg-green-50' },
  animation: { icon: BookOpen, label: 'Animation', color: 'text-purple-600 bg-purple-50' },
  simulation: { icon: FileSpreadsheet, label: 'Simulation', color: 'text-cyan-600 bg-cyan-50' },
};

export const mockLibraryContent: LibraryContentItem[] = [
  // Physics - Mechanics (8 items)
  { id: '1', title: "Newton's Laws - Complete Guide", type: 'presentation', duration: 15, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  { id: '2', title: "Force and Motion Explained", type: 'video', duration: 12, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  { id: '3', title: "Momentum Conservation Demo", type: 'video', duration: 10, chapter: 'Mechanics', subject: 'Physics', source: 'institute' },
  { id: '4', title: "Friction Types and Applications", type: 'document', duration: 8, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  { id: '5', title: "Projectile Motion Simulation", type: 'simulation', duration: 15, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  { id: '6', title: "Free Body Diagrams Tutorial", type: 'presentation', duration: 20, chapter: 'Mechanics', subject: 'Physics', source: 'institute' },
  { id: '7', title: "Work, Energy & Power", type: 'video', duration: 18, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  { id: '8', title: "Circular Motion Basics", type: 'animation', duration: 8, chapter: 'Mechanics', subject: 'Physics', source: 'global' },
  
  // Physics - Electrostatics (6 items)
  { id: '9', title: "Coulomb's Law Explained", type: 'video', duration: 14, chapter: 'Electrostatics', subject: 'Physics', source: 'global' },
  { id: '10', title: "Electric Field Lines", type: 'animation', duration: 10, chapter: 'Electrostatics', subject: 'Physics', source: 'global' },
  { id: '11', title: "Gauss's Law Applications", type: 'presentation', duration: 22, chapter: 'Electrostatics', subject: 'Physics', source: 'institute' },
  { id: '12', title: "Capacitors and Dielectrics", type: 'video', duration: 16, chapter: 'Electrostatics', subject: 'Physics', source: 'global' },
  { id: '13', title: "Electric Potential Energy", type: 'document', duration: 12, chapter: 'Electrostatics', subject: 'Physics', source: 'global' },
  { id: '14', title: "Conductors in Electric Fields", type: 'simulation', duration: 14, chapter: 'Electrostatics', subject: 'Physics', source: 'global' },
  
  // Physics - Optics (5 items)
  { id: '15', title: "Reflection and Refraction", type: 'video', duration: 15, chapter: 'Optics', subject: 'Physics', source: 'global' },
  { id: '16', title: "Lens Maker's Equation", type: 'presentation', duration: 18, chapter: 'Optics', subject: 'Physics', source: 'global' },
  { id: '17', title: "Wave Optics - Interference", type: 'animation', duration: 12, chapter: 'Optics', subject: 'Physics', source: 'institute' },
  { id: '18', title: "Diffraction Patterns Demo", type: 'video', duration: 10, chapter: 'Optics', subject: 'Physics', source: 'global' },
  { id: '19', title: "Polarization of Light", type: 'simulation', duration: 14, chapter: 'Optics', subject: 'Physics', source: 'global' },
  
  // Chemistry (8 items)
  { id: '20', title: "Atomic Structure Basics", type: 'presentation', duration: 20, chapter: 'Atomic Structure', subject: 'Chemistry', source: 'global' },
  { id: '21', title: "Periodic Table Trends", type: 'video', duration: 15, chapter: 'Periodic Table', subject: 'Chemistry', source: 'global' },
  { id: '22', title: "Chemical Bonding Types", type: 'animation', duration: 12, chapter: 'Chemical Bonding', subject: 'Chemistry', source: 'global' },
  { id: '23', title: "VSEPR Theory Explained", type: 'video', duration: 18, chapter: 'Chemical Bonding', subject: 'Chemistry', source: 'institute' },
  { id: '24', title: "Organic Nomenclature Guide", type: 'document', duration: 25, chapter: 'Organic Chemistry', subject: 'Chemistry', source: 'global' },
  { id: '25', title: "Reaction Mechanisms", type: 'presentation', duration: 22, chapter: 'Organic Chemistry', subject: 'Chemistry', source: 'global' },
  { id: '26', title: "Thermodynamics Laws", type: 'video', duration: 20, chapter: 'Thermodynamics', subject: 'Chemistry', source: 'global' },
  { id: '27', title: "Chemical Equilibrium", type: 'simulation', duration: 15, chapter: 'Equilibrium', subject: 'Chemistry', source: 'institute' },
  
  // Mathematics (8 items)
  { id: '28', title: "Differentiation Basics", type: 'video', duration: 18, chapter: 'Calculus', subject: 'Mathematics', source: 'global' },
  { id: '29', title: "Integration Techniques", type: 'presentation', duration: 25, chapter: 'Calculus', subject: 'Mathematics', source: 'global' },
  { id: '30', title: "Matrices and Determinants", type: 'video', duration: 20, chapter: 'Linear Algebra', subject: 'Mathematics', source: 'global' },
  { id: '31', title: "Vector Algebra Complete", type: 'presentation', duration: 22, chapter: 'Vectors', subject: 'Mathematics', source: 'institute' },
  { id: '32', title: "Probability Distributions", type: 'video', duration: 16, chapter: 'Probability', subject: 'Mathematics', source: 'global' },
  { id: '33', title: "Trigonometric Identities", type: 'document', duration: 15, chapter: 'Trigonometry', subject: 'Mathematics', source: 'global' },
  { id: '34', title: "Coordinate Geometry 3D", type: 'animation', duration: 14, chapter: 'Coordinate Geometry', subject: 'Mathematics', source: 'global' },
  { id: '35', title: "Conic Sections Visualized", type: 'simulation', duration: 18, chapter: 'Conic Sections', subject: 'Mathematics', source: 'institute' },
];

// Link type configuration
export type LinkType = 'youtube' | 'vimeo' | 'google-drive' | 'google-docs' | 'iframe' | 'unknown';

export const linkTypeBadges: Record<LinkType, { label: string; className: string }> = {
  youtube: { label: 'YouTube', className: 'bg-red-100 text-red-700 border-red-200' },
  vimeo: { label: 'Vimeo', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  'google-drive': { label: 'Google Drive', className: 'bg-green-100 text-green-700 border-green-200' },
  'google-docs': { label: 'Google Docs', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  iframe: { label: 'Embed', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  unknown: { label: 'Link', className: 'bg-gray-100 text-gray-700 border-gray-200' },
};
