// controllers/teacherController.js
const prisma = require("../prismaClient");

// controllers/teacherController.js
const getExistingTeacherRequest = async (req, res) => {
    try {
      const userId = req.user.id;
      const existingRequest = await prisma.teacherRequest.findFirst({
        where: { userId },
      });

      if (existingRequest) {
        return res.status(200).json({
          hasRequest: true,
          existingRequest, 
        });
      }
      return res.status(200).json({ hasRequest: false });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
const verifyTeacher = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname, education, expertise, experience } = req.body;

    // If the user already has a TeacherRequest, block them
    const existingRequest = await prisma.teacherRequest.findFirst({
      where: { userId },
    });
    
    const certificateFile = req.files?.certificate?.[0];
    const profileImageFile = req.files?.profileImage?.[0];

    let updatedUser;
    if (profileImageFile) {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          imageUrl: profileImageFile.path,
        },
      });
    }

    const newRequest = await prisma.teacherRequest.create({
      data: {
        fullname,
        education,
        expertise,
        experience,
        userId,
        isVerified: false,
        certificate: certificateFile ? certificateFile.path : "",
      },
    });

    return res.status(200).json({
      message: "Teacher request created successfully",
      newRequest,
      updatedUser,
      status: "CREATED",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getExistingTeacherRequest,
  verifyTeacher,
};
