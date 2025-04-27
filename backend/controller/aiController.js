const { PrismaClient } = require('@prisma/client');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const prisma = new PrismaClient();
const axios = require('axios');

async function exportRatings() {
  const ratings = await prisma.courseRating.findMany({
    select: {
      userId: true,
      courseId: true,
      rating: true,
    },
  });

  const csvWriter = createCsvWriter({
    path: '../recommender-env/ratings.csv',
    header: [
      { id: 'userId', title: 'user_id' },
      { id: 'courseId', title: 'course_id' },
      { id: 'rating', title: 'rating' },
    ],
  });

  await csvWriter.writeRecords(ratings);
  console.log('✅ ratings.csv written');
}

async function exportPrefs() {
  const prefs = await prisma.userPrefs.findMany({
    select: {
      userId: true,
      categoryId: true,
    },
  });

  const csvWriter = createCsvWriter({
    path: '../recommender-env/prefs.csv',
    header: [
      { id: 'userId', title: 'user_id' },
      { id: 'categoryId', title: 'category_id' },
    ],
  });

  await csvWriter.writeRecords(prefs);
  console.log('✅ prefs.csv written');
}

async function exportCourses() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      courseTitle: true,
      categoryId: true,
    },
  });

  const formattedCourses = courses.map((course) => ({
    course_id: course.id,
    course_title: course.courseTitle,
    category_id: course.categoryId,
  }));

  const csvWriter = createCsvWriter({
    path: '../recommender-env/courses.csv',
    header: [
      { id: 'course_id', title: 'course_id' },
      { id: 'course_title', title: 'course_title' },
      { id: 'category_id', title: 'category_id' },
    ],
  });

  await csvWriter.writeRecords(formattedCourses);
  console.log('✅ courses.csv written');
}

async function run() {
  await exportRatings();
  await exportPrefs();
  await exportCourses();
  await prisma.$disconnect();
}

const recommend = async (req, res) => {
  try {
    console.log('req.user =>', req.user);

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    const user_id = req.user.id;

    const response = await axios.post(
      'http://127.0.0.1:5001/recommend',
      { user_id },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const courseIds = response.data.recommended.map(
      (course) => course.course_id
    );

    const courseData = await prisma.course.findMany({
      where: {
        id: {
          in: courseIds,
        },
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

    res.status(200).json({ recommendedCourses: courseData });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  run,
  recommend,
};
