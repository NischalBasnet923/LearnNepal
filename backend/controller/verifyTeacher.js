const connectCloudinary = require('../config/cloudinary');
const prisma = require('../prismaClient');
const cloudinary = require('cloudinary').v2;

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

    const uploadProfile = await cloudinary.uploader.upload(
      profileImageFile.path
    );
    const uploadCertificate = await cloudinary.uploader.upload(
      certificateFile.path
    );

    let updatedUser;
    if (profileImageFile) {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          imageUrl: uploadProfile.secure_url,
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
        certificate: certificateFile ? uploadCertificate.secure_url : '',
      },
    });

    return res.status(200).json({
      message: 'Teacher request created successfully',
      newRequest,
      updatedUser,
      status: 'CREATED',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  getExistingTeacherRequest,
  verifyTeacher,
};
