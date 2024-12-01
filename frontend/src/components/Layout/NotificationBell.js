// src/components/Layout/NotificationBell.js
import React from 'react';
import { Bell, X } from 'lucide-react';

const NotificationBell = ({ count = 0, onClick, onClear }) => {
  return (
    <div className="relative inline-block">
      <button
        onClick={onClick}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none relative"
        aria-label={`${count} notifications`}
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {count > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full animate-pulse">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>
      
      {count > 0 && (
        <button
          onClick={onClear}
          className="ml-2 p-1 rounded hover:bg-gray-100 focus:outline-none"
          title="Clear all notifications"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default NotificationBell;