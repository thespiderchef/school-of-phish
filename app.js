// The Phisherman

console.log("The Phisherman: app.js connected");

// DOM elements
const emailFromEl = document.getElementById("email-from");
const emailSubjectEl = document.getElementById("email-subject");
const emailBodyEl = document.getElementById("email-body");

// interaction bits 
const legitBtn = document.getElementById("btn-legit");
const phishBtn = document.getElementById("btn-phish");
const nextBtn = document.getElementById("btn-next"); // future use
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");



// Score tracking
let score = 0;
let currentEmailIndex = 0;

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
  isPhishing: true, 
  explanation: "Creates urgency, uses a suspicious domain, and includes a link to reset the password."
};
const email2 = {
  from: "University IT Services <itservices@plymouth.ac.uk>",
  subject: "Scheduled Maintenance This Weekend",
  body: `
    <p>Hello,</p>
    <p>Please be aware that scheduled maintenance will take place this Saturday between 22:00 and 02:00.</p>
    <p>During this time, access to some systems may be intermittent.</p>
    <p>Kind regards,<br>PlymouthUniversity IT Services</p>
  `,
  isPhishing: false,
  explanation: "Uses an official domain, provides advance notice, and does not request personal information."
};
const email3 = {
  from: "Parcel Service <delivery-update@parcel-tracking.co>",
  subject: "Delivery Failed – Action Required",
  body: `
    <p>We were unable to deliver your parcel due to an address issue.</p>
    <p>Please confirm your details to reschedule delivery.</p>
    <p><a href="#">Confirm Delivery</a></p>
  `,
  isPhishing: true,
  explanation: "Creates urgency and uses a vague sender domain with a suspicious link."
};
const email4 = {
  from: "Security Team <security@account-alerts.com>",
  subject: "Unusual Login Attempt Detected",
  body: `
    <p>We detected an unusual login attempt on your account.</p>
    <p>If this was not you, please secure your account immediately.</p>
    <p><a href="#">Secure Account</a></p>
  `,
  isPhishing: true,
  explanation: "Generic greeting, pressure tactics, and non-official sender domain."
};

const email5 = {
  from: "University Library <library@plymouth.ac.uk>",
  subject: "Library Book Due Reminder",
  body: `
    <p>Hello,</p>
    <p>This is a reminder that one or more of your borrowed library books are due in three days.</p>
    <p>You can renew your books through the library portal.</p>
    <p>Thank you,<br>University Library</p>
  `,
  isPhishing: false,
  explanation: "No links demanding action and references an existing service the user already uses."
};
const email6 = {
  from: "Accounts Department <billing@payment-secure.net>",
  subject: "Outstanding Balance – Immediate Payment Required",
  body: `
    <p>Your account shows an outstanding balance.</p>
    <p>Failure to pay within 24 hours will result in deletion of account.</p>
    <p><a href="#">Make Payment</a></p>
  `,
  isPhishing: true,
  explanation: "Threatening language, short deadline, and generic sender identity."
};
const email7 = {
  from: "Prince Adewale <royal.funds.transfer@gmail.com>",
  subject: "URGENT BUSINESS PROPOSAL – CONFIDENTIAL",
  body: `
    <p>Dear Beloved Friend,</p>
    <p>I am Prince Adewale, son of the late Minister of Finance.</p>
    <p>I have the sum of <strong>$15,000,000 USD</strong> that I wish to transfer into your account.</p>
    <p>You have been selected due to your honesty and trustworthiness.</p>
    <p>Please reply urgently with your full name, address, and bank details.</p>
    <p>God bless you,<br>Prince Adewale</p>
  `,
  isPhishing: true,
  explanation: "Classic advance-fee scam using unrealistic promises, poor grammar, and requests for bank details."
};
const email8 = {
  from: "International Lottery <winnings@global-lotto-win.biz>",
  subject: "CONGRATULATIONS! YOU HAVE WON £1,250,000",
  body: `
    <p>Congratulations!</p>
    <p>Your email address has been randomly selected as the winner of our international lottery.</p>
    <p>You have won <strong>£1,250,000</strong>.</p>
    <p>To claim your prize, please reply with your personal details and a processing fee of £250.</p>
    <p>Act fast to avoid forfeiting your winnings!</p>
  `,
  isPhishing: true,
  explanation: "Unsolicited winnings, pressure to act quickly, and request for a processing fee are strong scam indicators."
};

//email array
const emails = [
  email1,
  email2,
  email3,
  email4,
  email5,
  email6,
  email7,
  email8
];

// Render function
function renderEmail(email) {
  emailFromEl.textContent = email.from;
  emailSubjectEl.textContent = email.subject;
  emailBodyEl.innerHTML = email.body;   // Using innerHTML to render HTML content

}

// Initial render
renderEmail(emails[currentEmailIndex]);

// button click handlers - for now, both will just increase the score, we'll work on logic later
legitBtn.addEventListener("click", function () {
  if (emails[currentEmailIndex].isPhishing === false) {
    feedbackEl.textContent = "Correct! This email is legitimate.";
    score++;
  } else {
    feedbackEl.textContent = "Incorrect. This email shows signs of phishing.";
  }

  scoreEl.textContent = score;
});

phishBtn.addEventListener("click", function () {
  if (emails[currentEmailIndex].isPhishing === true) {
    feedbackEl.textContent = "Correct! This email is a phishing attempt.";
    score++;
  } else {
    feedbackEl.textContent = "Incorrect. This email appears to be legitimate.";
  }

  scoreEl.textContent = score;
});

nextBtn.addEventListener("click", function () {
  currentEmailIndex++;
  if (currentEmailIndex >= emails.length) {
    currentEmailIndex = 0; // Loop back to the first email
  } 
  renderEmail(emails[currentEmailIndex]);
  feedbackEl.textContent = "Make your choice above to see if you're correct!";
});

