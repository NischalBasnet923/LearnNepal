import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import apiClient from '../../api/axios';
import { jwtDecode } from 'jwt-decode';

const Chat = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [recentMessages, setRecentMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const messageEndRef = useRef(null);

  const user = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

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

        newSocket.on('receiveMessage', (message) => {
          if (!selectedFriend || message.senderId !== selectedFriend.id) {
            setUnreadMessages((prev) => ({
              ...prev,
              [message.senderId]: (prev[message.senderId] || 0) + 1,
            }));
          }

          // Update recent message for the sender
          setRecentMessages((prev) => ({
            ...prev,
            [message.senderId]: message.message,
          }));

          if (selectedFriend && message.senderId === selectedFriend.id) {
            setMessages((prevMessages) => [...prevMessages, message]);
          }
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [selectedFriend]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get('/chat/getFriends', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFriends(response.data.friends || []);
        setLoading(false);

        // Fetch most recent message for each friend
        const friendIds = response.data.friends.map((friend) => friend.id);
        await fetchRecentMessagesForAllFriends(friendIds);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError('Failed to load friends. Please try again later.');
        setFriends([]);
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  // Function to fetch the most recent message for each friend
  const fetchRecentMessagesForAllFriends = async (friendIds) => {
    try {
      const token = localStorage.getItem('token');

      // Create a map to store recent messages
      const recentMsgs = {};

      // Fetch last message for each friend
      for (const friendId of friendIds) {
        const response = await apiClient.post(
          '/chat/getMessage',
          { receiverId: friendId, limit: 1 },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const messages = response.data.data || [];
        if (messages.length > 0) {
          // Store the most recent message
          recentMsgs[friendId] = messages[0].message;
        }
      }

      setRecentMessages(recentMsgs);
    } catch (err) {
      console.error('Error fetching recent messages:', err);
    }
  };

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend.id);
      setSidebarCollapsed(true);

      setUnreadMessages((prev) => ({
        ...prev,
        [selectedFriend.id]: 0,
      }));
    } else {
      setSidebarCollapsed(false);
    }
  }, [selectedFriend]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (receiverId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await apiClient.post(
        '/chat/getMessage',
        { receiverId: receiverId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages. Please try again later.');
      setMessages([]);
      setLoading(false);
    }
  };

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.post(
        '/chat/sendMessage',
        {
          receiverId: selectedFriend.id,
          message: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const newMsg = response.data.data;

        setMessages((prevMessages) => [...prevMessages, newMsg]);

        // Update recent message for this friend
        setRecentMessages((prev) => ({
          ...prev,
          [selectedFriend.id]: newMessage,
        }));

        if (socket) {
          socket.emit('sendMessage', {
            senderId: user.id,
            receiverId: selectedFriend.id,
            message: newMessage,
            createdAt: new Date().toISOString(),
          });
        }

        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Full or Collapsed */}
        <div
          className={`bg-white shadow-md transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-64'
          } ${selectedFriend === null ? 'w-full' : ''}`}>
          <div
            className={`p-4 border-b flex ${
              sidebarCollapsed ? 'justify-center' : 'justify-between'
            }`}>
            {!sidebarCollapsed && (
              <h2 className="font-semibold text-lg">Contacts</h2>
            )}
            {selectedFriend && (
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 focus:outline-none">
                {sidebarCollapsed ? '→' : '←'}
              </button>
            )}
          </div>

          {loading && !friends?.length ? (
            <div
              className={`p-4 text-center text-gray-500 ${
                sidebarCollapsed ? 'text-xs' : ''
              }`}>
              Loading...
            </div>
          ) : error ? (
            <div
              className={`p-4 text-center text-red-500 ${
                sidebarCollapsed ? 'text-xs' : ''
              }`}>
              {sidebarCollapsed ? '!' : error}
            </div>
          ) : !friends?.length ? (
            <div
              className={`p-4 text-center text-gray-500 ${
                sidebarCollapsed ? 'text-xs' : ''
              }`}>
              {sidebarCollapsed ? 'No contacts' : 'No contacts found'}
            </div>
          ) : (
            <ul>
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  className={`border-b hover:bg-gray-100 cursor-pointer ${
                    selectedFriend?.id === friend.id ? 'bg-blue-50' : ''
                  } ${
                    sidebarCollapsed
                      ? 'p-2 flex justify-center'
                      : 'p-3 flex items-center justify-between'
                  }`}
                  onClick={() => handleSelectFriend(friend)}>
                  <div
                    className={`flex ${
                      sidebarCollapsed
                        ? 'flex-col items-center'
                        : 'items-center'
                    }`}>
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                      {friend.image ? (
                        <img
                          src={friend.image}
                          alt={friend.username}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        friend.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    {!sidebarCollapsed && (
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium truncate">
                          {friend.username}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {recentMessages[friend.id]
                            ? recentMessages[friend.id].length > 25
                              ? recentMessages[friend.id].substring(0, 25) +
                                '...'
                              : recentMessages[friend.id]
                            : 'No messages yet'}
                        </p>
                      </div>
                    )}
                  </div>

                  {unreadMessages[friend.id] > 0 && (
                    <div
                      className={`bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                        sidebarCollapsed ? 'absolute top-0 right-0' : ''
                      }`}>
                      {unreadMessages[friend.id]}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Chat Area - Only shown when a friend is selected */}
        {selectedFriend && (
          <div className="flex-1 flex flex-col">
            <div className="bg-white p-4 shadow-sm flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                {selectedFriend.image ? (
                  <img
                    src={selectedFriend.image}
                    alt={selectedFriend.username}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  selectedFriend.username.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-medium">{selectedFriend.username}</h2>
                <p className="text-xs text-gray-500">{selectedFriend.email}</p>
              </div>
              <button
                onClick={() => setSelectedFriend(null)}
                className="text-gray-400 hover:text-gray-600 p-2">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loading ? (
                <div className="text-center text-gray-500">
                  Loading messages...
                </div>
              ) : !messages?.length ? (
                <div className="text-center text-gray-500">
                  No messages yet. Start a conversation!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${
                      msg.senderId === user.id ? 'justify-end' : 'justify-start'
                    }`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderId === user.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 shadow-sm'
                      }`}>
                      <p>{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messageEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="bg-white p-4 border-t flex">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
