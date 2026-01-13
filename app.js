// The Phisherman

console.log("The Phisherman: app.js connected");

const emailFromEl = document.getElementById("email-from");
const emailSubjectEl = document.getElementById("email-subject");
const emailBodyEl = document.getElementById("email-body");

// Hardcoded email object
const email1 = {
  from: "IT Support <it-support@university-helpdesk.com>",
  subject: "Urgent: Password Expiry Notice",
  body: `
    <p>Hello,</p>
    <p>Your password will expire today. Please reset it immediately to avoid losing access.</p>
    <p><a href="#">Reset Password</a></p>
    <p>Regards,<br>IT Support</p>
  `
};

// Render function
function renderEmail(email) {
  emailFromEl.textContent = email.from;
  emailSubjectEl.textContent = email.subject;
  console.log(typeof email.body);  // Debugging line to check the type of email.body as its coming out weird

  emailBodyEl.textContent = email.body;
}

// Initial render
renderEmail(email1);