// The School of Phish - Interactive Phishing Email Training App

console.log("The School of Phish app.js connected");

// DOM elements
const emailFromEl = document.getElementById("email-from");
const emailSubjectEl = document.getElementById("email-subject");
const emailBodyEl = document.getElementById("email-body");

// theme toggle - i want it dark mode by default, so the toggle will just add a light class to switch it to light mode
const body = document.body;
const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", function() {
  body.classList.toggle("light");
});

// function to handle sidebar links
const navLinks = document.querySelectorAll(".nav-link");
const views = document.querySelectorAll(".view");

navLinks.forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();

    // remove active from all views and links
    views.forEach(v => v.classList.remove("active"));
    navLinks.forEach(l => l.classList.remove("active"));

    // activate the clicked one
    const target = this.dataset.view;
    document.getElementById("view-" + target).classList.add("active");
    this.classList.add("active");
  });
});

// helper function for sneaky links
function handlePhishingLink(displayedUrl, realUrl) {
  feedbackEl.textContent = `Careful! That link said "${displayedUrl}" but would have taken you to "${realUrl}" - a classic phishing trick.`;
}

// interaction bits
const legitBtn = document.getElementById("btn-legit");
const phishBtn = document.getElementById("btn-phish");
const nextBtn = document.getElementById("btn-next");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const actionsEl = document.getElementById("actions");

// Username input - captures the user's name before training begins.
// The name is stored in userName and used to personalise email bodies and the end screen,
// making the training more realistic and demonstrating input/output functionality.
let userName = "";

const nameScreen = document.getElementById("name-screen");
const trainingContent = document.getElementById("training-content");
const startBtn = document.getElementById("btn-start");
const usernameInput = document.getElementById("username-input");

startBtn.addEventListener("click", function () {
  const entered = usernameInput.value.trim();
  userName = entered !== "" ? entered : "there";
  nameScreen.style.display = "none";
  trainingContent.style.display = "";
  renderEmail(emails[currentEmailIndex]);
});

// Allow Enter key to submit name and start training
usernameInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") startBtn.click();
});

// Score tracking
let score = 0;
let currentEmailIndex = 0;

// Hardcoded email objects - each with from, subject, body, isPhishing boolean, and explanation for educational feedback.
// Body is defined as an arrow function so that userName is evaluated at render time,
// after the user has entered their name on the name screen, rather than at definition time.
const email1 = {
  from: "IT Support <it-support@university-helpdesk.com>",
  subject: "Urgent: Password Expiry Notice",
  body: () => `
    <p>Hello ${userName},</p>
    <p>Your password will expire today. Please reset it immediately to avoid losing access.</p>
    <p><a href="university-helpdesk.com/harvest-credentials" onclick="handlePhishingLink('students.plymouth.ac.uk/reset-password', 'university-helpdesk.com/harvest-credentials'); return false;">Reset Password</a></p>
    <p>Regards,<br>IT Support</p>
  `,
  isPhishing: true,
  explanation: "Creates urgency, uses a suspicious domain, and includes a link to reset the password."
};

const email2 = {
  from: "University IT Services <itservices@plymouth.ac.uk>",
  subject: "Scheduled Maintenance This Weekend",
  body: () => `
    <p>Hello ${userName},</p>
    <p>Please be aware that scheduled maintenance will take place this Saturday between 22:00 and 02:00.</p>
    <p>During this time, access to some systems may be intermittent.</p>
    <p>You can check live system status at any time on the <a href="https://status.plymouth.ac.uk">IT Status Page</a>.</p>
    <p>Kind regards,<br>Plymouth University IT Services</p>
  `,
  isPhishing: false,
  explanation: "Uses an official domain, provides advance notice, links to an official university status page, and does not request any personal information."
};

const email3 = {
  from: "Parcel Service <delivery-update@parcel-tracking.co>",
  subject: "Delivery Failed - Action Required",
  body: () => `
    <p>We were unable to deliver your parcel due to an address issue.</p>
    <p>Please confirm your details to reschedule delivery.</p>
    <p><a href="parcel-tracking.co/steal-details" onclick="handlePhishingLink('royalmail.com/redeliver', 'parcel-tracking.co/steal-details'); return false;">Confirm Delivery</a></p>
  `,
  isPhishing: true,
  explanation: "Creates urgency and uses a vague sender domain with a suspicious link."
};

