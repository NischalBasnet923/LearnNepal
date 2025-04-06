const prisma = require('../prismaClient');
const { io, userSocketMap } = require('./socketController');

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;

    // Validate input
    if (!receiverId || !message) {
      return res.status(400).json({
        message: 'Both receiverId and message are required',
      });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({
        message: 'Receiver not found',
      });
    }

    // Execute the rest in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Check if users are already friends
      const areFriends = await prisma.user.findFirst({
        where: {
          id: senderId,
          friends: { some: { id: receiverId } },
        },
      });

      // If not friends, make them friends
      if (!areFriends) {
        console.log(
          `Users ${senderId} and ${receiverId} are not friends. Adding as friends.`
        );

        // Add both users to each other's friends list
        await prisma.user.update({
          where: { id: senderId },
          data: {
            friends: { connect: { id: receiverId } },
          },
        });

        await prisma.user.update({
          where: { id: receiverId },
          data: {
            friends: { connect: { id: senderId } },
          },
        });
      }

      // Create message in database
      const newMessage = await prisma.message.create({
        data: {
          senderId: senderId,
          receiverId: receiverId,
          message: message,
        },
        include: {
          sender: {
            select: { id: true, username: true },
          },
          receiver: {
            select: { id: true, username: true },
          },
        },
      });

      return newMessage;
    });

    // Emit to socket if receiver is online
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId && io) {
      console.log(
        `Emitting message to receiver ${receiverId} via socket ${receiverSocketId}`
      );
      io.to(receiverSocketId).emit('receiveMessage', {
        id: result.id,
        senderId: senderId,
        message: message,
        createdAt: result.createdAt,
        sender: result.sender,
        receiver: result.receiver,
      });
    } else {
      console.log(`Receiver ${receiverId} is not currently online`);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: result,
      friendAdded: !result.areFriends,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        friends: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    console.log('user', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId: receiverIdFromBody } = req.body;

    if (!senderId || !receiverIdFromBody) {
      return res.status(400).json({
        success: false,
        message: 'SenderId and ReceiverId are required.',
      });
    }

    console.log(
      `🔍 Fetching messages between ${senderId} and ${receiverIdFromBody}`
    );

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverIdFromBody },
          { senderId: receiverIdFromBody, receiverId: senderId },
        ],
      },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message,
    });
  }
};

module.exports = {
  getFriends,
  sendMessage,
  getMessage,
};
