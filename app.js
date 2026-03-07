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
    document.getElementById(target).classList.add("active");
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
    <p><a href="university-helpdesk.com/harvest-credentials" onclick="handlePhishingLink('students.plymouth.ac.uk/reset-password', 'university-helpdesk.com/harvest-credentials'); return false;">Reset Password</a></p>
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
    <p>Kind regards,<br>Plymouth University IT Services</p>
  `,
  isPhishing: false,
  explanation: "Uses an official domain, provides advance notice, and does not request personal information."
};

const email3 = {
  from: "Parcel Service <delivery-update@parcel-tracking.co>",
  subject: "Delivery Failed - Action Required",
  body: `
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
  body: `
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
  subject: "Outstanding Balance - Immediate Payment Required",
  body: `
    <p>Your account shows an outstanding balance.</p>
    <p>Failure to pay within 24 hours will result in deletion of account.</p>
    <p><a href="payment-secure.net/steal-card-details" onclick="handlePhishingLink('secure-payments.com/pay-now', 'payment-secure.net/steal-card-details'); return false;">Make Payment</a></p>
  `,
  isPhishing: true,
  explanation: "Threatening language, short deadline, and generic sender identity."
};

const email7 = {
  from: "Prince Adewale <royal.funds.transfer@gmail.com>",
  subject: "URGENT BUSINESS PROPOSAL - CONFIDENTIAL",
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

const email9 = {
  from: "Student Finance England <notifications@studentfinance.gov.uk>",
  subject: "Your Student Loan Payment Is Ready",
  body: `
    <p>Hello,</p>
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
  body: `
    <p>Dear Student,</p>
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
  body: `
    <p>Hi,</p>
    <p>Thanks for your payment. Your Spotify Premium subscription has been renewed for another month.</p>
    <p>Amount charged: £10.99</p>
    <p>If you did not authorise this, you can manage your subscription in your account settings.</p>
    <p>The Spotify Team</p>
  `,
  isPhishing: false,
  explanation: "Comes from an official Spotify domain, contains no urgent links demanding credentials, and refers to an expected transaction."
};

const email12 = {
  from: "Spotify Billing <support@spotify-billing-centre.com>",
  subject: "Your Payment Failed - Update Your Details",
  body: `
    <p>Dear Valued Customer,</p>
    <p>We were unable to process your latest Spotify payment.</p>
    <p>To avoid losing access to your account, please update your billing information within 24 hours.</p>
    <p><a href="spotify-billing-centre.com/steal-card" onclick="handlePhishingLink('spotify.com/account/billing', 'spotify-billing-centre.com/steal-card'); return false;">Update Billing Details</a></p>
  `,
  isPhishing: true,
  explanation: "Fake Spotify domain, generic greeting, artificial urgency, and a link to harvest payment details."
};

const email13 = {
  from: "DLE Support <dle-support@plymouth.ac.uk>",
  subject: "Planned DLE Downtime - Friday Evening",
  body: `
    <p>Hello,</p>
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
  body: `
    <p>Dear User,</p>
    <p>Your Microsoft account has been temporarily locked due to suspicious activity.</p>
    <p>Click below to verify your identity and restore access.</p>
    <p><a href="microsofft-account.com/steal-credentials" onclick="handlePhishingLink('login.microsoft.com/verify-identity', 'microsofft-account.com/steal-credentials'); return false;">Unlock My Account</a></p>
    <p>Microsoft Security Team</p>
  `,
  isPhishing: true,
  explanation: "Sender domain has a double 'f' in 'microsofft' — a classic typosquat. Locking accounts to create panic is a common phishing tactic."
};

const email15 = {
  from: "GitHub <noreply@github.com>",
  subject: "Your pull request was merged",
  body: `
    <p>Hi,</p>
    <p>Your pull request <strong>#42 - Fix navigation bug</strong> was merged into main by a collaborator.</p>
    <p>You can view the changes in your repository.</p>
    <p>— The GitHub Team</p>
  `,
  isPhishing: false,
  explanation: "Comes from GitHub's official domain and references a specific, expected event with no request for credentials."
};

const email16 = {
  from: "PayPal <service@paypal-customer-support.org>",
  subject: "Your Account Has Been Suspended",
  body: `
    <p>Dear Customer,</p>
    <p>We have suspended your PayPal account due to a violation of our terms of service.</p>
    <p>To appeal this decision and restore access, you must verify your identity within 48 hours.</p>
    <p><a href="paypal-customer-support.org/steal-credentials" onclick="handlePhishingLink('paypal.com/restore-account', 'paypal-customer-support.org/steal-credentials'); return false;">Restore Account</a></p>
  `,
  isPhishing: true,
  explanation: "PayPal's real domain is paypal.com — this uses a lookalike. Suspension threats are a high-pressure tactic designed to bypass critical thinking."
};

const email17 = {
  from: "Amazon <auto-confirm@amazon.co.uk>",
  subject: "Your order has been dispatched",
  body: `
    <p>Hello,</p>
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
  body: `
    <p>Dear Amazon Customer,</p>
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
  body: `
    <p>Hi,</p>
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
  body: `
    <p>Dear Patient,</p>
    <p>As part of an NHS system upgrade, all patients are required to re-verify their details.</p>
    <p>Failure to do so within 7 days will result in your records being archived and inaccessible to your GP.</p>
    <p><a href="nhs-patient-portal.co/harvest-data" onclick="handlePhishingLink('nhs.uk/verify-patient-details', 'nhs-patient-portal.co/harvest-data'); return false;">Verify My Details</a></p>
  `,
  isPhishing: true,
  explanation: "The NHS does not contact patients this way. The domain is not nhs.uk, and threatening to archive medical records is a manipulation tactic targeting vulnerable users."
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
  email8,
  email9,
  email10,
  email11,
  email12,
  email13,
  email14,
  email15,
  email16,
  email17,
  email18,
  email19,
  email20 
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

