// The Phisherman

console.log("The Phisherman: app.js connected");

// DOM elements
const emailFromEl = document.getElementById("email-from");
const emailSubjectEl = document.getElementById("email-subject");
const emailBodyEl = document.getElementById("email-body");

// interaction bits 
const legitBtn = document.getElementById("btn-legit");
const phishBtn = document.getElementById("btn-phish");
const nextEmailBtn = document.getElementById("btn-next-email"); // future use
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");

// Score tracking
let score = 0;

// Hardcoded email objects will be here, for now just one email
const email1 = {
  from: "IT Support <it-support@university-helpdesk.com>",
  subject: "Urgent: Password Expiry Notice",
  body: `
    <p>Hello,</p>
    <p>Your password will expire today. Please reset it immediately to avoid losing access.</p>
    <p><a href="#">Reset Password</a></p>
    <p>Regards,<br>IT Support</p>
  `,    
  isPhishing: true    //will test this, if it works i'll change for future emails too
};

// Render function
function renderEmail(email) {
  emailFromEl.textContent = email.from;
  emailSubjectEl.textContent = email.subject;
  emailBodyEl.innerHTML = email.body;   // Using innerHTML to render HTML content

}

// Initial render
renderEmail(email1);

// button click handlers - for now, both will just increase the score, we'll work on logic later
legitBtn.addEventListener("click", function () {
  if (email1.isPhishing === false) {
    feedbackMessageEl.textContent = "Correct! This email is legitimate.";
    score++;
  } else {
    feedbackMessageEl.textContent = "Incorrect. This email shows signs of phishing.";
  }

  scoreEl.textContent = score;
});

phishBtn.addEventListener("click", function () {
  if (email1.isPhishing === true) {
    feedbackMessageEl.textContent = "Correct! This email is a phishing attempt.";
    score++;
  } else {
    feedbackMessageEl.textContent = "Incorrect. This email appears to be legitimate.";
  }

  scoreEl.textContent = score;
});

