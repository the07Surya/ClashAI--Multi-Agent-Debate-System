import { useState, useEffect, useCallback, useRef } from 'react';

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
  const reconnectAttempts = useRef(0);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    
    try {
      setConnectionStatus('connecting');
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        if (!mountedRef.current) return;
        console.log('✓ WebSocket connected');
        setIsConnected(true);
        setError(null);
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const message = JSON.parse(event.data);
          setMessages(prev => [...prev, { ...message, id: Date.now() + Math.random() }]);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      ws.onclose = (event) => {
        if (!mountedRef.current) return;
        console.log('WebSocket closed:', event.code);
        setIsConnected(false);
        setSocket(null);
        setConnectionStatus('disconnected');
        
        // Auto-reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts && event.code !== 1000) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          setConnectionStatus('reconnecting');
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              console.log(`Reconnecting... attempt ${reconnectAttempts.current}`);
              connect();
            }
          }, delay);
        } else {
          setConnectionStatus('failed');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error');
        setConnectionStatus('error');
      };

      setSocket(ws);
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError('Failed to connect');
      setConnectionStatus('failed');
    }
  }, [url]);

  useEffect(() => {
    connect();
    
    return () => {
      mountedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close(1000, 'Component unmounting');
      }
    };
  }, [connect]); // Fixed: only include connect in dependencies

  const sendMessage = useCallback((message) => {
    if (socket && isConnected) {
      try {
        socket.send(JSON.stringify(message));
        return true;
      } catch (err) {
        console.error('Failed to send message:', err);
        setError('Failed to send message');
        return false;
      }
    } else {
      console.warn('WebSocket not connected');
      return false;
    }
  }, [socket, isConnected]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    isConnected,
    messages,
    error,
    connectionStatus,
    sendMessage,
    clearMessages
  };
};

export default useWebSocket;