import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi, NotificationDto } from '@/lib/api/notificationApi';
import { userService } from '@/lib/api/userService';
import { toast } from 'sonner';

/**
 * Hook to get user's notifications
 */
export const useNotifications = () => {
  const userId = userService.getDatabaseUserId();

  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationApi.getNotifications(userId || ''),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to get unread notification count
 */
export const useNotificationCount = () => {
  const userId = userService.getDatabaseUserId();

  return useQuery({
    queryKey: ['notification-count', userId],
    queryFn: () => notificationApi.getUnreadCount(userId || ''),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to mark notification as read
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const userId = userService.getDatabaseUserId();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.markAsRead(notificationId, userId || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notification-count', userId] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark notification as read: ${error.message}`);
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const userId = userService.getDatabaseUserId();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(userId || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notification-count', userId] });
      toast.success('All notifications marked as read');
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark all as read: ${error.message}`);
    },
  });
};

/**
 * Hook to delete notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const userId = userService.getDatabaseUserId();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.deleteNotification(notificationId, userId || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notification-count', userId] });
      toast.success('Notification deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete notification: ${error.message}`);
    },
  });
};

