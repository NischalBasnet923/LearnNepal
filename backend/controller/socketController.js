const { Server } = require('socket.io');

const userSocketMap = {};

const setupSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== 'undefined') {
      // Ensure we're using the exact user ID from the query
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} connected with socket ${socket.id}`);

      // Optional: Broadcast user's online status
      io.emit('userOnline', { userId });
    }

    socket.on('sendMessage', (messageData) => {
      const { receiverId } = messageData;
      console.log('Checking receiver socket:', {
        receiverId,
        socketMap: userSocketMap,
        isOnline: !!userSocketMap[receiverId],
      });

      const receiverSocketId = userSocketMap[receiverId];

      if (receiverSocketId) {
        console.log(
          `Sending message to receiver ${receiverId} via socket ${receiverSocketId}`
        );
        io.to(receiverSocketId).emit('receiveMessage', messageData);
      } else {
        console.log(`Receiver ${receiverId} socket not found in map`);
      }
    });

    socket.on('disconnect', () => {
      const userId = Object.keys(userSocketMap).find(
        (key) => userSocketMap[key] === socket.id
      );

      if (userId) {
        delete userSocketMap[userId];
        console.log(`User ${userId} disconnected`);

        // Optional: Broadcast user's offline status
        io.emit('userOffline', { userId });
      }
    });
  });

  return io;
};

module.exports = {
  setupSocketServer,
  userSocketMap,
};
