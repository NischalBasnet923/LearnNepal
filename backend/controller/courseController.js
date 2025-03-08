const prisma = require("../prismaClient");

//get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        enrollments: {
          select: {
            userId: true,
          },
        },
        teacher: {
          select: {
            id: true,
            username: true,
            email: true,
            imageUrl: true,
          },
        },
        ratings: {
          select: {
            id: true,
            userId: true,
            rating: true,
          },
        },
        chapters: {
          include: {
            lectures: {
              select: {
                duration: true,
              },
            },
          },
        },
      },
    });

    const coursesWithDuration = courses.map((course) => {
      let totalDuration = 0;

      course.chapters.forEach((chapter) => {
        chapter.lectures.forEach((lecture) => {
          totalDuration += parseInt(lecture.duration, 10);
        });
      });

      const { chapters, ...courseDataWithoutChapters } = course;

      return {
        ...courseDataWithoutChapters,
        totalDuration,
      };
    });

    return res.status(200).json({
      success: true,
      courses: coursesWithDuration,
    });
  } catch (error) {
    console.log("Error fetching all courses:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get course by id
const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const courseData = await prisma.course.findFirst({
      where: {
        id: id,
      },
      include: {
        teacher: {
          select: {
            id: true,
            username: true,
            email: true,
            imageUrl: true,
          },
        },
        chapters: {
          include: {
            lectures: true,
          },
        },
        ratings: {
          select: {
            id: true,
            userId: true,
            rating: true,
          },
        },
        enrollments: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Remove `lectureUrl` if `isPreviewFree` is false
    courseData.chapters.forEach((chapter) => {
      chapter.lectures.forEach((lecture) => {
        if (!lecture.isPreview) {
          lecture.contentUrl = ""; // Set `lectureUrl` to an empty string
        }
      });
    });

    return res.status(200).json({
      success: true,
      courseData,
    });
  } catch (error) {
    console.log("Error fetching course by ID:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const createCourse = async (req, res) => {
  try {
    const {courseTitle, category} = req.body;
    if(!courseTitle || !category){
      return res.status(400).json({success: false, message: "Please provide course title and category"});
    }

    const course = await prisma.course.create({
      data: {
        courseTitle: courseTitle,
        category: category,
        teacher: { connect: { id: req.user.id } } // If teacher is a relation
      }
    });
    
    
    return res.status(201).json({
      course,
      message:"course create"
    })
  } catch (error) {
    console.log("Error fetching course by ID:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { getAllCourses, getCourseById, createCourse};
