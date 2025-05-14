const courseEnrollmentTemplate = (username, courseTitle) => {
  return {
    subject: '🎉 Welcome to LearnNepal - Course Enrollment Successful!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #4CAF50;">Hello ${username},</h2>
        <p>Congratulations! 🎓 You have successfully enrolled in the course:</p>
        <h3 style="color: #333;">${courseTitle}</h3>
        <p>We're thrilled to have you on board at <strong>LearnNepal</strong>. Your learning journey starts now!</p>
        <hr />
        <p>If you have any questions or need support, feel free to reach out to us anytime.</p>
        <p style="margin-top: 30px;">Happy Learning!<br />The LearnNepal Team</p>
      </div>
    `,
  };
};

module.exports = courseEnrollmentTemplate;
