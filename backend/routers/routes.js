const express = require('express');
const router = express.Router();
const authenticationController = require('../controller/authenticationController');
const teacherController = require('../controller/teacherController');
const forgetpassword = require('../controller/forgetpassword');
const adminController = require('../controller/adminController');
const {
  authMiddleware,
  protectTeacher,
} = require('../middleware/authmiddleware');
const upload = require('../config/multer');
const courseController = require('../controller/courseController');
const userController = require('../controller/userController');
const paymentController = require('../controller/paymentController');
const {
  verifyTeacher,
  getExistingTeacherRequest,
} = require('../controller/verifyTeacher');
const getRequests = require('../controller/adminController');

const {
  sendRequest,
  getFriends,
  sendMessage,
  getMessage,
} = require('../controller/chatController');
const { recommend } = require('../controller/aiController');

// Authentication Routes
router.post('/register', authenticationController.register);
router.post('/login', authenticationController.signIn);
router.post('/logout', authenticationController.logout);
router.get('/verifytoken', authenticationController.verifyToken);
router.post('/requestotp', forgetpassword.requestOTP);
router.post('/resetpassword', forgetpassword.resetPassword);
router.post('/verifyotp', forgetpassword.verifyOTP);

// 🔹 Teacher Routes
router.put(
  '/updateRole',
  authMiddleware(),
  teacherController.updateRoleToTeacher
);
router.post(
  '/add-course',
  authMiddleware(),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'videos', maxCount: 50 },
  ]),
  teacherController.addCourse
);
router.get('/courses', authMiddleware(), teacherController.getTeacherCourse);
router.get(
  '/dashboard',
  authMiddleware(),
  teacherController.teacherDashboardData
);
router.get(
  '/enrolled-students',
  authMiddleware(),
  teacherController.getEnrollmentStudentData
);
router.put(
  '/updateCourse/:courseId',
  authMiddleware(),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'videos', maxCount: 50 },
  ]),
  teacherController.updateCourse
);
router.get('/getReport', authMiddleware(), teacherController.getTeacherReport);
// Course Routes
router.get('/course/all', courseController.getAllCourses);
router.get('/course/:id', courseController.getCourseById);

// User Routes
router.get('/user', authMiddleware(), userController.getUserData);
router.get(
  '/user/enrolledCourses',
  authMiddleware(),
  userController.getUserEnrolledCourses
);
router.post('/user/purchase', authMiddleware(), userController.purchaseCourse);
router.post(
  '/user/get-course-progress',
  authMiddleware(),
  userController.getUserCourseProgress
);
router.post(
  '/user/update-course-progress',
  authMiddleware(),
  userController.updateUserCourseProgress
);
router.post(
  '/user/add-rating',
  authMiddleware(),
  userController.addUserRatingToCourse
);

router.get(
  '/user/getRequests',
  authMiddleware(),
  userController.getRequestsTeacher
);

// 🔹 Khalti Payment Routes
router.post(
  '/purchase-course/khalti',
  authMiddleware(),
  paymentController.purchaseCourseKhalti
);

router.get('/complete-khalti-payment', paymentController.completeKhaltiPayment);
router.post(
  '/khalti-payment-failed',
  paymentController.handleKhaltiPaymentFailure
);

// verify Teacher
router.get('/teacher-request', authMiddleware(), getExistingTeacherRequest);
router.post(
  '/verify-teacher',
  upload.fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
  ]),
  authMiddleware(),
  verifyTeacher
);
router.post('/addPrefs', courseController.coursePrefs);

// admin routes
router.get('/getRequest', authMiddleware(), adminController.getRequests);
router.put('/approveTeacher', authMiddleware(), adminController.approveTeacher);
router.put('/declineTeacher', authMiddleware(), adminController.declineTeacher);
router.post('/addCategory', authMiddleware(), adminController.category);
router.get('/getCategory', authMiddleware(), adminController.getCategory);

router.get('/chat/getFriends', authMiddleware(), getFriends);
router.post('/chat/sendMessage', authMiddleware(), sendMessage);
router.post('/chat/getMessage', authMiddleware(), getMessage);

router.get('/ai/recommand', authMiddleware(), recommend);
module.exports = router;