const email4 = {
  from: "Security Team <security@account-alerts.com>",
  subject: "Unusual Login Attempt Detected",
  body: () => `
    <p>We detected an unusual login attempt on your account.</p>
    <p>If this was not you, please secure your account immediately.</p>
    <p><a href="account-alerts.com/steal-credentials" onclick="handlePhishingLink('myaccount.google.com/security', 'account-alerts.com/steal-credentials'); return false;">Secure Account</a></p>
  `,
  isPhishing: true,
  explanation: "Generic greeting, pressure tactics, and non-official sender domain."
};

const email5 = {
  from: "University Library <library@plymouth.ac.uk>",
  subject: "Library Book Due Reminder",
  body: () => `
    <p>Hello ${userName},</p>
    <p>This is a reminder that one or more of your borrowed library books are due in three days.</p>
    <p>You can renew your books through the library portal.</p>
    <p>Thank you,<br>University Library</p>
  `,
  isPhishing: false,
  explanation: "No links demanding action and references an existing service the user already uses."
};

const email6 = {
  from: "Accounts Department <billing@payment-secure.net>",
  subject: "Outstanding Balance - Immediate Payment Required",
  body: () => `
    <p>Your account shows an outstanding balance.</p>
    <p>Failure to pay within 24 hours will result in deletion of account.</p>
    <p><a href="payment-secure.net/steal-card-details" onclick="handlePhishingLink('secure-payments.com/pay-now', 'payment-secure.net/steal-card-details'); return false;">Make Payment</a></p>
  `,
  isPhishing: true,
  explanation: "Threatening language, short deadline, and generic sender identity."
};

const email7 = {
  from: "Dr. Emmanuel Osei <e.osei.legal@gmail.com>",
  subject: "Confidential Legal Matter Requiring Your Assistance",
  body: () => `
    <p>Dear Friend,</p>
    <p>I am a solicitor based in Accra, Ghana. My late client, who shares your surname, passed away intestate leaving an estate valued at $4,200,000 USD.</p>
    <p>As no next of kin has been located, I am seeking a foreign partner to assist with the legal transfer of these funds. You will receive 35% as compensation.</p>
    <p>This matter is strictly confidential. Please respond with your full name and contact details.</p>
    <p>Yours faithfully,<br>Dr. Emmanuel Osei</p>
  `,
  isPhishing: true,
  explanation: "Classic advance-fee fraud; uses a professional title and legal framing to appear credible. Requests personal details and promises an unrealistic financial reward for no legitimate reason."
};

const email8 = {
  from: "HMRC <tax-refund@hmrc-refunds.co.uk>",
  subject: "You Are Entitled to a Tax Refund of £342.50",
  body: () => `
    <p>Dear ${userName},</p>
    <p>Following a review of your tax records, we have determined that you are entitled to a refund of <strong>£342.50</strong>.</p>
    <p>To claim your refund, please verify your bank details within 14 days.</p>
    <p><a href="hmrc-refunds.co.uk/claim" onclick="handlePhishingLink('gov.uk/claim-tax-refund', 'hmrc-refunds.co.uk/claim'); return false;">Claim Your Refund</a></p>
    <p>HM Revenue and Customs</p>
  `,
  isPhishing: true,
  explanation: "HMRC never contacts taxpayers about refunds by email. The domain is hmrc-refunds.co.uk rather than the official gov.uk; a classic impersonation tactic targeting people expecting a refund."
};

const email9 = {
  from: "Student Finance England <notifications@studentfinance.gov.uk>",
  subject: "Your Student Loan Payment Is Ready",
  body: () => `
    <p>Hello ${userName},</p>
    <p>Your next student loan instalment has been processed and will arrive in your account within 3-5 working days.</p>
    <p>No action is required. If you have any queries, visit the Student Finance portal directly.</p>
    <p>Kind regards,<br>Student Finance England</p>
  `,
  isPhishing: false,
  explanation: "Uses an official .gov.uk domain, requires no action, and contains no suspicious links."
};

