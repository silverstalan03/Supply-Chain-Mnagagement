// src/services/notification-handler.js

class NotificationHandler {
  constructor(onNotification) {
    this.onNotification = onNotification;
    this.checkInterval = 5000; // 5 seconds
    this.intervalId = null;
  }

  start() {
    if (!this.intervalId) {
      this.checkForNotifications();
      this.intervalId = setInterval(() => this.checkForNotifications(), this.checkInterval);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async checkForNotifications() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      const notifications = await response.json();
      notifications.forEach(notification => {
        this.onNotification(notification);
      });
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }
}

export { NotificationHandler };