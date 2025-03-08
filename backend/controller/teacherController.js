const connectCloudinary = require("../config/cloudinary");
const prisma = require("../prismaClient");
const cloudinary = require("cloudinary").v2;

const updateRoleToTeacher = async (req, res) => {
  try {
    const userid = req.user.id;
    await prisma.user.update({
      where: { id: userid },
      data: { role: "teacher" },
    });
    return res
      .status(200)
      .json({ message: "Role updated successfully to TEACHER" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

const addCourse = async (req, res) => {
  try {
    console.log("Request received:", req.body);
    console.log("Uploaded Files:", req.files);

    const { courseData } = req.body;
    const imageFile = req.files?.image ? req.files.image[0] : null;
    const videoFiles = req.files?.videos || [];
    const teacherId = req.user.id;

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Thumbnail not attached" });
    }

    // Upload the course thumbnail to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.teacherId = teacherId;
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    let videoIndex = 0;
    for (const chapter of parsedCourseData.courseContent) {
      for (const lecture of chapter.chapterContent) {
        if (lecture.lectureUrl === "" && videoIndex < videoFiles.length) {
          const videoUpload = await cloudinary.uploader.upload(
            videoFiles[videoIndex].path,
            {
              resource_type: "video",
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
        category: "empty",
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

    return res
      .status(201)
      .json({
        success: true,
        message: "Course added successfully",
        course: newCourse,
      });
  } catch (error) {
    console.error("Error adding course:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
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
    console.error("Error fetching teacher courses:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
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
    const totalEnrolledStudents = await prisma.enrollment.count({
      where: {
        course: {
          teacherId: teacherId,
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
    console.error("Error fetching teacher dashboard data:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// const educatorDashboardData = async (req, res) => {
//     try {
//         const educatorId = req.user.id; // Fetch the educator's ID from the authenticated user

//         // Fetch all courses created by the educator
//         const courses = await prisma.course.findMany({
//             where: { teacherId: educatorId },
//             include: {
//                 enrollments: {
//                     include: {
//                         user: {
//                             select: {
//                                 id: true,
//                                 username: true,
//                                 imageUrl: true,
//                             },
//                         },
//                     },
//                 },
//             },
//         });

//         // Calculate total courses
//         const totalCourses = courses.length;

//         // Extract course IDs
//         const courseIds = courses.map(course => course.id);

//         // Calculate total earnings from purchases
//         const purchases = await prisma.purchase.findMany({
//             where: {
//                 courseId: { in: courseIds },
//                 status: 'completed',
//             },
//             select: {
//                 amount: true,
//             },
//         });

//         const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

//         // Collect enrolled students with course titles
//         const enrolledStudentsData = [];
//         courses.forEach(course => {
//             course.enrollments.forEach(enrollment => {
//                 enrolledStudentsData.push({
//                     courseTitle: course.courseTitle,
//                     studentName: enrollment.user.username,
//                     studentImage: enrollment.user.imageUrl,
//                 });
//             });
//         });

//         // Return aggregated data
//         return res.status(200).json({
//             success: true,
//             data: {
//                 totalCourses,
//                 totalEarnings,
//                 enrolledStudents: enrolledStudentsData,
//             },
//         });
//     } catch (error) {
//         console.error("Error fetching educator dashboard data:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message,
//         });
//     }
// };

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
        status: "completed",
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
    console.error("Error fetching enrollment data:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = {
  updateRoleToTeacher,
  addCourse,
  getTeacherCourse,
  teacherDashboardData,
  getEnrollmentStudentData,
};
