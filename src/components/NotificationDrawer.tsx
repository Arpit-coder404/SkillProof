import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Bell, Check, ExternalLink, ShieldCheck, FileCheck, Info, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationDrawer: React.FC = () => {
  const { notifications, currentUserId, markNotificationAsRead, markAllNotificationsAsRead } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const userNotifications = notifications.filter((n) => n.userId === currentUserId);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-forest" />;
      case 'assessment':
        return <FileCheck className="w-4 h-4 text-terracotta" />;
      default:
        return <Info className="w-4 h-4 text-ink-muted" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-ink-light hover:text-ink hover:bg-paper-subtle rounded-sm transition-colors"
        title="View Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-terracotta ring-2 ring-paper" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-80 md:w-96 bg-paper-card border border-border shadow-lift rounded-sm z-50 overflow-hidden animate-fade-in text-xs">
            {/* Header */}
            <div className="p-3 bg-paper-subtle border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-forest/10 text-forest text-[10px] font-bold rounded-sm">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsAsRead()}
                    className="text-[11px] text-ink-muted hover:text-ink font-medium"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-ink-muted hover:text-ink p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-border-subtle">
              {userNotifications.length === 0 ? (
                <div className="p-6 text-center text-ink-muted">
                  No notifications for your current profile.
                </div>
              ) : (
                userNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) markNotificationAsRead(notif.id);
                      if (notif.link) {
                        setIsOpen(false);
                        navigate(notif.link);
                      }
                    }}
                    className={`p-3.5 hover:bg-paper-subtle transition-colors cursor-pointer flex gap-3 ${
                      !notif.read ? 'bg-forest/5' : ''
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-1 mb-0.5">
                        <span className={`font-medium ${!notif.read ? 'text-ink font-semibold' : 'text-ink-light'}`}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-ink-faint mt-1.5 block">
                        {notif.createdAt}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
