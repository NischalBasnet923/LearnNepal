import Teacher from "../pages/teacher/Teacher";

export const dummyTeacherData = {
  id: "67qnbusfnuetrnmsdfhu242d",
  name: "Ramesh Chauhan",
  profile:
    "https://img.freepik.com/free-vector/teacher-avatar-concept-illustration_114360-174.jpg?w=2000",
  email: "7nDm8@example.com",
  created_at: "2023-08-15T12:34:56Z",
  updated_at: "2023-08-15T12:34:56Z",
  "-v": 0,
};

export const dummyTestimonialData = [
  {
    name: "Subin Rai",
    image:
      "https://img.freepik.com/free-vector/student-avatar-concept-illustration_114360-174.jpg?w=2000",
    role: "Student",
    rating: 5,
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin consectetur varius ligula, sit amet gravida diam dapibus et. Quisque imperdiet.",
  },
  {
    name: "Rabin Rai",
    image:
      "https://img.freepik.com/free-vector/student-avatar-concept-illustration_114360-174.jpg?w=2000",
    role: "Technical Assistant",
    rating: 4.5,
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin consectetur varius ligula, sit amet gravida diam dapibus et. Quisque imperdiet.",
  },
  {
    name: "Subin Rai",
    image:
      "https://img.freepik.com/free-vector/student-avatar-concept-illustration_114360-174.jpg?w=2000",
    role: "Student",
    rating: 5,
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin consectetur varius ligula, sit amet gravida diam dapibus et. Quisque imperdiet.",
  },
];

export const dummyDashboardData = {
  totalEarnings: 707.07,
  enrolledStudentData: [
    {
      courseTitle: "Flutter Development",
      student: {
        _id: "user_237hsdfuy35bndvuh",
        name: "Rupendra Tegor",
        imageUrl:
          "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5 jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ycVFsdmFMSkw3ck IXNHZMU204ZURWNEtmR2IifQ",
      },
    },
    {
      courseTitle: "Flutter Development",
      student: {
        _id: "user_237hsdfuy35bndvuh",
        name: "Rupendra Tegor",
        imageUrl:
          "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5 jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ycVFsdmFMSkw3ck IXNHZMU204ZURWNEtmR2IifQ",
      },
    },
    {
      courseTitle: "Java Development",
      student: {
        _id: "user_237hsdfuy35bndvuh",
        name: "Rupendra Tegor",
        imageUrl:
          "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5 jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ycVFsdmFMSkw3ck IXNHZMU204ZURWNEtmR2IifQ",
      },
    },
  ],
  totalCourses: 9,
};

export const dummyStudentEnrolled = [
  {
    student: {
      _id: "user_236hsdfuy35bndvuh",
      name: "Rupendra Tegor",
      imageUrl:
        "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiwLjzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ycVFsdmFMSkw3ckIXNHZMU204ZURWNEtmR2IifQ",
    },
    courseTitle: "Flutter Development",
    purchaseDate: "2023-08-15T12:34:56Z",
  },
  {
    student: {
      _id: "user_237hsdfuy35bndvuh",
      name: "Rupendra Tegor",
      imageUrl:
        "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiwLjzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ycVFsdmFMSkw3ckIXNHZMU204ZURWNEtmR2IifQ",
    },
    courseTitle: "Flutter Development",
    purchaseDate: "2023-08-15T12:34:56Z",
  },
  {
    student: {
      _id: "user_237hsdfuy35bndvuh",
      name: "Rupendra Tegor",
      imageUrl:
        "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiwLjzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ycVFsdmFMSkw3ckIXNHZMU204ZURWNEtmR2IifQ",
    },
    courseTitle: "Java Development",
    purchaseDate: "2023-08-15T12:34:56Z",
  },
];

const dummyCourses = [
  {
    id: "cm7xi6dp30000gsp41swiykua",
    courseTitle: "Java Development",
    courseDescription:
      "<h2>Java Development</h2><p>Java Development is the most popular programming language for software development.</p><ul><li>Understand the basics of Java</li><li>Learn how to build a Java app</li></ul><h2>Java Development</h2><p>Java Development is the most popular programming language for software development.</p><ul><li>Understand the basics of Java</li><li>Learn how to build a Java app</li></ul>",
    courseThumbnail:
      "https://res.cloudinary.com/diag9maev/image/upload/v1741275000/cfncw6f9vrhee1c33nnu.png",
    coursePrice: 50,
    isPublished: true,
    discount: 10,
    createdAt: "2025-03-06T15:30:00.996Z",
    updatedAt: "2025-03-06T15:30:00.996Z",
    teacherId: "cm70kth5z0000gsjli4xpg6mc",
    enrollments: [],
    teacher: {
      id: "cm70kth5z0000gsjli4xpg6mc",
      username: "Rabin Rai",
      email: "test@gmail.com",
      password: "$2b$15$Fo3t8US/l9JECTC0VZQ8iu12P31BWuG.4BmQAfItlVG2gXDKOUS2O",
      imageUrl: null,
      enrolledCourses: 0,
      createdAt: "2025-02-11T14:27:34.055Z",
      updatedAt: "2025-02-11T14:27:34.055Z",
      role: "student",
    },
    chapters: [
      {
        id: "cm7xi6dp40001gsp46t5t60nq",
        chapterOrder: 1,
        chapterTitle: "Test Chapter Title",
        courseId: "cm7xi6dp30000gsp41swiykua",
        lectures: [
          {
            id: "cm7xi6dp50002gsp49u7pyxzl",
            title: "Introduction to Programming",
            contentUrl: "https://example.com/lectures/intro.mp4",
            duration: 10,
            leactureOrder: 1,
            isPreview: true,
            chapterId: "cm7xi6dp40001gsp46t5t60nq",
            createdAt: "2025-03-06T15:30:00.996Z",
          },
          {
            id: "cm7xi6dp50003gsp4vhbvgjem",
            title: "Variables and Data Types",
            contentUrl: "https://example.com/lectures/variables.mp4",
            duration: 13,
            leactureOrder: 2,
            isPreview: false,
            chapterId: "cm7xi6dp40001gsp46t5t60nq",
            createdAt: "2025-03-06T15:30:00.996Z",
          },
          {
            id: "cm7xi6dp50004gsp4i4a9olmb",
            title: "Control Flow Statements",
            contentUrl: "https://example.com/lectures/control-flow.mp4",
            duration: 25,
            leactureOrder: 3,
            isPreview: true,
            chapterId: "cm7xi6dp40001gsp46t5t60nq",
            createdAt: "2025-03-06T15:30:00.996Z",
          },
        ],
      },
    ],
  },
];

export default dummyCourses;
