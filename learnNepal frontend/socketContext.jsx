import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const SocketContext = createContext(null);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const initializeSocket = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const newSocket = io('http://localhost:3000', {
          query: { userId: decoded.id },
          transports: ['websocket'],
        });

        newSocket.on('connect', () => console.log('Socket connected'));
        newSocket.on('disconnect', () => console.log('Socket disconnected'));

        setSocket(newSocket);

        return () => newSocket.disconnect();
      } catch (error) {
        console.error('Socket initialization error:', error);
      }

      SocketProvider.propTypes = {
        children: PropTypes.node.isRequired,
      };
    };

    initializeSocket();
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