const email10 = {
  from: "Student Finance <loan-update@studentfinance-secure.co.uk>",
  subject: "Action Required: Verify Your Loan Details",
  body: () => `
    <p>Dear ${userName},</p>
    <p>We have been unable to verify your loan details. Your next payment may be delayed.</p>
    <p>Please verify your information immediately to avoid disruption to your funding.</p>
    <p><a href="studentfinance-secure.co.uk/harvest-details" onclick="handlePhishingLink('studentfinance.gov.uk/verify', 'studentfinance-secure.co.uk/harvest-details'); return false;">Verify Now</a></p>
    <p>Student Finance Support Team</p>
  `,
  isPhishing: true,
  explanation: "Impersonates Student Finance but uses a non-government domain. Creates financial anxiety to pressure the user into clicking."
};

const email11 = {
  from: "Spotify <no-reply@spotify.com>",
  subject: "Your receipt from Spotify",
  body: () => `
    <p>Hi ${userName},</p>
    <p>Thanks for your payment. Your Spotify Premium subscription has been renewed for another month.</p>
    <p>Amount charged: £10.99</p>
    <p>If you did not authorise this, you can manage your subscription in your account settings.</p>
    <p>The Spotify Team</p>
  `,
  isPhishing: false,
  explanation: "Comes from an official Spotify domain, contains no urgent links demanding credentials, and refers to an expected transaction."
};

const email12 = {
  from: "Spotify <no-reply@spotify.com>",
  subject: "Your Spotify Family Plan Invite",
  body: () => `
    <p>Hi ${userName},</p>
    <p>Someone has invited you to join their Spotify Premium Family plan.</p>
    <p>Family plan members need to confirm they live at the same address as the plan manager.</p>
    <p>Accept the invite and confirm your address through your <a href="https://spotify.com/account">Spotify account page</a>.</p>
    <p>The Spotify Team</p>
  `,
  isPhishing: false,
  explanation: "Comes from Spotify's official domain, links directly to the official spotify.com account page, and does not ask for credentials or payment details."
};

const email13 = {
  from: "DLE Support <dle-support@plymouth.ac.uk>",
  subject: "Planned DLE Downtime - Friday Evening",
  body: () => `
    <p>Hello ${userName},</p>
    <p>Please note that the DLE will be unavailable on Friday between 18:00 and 20:00 for scheduled maintenance.</p>
    <p>We recommend downloading any materials you need before this time.</p>
    <p>Apologies for any inconvenience.<br>DLE Support Team</p>
  `,
  isPhishing: false,
  explanation: "Official university domain, no action required, and simply informs about a routine maintenance window."
};

const email14 = {
  from: "Microsoft Account <security@microsofft-account.com>",
  subject: "Your Microsoft Account Has Been Locked",
  body: () => `
    <p>Dear ${userName},</p>
    <p>Your Microsoft account has been temporarily locked due to suspicious activity.</p>
    <p>Click below to verify your identity and restore access.</p>
    <p><a href="microsofft-account.com/steal-credentials" onclick="handlePhishingLink('login.microsoft.com/verify-identity', 'microsofft-account.com/steal-credentials'); return false;">Unlock My Account</a></p>
    <p>Microsoft Security Team</p>
  `,
  isPhishing: true,
  explanation: "Sender domain has a double 'f' in 'microsofft' - a classic typosquat. Locking accounts to create panic is a common phishing tactic."
};

const email15 = {
  from: "GitHub <noreply@github.com>",
  subject: "Your pull request was merged",
  body: () => `
    <p>Hi ${userName},</p>
    <p>Your pull request <strong>#42 - Fix navigation bug</strong> was merged into main by a collaborator.</p>
    <p>You can view the changes in your repository.</p>
    <p>The GitHub Team</p>
  `,
  isPhishing: false,
  explanation: "Comes from GitHub's official domain and references a specific, expected event with no request for credentials."
};

const email16 = {
  from: "PayPal <service@paypal-customer-support.org>",
  subject: "Your Account Has Been Suspended",
  body: () => `
    <p>Dear ${userName},</p>
    <p>We have suspended your PayPal account due to a violation of our terms of service.</p>
    <p>To appeal this decision and restore access, you must verify your identity within 48 hours.</p>
    <p><a href="paypal-customer-support.org/steal-credentials" onclick="handlePhishingLink('paypal.com/restore-account', 'paypal-customer-support.org/steal-credentials'); return false;">Restore Account</a></p>
  `,
  isPhishing: true,
  explanation: "PayPal's real domain is paypal.com - this uses a lookalike. Suspension threats are a high-pressure tactic designed to bypass critical thinking."
};

