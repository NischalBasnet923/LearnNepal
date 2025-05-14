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
      data: { isVerified: false, message },
    });
    return res.status(200).json({
      success: true,
      message: 'Teacher request declined !',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const category = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ error: 'No categories provided' });
    }

    const formattedCategories = categories.map((title) => ({
      categoryTitle: title,
    }));

    await prisma.courseCategory.createMany({
      data: formattedCategories,
      skipDuplicates: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Categories created successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await prisma.courseCategory.findMany();
    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  getRequests,
  approveTeacher,
  declineTeacher,
  category,
  getCategory,
};
