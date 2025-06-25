import { useEffect, useState, useCallback } from 'react';

let eventSource = null;
let reconnectTimer = null;
const eventListeners = {};

// Function to safely parse the incoming event data
const safeParse = (data) => {
  try {
    return JSON.parse(data); // Attempt to parse the incoming data as JSON
  } catch (err) {
    console.error('❌ Error parsing SSE data:', err); // Log if there's an error in parsing
    return null; // Return null if parsing fails
  }
};

// Function to initialize SSE connection
const initSSE = () => {
  if (eventSource) return; // If already connected, return to prevent reinitializing

  const url = `http://localhost:5000/SSEhandler?ts=${Date.now()}`; // Append timestamp to avoid caching
  eventSource = new EventSource(url, { withCredentials: true });

  console.log('📡 Connecting to SSE:', url); // Log the connection attempt

  // Handle successful SSE connection
  eventSource.onopen = () => {
    console.log('✅ SSE connection established'); // Log when connection is successfully opened
  };

  // Handle errors in the SSE connection
  eventSource.onerror = (err) => {
    console.error('❌ SSE connection error:', err); // Log any connection errors
    eventSource.close(); // Close the existing connection
    eventSource = null;

    // Retry connection after 5 seconds if not already retrying
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        initSSE(); // Retry initializing SSE after 5 seconds
        console.log('🔄 Retrying SSE connection in 5 seconds...');
      }, 5000);
    }
  };

  // Define supported events and register event listeners
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
      console.log(`📥 Event received: ${eventName}`); // Log when any event is received
      const parsed = safeParse(event.data); // Attempt to parse the event data
      if (!parsed) return;

      console.log('✅ Parsed event data:', parsed); // Log the parsed event data

      const listeners = eventListeners[eventName] || [];
      listeners.forEach((cb) => {
        console.log(`🔔 Triggering callback for event: ${eventName}`); // Log when callback is triggered
        cb(parsed); // Call the registered callback with parsed data
      });
    });
  });
};

// Function to register event listeners for specific events
const   register = (eventName, callback) => {
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = []; // If no listeners, initialize an empty array
  }

  if (!eventListeners[eventName].includes(callback)) {
    console.log(`📩 Registered callback for event: ${eventName}`); // Log when a callback is registered
    eventListeners[eventName].push(callback); // Add the callback to the list
  }
};

// Function to unregister event listeners
const unregister = (eventName, callback) => {
  console.log(`📭 Unregistered callback for event: ${eventName}`); // Log when a callback is unregistered
  if (!eventListeners[eventName]) return;

  eventListeners[eventName] = eventListeners[eventName].filter((cb) => cb !== callback); // Remove the callback
};

// Function to close SSE connection and clear any retry timer
const closeSSE = () => {
  if (eventSource) {
    eventSource.close(); // Close the SSE connection
    eventSource = null;
    console.log('🧹 SSE connection closed');
  }

  if (reconnectTimer) {
    clearTimeout(reconnectTimer); // Clear the retry timer if set
    reconnectTimer = null;
    console.log('🧹 Reconnect timer cleared');
  }
};

// Custom hook to use SSE
export default function useSSE(events) {
  useEffect(() => {
    if (typeof events !== 'object' || Array.isArray(events)) {
      console.error('❌ useSSE expects an object with event names and callbacks'); // Log if events are not valid
      return;
    }

    // Initialize SSE connection once
    initSSE();

    // Register events passed as props to the hook
    Object.entries(events).forEach(([eventName, callback]) => {
      register(eventName, callback); // Register each event listener
    });

    // Cleanup function when the component unmounts or when `events` change
    return () => {
      console.log('🧹 Cleaning up event listeners and closing SSE connection');
      Object.entries(events).forEach(([eventName, callback]) => {
        unregister(eventName, callback); // Unregister all event listeners
      });
      closeSSE(); // Close the SSE connection
    };
  }, [events]); // Re-run the effect if the `events` prop changes
}