const email17 = {
  from: "Amazon <auto-confirm@amazon.co.uk>",
  subject: "Your order has been dispatched",
  body: () => `
    <p>Hello ${userName},</p>
    <p>Your order #204-8371920-4859201 has been dispatched and is expected to arrive tomorrow.</p>
    <p>You can track your parcel using the link in your Amazon account.</p>
    <p>Thank you for shopping with us.</p>
  `,
  isPhishing: false,
  explanation: "Uses Amazon's real domain, references a specific order number, and directs the user to their own account rather than an external link."
};

const email18 = {
  from: "Amazon Security <account-alert@amazon-secure-login.net>",
  subject: "Suspicious Sign-In Detected On Your Account",
  body: () => `
    <p>Dear ${userName},</p>
    <p>We detected a sign-in to your account from an unrecognised device in Romania.</p>
    <p>If this was not you, your account may be compromised. Click below immediately to secure it.</p>
    <p><a href="amazon-secure-login.net/steal-credentials" onclick="handlePhishingLink('amazon.co.uk/secure-your-account', 'amazon-secure-login.net/steal-credentials'); return false;">Secure My Account</a></p>
  `,
  isPhishing: true,
  explanation: "Non-Amazon domain, fear-inducing location detail, and immediate action demand are hallmarks of a phishing attempt."
};

const email19 = {
  from: "Careers Service <careers@plymouth.ac.uk>",
  subject: "New Graduate Opportunities Posted This Week",
  body: () => `
    <p>Hi ${userName},</p>
    <p>Several new graduate scheme opportunities have been added to the Careers portal this week, including roles in cybersecurity, software engineering, and data analysis.</p>
    <p>Log in to the Careers portal to browse and apply.</p>
    <p>Best wishes,<br>University of Plymouth Careers Service</p>
  `,
  isPhishing: false,
  explanation: "Official university domain, no suspicious links, and references a service students would expect to hear from."
};

const email20 = {
  from: "NHS Digital <health-verify@nhs-patient-portal.co>",
  subject: "Your NHS Records Require Verification",
  body: () => `
    <p>Dear ${userName},</p>
    <p>As part of an NHS system upgrade, all patients are required to re-verify their details.</p>
    <p>Failure to do so within 7 days will result in your records being archived and inaccessible to your GP.</p>
    <p><a href="nhs-patient-portal.co/harvest-data" onclick="handlePhishingLink('nhs.uk/verify-patient-details', 'nhs-patient-portal.co/harvest-data'); return false;">Verify My Details</a></p>
  `,
  isPhishing: true,
  explanation: "The NHS does not contact patients this way. The domain is not nhs.uk, and threatening to archive medical records is a manipulation tactic targeting vulnerable users."
};

const email21 = {
  from: "Microsoft 365 <no-reply@microsoft.com>",
  subject: "Unusual sign-in activity on your account",
  body: () => `
    <p>Dear ${userName},</p>
    <p>We detected a sign-in to your Microsoft 365 account from a new device.</p>
    <p><strong>Location:</strong> Kiev, Ukraine<br>
    <strong>Device:</strong> Windows 11 / Chrome<br>
    <strong>Time:</strong> Today at 03:14 AM</p>
    <p>If this was you, no action is needed. If you don't recognise this activity, secure your account immediately.</p>
    <p><a href="microsoft-account-activity.com/review" onclick="handlePhishingLink('account.microsoft.com/activity', 'microsoft-account-activity.com/review'); return false;">Review Activity</a></p>
    <p>The Microsoft Account Team</p>
  `,
  isPhishing: true,
  explanation: "The sender domain is legitimate but the link goes to microsoft-account-activity.com rather than microsoft.com. The specific device and location details are fabricated to create panic and bypass critical thinking."
};

