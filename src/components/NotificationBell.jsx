import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Clock, Inbox, Circle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { cn } from '../utils/cn';
import { Button } from './Button';

export const NotificationBell = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className={cn('h-5 w-5', unreadCount > 0 && 'animate-swing')} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="p-4 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 text-sm">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-7 text-xs font-medium text-gray-500 hover:text-gray-900"
                  leftIcon={<Check className="h-3 w-3" />}
                >
                  Mark all read
                </Button>
              </div>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="p-3 bg-gray-50 text-gray-400 rounded-full mb-3">
                  <Inbox className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-900">All caught up!</p>
                <p className="text-xs text-gray-500 mt-1">No new notifications at this time.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      'p-4 flex gap-3 hover:bg-gray-50 transition-colors relative group',
                      !notif.read && 'bg-blue-50/10'
                    )}
                  >
                    {/* Unread indicator */}
                    {!notif.read && (
                      <span className="absolute top-4 right-4 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                    )}

                    {/* Notification content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          'text-xs font-semibold text-gray-900',
                          !notif.read && 'font-bold'
                        )}>
                          {notif.title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {notif.description}
                      </p>
                      
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{notif.time}</span>
                      </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="flex flex-col gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-1 rounded hover:bg-gray-100 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50/50 border-t border-gray-50 text-center">
              <button
                onClick={clearAll}
                className="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
