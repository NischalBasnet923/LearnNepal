const {
  initializeKhaltiPayment,
  verifyKhaltiPayment,
} = require("./khaltiController");
const prisma = require("../prismaClient");

// Purchase Course using Khalti
const purchaseCourseKhalti = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Fetch user and course data
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!user || !course) {
      return res
        .status(404)
        .json({ success: false, message: "User or course not found" });
    }

    // Calculate final price after discount
    const discountedPrice = (
      course.coursePrice -
      (course.discount * course.coursePrice) / 100
    ).toFixed(2);

    // Create purchase record in database
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        courseId,
        amount: parseFloat(discountedPrice),
        status: "pending",
        paymentMethod: "khalti",
      },
    });

    // Initialize Khalti Payment
    const paymentResponse = await initializeKhaltiPayment({
      return_url: `${process.env.BACKEND_URI}/api/complete-khalti-payment`,
      website_url: "http://localhost:5173/course-list",
      amount: parseFloat(discountedPrice), // Convert NPR to paisa
      purchase_order_id: purchase.id,
      purchase_order_name: course.courseTitle,
    });

    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      payment_url: paymentResponse.payment_url, // Redirect user to this link
    });
  } catch (error) {
    console.error("Error purchasing course:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// Verify Khalti Payment
const completeKhaltiPayment = async (req, res) => {
  try {
    const { pidx, transaction_id, amount, purchase_order_id } = req.query;

    // Verify payment with Khalti API
    const paymentInfo = await verifyKhaltiPayment(pidx);

    if (
      paymentInfo?.status !== "Completed" ||
      paymentInfo.transaction_id !== transaction_id ||
      Number(paymentInfo.total_amount) !== Number(amount)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid payment details",
          paymentInfo,
        });
    }

    // Retrieve purchase record
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchase_order_id },
    });

    if (!purchase) {
      return res
        .status(400)
        .json({ success: false, message: "Purchase record not found" });
    }

    // Update purchase status to "completed"
    await prisma.purchase.update({
      where: { id: purchase_order_id },
      data: { status: "completed", pidx, transactionId: transaction_id },
    });

    // Enroll user in the course
    await prisma.enrollment.create({
      data: {
        userId: purchase.userId,
        courseId: purchase.courseId,
      },
    });
    return res.redirect(`http://localhost:5173`);
  } catch (error) {
    console.error("Error verifying Khalti payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Handle Payment Failure
const handleKhaltiPaymentFailure = async (req, res) => {
  try {
    const { purchase_order_id } = req.body;

    // Update the purchase status to "failed"
    await prisma.purchase.update({
      where: { id: purchase_order_id },
      data: { status: "failed" },
    });

    res.json({ success: true, message: "Payment marked as failed." });
  } catch (error) {
    console.error("Error handling failed payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  purchaseCourseKhalti,
  completeKhaltiPayment,
  handleKhaltiPaymentFailure,
};
[];