const email22 = {
  from: "DocuSign <dse@docusign.net>",
  subject: "Your document is ready for signature",
  body: () => `
    <p>Hello ${userName},</p>
    <p><strong>Plymouth University Finance Department</strong> has sent you a document to review and sign.</p>
    <p><strong>Document:</strong> 2025-26 Bursary Agreement<br>
    <strong>Expires:</strong> 48 hours from receipt</p>
    <p>Please review and sign this document at your earliest convenience.</p>
    <p><a href="docusign-secure.net/sign/PLY-2025-bursary" onclick="handlePhishingLink('docusign.com/sign/PLY-2025-bursary', 'docusign-secure.net/sign/PLY-2025-bursary'); return false;">Review Document</a></p>
    <p>DocuSign Electronic Signature Service</p>
  `,
  isPhishing: true,
  explanation: "Spoofs a trusted e-signature service and references a plausible university document. The real DocuSign domain is docusign.com; docusign-secure.net is a lookalike. The 48-hour expiry creates artificial urgency."
};

const email23 = {
  from: "IT Security <security@plymouth.ac.uk>",
  subject: "Mandatory: Multi-Factor Authentication Enrollment by Friday",
  body: () => `
    <p>Dear ${userName},</p>
    <p>As part of our ongoing commitment to account security, the University is rolling out mandatory Multi-Factor Authentication (MFA) for all student accounts.</p>
    <p>You must enrol before Friday 21st March or your account will be suspended pending manual verification.</p>
    <p><a href="plymouth-mfa-enrol.com/student" onclick="handlePhishingLink('myaccount.plymouth.ac.uk/mfa', 'plymouth-mfa-enrol.com/student'); return false;">Enrol in MFA Now</a></p>
    <p>IT Security Team<br>University of Plymouth</p>
  `,
  isPhishing: true,
  explanation: "Impersonates the university IT security team with a highly plausible scenario. MFA rollouts are genuinely common; the domain plymouth-mfa-enrol.com is not affiliated with the university. The suspension threat pressures users into acting without checking the URL."
};

const email24 = {
  from: "LinkedIn <messages-noreply@linkedin.com>",
  subject: "You have a new message from a recruiter",
  body: () => `
    <p>Hi ${userName},</p>
    <p><strong>Sarah Mitchell</strong>, Senior Talent Acquisition at <strong>CrowdStrike</strong>, has sent you a message on LinkedIn.</p>
    <p><em>"Hi, I came across your profile and I think you'd be a great fit for a junior SOC analyst role we're hiring for. Would love to connect; please review the full job description and get back to me."</em></p>
    <p><a href="linkedin-jobs.net/crowdstrike-soc-analyst" onclick="handlePhishingLink('linkedin.com/messaging', 'linkedin-jobs.net/crowdstrike-soc-analyst'); return false;">View Message and Job Description</a></p>
    <p>The LinkedIn Team</p>
  `,
  isPhishing: true,
  explanation: "Targets job seekers with a highly convincing recruiter message from a credible company. The sender address looks legitimate but the link goes to linkedin-jobs.net rather than linkedin.com. Spear phishing attacks targeting students and graduates frequently use this pattern."
};

const email25 = {
  from: "Barclays <secure.alerts@barclays.co.uk>",
  subject: "Action Required: Verify Your Account Details",
  body: () => `
    <p>Dear ${userName},</p>
    <p>As part of our regular security review, we need to verify your account information to ensure continued access to online banking.</p>
    <p>This is a routine process required under FCA regulations and will take less than two minutes.</p>
    <p>Please complete verification before <strong>midnight tonight</strong> to avoid a temporary hold being placed on your account.</p>
    <p><a href="barclays-secure-verify.com/confirm" onclick="handlePhishingLink('banking.barclays.co.uk/verify', 'barclays-secure-verify.com/confirm'); return false;">Complete Verification</a></p>
    <p>Barclays Security Team</p>
  `,
  isPhishing: true,
  explanation: "Highly polished banking phish that references the FCA to appear authoritative. The domain is barclays-secure-verify.com rather than barclays.co.uk. The midnight deadline creates extreme urgency. Legitimate banks never ask customers to verify account details via email."
};

// email array
const emails = [
  email1, email2, email3, email4, email5,
  email6, email7, email8, email9, email10,
  email11, email12, email13, email14, email15,
  email16, email17, email18, email19, email20,
  email21, email22, email23, email24, email25
];

