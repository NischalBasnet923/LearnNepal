const prisma = require('../prismaClient');

const getRequests = async (req, res) => {
  try {
    const adminId = req.user.id;
    console.log(adminId);
    const requests = await prisma.teacherRequest.findMany({});
    return res.status(200).json({ success: true, requests });
  } catch (error) {}
};

const approveTeacher = async (req, res) => {
  try {
    const { requestId } = req.body;
    const teacherRequest = await prisma.teacherRequest.findUnique({
      where: { id: requestId },
    });

    if (!teacherRequest) {
      return res.status(404).json({
        success: false,
        message: 'Teacher request not found',
      });
    }

    const result = await prisma.$transaction([
      prisma.teacherRequest.update({
        where: { id: requestId },
        data: { isVerified: true },
      }),
      prisma.user.update({
        where: { id: teacherRequest.userId },
        data: { role: 'teacher' },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Teacher request approved successfully',
      result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const declineTeacher = async (req, res) => {
  try {
    const { requestId, message } = req.body;
    console.log(req.body);
    const request = await prisma.teacherRequest.update({
      where: { id: requestId },
      data: { isVerified: false, message: message },
    });
    return res.status(200).json({
      success: true,
      message: 'Teacher request declined !',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRequests, approveTeacher, declineTeacher };
