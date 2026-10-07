/* The School of Phish: training data.
 *
 * TACTICS are the "species" in the field guide. Every red flag in an email
 * points at one of these by id, which is how the app links feedback to the
 * guide and tracks which tricks a learner misses most.
 *
 * EMAILS are plain data. Body blocks can be:
 *   "a string"                            a plain paragraph
 *   { p: "text" }                         a paragraph (use this form to add a flag)
 *   { link, href, cta }                   a link; link is the visible text, href where it really goes
 *   { attach, size }                      an attachment
 *   { qr, href }                          a QR code that leads to href
 *   { sig: "Line one\nLine two" }         a sign-off
 * Any block, plus from, replyTo and subject, can carry a red flag:
 *   flag: { t: "tactic-id", n: "Why this is suspicious" }
 *
 * Everything here is fictional. Phishing domains are invented; sender
 * addresses for real organisations are illustrative.
 */
window.SCHOOL_OF_PHISH = {
  TACTICS: [
    {
      id: 'lookalike',
      name: 'Lookalike domain',
      summary: "An address or link that's one letter, word or ending away from the real thing.",
      examples: ['security@microsofft-account.com', 'service@paypal-customer-support.org'],
      check: "Find the part of the domain just before the ending (.com, .co.uk) and compare it letter by letter with the organisation's real website. Extra words like -secure, -support and -login are a classic giveaway."
    },
    {
      id: 'buried',
      name: 'Buried domain',
      summary: "The real organisation's name appears at the start of the address, but the part that decides where you go is at the end.",
      examples: ['https://login.microsoft.com.verify-identity.co/unlock', 'mfa-noreply@plymouth.ac.uk.mfa-enrol.com'],
      check: 'Read the domain from right to left. In login.microsoft.com.verify-identity.co the website is verify-identity.co; everything to its left can be made up.'
    },
    {
      id: 'display-name',
      name: 'Borrowed name',
      summary: "The display name says Royal Mail or your lecturer, but the address behind it doesn't match.",
      examples: ['Prof. Helen Carter <helen.carter.office@gmail.com>', 'Royal Mail <redelivery@rm-parcel-update.co>'],
      check: 'Open the sender details. A display name is just text that anyone can type; the address is what counts. Organisations rarely email from free accounts like Gmail or Outlook.'
    },
    {
      id: 'reply-to',
      name: 'Redirected reply',
      summary: 'The email comes from one address, but replies quietly go to another.',
      examples: ['From: bookings@harbourevents.co.uk', 'Reply-To: harbourevents.accounts@outlook.com'],
      check: "Check the Reply-To field before you answer anything about money or accounts. If it's different from the sender, ask why."
    },
    {
      id: 'disguised-link',
      name: 'Disguised link',
      summary: 'The words of a link point one way and the link goes somewhere else.',
      examples: ['Says: Keep my current password', 'Goes to: https://plymouth-ac-uk.password-portal.net/keep'],
      check: 'Hover over a link (or press and hold on a phone) and read the real destination before you click. The visible text proves nothing.'
    },
    {
      id: 'urgency',
      name: 'Ticking clock',
      summary: 'A deadline measured in hours, so you act before you think.',
      examples: ['Verify within 24 hours to avoid disruption.', 'Unclaimed prizes are forfeited after 72 hours.'],
      check: "Slow down. Real organisations give reasonable notice and let you sort things out through their own website or app."
    },
    {
      id: 'threat',
      name: 'Threat of loss',
      summary: 'Your account, records, money or access will disappear unless you do something now.',
      examples: ['Your account has been temporarily locked.', 'Your records will be archived and inaccessible to your GP.'],
      check: "Go to the service directly, by typing its address or opening its app, and see whether anything is actually wrong."
    },
    {
      id: 'greeting',
      name: 'Faceless greeting',
      summary: 'Dear Customer, Dear Student, Dear User: a mass email pretending to be personal.',
      examples: ['Dear Valued Customer,', 'Dear Patient,'],
      check: "Organisations you have an account with usually know your name. A generic greeting alone isn't proof, but it adds up with other signs."
    },
    {
      id: 'too-good',
      name: 'Too good to be true',
      summary: "Prizes, inheritances and windfalls you never expected and couldn't have earned.",
      examples: ['You have won £1,250,000', 'You will receive 30% for your assistance.'],
      check: "You can't win a competition you never entered, and strangers don't share fortunes. There's always a fee coming."
    },
    {
      id: 'secrets',
      name: 'Asking for secrets',
      summary: 'A request, or a link to a page, wanting your password, card details, bank details or a one-time code.',
      examples: ['You will need your card number, expiry date and security code.', 'Sign in with your email account to view the document.'],
      check: "Legitimate organisations don't ask for these by email. Never type a password into a page you reached from an email link, and never share a one-time code with anyone."
    },
    {
      id: 'attachment',
      name: 'Unexpected attachment',
      summary: 'A file you weren\'t expecting, often a type that can run code or show a fake login page.',
      examples: ['Remittance_Advice_0923.htm', 'Account_Review_Form.pdf.html'],
      check: "Watch for .htm, .html, .zip, .exe, .iso and macro-enabled Office files, and for double endings like .pdf.html. If you weren't expecting it, confirm with the sender using contact details you already have."
    },
    {
      id: 'payment',
      name: 'Money on the move',
      summary: 'Requests to pay a fee, buy gift cards, or send money to new bank details.',
      examples: ['Please note we have changed banks.', 'I need 5 Amazon gift cards at £50 each.'],
      check: 'Confirm any change of bank details by phone, using a number you already trust. Gift cards are never a genuine way to pay a bill or a colleague.'
    },
    {
      id: 'secrecy',
      name: 'Keep it quiet',
      summary: 'Requests to keep things confidential, avoid phone calls or skip the usual process.',
      examples: ["Please keep it quiet, it's a surprise.", 'Please email rather than call.'],
      check: 'Secrecy stops you asking the one person who would spot the scam. That is exactly the moment to ask them.'
    },
    {
      id: 'qr',
      name: 'QR code switch',
      summary: 'A QR code instead of a link, so email filters and your hover habit can\'t check where it goes.',
      examples: ['Scan the code with your phone to re-enrol.'],
      check: 'Treat a QR code in an email exactly like a link. Your phone usually shows the address before opening it: read it, and if in doubt, don\'t scan.'
    }
  ],

  EMAILS: [
    {
      id: 'uni-password-expiry',
      phish: true,
      from: {
        name: 'IT Service Desk',
        email: 'it-support@university-helpdesk.com',
        flag: { t: 'lookalike', n: "The university's real domain is plymouth.ac.uk. university-helpdesk.com could belong to anyone." }
      },
      subject: {
        text: 'Action required: your password expires today',
        flag: { t: 'urgency', n: 'A same-day deadline in the subject line is there to rush you.' }
      },
      body: [
        'Hello,',
        {
          p: "Your university password expires today at 17:00. If you don't act, you will lose access to email, the DLE and your files.",
          flag: { t: 'threat', n: 'Losing access to everything is the threat. Genuine password expiry notices give you days of warning, not hours.' }
        },
        {
          link: 'Keep my current password',
          href: 'https://plymouth-ac-uk.password-portal.net/keep',
          cta: true,
          flag: { t: 'disguised-link', n: "The button goes to password-portal.net. Putting 'plymouth-ac-uk' at the front is meant to make it look official. And there's no such thing as keeping an expired password." }
        },
        { sig: 'Regards,\nIT Support' }
      ],
      lesson: 'A credential-harvesting email: an urgent deadline, a lookalike sender and a button leading to a fake login page. If you think your password really is expiring, sign in to the university portal yourself.'
    },
    {
      id: 'uni-maintenance',
      phish: false,
      from: { name: 'University IT Services', email: 'itservices@plymouth.ac.uk' },
      subject: 'Scheduled maintenance this weekend',
      body: [
        'Hello,',
        'Scheduled maintenance will take place this Saturday between 22:00 and 02:00. Some systems may be intermittently unavailable during this time.',
        "You don't need to do anything. Service status updates will be posted on the IT Services pages.",
        { sig: 'Kind regards,\nIT Services, University of Plymouth' }
      ],
      good: [
        "Sent from plymouth.ac.uk, the university's real domain.",
        'Gives advance notice and asks you to do nothing.',
        'No links, no attachments and no requests for information.'
      ],
      lesson: 'A routine notice: information only, from the real domain, with nothing to click. Most genuine email looks this boring.'
    },
    {
      id: 'parcel-fee',
      phish: true,
      from: {
        name: 'Royal Mail',
        email: 'redelivery@rm-parcel-update.co',
        flag: { t: 'display-name', n: "The name says Royal Mail, but the address is rm-parcel-update.co. Royal Mail's real website is royalmail.com." }
      },
      subject: 'Your parcel is on hold: £1.45 fee unpaid',
      body: [
        {
          p: 'Dear Customer,',
          flag: { t: 'greeting', n: "Royal Mail would know whose name is on the parcel." }
        },
        'We attempted to deliver your parcel today, but there is an unpaid shipping fee of £1.45.',
        {
          p: 'Your parcel will be returned to the sender if the fee is not paid within 48 hours.',
          flag: { t: 'urgency', n: 'A 48-hour deadline stops you checking whether you are even expecting a parcel.' }
        },
        {
          link: 'royalmail.com/redelivery',
          href: 'https://royalmail.com-redeliver.info/pay',
          flag: { t: 'buried', n: 'The link text shows royalmail.com, but the real domain is com-redeliver.info. Read domains from right to left.' }
        },
        {
          p: 'To pay, you will need your card number, expiry date and security code.',
          flag: { t: 'secrets', n: 'The tiny fee is bait. What they want is your full card details.' }
        },
        { sig: 'Royal Mail Customer Services' }
      ],
      lesson: "A small fee feels harmless, which is the point: scammers want your card, not the £1.45. If you're expecting a parcel, check its tracking by typing the courier's address into your browser yourself."
    },
    {
      id: 'google-signin-alert',
      phish: false,
      from: { name: 'Google', email: 'no-reply@accounts.google.com' },
      subject: 'Security alert: new sign-in on Windows',
      body: [
        "We noticed a new sign-in to your Google Account on a Windows device. If this was you, you don't need to do anything. If not, we'll help you secure your account.",
        { link: 'Check activity', href: 'https://myaccount.google.com/notifications', cta: true },
        'You can also see security activity at myaccount.google.com/notifications.',
        { sig: 'The Google Accounts team' }
      ],
      good: [
        'Sent from accounts.google.com. Read right to left: the domain is google.com.',
        "The link goes to myaccount.google.com, Google's real account page.",
        "Calm wording: if it was you, do nothing. No deadline, no threat."
      ],
      lesson: 'Real security alerts exist, and this is one. The difference is calm wording and real domains. Even so, the safest move is still to check your account in the app or by typing the address yourself.'
    },
    {
      id: 'library-due',
      phish: false,
      from: { name: 'University Library', email: 'library@plymouth.ac.uk' },
      subject: 'Library items due in 3 days',
      body: [
        'Hello,',
        "One or more items you've borrowed are due back in three days.",
        'You can renew them online through your library account, or return them to any campus library.',
        { link: 'View my loans', href: 'https://library.plymouth.ac.uk/account/loans' },
        { sig: 'Thank you,\nUniversity Library' }
      ],
      good: [
        "Sent from plymouth.ac.uk, the university's real domain.",
        'The link stays on library.plymouth.ac.uk.',
        "A reminder about something you'd expect, with three days' notice and no threats."
      ],
      lesson: "Legitimate emails can contain links. What matters is where they go, and this one stays on the university's own domain."
    },
    {
      id: 'venue-bank-change',
      phish: true,
      from: { name: 'Harbour Events Bookings', email: 'bookings@harbourevents.co.uk' },
      replyTo: {
        email: 'harbourevents.accounts@outlook.com',
        flag: { t: 'reply-to', n: 'The email came from harbourevents.co.uk, but any reply would go to a free Outlook address. This is how invoice fraudsters take over a conversation.' }
      },
      subject: 'Invoice HE-4471: updated payment details',
      body: [
        'Hi,',
        "Thanks again for booking the Harbour Suite for your society's end-of-term social.",
        {
          p: 'Please note we have changed banks. Use the new details below to pay invoice HE-4471 (£640.00) and update your records.',
          flag: { t: 'payment', n: 'A change of bank details by email is the biggest single warning sign of invoice fraud. Always confirm by phone, using a number you already had.' }
        },
        'Account name: Harbour Events Ltd\nSort code: 20-45-77\nAccount number: 83920164',
        {
          p: "Our auditors are reviewing accounts this week, so please email rather than call, and keep this between us until it's processed.",
          flag: { t: 'secrecy', n: "Asking you not to phone is a way of stopping you checking. Secrecy protects the scammer, not the supplier." }
        },
        { sig: 'Many thanks,\nJo\nHarbour Events' }
      ],
      lesson: "Business email compromise. The sender address may be genuine because the supplier's own account was hacked, so checking the domain won't save you here. The bank change, the Reply-To and the 'don't call' request will."
    },
    {
      id: 'advance-fee-prince',
      phish: true,
      from: {
        name: 'Prince Adewale',
        email: 'royal.funds.transfer@gmail.com',
        flag: { t: 'display-name', n: 'A free Gmail address for someone claiming to move millions on behalf of a government.' }
      },
      subject: {
        text: 'URGENT BUSINESS PROPOSAL: CONFIDENTIAL',
        flag: { t: 'secrecy', n: 'Capitals, urgency and confidentiality, all in one subject line.' }
      },
      body: [
        {
          p: 'Dear Beloved Friend,',
          flag: { t: 'greeting', n: "A stranger who doesn't know your name, but calls you a beloved friend." }
        },
        'I am Prince Adewale, son of the late Minister of Finance.',
        {
          p: 'I have the sum of $15,000,000 USD that I wish to transfer into your account, and you will receive 30% for your assistance.',
          flag: { t: 'too-good', n: 'Nobody hands strangers millions. Once you reply, a "release fee" always appears.' }
        },
        {
          p: 'Please reply urgently with your full name, address, telephone number and bank details.',
          flag: { t: 'secrets', n: 'Your bank details and personal information are the real prize.' }
        },
        { sig: 'God bless you,\nPrince Adewale' }
      ],
      lesson: 'The classic advance-fee scam. It is deliberately over the top: anyone who replies has already shown they might pay the "fees" that follow.'
    },
    {
      id: 'lottery-win',
      phish: true,
      from: {
        name: 'International Lottery Commission',
        email: 'winnings@global-lotto-win.biz',
        flag: { t: 'display-name', n: 'An official-sounding name on a throwaway .biz domain.' }
      },
      subject: {
        text: 'CONGRATULATIONS! YOU HAVE WON £1,250,000',
        flag: { t: 'too-good', n: "You can't win a lottery you never entered." }
      },
      body: [
        'Congratulations!',
        'Your email address has been randomly selected as the winner of our international lottery draw.',
        {
          p: 'To claim your prize, reply with your full name, date of birth and bank details, plus a processing fee of £250.',
          flag: { t: 'payment', n: 'Real prizes never cost money to receive.' }
        },
        {
          p: 'Unclaimed prizes are forfeited after 72 hours.',
          flag: { t: 'urgency', n: 'The deadline is there so you pay before you think.' }
        },
        { sig: 'Claims Department' }
      ],
      lesson: 'Lottery scams combine a windfall with a small fee. The fee is the scam, and your personal details are a bonus for the next one.'
    },
    {
      id: 'student-finance-real',
      phish: false,
      from: { name: 'Student Finance England', email: 'notifications@studentfinance.gov.uk' },
      subject: 'Your next payment is on its way',
      body: [
        'Hello,',
        'Your next maintenance loan instalment has been processed and should reach your bank account within 3 to 5 working days.',
        "You don't need to do anything. To see your payment schedule, sign in to your student finance account through GOV.UK.",
        { sig: 'Kind regards,\nStudent Finance England' }
      ],
      good: [
        'A .gov.uk address, which only UK public sector bodies can register.',
        'No links: it tells you to sign in through GOV.UK yourself.',
        "No request for details, and nothing to do."
      ],
      lesson: 'Good news, delivered without a single link. Telling you to go to the website yourself is exactly what a careful organisation does.'
    },
    {
      id: 'student-finance-fake',
      phish: true,
      from: {
        name: 'Student Finance England',
        email: 'loan-update@studentfinance-secure.co.uk',
        flag: { t: 'lookalike', n: 'Government services email from .gov.uk addresses. Anyone can register a .co.uk.' }
      },
      subject: 'Action required: verify your loan details',
      body: [
        {
          p: 'Dear Student,',
          flag: { t: 'greeting', n: 'Student Finance knows your name. A generic greeting suggests a mass mailing.' }
        },
        {
          p: 'We were unable to verify your bank details and your next payment has been put on hold.',
          flag: { t: 'threat', n: 'Money worries are a powerful lever, especially at the start of term.' }
        },
        {
          p: 'Verify your information within 24 hours to avoid disruption to your funding.',
          flag: { t: 'urgency', n: 'Twenty-four hours is designed to make you panic rather than check.' }
        },
        {
          link: 'Verify now',
          href: 'https://studentfinance-secure.co.uk/verify',
          cta: true,
          flag: { t: 'secrets', n: 'Leads to a fake sign-in page that would collect your login and bank details.' }
        },
        { sig: 'Student Finance Support Team' }
      ],
      lesson: 'Compare this with the genuine Student Finance email: a fake domain, a threat to your money, a deadline and a link to "verify". If you are worried about a payment, sign in through GOV.UK yourself.'
    },
    {
      id: 'spotify-receipt',
      phish: false,
      from: { name: 'Spotify', email: 'no-reply@spotify.com' },
      subject: 'Your Spotify Premium receipt',
      body: [
        'Hi,',
        'Thanks for your payment. Your Premium subscription has renewed for another month.',
        'Amount charged: £11.99\nPayment method: Visa ending 4417',
        'You can manage your subscription in your account settings at any time.',
        { sig: 'The Spotify Team' }
      ],
      good: [
        "Sent from spotify.com, Spotify's real domain.",
        'A receipt for something that renews every month, with no request to do anything.',
        'It shows only the last four digits of the card, which is normal.'
      ],
      lesson: 'Receipts are some of the most commonly faked emails, so it helps to know what a real one looks like: specific, calm, and asking nothing of you.'
    },
    {
      id: 'spotify-billing-fake',
      phish: true,
      from: {
        name: 'Spotify Billing',
        email: 'support@spotify-billing-centre.com',
        flag: { t: 'lookalike', n: 'Spotify emails come from spotify.com. spotify-billing-centre.com is a separate domain anyone could buy.' }
      },
      subject: 'Your payment failed: update your details',
      body: [
        {
          p: 'Dear Valued Customer,',
          flag: { t: 'greeting', n: 'Spotify knows your name and uses it.' }
        },
        'We were unable to process your latest Spotify payment.',
        {
          p: 'To avoid losing access to your music and playlists, update your billing information within 24 hours.',
          flag: { t: 'urgency', n: 'Losing your playlists within a day: a threat and a deadline in one sentence.' }
        },
        {
          link: 'Update billing details',
          href: 'https://spotify-billing-centre.com/account/billing',
          cta: true,
          flag: { t: 'secrets', n: "A copy of Spotify's payment page, on a domain Spotify doesn't own, built to capture your card." }
        }
      ],
      lesson: 'Failed-payment emails work because they are plausible. Open the app: if a payment really failed, it will tell you there.'
    },
    {
      id: 'dle-downtime',
      phish: false,
      from: { name: 'DLE Support', email: 'dle-support@plymouth.ac.uk' },
      subject: 'Planned DLE downtime on Friday evening',
      body: [
        'Hello,',
        'The DLE will be unavailable on Friday between 18:00 and 20:00 for scheduled maintenance.',
        'We recommend downloading any materials you need before then.',
        { sig: 'Apologies for any inconvenience,\nDLE Support Team' }
      ],
      good: [
        "The university's own domain.",
        'Advance notice of a short, specific maintenance window.',
        "Nothing to click and nothing to hand over."
      ],
      lesson: 'Another genuine notice. Real organisations tell you things; phishing emails ask you for things.'
    },
    {
      id: 'microsoft-locked',
      phish: true,
      from: {
        name: 'Microsoft account team',
        email: 'security@microsofft-account.com',
        flag: { t: 'lookalike', n: 'Look again: microsofft, with two f\'s. Registering misspelt domains is called typosquatting.' }
      },
      subject: 'Your Microsoft account has been locked',
      body: [
        {
          p: 'Dear User,',
          flag: { t: 'greeting', n: 'Microsoft addresses you by name, or by your account email.' }
        },
        {
          p: 'Your account has been temporarily locked due to suspicious activity. Some features are unavailable until you verify your identity.',
          flag: { t: 'threat', n: 'A locked account is frightening, which makes you more likely to click without checking.' }
        },
        {
          link: 'Unlock my account',
          href: 'https://login.microsoft.com.verify-identity.co/unlock',
          cta: true,
          flag: { t: 'buried', n: 'It starts with login.microsoft.com, but the website is verify-identity.co. Everything to the left of the real domain can be made up.' }
        },
        { sig: 'Microsoft Security' }
      ],
      lesson: 'Two classic tricks at once: a misspelt sender and a link where the real brand appears at the front of somebody else\'s domain.'
    },
    {
      id: 'github-merged',
      phish: false,
      from: { name: 'GitHub', email: 'noreply@github.com' },
      subject: '[school-of-phish] Pull request #42 merged',
      body: [
        'Hi,',
        'Your pull request #42 (Fix navigation bug) was merged into main.',
        { link: 'View it on GitHub', href: 'https://github.com/example-user/school-of-phish/pull/42' },
        { sig: 'You are receiving this because you authored the thread.' }
      ],
      good: [
        "Sent from github.com, GitHub's real domain.",
        'Refers to a specific event you would recognise: your own pull request.',
        'The link stays on github.com and asks for nothing.'
      ],
      lesson: 'Notifications about something you actually did are usually genuine. If it mentioned a pull request you never made, that would be the time to be suspicious.'
    },
    {
      id: 'paypal-suspended',
      phish: true,
      from: {
        name: 'PayPal',
        email: 'service@paypal-customer-support.org',
        flag: { t: 'lookalike', n: "PayPal's real domain is paypal.com. Adding -customer-support and switching to .org makes a different domain entirely." }
      },
      subject: 'Your account has been limited',
      body: [
        {
          p: 'Dear Customer,',
          flag: { t: 'greeting', n: 'PayPal knows exactly who you are.' }
        },
        {
          p: 'We have limited your account due to a violation of our terms of service. To restore access, you must verify your identity within 48 hours.',
          flag: { t: 'urgency', n: 'An accusation plus a deadline: designed to make you defend yourself quickly.' }
        },
        {
          link: 'Restore account',
          href: 'https://paypal-customer-support.org/restore',
          cta: true,
          flag: { t: 'secrets', n: 'Leads to a fake PayPal login on the same lookalike domain.' }
        },
        {
          attach: 'Account_Review_Form.pdf.html',
          size: '34 KB',
          flag: { t: 'attachment', n: 'A file ending .pdf.html is a web page pretending to be a PDF. Opening it would show a fake login form.' }
        }
      ],
      lesson: 'This one gives you two ways to get caught: a link and an attachment. Both lead to the same place, a form asking for your PayPal password.'
    },
    {
      id: 'amazon-dispatched',
      phish: false,
      from: { name: 'Amazon.co.uk', email: 'shipment-tracking@amazon.co.uk' },
      subject: 'Dispatched: your Amazon.co.uk order',
      body: [
        'Hello,',
        'Your package has been dispatched and is expected to arrive tomorrow.',
        'Order #204-8371920-4859201',
        { link: 'Track your package', href: 'https://www.amazon.co.uk/gp/your-account/order-history', cta: true },
        { sig: 'Thanks for shopping with us.\nAmazon.co.uk' }
      ],
      good: [
        'Sent from amazon.co.uk.',
        'A specific order number you can match against your own account.',
        'The link goes to www.amazon.co.uk and asks for nothing extra.'
      ],
      lesson: "Delivery notices are genuine when they match something you ordered. If you didn't order anything, there's no reason to click: open the app and look."
    },
    {
      id: 'amazon-signin-fake',
      phish: true,
      from: {
        name: 'Amazon Security',
        email: 'account-alert@amazon-secure-login.net',
        flag: { t: 'lookalike', n: 'Not amazon.co.uk or amazon.com. Words like secure and login are added to make a fake domain feel safe.' }
      },
      subject: 'Unusual sign-in detected on your account',
      body: [
        {
          p: 'Dear Amazon Customer,',
          flag: { t: 'greeting', n: 'Real Amazon emails use your name.' }
        },
        'We detected a sign-in to your account from an unrecognised device (IP address 185.220.101.4).',
        {
          p: 'If this was not you, secure your account immediately or it will be closed for your protection.',
          flag: { t: 'threat', n: '"Closed for your protection" is a threat dressed up as help.' }
        },
        {
          link: 'Secure my account',
          href: 'https://amazon-secure-login.net/signin',
          cta: true,
          flag: { t: 'secrets', n: 'A fake Amazon sign-in page that captures your password the moment you type it.' }
        }
      ],
      lesson: 'Technical details like an IP address make an alert feel real, but they cost a scammer nothing. Compare this with the genuine Google alert: no threat, no deadline, real domain.'
    },
    {
      id: 'careers-roles',
      phish: false,
      from: { name: 'Careers Service', email: 'careers@plymouth.ac.uk' },
      subject: 'New graduate opportunities this week',
      body: [
        'Hi,',
        'Several new graduate scheme roles have been added to the Careers portal this week, including positions in cybersecurity, software engineering and data analysis.',
        'Log in to the Careers portal to browse and apply.',
        { sig: 'Best wishes,\nUniversity of Plymouth Careers Service' }
      ],
      good: [
        "The university's own domain.",
        "A service you'd expect to hear from, pointing you to a portal you can find yourself.",
        'No deadlines, links or requests.'
      ],
      lesson: 'A plain, expected newsletter. Notice how little it asks of you.'
    },
    {
      id: 'nhs-records-fake',
      phish: true,
      from: {
        name: 'NHS Patient Services',
        email: 'health-verify@nhs-patient-portal.co',
        flag: { t: 'lookalike', n: 'NHS email comes from nhs.uk or nhs.net addresses. nhs-patient-portal.co is a lookalike anyone could register.' }
      },
      subject: 'Your NHS records require verification',
      body: [
        {
          p: 'Dear Patient,',
          flag: { t: 'greeting', n: 'Your GP practice knows your name.' }
        },
        'As part of an NHS system upgrade, all patients are required to re-verify their details.',
        {
          p: 'Failure to do so within 7 days will result in your records being archived and inaccessible to your GP.',
          flag: { t: 'threat', n: 'Threatening access to medical care targets people who can least afford to ignore it.' }
        },
        {
          link: 'Verify my details',
          href: 'https://nhs-patient-portal.co/verify',
          cta: true,
          flag: { t: 'secrets', n: 'Would ask for your NHS number, date of birth and address: everything needed for identity theft.' }
        }
      ],
      lesson: "Health scams are cruel because they're effective. Your records won't vanish because you ignored an email; if in doubt, ring your GP practice or use the NHS App."
    },
    {
      id: 'mfa-qr',
      phish: true,
      from: {
        name: 'Microsoft 365',
        email: 'mfa-noreply@plymouth.ac.uk.mfa-enrol.com',
        flag: { t: 'buried', n: 'The address starts with plymouth.ac.uk, but read it right to left: the domain is mfa-enrol.com.' }
      },
      subject: 'Multi-factor authentication re-enrolment required',
      body: [
        'Hi,',
        'The university is upgrading its multi-factor authentication. All staff and students must re-enrol their authenticator app by Friday.',
        'Scan the code below with your phone to begin.',
        {
          qr: true,
          href: 'https://mfa-enrol.com/plymouth/login',
          flag: { t: 'qr', n: 'This QR code leads to mfa-enrol.com/plymouth/login, a fake Microsoft sign-in page. QR codes slip past email link scanners and your hover habit.' }
        },
        {
          p: 'Accounts not re-enrolled by Friday will be disabled.',
          flag: { t: 'urgency', n: 'A deadline plus a threat to disable your account.' }
        },
        { sig: 'IT Security Team' }
      ],
      lesson: '"Quishing" moves the attack to your phone, where it\'s harder to inspect the address and your work security tools aren\'t watching. Treat a QR code in an email exactly like a link.'
    },
    {
      id: 'gift-card-favour',
      phish: true,
      from: {
        name: 'Prof. Helen Carter',
        email: 'helen.carter.office@gmail.com',
        flag: { t: 'display-name', n: "A senior colleague's name on a personal Gmail address. Anyone can set any display name." }
      },
      subject: 'Quick favour',
      body: [
        'Hi,',
        "Are you on campus today? I'm in back-to-back meetings and can't take calls.",
        {
          p: "I need 5 Amazon gift cards at £50 each for the student awards this afternoon. Can you buy them now? I'll reimburse you tomorrow.",
          flag: { t: 'payment', n: 'Gift cards are untraceable once the codes are shared. No genuine manager asks staff to buy them.' }
        },
        {
          p: "Scratch off the backs and email me photos of the codes. Please keep it quiet, it's a surprise.",
          flag: { t: 'secrecy', n: '"Keep it quiet" and "can\'t take calls" both stop you checking with anyone.' }
        },
        { sig: 'Sent from my iPhone' }
      ],
      lesson: 'No links and no attachments, so nothing for a spam filter to catch. Gift card scams run purely on authority and pressure. Check with the person through a different channel before you spend a penny.'
    },
    {
      id: 'microsoft-code-real',
      phish: false,
      from: { name: 'Microsoft account team', email: 'account-security-noreply@accountprotection.microsoft.com' },
      subject: 'Microsoft account security code',
      body: [
        'Please use the following security code for the Microsoft account st**@students.plymouth.ac.uk.',
        'Security code: 482913',
        "If you didn't request a code, you can safely ignore this email. Someone else might have typed your email address by mistake.",
        { sig: 'Thanks,\nThe Microsoft account team' }
      ],
      good: [
        'A long address, but read it right to left: it ends in microsoft.com, so Microsoft controls it.',
        'No links and no request to reply. If you didn\'t ask for it, you can ignore it.',
        "The rule that matters: never share a code like this with anyone, even someone claiming to be from Microsoft."
      ],
      lesson: 'Long, odd-looking addresses aren\'t automatically fake. What matters is the domain at the end, and what the email asks you to do.'
    },
    {
      id: 'remittance-attachment',
      phish: true,
      from: { name: 'Accounts Payable', email: 'accounts@northwest-supplies.co.uk' },
      subject: 'Remittance advice: payment of £2,340.00',
      body: [
        'Good afternoon,',
        'Please find attached remittance advice for a payment of £2,340.00 made to your account today.',
        {
          attach: 'Remittance_Advice_0923.htm',
          size: '12 KB',
          flag: { t: 'attachment', n: "An .htm file opens in your browser, where it can show a convincing fake login page. Real remittances are usually PDFs, and you weren't expecting one." }
        },
        {
          p: 'Open the attachment and sign in with your email account to view the document securely.',
          flag: { t: 'secrets', n: 'Needing to sign in to read an attachment is the trick: the "secure document" is a password harvester.' }
        },
        { sig: 'Kind regards,\nAccounts Payable' }
      ],
      lesson: 'Unexpected money plus an attachment that asks you to sign in adds up to credential theft. The sender may even be a real company whose account has been compromised.'
    }
  ]
};
