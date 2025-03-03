import { createContext, useState, useEffect, useContext } from "react";

export const NotificationContext = createContext(null);

export const useNotificationContext = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const userRole = localStorage.getItem("role"); // Get user role

  useEffect(() => {
    if (userRole !== "Admin" && userRole !== "Delivery Partner") return;

    const eventSource = new EventSource("http://localhost:5000/api/notifications");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data]);
    };

    return () => {
      eventSource.close();
    };
  }, [userRole]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