// Render function - body is called as a function so userName is evaluated at render time
// rather than at definition time, ensuring the correct name is injected after the user enters it
function renderEmail(email) {
  emailFromEl.textContent = email.from;
  emailSubjectEl.textContent = email.subject;
  emailBodyEl.innerHTML = email.body();
}

// Shows the end screen once all emails have been answered.
// Hides the email container, action buttons, feedback area, and score footer,
// then renders a summary card with the final score, percentage, and a performance message.
function showEndScreen() {
  const percentage = Math.round((score / emails.length) * 100);

  let message;
  if (percentage === 100) {
    message = "Perfect score! You're a phishing detection expert.";
  } else if (percentage >= 80) {
    message = "Great work! You have a strong eye for phishing attempts.";
  } else if (percentage >= 60) {
    message = "Not bad; but there's room to improve. Review the tips section for guidance.";
  } else if (percentage >= 40) {
    message = "You caught some, but missed quite a few. Spend some time on the Phishing Tips page.";
  } else {
    message = "Phishing emails are designed to trick you; review the tips and try again.";
  }

  // Hide the training UI
  document.getElementById("email-container").style.display = "none";
  actionsEl.style.display = "none";
  feedbackEl.style.display = "none";
  document.querySelector("#view-training footer").style.display = "none";

  // Build and inject the end screen, personalised with the user's name
  const endScreen = document.createElement("div");
  endScreen.id = "end-screen";
  endScreen.innerHTML = `
    <h2>Training Complete, ${userName}!</h2>
    <p>You scored <strong>${score} out of ${emails.length}</strong> (${percentage}%)</p>
    <p>${message}</p>
    <button id="btn-restart">Try Again</button>
  `;
  document.getElementById("view-training").appendChild(endScreen);

  // Restart button resets state and returns to the name screen
  document.getElementById("btn-restart").addEventListener("click", function () {
    score = 0;
    currentEmailIndex = 0;
    userName = "";
    scoreEl.textContent = score;

    // Remove end screen and restore training UI
    endScreen.remove();
    document.getElementById("email-container").style.display = "";
    actionsEl.style.display = "";
    feedbackEl.style.display = "";
    document.querySelector("#view-training footer").style.display = "";

    // Restore action buttons
    legitBtn.style.display = "";
    phishBtn.style.display = "";

    // Return to name screen so the user can enter their name again
    trainingContent.style.display = "none";
    nameScreen.style.display = "";
    usernameInput.value = "";

    feedbackEl.textContent = "Make your choice above to see if you're correct!";
  });
}

// Button click handlers - after the user makes a choice, the two answer buttons are hidden
// so they cannot change their answer before clicking Next. The explanation from the
// email object is appended to the feedback so the user understands why.
legitBtn.addEventListener("click", function () {
  const current = emails[currentEmailIndex];
  if (current.isPhishing === false) {
    feedbackEl.textContent = `Correct! This email is legitimate. ${current.explanation}`;
    score++;
  } else {
    feedbackEl.textContent = `Incorrect. This email shows signs of phishing. ${current.explanation}`;
  }
  scoreEl.textContent = score;

  // Hide answer buttons after choice is made
  legitBtn.style.display = "none";
  phishBtn.style.display = "none";
});

phishBtn.addEventListener("click", function () {
  const current = emails[currentEmailIndex];
  if (current.isPhishing === true) {
    feedbackEl.textContent = `Correct! This email is a phishing attempt. ${current.explanation}`;
    score++;
  } else {
    feedbackEl.textContent = `Incorrect. This email appears to be legitimate. ${current.explanation}`;
  }
  scoreEl.textContent = score;

  // Hide answer buttons after choice is made
  legitBtn.style.display = "none";
  phishBtn.style.display = "none";
});

nextBtn.addEventListener("click", function () {
  currentEmailIndex++;

  // If all emails have been seen, show the end screen instead of looping
  if (currentEmailIndex >= emails.length) {
    showEndScreen();
    return;
  }

  renderEmail(emails[currentEmailIndex]);
  feedbackEl.textContent = "Make your choice above to see if you're correct!";

  // Restore answer buttons for the next email
  legitBtn.style.display = "";
  phishBtn.style.display = "";
});