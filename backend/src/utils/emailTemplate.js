function verificationEmailTemplate(code) {
  return `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
      color: #2c3e50;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    ">
      <h2 style="
        color: #1a73e8;
        margin-top: 0;
        font-size: 24px;
        border-bottom: 2px solid #1a73e8;
        padding-bottom: 10px;
      ">
        Talkify Email Verification
      </h2>

      <p style="font-size: 16px; line-height: 1.6;">Hi,</p>
      <p style="font-size: 16px; line-height: 1.6;">
        Thank you for signing up! Use the following verification code to complete your registration:
      </p>

      <div style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #1a73e8;
        background-color: #f0f4ff;
        padding: 20px 30px;
        text-align: center;
        border-radius: 8px;
        margin: 20px 0;
        border: 1px dashed #1a73e8;
      ">
        ${code}
      </div>

      <p style="font-size: 14px; color: #666; line-height: 1.5;">
        This code is valid for 10 minutes. If you did not sign up for Talkify, please disregard this email.
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <p style="font-size: 12px; color: #aaa; text-align: center;">
        &copy; ${new Date().getFullYear()} Talkify. All rights reserved.
      </p>
    </div>
  `;
}

module.exports = {
  verificationEmailTemplate,
};

