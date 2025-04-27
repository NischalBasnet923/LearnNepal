const connectCloudinary = require('../config/cloudinary');
const prisma = require('../prismaClient');
const cloudinary = require('cloudinary').v2;

const updateRoleToTeacher = async (req, res) => {
  try {
    const userid = req.user.id;
    await prisma.user.update({
      where: { id: userid },
      data: { role: 'teacher' },
    });
    return res
      .status(200)
      .json({ message: 'Role updated successfully to TEACHER' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'server error', error: error.message });
  }
};

const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.files?.image ? req.files.image[0] : null;
    const videoFiles = req.files?.videos || [];
    const teacherId = req.user.id;
    console.log(courseData);
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: 'Thumbnail not attached' });
    }
    const parsedCourseData = JSON.parse(courseData);
    const checkCategory = await prisma.courseCategory.findFirst({
      where: {
        categoryTitle: parsedCourseData.categories[0],
      },
    });
    console.log(checkCategory);
    console.log(parsedCourseData.categories[0]);

    if (!checkCategory)
      return res.status(400).json({ message: 'category not found' });

    // Upload the course thumbnail to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    parsedCourseData.teacherId = teacherId;
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    let videoIndex = 0;
    for (const chapter of parsedCourseData.courseContent) {
      for (const lecture of chapter.chapterContent) {
        if (lecture.lectureUrl === '' && videoIndex < videoFiles.length) {
          const videoUpload = await cloudinary.uploader.upload(
            videoFiles[videoIndex].path,
            {
              resource_type: 'video',
            }
          );

          lecture.lectureUrl = videoUpload.secure_url;
          videoIndex++;
        }
      }
    }

    const newCourse = await prisma.course.create({
      data: {
        courseTitle: parsedCourseData.courseTitle,
        courseDescription: parsedCourseData.courseDescription,
        category: {
          connect: {
            id: checkCategory.id,
          },
        },
        coursePrice: parsedCourseData.coursePrice,
        discount: parsedCourseData.discount || 0,
        isPublished: parsedCourseData.isPublished || true,
        courseThumbnail: parsedCourseData.courseThumbnail,
        teacher: {
          connect: { id: teacherId },
        },
        chapters: {
          create: parsedCourseData.courseContent.map((chapter) => ({
            chapterTitle: chapter.chapterTitle,
            chapterOrder: chapter.chapterOrder,
            lectures: {
              create: chapter.chapterContent.map((lecture) => ({
                title: lecture.lectureTitle,
                contentUrl: lecture.lectureUrl,
                duration: parseInt(lecture.lectureDuration),
                isPreview: lecture.isPreviewFree,
                lectureOrder: lecture.lectureOrder,
              })),
            },
          })),
        },
      },
      include: {
        enrollments: true,
        teacher: true,
        chapters: { include: { lectures: true } },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Course added successfully',
      course: newCourse,
    });
  } catch (error) {
    console.error('Error adding course:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseData } = req.body;
    const imageFile = req.files?.image?.[0] || null;
    const videoFiles = req.files?.videos || [];
    const teacherId = req.user.id;

    console.log('Update Request received:', req.body);
    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: 'Course ID is required' });
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          include: {
            lectures: true,
          },
        },
      },
    });

    if (!existingCourse) {
      return res
        .status(404)
        .json({ success: false, message: 'Course not found' });
    }

    if (existingCourse.teacherId !== teacherId) {
      return res
        .status(403)
        .json({ success: false, message: 'Unauthorized access' });
    }

    if (!courseData) {
      return res.status(400).json({
        success: false,
        message: 'Missing courseData in request body',
      });
    }

    let parsedCourseData;
    try {
      parsedCourseData = JSON.parse(courseData);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid courseData format',
        error: parseError.message,
      });
    }

    const checkCategory = await prisma.courseCategory.findFirst({
      where: {
        categoryTitle: parsedCourseData.categories[0],
      },
    });

    // Upload thumbnail if provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path);
      parsedCourseData.courseThumbnail = imageUpload.secure_url;
    } else {
      parsedCourseData.courseThumbnail = existingCourse.courseThumbnail;
    }

    // Upload new videos and update video URLs
    let videoIndex = 0;
    for (const chapter of parsedCourseData.courseContent) {
      for (const lecture of chapter.chapterContent) {
        if (!lecture.lectureUrl && videoIndex < videoFiles.length) {
          const videoUpload = await cloudinary.uploader.upload(
            videoFiles[videoIndex].path,
            { resource_type: 'video' }
          );
          lecture.lectureUrl = videoUpload.secure_url;
          videoIndex++;
        }
      }
    }

    // Delete old lectures
    await prisma.lecture.deleteMany({
      where: {
        chapter: {
          courseId: courseId,
        },
      },
    });

    // Delete old chapters and lectures
    await prisma.chapter.deleteMany({
      where: {
        courseId: courseId,
      },
    });

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        courseTitle: parsedCourseData.courseTitle,
        courseDescription: parsedCourseData.courseDescription,
        coursePrice: parsedCourseData.coursePrice,
        discount: parsedCourseData.discount || 0,
        isPublished: parsedCourseData.isPublished,
        category: {
          connect: {
            id: checkCategory.id,
          },
        },
        courseThumbnail: parsedCourseData.courseThumbnail,
        chapters: {
          create: parsedCourseData.courseContent.map((chapter) => ({
            chapterTitle: chapter.chapterTitle,
            chapterOrder: chapter.chapterOrder,
            lectures: {
              create: chapter.chapterContent.map((lecture) => ({
                title: lecture.lectureTitle,
                contentUrl: lecture.lectureUrl,
                duration: parseInt(lecture.lectureDuration),
                isPreview: lecture.isPreviewFree,
                lectureOrder: lecture.lectureOrder,
              })),
            },
          })),
        },
      },
      include: {
        chapters: {
          include: {
            lectures: true,
          },
        },
        teacher: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get all courses created by the teacher
const getTeacherCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await prisma.course.findMany({
      where: {
        teacherId: teacherId,
      },
      include: {
        chapters: {
          include: {
            lectures: true,
          },
        },
      },
    });

    return res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
};

