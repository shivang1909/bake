import { useEffect } from 'react';

const eventListeners = {};
let eventSource = null;
let reconnectTimer = null;

export default function useSSE(on = {}) {
  if (typeof on !== 'object' || Array.isArray(on)) {
    console.error('❌ useSSE expects an object with event names and callbacks, got:', on);
    return;
  }

  console.log('📥 Registering listeners:', on);
  for (const eventName in on) {
    if (!eventListeners[eventName]) {
      eventListeners[eventName] = [];
    }
    if (!eventListeners[eventName].includes(on[eventName])) {
      eventListeners[eventName].push(on[eventName]);
    }
  }

  console.log('📦 Current eventListeners:', eventListeners);

  useEffect(() => {
    function initSSE() {
      if (eventSource) return; // Don't reinitialize if already connected

      const url = `http://localhost:5000/SSEhandler?ts=${Date.now()}`;
      eventSource = new EventSource(url, {
        withCredentials: true,
      });

      console.log('📡 Connecting to SSE:', url);

      eventSource.onopen = () => {
        console.log('✅ SSE connection established');
      };

      eventSource.onerror = (err) => {
        console.error('❌ SSE connection error:', err);
        eventSource.close();
        eventSource = null;

        // 🔁 Retry after 5 seconds
        if (!reconnectTimer) {
          reconnectTimer = setTimeout(() => {
            reconnectTimer = null;
            initSSE(); // Reconnect
          }, 5000);
        }
      };

      const supportedEvents = [
        'delivery-update',
        'admin-event',
        'ping',
        'cod-status-update',
        'new-order',
        'Delivery-notification',
      ];

      supportedEvents.forEach((eventName) => {
        eventSource.addEventListener(eventName, (event) => {
          try {
            const parsed = JSON.parse(event.data);
            console.log(`📨 Received ${eventName}:`, parsed);

            const listeners = eventListeners[eventName] || [];
            listeners.forEach((cb) => cb(parsed));
          } catch (err) {
            console.error('❌ Error parsing SSE data:', err);
          }
        });
      });
    }

    initSSE(); // Initial connection

    return () => {
      for (const eventName in on) {
        eventListeners[eventName] = (eventListeners[eventName] || []).filter(
          (cb) => cb !== on[eventName]
        );
      }
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };
  }, []);
}
