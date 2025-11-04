import { apiClient } from './client';
import { userService } from './userService';

// Notification types
export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface NotificationCountDto {
  unreadCount: number;
  totalCount: number;
}

export interface NotificationResponse {
  success: boolean;
  data: NotificationDto[] | NotificationCountDto;
  message?: string;
}

// Notification API client
export const notificationApi = {
  /**
   * Get user's notifications
   */
  getNotifications: async (userId: string): Promise<NotificationDto[]> => {
    try {
      const response = await apiClient.get<NotificationResponse>(
        `/notifications?userId=${userId}`
      );
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      const response = await apiClient.get<NotificationResponse>(
        `/notifications/count?userId=${userId}`
      );
      const data = response.data.data as NotificationCountDto;
      return data?.unreadCount || 0;
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
      return 0;
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId: string, userId: string): Promise<void> => {
    try {
      await apiClient.put(
        `/notifications/${notificationId}/read?userId=${userId}`
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (userId: string): Promise<void> => {
    try {
      await apiClient.put(`/notifications/read-all?userId=${userId}`);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId: string, userId: string): Promise<void> => {
    try {
      await apiClient.delete(`/notifications/${notificationId}?userId=${userId}`);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }
};

export default notificationApi;