//get teacher dashboard data
//total earning , enrolled students, no of courses

const teacherDashboardData = async (req, res) => {
  try {
    const teacherId = req.user.id;
    // Count the number of courses created by the teacher
    const totalCourses = await prisma.course.count({
      where: { teacherId: teacherId },
    });

    // Calculate total earnings for the teacher
    const totalEarnings = await prisma.purchase.aggregate({
      _sum: {
        amount: true, // Sum the `amount` field for all purchases
      },
      where: {
        course: {
          teacherId: teacherId,
        },
      },
    });

    // Count total enrolled students across all courses by the teacher
    const totalEnrolledStudents = await prisma.enrollment.findMany({
      where: {
        course: {
          teacherId: teacherId,
        },
      },
      include: {
        user: true,
        course: {
          select: {
            courseTitle: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalEarnings: totalEarnings._sum.amount || 0, // Return 0 if no earnings
        totalEnrolledStudents,
      },
    });
  } catch (error) {
    console.error('Error fetching teacher dashboard data:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getEnrollmentStudentData = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const courses = await prisma.course.findMany({
      where: {
        teacherId: teacherId,
      },
    });

    // Extract course IDs
    const courseIds = courses.map((course) => course.id);

    // Fetch purchase data for the courses created by the teacher
    const purchases = await prisma.purchase.findMany({
      where: {
        courseId: { in: courseIds },
        status: 'completed',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
        course: {
          select: {
            id: true,
            courseTitle: true,
          },
        },
      },
    });

    // Map purchase data to the desired structure
    const enrolledStudents = purchases.map((purchase) => ({
      studentId: purchase.user.id,
      studentName: purchase.user.username,
      studentImage: purchase.user.imageUrl,
      courseTitle: purchase.course.courseTitle,
      purchaseDate: purchase.createdAt,
      amountPaid: purchase.amount,
    }));

    return res.status(200).json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    console.error('Error fetching enrollment data:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getTeacherReport = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const courses = await prisma.course.findMany({
      where: { teacherId },
      include: {
        enrollments: true,
        ratings: true,
        purchases: true,
      },
    });

    const report = {
      teacherId,
      totalCourses: courses.length,
      totalEnrollments: 0,
      totalEarnings: {
        monthly: 0,
        yearly: 0,
      },
      courseDetails: [],
    };

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    for (const course of courses) {
      const courseEnrollments = course.enrollments.length;
      report.totalEnrollments += courseEnrollments;

      const courseRatings = course.ratings.map((r) => r.rating);
      const avgRating =
        courseRatings.length > 0
          ? courseRatings.reduce((a, b) => a + b, 0) / courseRatings.length
          : null;

      let monthlyEarnings = 0;
      let yearlyEarnings = 0;

      course.purchases.forEach((purchase) => {
        const createdAt = new Date(purchase.createdAt);
        const isCompleted = purchase.status === 'completed';

        if (!isCompleted) return;

        if (
          createdAt.getFullYear() === currentYear &&
          createdAt.getMonth() === currentMonth
        ) {
          monthlyEarnings += purchase.amount;
        }

        if (createdAt.getFullYear() === currentYear) {
          yearlyEarnings += purchase.amount;
        }
      });

      report.totalEarnings.monthly += monthlyEarnings;
      report.totalEarnings.yearly += yearlyEarnings;

      report.courseDetails.push({
        courseId: course.id,
        title: course.courseTitle,
        enrollments: courseEnrollments,
        averageRating: avgRating,
        monthlyEarnings,
        yearlyEarnings,
      });
    }

    return res.status(200).json({ success: true, report });
  } catch (error) {
    console.error('Error generating teacher report:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  updateRoleToTeacher,
  addCourse,
  getTeacherCourse,
  teacherDashboardData,
  getEnrollmentStudentData,
  updateCourse,
  getTeacherReport,
};
