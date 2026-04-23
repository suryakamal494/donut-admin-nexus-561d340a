// Student Weekly Schedule Data Generator
// Generates a full week (Mon-Sat) of schedule data for the student's batch

import { ScheduleItem } from './dashboard';

interface DayScheduleTemplate {
  subjects: Array<{
    subject: string;
    topic: string;
    teacher: string;
    room: string;
  }>;
}

const weekTemplates: Record<string, DayScheduleTemplate> = {
  monday: {
    subjects: [
      { subject: 'math', topic: 'Quadratic Equations', teacher: 'Mrs. Gupta', room: '105' },
      { subject: 'chemistry', topic: 'Organic Compounds', teacher: 'Mrs. Sharma', room: '302' },
      { subject: 'physics', topic: 'Laws of Motion', teacher: 'Mr. Verma', room: '201' },
      { subject: 'english', topic: 'Essay Writing', teacher: 'Ms. Reddy', room: '110' },
      { subject: 'biology', topic: 'Cell Biology', teacher: 'Dr. Kumar', room: '205' },
    ],
  },
  tuesday: {
    subjects: [
      { subject: 'physics', topic: 'Newtons Laws', teacher: 'Mr. Verma', room: '201' },
      { subject: 'math', topic: 'Polynomials', teacher: 'Mrs. Gupta', room: '105' },
      { subject: 'biology', topic: 'Genetics', teacher: 'Dr. Kumar', room: '205' },
      { subject: 'chemistry', topic: 'Chemical Bonding', teacher: 'Mrs. Sharma', room: '302' },
      { subject: 'cs', topic: 'Python Basics', teacher: 'Mr. Rao', room: '401' },
    ],
  },
  wednesday: {
    subjects: [
      { subject: 'english', topic: 'Comprehension', teacher: 'Ms. Reddy', room: '110' },
      { subject: 'math', topic: 'Trigonometry', teacher: 'Mrs. Gupta', room: '105' },
      { subject: 'physics', topic: 'Work & Energy', teacher: 'Mr. Verma', room: '201' },
      { subject: 'biology', topic: 'Plant Anatomy', teacher: 'Dr. Kumar', room: '205' },
      { subject: 'chemistry', topic: 'Acids & Bases', teacher: 'Mrs. Sharma', room: '302' },
    ],
  },
  thursday: {
    subjects: [
      { subject: 'chemistry', topic: 'Redox Reactions', teacher: 'Mrs. Sharma', room: '302' },
      { subject: 'physics', topic: 'Gravitation', teacher: 'Mr. Verma', room: '201' },
      { subject: 'math', topic: 'Coordinate Geometry', teacher: 'Mrs. Gupta', room: '105' },
      { subject: 'cs', topic: 'Data Structures', teacher: 'Mr. Rao', room: '401' },
      { subject: 'english', topic: 'Poetry Analysis', teacher: 'Ms. Reddy', room: '110' },
    ],
  },
  friday: {
    subjects: [
      { subject: 'biology', topic: 'Human Physiology', teacher: 'Dr. Kumar', room: '205' },
      { subject: 'math', topic: 'Statistics', teacher: 'Mrs. Gupta', room: '105' },
      { subject: 'chemistry', topic: 'Thermodynamics', teacher: 'Mrs. Sharma', room: '302' },
      { subject: 'physics', topic: 'Waves & Optics', teacher: 'Mr. Verma', room: '201' },
      { subject: 'english', topic: 'Grammar Review', teacher: 'Ms. Reddy', room: '110' },
    ],
  },
  saturday: {
    subjects: [
      { subject: 'math', topic: 'Problem Solving', teacher: 'Mrs. Gupta', room: '105' },
      { subject: 'physics', topic: 'Numericals Practice', teacher: 'Mr. Verma', room: '201' },
      { subject: 'chemistry', topic: 'Lab Session', teacher: 'Mrs. Sharma', room: '302' },
    ],
  },
};

const timeSlots = [
  { time: '9:00 AM', endTime: '10:00 AM' },
  { time: '10:15 AM', endTime: '11:15 AM' },
  { time: '11:30 AM', endTime: '12:30 PM' },
  // Lunch break after 3rd period
  { time: '1:30 PM', endTime: '2:30 PM' },
  { time: '2:45 PM', endTime: '3:45 PM' },
];

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function getScheduleStatus(dateStr: string, time: string, endTime: string): 'completed' | 'current' | 'upcoming' {
  const today = new Date();
  const scheduleDate = new Date(dateStr);
  
  if (scheduleDate.toDateString() !== today.toDateString()) {
    if (scheduleDate < today) return 'completed';
    return 'upcoming';
  }
  
  // Parse times for today
  const now = today.getHours() * 60 + today.getMinutes();
  const parseTime = (t: string) => {
    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    if (match[3].toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (match[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };
  
  const startMin = parseTime(time);
  const endMin = parseTime(endTime);
  
  if (now >= endMin) return 'completed';
  if (now >= startMin && now < endMin) return 'current';
  return 'upcoming';
}

export function getWeekSchedule(weekStart: Date): Record<string, ScheduleItem[]> {
  const schedule: Record<string, ScheduleItem[]> = {};
  
  for (let i = 0; i < 6; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = dayNames[date.getDay()];
    const template = weekTemplates[dayName];
    
    if (!template) continue; // Skip Sunday
    
    const items: ScheduleItem[] = [];
    let id = 1;
    
    template.subjects.forEach((sub, idx) => {
      // Insert lunch break after 3rd period
      if (idx === 3) {
        items.push({
          id: id++,
          time: '12:30 PM',
          endTime: '1:30 PM',
          type: 'break',
          label: 'Lunch Break',
          status: getScheduleStatus(dateStr, '12:30 PM', '1:30 PM'),
        });
      }
      
      const slot = timeSlots[idx];
      if (!slot) return;
      
      items.push({
        id: id++,
        time: slot.time,
        endTime: slot.endTime,
        subject: sub.subject,
        topic: sub.topic,
        teacher: sub.teacher,
        room: sub.room,
        status: getScheduleStatus(dateStr, slot.time, slot.endTime),
        type: 'class',
      });
    });
    
    schedule[dateStr] = items;
  }
  
  return schedule;
}

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}