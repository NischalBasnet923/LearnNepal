const prisma = require("../prismaClient");
const Stripe = require("stripe");

// Get user data
const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        enrollments: {
          select: {
            courseId: true,
          },
        },
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error fetching user data:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get user enrolled courses
const getUserEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                courseTitle: true,
                isPublished: true,
              },
            },
          },
        },
      },
    });

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User or enrollments not found" });
    }

    return res.status(200).json({
      success: true,
      enrolledCourses: userData.enrollments.map(
        (enrollment) => enrollment.course
      ),
    });
  } catch (error) {
    console.log("Error fetching user enrollments:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Purchase a course
const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.user.id;

    console.log(courseId);

    // Fetch user and course data
    const userData = await prisma.user.findFirst({ where: { id: userId } });
    const courseData = await prisma.course.findFirst({
      where: { id: courseId },
    });
    console.log(courseData);
    if (!userData || !courseData) {
      return res
        .status(404)
        .json({ success: false, message: "User or course not found" });
    }

    // Calculate discounted price
    const discountedPrice = (
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100
    ).toFixed(2);

    // Create a purchase record
    const purchaseData = {
      courseId: courseData.id,
      userId: userId,
      amount: parseFloat(discountedPrice), // Convert to float
      status: "pending", // Set the initial status as pending
    };

    const newPurchase = await prisma.purchase.create({ data: purchaseData });

    // Initialize Stripe
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    // Create line items for Stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items,
      mode: "payment",
      metadata: { purchaseId: newPurchase.id.toString() },
    });

    // Send the session ID back to the frontend
    res.status(200).json({
      success: true,
      message: "Course purchased successfully",
      session_url: session.url,
    });
  } catch (error) {
    console.log("Error during course purchase:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update User Course Progress
const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;

    // Check if progress data exists for the user and course
    let courseProgress = await prisma.courseProgress.findFirst({
      where: { userId, courseId },
      include: { completedLectures: true },
    });

    if (courseProgress) {
      // Check if the lecture is already marked as completed
      const lectureAlreadyCompleted = courseProgress.completedLectures.some(
        (lecture) => lecture.lectureId === lectureId
      );

      if (lectureAlreadyCompleted) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }

      // Add the lecture to completed lectures
      await prisma.completedLecture.create({
        data: {
          courseProgressId: courseProgress.id,
          lectureId,
        },
      });
    } else {
      // Create a new course progress record if none exists
      courseProgress = await prisma.courseProgress.create({
        data: {
          userId,
          courseId,
          completedLectures: {
            create: [{ lectureId }],
          },
        },
        include: { completedLectures: true },
      });
    }

    return res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    console.error("Error updating course progress:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get User Course Progress

const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming the authenticated user ID is in req.auth
    const { courseId } = req.body;

    // Fetch the course progress for the user and course
    const progressData = await prisma.courseProgress.findFirst({
      where: {
        userId,
        courseId,
      },
      include: {
        completedLectures: true,
      },
    });

    if (!progressData) {
      return res.status(404).json({
        success: false,
        message: "Progress data not found for the specified course.",
      });
    }

    res.status(200).json({ success: true, progressData });
  } catch (error) {
    console.error("Error fetching course progress:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//add user Rating to course
const addUserRatingToCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, rating, comment } = req.body;
    console.log(req.body);
    if (!courseId || !rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid rating details" });
    }

    // Check if the course exists
    const course = await prisma.course.findFirst({
      where: { id: courseId },
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    console.log(userId, courseId);
    // Check if the user is enrolled in the course
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: userId, courseId: courseId },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ success: false, message: "User not enrolled in the course" });
    }

    // Check if the user has already rated this course
    const existingRating = await prisma.courseRating.findFirst({
      where: { userId: userId, courseId: courseId },
    });

    if (existingRating) {
      // Update existing rating
      await prisma.courseRating.update({
        where: { id: existingRating.id },
        data: { rating, comment },
      });

      return res
        .status(200)
        .json({ success: true, message: "Rating updated successfully" });
    } else {
      // Add new rating
      await prisma.courseRating.create({
        data: {
          userId,
          courseId,
          rating,
          comment,
        },
      });

      return res
        .status(201)
        .json({ success: true, message: "Rating added successfully" });
    }
  } catch (error) {
    console.error("Error adding/updating course rating:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  getUserData,
  getUserEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRatingToCourse,
};
