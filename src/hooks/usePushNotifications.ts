/**
 * Hook for managing push notification subscriptions
 * UI-only implementation - backend integration to be added later
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export type PushPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<PushPermissionState>('prompt');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if push notifications are supported
  const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;

  useEffect(() => {
    if (!isSupported) {
      setPermission('unsupported');
      return;
    }

    // Check current permission state
    if ('Notification' in window) {
      setPermission(Notification.permission as PushPermissionState);
    }

    // Check if already subscribed
    checkSubscription();
  }, [isSupported]);

  const checkSubscription = async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await (registration as any).pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const registerServiceWorker = async () => {
    if (!isSupported) return null;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  };

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    setIsLoading(true);

    try {
      // Request permission
      const result = await Notification.requestPermission();
      setPermission(result as PushPermissionState);

      if (result !== 'granted') {
        toast.error('Notification permission denied');
        setIsLoading(false);
        return false;
      }

      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) {
        throw new Error('Failed to register service worker');
      }

      // For now, just simulate subscription (backend integration later)
      // In production, this would use VAPID keys and save to database
      setIsSubscribed(true);
      toast.success('Push notifications enabled!');
      
      return true;
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to enable push notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return false;

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await (registration as any).pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      toast.success('Push notifications disabled');
      return true;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      toast.error('Failed to disable push notifications');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Send a test notification (for demo purposes)
  const sendTestNotification = useCallback(() => {
    if (permission !== 'granted') {
      toast.error('Please enable notifications first');
      return;
    }

    new Notification('Test Notification', {
      body: 'Push notifications are working!',
      icon: '/favicon.ico',
    });
  }, [permission]);

  return {
    permission,
    isSubscribed,
    isLoading,
    isSupported,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
};
