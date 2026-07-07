import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext(undefined);

const initialNotifications = [
  {
    id: '1',
    title: 'Technician Dispatched',
    description: 'Dave Miller is en route to Customer John Smith (AC Maintenance).',
    time: '5 mins ago',
    read: false,
    type: 'info',
    category: 'workflow'
  },
  {
    id: '2',
    title: 'Quote Approved',
    description: 'Mrs. Gable approved the estimate for Compressor Replacement ($450).',
    time: '2 hours ago',
    read: false,
    type: 'success',
    category: 'sales'
  },
  {
    id: '3',
    title: 'Feedback Received',
    description: '5-star rating submitted by Robert Downey: "Excellent and fast repair!".',
    time: '4 hours ago',
    read: true,
    type: 'success',
    category: 'customer'
  },
  {
    id: '4',
    title: 'Delay Alert',
    description: 'Traffic delay reported for job #3492 in Sector 4.',
    time: '1 day ago',
    read: true,
    type: 'warning',
    category: 'alert'
  }
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const addNotification = (notif) => {
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        time: 'Just now',
        read: false,
        type: 'info',
        ...notif
      },
      ...prev
    ]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
