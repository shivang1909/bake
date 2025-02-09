import { useState, useEffect } from 'react';

function Orderstatus() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to the SSE endpoint
    const eventSource = new EventSource('http://localhost:5000/events');

    // Listen for messages from the server
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [
        {
          id: Date.now(),
          orderId: data.orderId,
          status: data.orderStatus,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    };

    // Handle errors
    eventSource.onerror = () => {
      console.error('SSE connection error');
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Real-Time Order Status Updates</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <strong>Order ID:</strong> {notification.orderId} <br />
            <strong>Status:</strong> {notification.status} <br />
            <small>{notification.timestamp}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orderstatus;