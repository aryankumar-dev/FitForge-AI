const wrapper = (title, bodyHtml) => `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
    <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 20px 24px; border-radius: 8px 8px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px;">FitForge AI</h1>
    </div>
    <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
      <h2 style="margin-top: 0; font-size: 18px; color: #111827;">${title}</h2>
      ${bodyHtml}
      <p style="margin-top: 32px; font-size: 12px; color: #9ca3af;">
        This is an automated message from FitForge AI. Please do not reply directly to this email.
      </p>
    </div>
  </div>
`;

export const welcomeUser = (user) => ({
  subject: "Welcome to FitForge AI!",
  html: wrapper(
    `Welcome aboard, ${user.name}!`,
    `<p>Thanks for joining <strong>FitForge AI</strong>. Your account has been created successfully as a <strong>user</strong>.</p>
     <p>You can now log in, set up your health profile, get a personalized calorie target, diet plan, workout plan, and chat with our AI health assistant.</p>
     <p>Let's crush those fitness goals!</p>`
  ),
});

export const welcomeTrainer = (trainer) => ({
  subject: "Welcome to FitForge AI - Trainer Account Created",
  html: wrapper(
    `Welcome, Coach ${trainer.name}!`,
    `<p>Your <strong>trainer</strong> account on FitForge AI has been created successfully.</p>
     <p>Clients will soon be able to discover your profile and send you hire requests. Make sure to keep your specialization and bio up to date.</p>
     <p>We're excited to have you on the team!</p>`
  ),
});

export const hireRequestToTrainer = (user, trainer, message) => ({
  subject: `New Hire Request from ${user.name}`,
  html: wrapper(
    `You have a new hire request!`,
    `<p>Hi ${trainer.name},</p>
     <p><strong>${user.name}</strong> (${user.email}) would like to hire you as their trainer.</p>
     ${message ? `<p style="background:#f3f4f6;padding:12px;border-radius:6px;"><em>"${message}"</em></p>` : ""}
     <p>Please log in to your FitForge AI dashboard to accept or reject this request.</p>`
  ),
});

export const hireRequestConfirmationToUser = (user, trainer) => ({
  subject: `Hire Request Sent to ${trainer.name}`,
  html: wrapper(
    `Your hire request has been sent!`,
    `<p>Hi ${user.name},</p>
     <p>Your request to hire <strong>${trainer.name}</strong> as your trainer has been sent successfully.</p>
     <p>You'll receive another email once the trainer responds to your request.</p>`
  ),
});

export const hireStatusToUser = (user, trainer, status) => ({
  subject: `Your Hire Request was ${status === "accepted" ? "Accepted" : "Rejected"}`,
  html: wrapper(
    `Hire request update`,
    `<p>Hi ${user.name},</p>
     <p><strong>${trainer.name}</strong> has <strong>${status}</strong> your hire request.</p>
     ${
       status === "accepted"
         ? "<p>Congratulations! You can now coordinate with your trainer to start your fitness journey.</p>"
         : "<p>Don't worry, you can browse and reach out to other trainers on FitForge AI.</p>"
     }`
  ),
});

export const hireStatusToTrainer = (user, trainer, status) => ({
  subject: `You ${status === "accepted" ? "Accepted" : "Rejected"} a Hire Request`,
  html: wrapper(
    `Hire request update confirmation`,
    `<p>Hi ${trainer.name},</p>
     <p>You have <strong>${status}</strong> the hire request from <strong>${user.name}</strong> (${user.email}).</p>`
  ),
});
