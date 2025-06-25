import { useState, useEffect, useCallback, useMemo } from 'react';
import Axios from "../utils/Axios";
import { IoNotificationsOutline } from 'react-icons/io5';
import SummaryApi from '../common/SummaryApi';
import useSSE from '../hooks/useSSE';
import { useSelector } from 'react-redux';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleNotification = async () => {
    setIsNotificationOpen((prev) => !prev);
    await Axios({ ...SummaryApi.updatenotification });
    setNotificationCount(0);
  };

  const handleAdminEvent = useCallback((data) => {
    setNotifications((prev) => [...prev, data]);
    setNotificationCount((prev) => prev + 1);
  }, []);

  const CodUpdate = useCallback((data) => {
    setNotifications((prev) => [...prev, data]);
    setNotificationCount((prev) => prev + 1);
  }, []);

  const Delivery_notification = useCallback((data) => {
    setNotifications((prev) => [...prev, data]);
    setNotificationCount((prev) => prev + 1);
  }, []);

  const eventHandlers = useMemo(() => ({
    'admin-event': handleAdminEvent,
    'cod-status-update': CodUpdate,
    'Delivery-notification': Delivery_notification,
  }), [handleAdminEvent, CodUpdate, Delivery_notification]);

  useSSE(eventHandlers);

  const getallnotification = async () => {
    try {
      const response = await Axios(SummaryApi.getnotification);
      if (response.data) {
        const data = response.data;
        setNotificationCount(data.count);
        const notifications = data.notifications.map((item) => ({
          message: item.message,
          link: item.link,
          isRead: item.isRead,
        }));
        setNotifications(notifications);
      }
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await Axios(SummaryApi.clearAllNotifications);
      setNotifications([]);
      setNotificationCount(0);
    } catch (error) {
      console.log("Error clearing notifications:", error);
    }
  };

  useEffect(() => {
    getallnotification();
  }, []);

  return (
    <div className="relative">
      <button onClick={toggleNotification} className="relative text-neutral-600">
        <IoNotificationsOutline size={26} />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </button>

      {isNotificationOpen && (
        <div className="absolute right-0 top-10 w-64 bg-white shadow-lg rounded-md p-3 max-h-60 overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-sm">Notifications</p>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-red-500 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <a
                key={index}
                href={notif.link}
                className={`block text-sm p-2 border-b border-gray-200 last:border-none transition-colors duration-200
                  ${notif.isRead ? 'text-gray-700 hover:text-blue-600' : 'text-red-600 hover:text-blue-600'}`}
              >
                {notif.message}
              </a>
            ))
          ) : (
            <p className="text-sm p-2 text-center text-gray-500">No new notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
