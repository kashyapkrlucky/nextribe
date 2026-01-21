import { 
  BellIcon, 
  HeartIcon, 
  MessageCircleIcon, 
  UserPlusIcon, 
  TrophyIcon, 
  CalendarIcon,
  SparklesIcon,
  UsersIcon,
  StarIcon,
  CheckCircleIcon
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'achievement' | 'event' | 'mention' | 'welcome' | 'milestone';
  title: string;
  description: string;
  time: string;
  user?: {
    name: string;
    avatar: string;
  };
  read: boolean;
  actionUrl?: string;
}

const notificationIcons = {
  like: HeartIcon,
  comment: MessageCircleIcon,
  follow: UserPlusIcon,
  achievement: TrophyIcon,
  event: CalendarIcon,
  mention: MessageCircleIcon,
  welcome: SparklesIcon,
  milestone: StarIcon,
};

const notificationColors = {
  like: 'text-red-500',
  comment: 'text-blue-500',
  follow: 'text-purple-500',
  achievement: 'text-yellow-500',
  event: 'text-green-500',
  mention: 'text-blue-400',
  welcome: 'text-pink-500',
  milestone: 'text-amber-500',
};

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'welcome',
      title: 'Welcome to NexTribe! 🎉',
      description: 'Your community journey begins here. Start creating and connecting!',
      time: 'Just now',
      read: false,
    },
    {
      id: 2,
      type: 'like',
      title: 'New likes on your post',
      description: 'Sarah Chen and 12 others liked your community update',
      time: '5 minutes ago',
      user: {
        name: 'Sarah Chen',
        avatar: 'SC',
      },
      read: false,
    },
    {
      id: 3,
      type: 'comment',
      title: 'New comment on your project',
      description: 'Mike Johnson: "This is amazing! Would love to collaborate"',
      time: '12 minutes ago',
      user: {
        name: 'Mike Johnson',
        avatar: 'MJ',
      },
      read: false,
    },
    {
      id: 4,
      type: 'follow',
      title: 'New follower',
      description: 'Emma Wilson started following your community',
      time: '1 hour ago',
      user: {
        name: 'Emma Wilson',
        avatar: 'EW',
      },
      read: false,
    },
    {
      id: 5,
      type: 'achievement',
      title: 'Achievement unlocked! 🏆',
      description: 'You\'ve created 10 community posts - you\'re on fire!',
      time: '2 hours ago',
      read: true,
    },
    {
      id: 6,
      type: 'event',
      title: 'Community event starting soon',
      description: 'Virtual meetup: "Building Better Communities" starts in 30 mins',
      time: '30 minutes ago',
      read: false,
    },
    {
      id: 7,
      type: 'mention',
      title: 'You were mentioned',
      description: 'Alex Kumar mentioned you in "Community Guidelines Discussion"',
      time: '3 hours ago',
      user: {
        name: 'Alex Kumar',
        avatar: 'AK',
      },
      read: true,
    },
    {
      id: 8,
      type: 'milestone',
      title: 'Community milestone! 🌟',
      description: 'Your community reached 100 members - congratulations!',
      time: '1 day ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 transform transition-all duration-200 ease-out">
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-900 p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UsersIcon className="w-4 h-4" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Community Notifications</h3>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded-full transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {unreadCount > 0 ? `${unreadCount} new notifications` : 'All caught up!'}
            </p>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = notificationIcons[notification.type];
                const colorClass = notificationColors[notification.type];
                
                return (
                  <div
                    key={notification.id}
                    className={`group relative border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="p-3">
                      <div className="flex items-start space-x-3">
                        {/* Avatar or Icon */}
                        <div className="flex-shrink-0">
                          {notification.user ? (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {notification.user.avatar}
                            </div>
                          ) : (
                            <div className={`w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center ${colorClass}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                {notification.description}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                  {notification.time}
                                </span>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
