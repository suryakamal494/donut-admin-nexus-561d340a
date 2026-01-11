/**
 * Hook for managing notification preferences
 * Uses localStorage for persistence (backend integration later)
 */

import { useState, useEffect, useCallback } from 'react';

export interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  category: 'schedule' | 'academic' | 'communication' | 'system';
  enabled: boolean;
  pushEnabled: boolean;
}

const defaultPreferences: NotificationPreference[] = [
  // Schedule
  {
    id: 'schedule_changes',
    label: 'Schedule Changes',
    description: 'Timetable updates and class reassignments',
    category: 'schedule',
    enabled: true,
    pushEnabled: true,
  },
  {
    id: 'class_reminders',
    label: 'Class Reminders',
    description: 'Upcoming class notifications',
    category: 'schedule',
    enabled: true,
    pushEnabled: false,
  },
  {
    id: 'substitute_requests',
    label: 'Substitute Requests',
    description: 'Requests to cover other teachers\' classes',
    category: 'schedule',
    enabled: true,
    pushEnabled: true,
  },
  // Academic
  {
    id: 'student_submissions',
    label: 'Student Submissions',
    description: 'Homework and assignment submissions',
    category: 'academic',
    enabled: true,
    pushEnabled: false,
  },
  {
    id: 'quiz_completions',
    label: 'Quiz Completions',
    description: 'When students complete quizzes',
    category: 'academic',
    enabled: true,
    pushEnabled: false,
  },
  {
    id: 'grading_reminders',
    label: 'Grading Reminders',
    description: 'Pending items to grade',
    category: 'academic',
    enabled: true,
    pushEnabled: false,
  },
  {
    id: 'low_performance_alerts',
    label: 'Performance Alerts',
    description: 'Students with declining grades',
    category: 'academic',
    enabled: true,
    pushEnabled: true,
  },
  // Communication
  {
    id: 'announcements',
    label: 'Announcements',
    description: 'Institute-wide announcements',
    category: 'communication',
    enabled: true,
    pushEnabled: true,
  },
  {
    id: 'parent_messages',
    label: 'Parent Messages',
    description: 'Messages from parents',
    category: 'communication',
    enabled: true,
    pushEnabled: true,
  },
  {
    id: 'staff_messages',
    label: 'Staff Messages',
    description: 'Messages from other staff members',
    category: 'communication',
    enabled: true,
    pushEnabled: false,
  },
  // System
  {
    id: 'deadline_reminders',
    label: 'Deadline Reminders',
    description: 'Upcoming lesson plan and report deadlines',
    category: 'system',
    enabled: true,
    pushEnabled: true,
  },
  {
    id: 'system_updates',
    label: 'System Updates',
    description: 'App updates and maintenance notices',
    category: 'system',
    enabled: true,
    pushEnabled: false,
  },
];

const STORAGE_KEY = 'teacher_notification_preferences';

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new preference types
        const merged = defaultPreferences.map(def => {
          const saved = parsed.find((p: NotificationPreference) => p.id === def.id);
          return saved ? { ...def, enabled: saved.enabled, pushEnabled: saved.pushEnabled } : def;
        });
        setPreferences(merged);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = useCallback((newPrefs: NotificationPreference[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, []);

  // Toggle in-app notification
  const toggleEnabled = useCallback((id: string) => {
    setPreferences(prev => {
      const updated = prev.map(p => 
        p.id === id ? { ...p, enabled: !p.enabled } : p
      );
      savePreferences(updated);
      return updated;
    });
  }, [savePreferences]);

  // Toggle push notification
  const togglePushEnabled = useCallback((id: string) => {
    setPreferences(prev => {
      const updated = prev.map(p => 
        p.id === id ? { ...p, pushEnabled: !p.pushEnabled } : p
      );
      savePreferences(updated);
      return updated;
    });
  }, [savePreferences]);

  // Enable all in a category
  const enableCategory = useCallback((category: NotificationPreference['category']) => {
    setPreferences(prev => {
      const updated = prev.map(p => 
        p.category === category ? { ...p, enabled: true } : p
      );
      savePreferences(updated);
      return updated;
    });
  }, [savePreferences]);

  // Disable all in a category
  const disableCategory = useCallback((category: NotificationPreference['category']) => {
    setPreferences(prev => {
      const updated = prev.map(p => 
        p.category === category ? { ...p, enabled: false, pushEnabled: false } : p
      );
      savePreferences(updated);
      return updated;
    });
  }, [savePreferences]);

  // Get preferences by category
  const getByCategory = useCallback((category: NotificationPreference['category']) => {
    return preferences.filter(p => p.category === category);
  }, [preferences]);

  // Check if all in category are enabled
  const isCategoryEnabled = useCallback((category: NotificationPreference['category']) => {
    const categoryPrefs = preferences.filter(p => p.category === category);
    return categoryPrefs.every(p => p.enabled);
  }, [preferences]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setPreferences(defaultPreferences);
    savePreferences(defaultPreferences);
  }, [savePreferences]);

  return {
    preferences,
    isLoading,
    toggleEnabled,
    togglePushEnabled,
    enableCategory,
    disableCategory,
    getByCategory,
    isCategoryEnabled,
    resetToDefaults,
  };
};
