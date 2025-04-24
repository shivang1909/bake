import { useEffect } from 'react';

const eventListeners = {};
let eventSource = null;

export default function useSSE(on = {}) {
  // 🛡️ Validate input
  if (typeof on !== 'object' || Array.isArray(on)) {
    console.error('❌ useSSE expects an object with event names and callbacks, got:', on);
    return;
  }

  // ✅ Register event listeners BEFORE starting SSE
  console.log('📥 Registering listeners:', on);
  for (const eventName in on) {
    if (!eventListeners[eventName]) {
      eventListeners[eventName] = [];
    }

    // Avoid duplicates
    if (!eventListeners[eventName].includes(on[eventName])) {
       console.log(`❌ Listener for ${eventName} already registered:`, on[eventName]);  
      eventListeners[eventName].push(on[eventName]);
        
    }
  }

  console.log('📦 Current eventListeners:', eventListeners);

  useEffect(() => {
    // 🚀 Setup SSE only once
    if (!eventSource) {
      eventSource = new EventSource('http://localhost:5000/SSEhandler', {
        withCredentials: true,
      });

      eventSource.onopen = () => {
        console.log('✅ SSE connection established');
      };

      eventSource.onerror = (err) => {
        console.error('❌ SSE connection error:', err);
        eventSource.close();
        eventSource = null; // reset so it can reconnect if needed
      };

      // 🧠 Listen to specific events
      const supportedEvents = ['delivery-update', 'admin-event', 'ping','cod-status-update','new-order','Delivery-notification'];
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

    // 🧹 Clean up on unmount
    return () => {
      for (const eventName in on) {
        eventListeners[eventName] = (eventListeners[eventName] || []).filter(
          (cb) => cb !== on[eventName]
        );
      }
    };
  }, []);
}
