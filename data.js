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
      examples: ['https://login.microsoft.com.verify-identity.co/unlock', 'https://www.gov.uk.tax-refund-claim.com/hmrc'],
      check: 'Read the domain from right to left. In login.microsoft.com.verify-identity.co the website is verify-identity.co; everything to its left can be made up.'
    },
    {
      id: 'display-name',
      name: 'Borrowed name',
      summary: "The display name says Royal Mail or your manager, but the address behind it doesn't match.",
      examples: ['Karen Hughes <karen.hughes.office@gmail.com>', 'Royal Mail <redelivery@rm-parcel-update.co>'],
      check: 'Open the sender details. A display name is just text that anyone can type; the address is what counts. Organisations rarely email from free accounts like Gmail or Outlook.'
    },
    {
      id: 'reply-to',
      name: 'Redirected reply',
      summary: 'The email comes from one address, but replies quietly go to another.',
      examples: ['From: dave@dmkitchens.co.uk', 'Reply-To: dmkitchens.accounts@outlook.com'],
      check: "Check the Reply-To field before you answer anything about money or accounts. If it's different from the sender, ask why."
    },
    {
      id: 'disguised-link',
      name: 'Disguised link',
      summary: 'The words of a link point one way and the link goes somewhere else.',
      examples: ['Says: royalmail.com/redelivery', 'Goes to: https://royalmail.com-redeliver.info/pay'],
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
      examples: ['You will need your card number, expiry date and security code.', 'Move your balance to a temporary safe account.'],
      check: "Legitimate organisations don't ask for these by email. Never type a password into a page you reached from an email link, and never share a one-time code with anyone."
    },
    {
      id: 'attachment',
      name: 'Unexpected attachment',
      summary: 'A file you weren\'t expecting, often a type that can run code or show a fake login page.',
      examples: ['Delivery_Label_UK.zip', 'Account_Review_Form.pdf.html'],
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
      examples: ['Scan the code to pay your parking charge.'],
      check: 'Treat a QR code in an email exactly like a link. Your phone usually shows the address before opening it: read it, and if in doubt, don\'t scan.'
    }
  ],

  EMAILS: [
    /* ---------- Phishing ---------- */
    {
      id: 'mailbox-full',
      phish: true,
      from: {
        name: 'Mail Administrator',
        email: 'no-reply@mailbox-quota-alert.com',
        flag: { t: 'display-name', n: "'Mail Administrator' sounds official, but your email provider would email you from its own domain, not mailbox-quota-alert.com." }
      },
      subject: {
        text: 'Your mailbox is 98% full',
        flag: { t: 'threat', n: 'A full inbox is a worry most people can believe, which is exactly why scammers use it.' }
      },
      body: [
        {
          p: 'Dear User,',
          flag: { t: 'greeting', n: 'Your email provider knows your name and address.' }
        },
        {
          p: 'Your mailbox has almost reached its storage limit. New messages will be rejected and returned to the sender within 24 hours.',
          flag: { t: 'urgency', n: 'Twenty-four hours before you "lose" your email: designed to make you act now.' }
        },
        {
          link: 'Get free extra storage',
          href: 'https://mail-storage-upgrade.net/login',
          cta: true,
          flag: { t: 'disguised-link', n: 'The button promises free storage but goes to mail-storage-upgrade.net, a fake login page for your email account.' }
        },
        { sig: 'Mail Administrator' }
      ],
      lesson: "A classic way to steal your email password, which then unlocks password resets for everything else. If you're worried about storage, check it in your email app or settings, not through a link."
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
      id: 'courier-zip',
      phish: true,
      from: {
        name: 'Evri Delivery',
        email: 'notification@evri-parcels-uk.com',
        flag: { t: 'lookalike', n: "Evri's real website is evri.com. Adding -parcels-uk makes a completely different domain." }
      },
      subject: 'We missed you: print your delivery label',
      body: [
        'Hello,',
        'Our driver was unable to deliver your parcel today because nobody was home.',
        {
          p: 'Please print the attached label and bring it to your nearest ParcelShop within 3 days, or your parcel will be returned.',
          flag: { t: 'urgency', n: 'Three days, then your parcel "goes back": pressure to open the attachment without thinking.' }
        },
        {
          attach: 'Delivery_Label_UK.zip',
          size: '186 KB',
          flag: { t: 'attachment', n: "Couriers don't send delivery labels as .zip files. A zip can hide a program that installs malware when you open it." }
        },
        { sig: 'Evri Customer Team' }
      ],
      lesson: 'Missed-delivery emails are one of the most common scams in the UK. If you think you missed a parcel, use the tracking number from the shop you ordered from, on the courier\'s own website.'
    },
    {
      id: 'builder-bank-change',
      phish: true,
      from: { name: 'Dave at DM Kitchens', email: 'dave@dmkitchens.co.uk' },
      replyTo: {
        email: 'dmkitchens.accounts@outlook.com',
        flag: { t: 'reply-to', n: 'The email came from dmkitchens.co.uk, but your reply would go to a free Outlook address. This is how fraudsters slip into a real conversation.' }
      },
      subject: 'Kitchen fitting: deposit details',
      body: [
        'Hi,',
        'Thanks again for choosing us for your new kitchen. We can start on the 14th as planned.',
        {
          p: 'Just a heads up, we have changed banks. Please send the £2,400 deposit to the new account below rather than the one on your quote.',
          flag: { t: 'payment', n: 'A change of bank details by email is the biggest single warning sign of this kind of fraud. Always ring the trader on a number you already had.' }
        },
        'Account name: DM Kitchens Ltd\nSort code: 20-45-77\nAccount number: 83920164',
        {
          p: "I'm on site all week with no signal, so email is best. The sooner it's in, the sooner we can order your units.",
          flag: { t: 'secrecy', n: '"Email is best" stops you phoning to check. The rush to order units adds pressure.' }
        },
        { sig: 'Cheers,\nDave\nDM Kitchens' }
      ],
      lesson: "The sender address may be real because the trader's own email was hacked, so checking the domain won't save you here. A bank change plus 'don't call me' should always mean picking up the phone before you pay."
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
      id: 'hmrc-refund',
      phish: true,
      from: {
        name: 'HMRC',
        email: 'refunds@hmrc-taxrefund-uk.com',
        flag: { t: 'lookalike', n: 'HMRC is part of government, so its addresses end in gov.uk. Anyone can register hmrc-taxrefund-uk.com.' }
      },
      subject: {
        text: 'You are eligible for a tax refund of £326.18',
        flag: { t: 'too-good', n: "Money you weren't expecting is the hook. HMRC says it never tells people about refunds by email." }
      },
      body: [
        {
          p: 'Dear Taxpayer,',
          flag: { t: 'greeting', n: 'HMRC knows exactly who you are.' }
        },
        'After the annual calculation of your fiscal activity, we have determined that you are eligible to receive a tax refund of £326.18.',
        {
          p: 'You must submit your claim within 5 working days or the refund will be cancelled.',
          flag: { t: 'urgency', n: 'A deadline on free money, so you rush the form.' }
        },
        {
          link: 'Claim your refund',
          href: 'https://www.gov.uk.tax-refund-claim.com/hmrc',
          cta: true,
          flag: { t: 'buried', n: 'It starts www.gov.uk, but read it right to left: the website is tax-refund-claim.com.' }
        },
        { sig: 'HM Revenue & Customs' }
      ],
      lesson: "Tax refund emails are among the most common scams in the UK. Real refunds are handled through your tax code, your employer or your own GOV.UK account. Forward fakes to phishing@hmrc.gov.uk."
    },
    {
      id: 'dvla-tax',
      phish: true,
      from: {
        name: 'DVLA',
        email: 'vehicle-tax@dvla-renewals.co.uk',
        flag: { t: 'lookalike', n: 'The DVLA is a government agency. dvla-renewals.co.uk has nothing to do with it.' }
      },
      subject: 'Your vehicle tax payment has failed',
      body: [
        {
          p: 'Dear Customer,',
          flag: { t: 'greeting', n: 'The DVLA knows the registered keeper\'s name.' }
        },
        'Your latest vehicle tax payment was declined by your bank.',
        {
          p: 'Driving an untaxed vehicle can lead to a fine of up to £1,000 and your vehicle being clamped.',
          flag: { t: 'threat', n: 'Fines and clamping: a frightening threat to stop you checking.' }
        },
        {
          link: 'Update payment details',
          href: 'https://dvla-renewals.co.uk/payment',
          cta: true,
          flag: { t: 'secrets', n: 'A fake payment page built to collect your card or bank details.' }
        },
        { sig: 'DVLA Vehicle Tax Team' }
      ],
      lesson: 'The DVLA says it never emails asking you to confirm payment or bank details. You can check whether your car is taxed for free on GOV.UK in about 30 seconds.'
    },
    {
      id: 'energy-rebate',
      phish: true,
      from: {
        name: 'Ofgem Energy Support',
        email: 'support@ofgem-energy-rebate.com',
        flag: { t: 'display-name', n: "Ofgem is the energy regulator. It doesn't pay money to households, and its emails wouldn't come from a .com rebate domain." }
      },
      subject: {
        text: 'You have an unclaimed £400 energy rebate',
        flag: { t: 'too-good', n: 'A government-sounding windfall, timed to land when bills are on everyone\'s mind.' }
      },
      body: [
        'Hello,',
        'Following the latest energy price cap review, your household qualifies for a one-off rebate of £400.',
        {
          link: 'Apply for your rebate',
          href: 'https://ofgem-energy-rebate.com/apply',
          cta: true,
          flag: { t: 'secrets', n: 'The "application" asks for your bank details so they can "pay" you.' }
        },
        {
          p: 'This offer ends on Friday. Unclaimed funds will be returned to the Treasury.',
          flag: { t: 'urgency', n: 'A Friday deadline so you apply before talking to anyone.' }
        },
        { sig: 'Ofgem Energy Support Team' }
      ],
      lesson: "Real energy support is applied automatically by your supplier or announced on GOV.UK. You never have to hand over bank details to an email to receive it."
    },
    {
      id: 'bank-safe-account',
      phish: true,
      from: {
        name: 'Westbridge Bank Fraud Team',
        email: 'fraud-team@westbridge-secure-banking.com',
        flag: { t: 'lookalike', n: "Westbridge Bank's real emails come from westbridgebank.co.uk. Adding -secure-banking makes a different domain." }
      },
      subject: 'Urgent: suspicious payment on your account',
      body: [
        {
          p: 'Dear Valued Customer,',
          flag: { t: 'greeting', n: 'Your bank knows your name and will use it.' }
        },
        'We have stopped a payment of £1,840.00 to an unrecognised account and believe your account may be compromised.',
        {
          p: 'To protect your money, move your balance to a temporary safe account we have set up in your name. Details are on the secure page below.',
          flag: { t: 'payment', n: 'No genuine bank will ever ask you to move money to a "safe account". This one line is always a scam.' }
        },
        {
          link: 'Protect my money',
          href: 'https://westbridge-secure-banking.com/safe-account',
          cta: true,
          flag: { t: 'secrets', n: 'Leads to a page that collects your login details and the transfer.' }
        },
        {
          p: 'Do not discuss this with branch staff, as the fraud may involve an employee.',
          flag: { t: 'secrecy', n: 'Telling you not to speak to your own bank is the clearest sign there is.' }
        }
      ],
      lesson: "Safe-account scams have cost people their life savings. Your bank will never ask you to move money to keep it safe. Hang up, or close the email, and call the number on the back of your card. In the UK you can also call 159 to reach your bank."
    },
    {
      id: 'icloud-storage',
      phish: true,
      from: {
        name: 'iCloud',
        email: 'noreply@icloud-storage-alerts.com',
        flag: { t: 'lookalike', n: "Apple emails come from apple.com or icloud.com, not icloud-storage-alerts.com." }
      },
      subject: {
        text: 'Your photos and videos will be deleted',
        flag: { t: 'threat', n: 'Losing family photos is one of the most upsetting threats there is, which is why scammers use it.' }
      },
      body: [
        'Hello,',
        {
          p: 'Your iCloud storage is full. Your photos and videos will be permanently deleted within 48 hours unless you upgrade.',
          flag: { t: 'urgency', n: 'A deadline on something precious. Real storage limits just stop new photos backing up; nothing is deleted.' }
        },
        {
          p: 'As a loyal customer, you can claim 50GB of extra storage for just £1.99.',
          flag: { t: 'too-good', n: 'A suspiciously cheap upgrade makes handing over card details feel low risk.' }
        },
        {
          link: 'Upgrade now',
          href: 'https://icloud-storage-alerts.com/upgrade',
          cta: true,
          flag: { t: 'secrets', n: 'The page asks for your Apple ID password and card details.' }
        }
      ],
      lesson: "If your storage really is full, your phone will tell you in Settings. Check there rather than following a link, and remember that full storage doesn't delete anything."
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
      id: 'parking-qr',
      phish: true,
      from: {
        name: 'Parking Enforcement',
        email: 'pcn@uk-parking-penalty.com',
        flag: { t: 'display-name', n: 'A vague, official-sounding name on a made-up domain. Council parking emails would come from the council\'s own gov.uk address.' }
      },
      subject: {
        text: 'Penalty Charge Notice: payment overdue',
        flag: { t: 'threat', n: 'Most people have parked somewhere recently, so a fine feels believable.' }
      },
      body: [
        'Hello,',
        'Our records show an unpaid Penalty Charge Notice for a vehicle registered to you.',
        {
          p: 'The charge is £35 if paid within 14 days. After that it rises to £70 and may be passed to enforcement agents.',
          flag: { t: 'urgency', n: 'A discount for paying fast, and a threat if you don\'t: double pressure.' }
        },
        'Scan the code below with your phone to view the photo evidence and pay.',
        {
          qr: true,
          href: 'https://uk-parking-penalty.com/pay',
          flag: { t: 'qr', n: 'This QR code leads to uk-parking-penalty.com/pay, a fake payment page. QR codes slip past email security and are hard to check on a phone.' }
        },
        { sig: 'Parking Enforcement Team' }
      ],
      lesson: "Real parking tickets go on your windscreen or come by post, and give the issuer's name and a reference you can check on their official website. Never pay a fine through a QR code in an email."
    },
    {
      id: 'gift-card-favour',
      phish: true,
      from: {
        name: 'Karen Hughes',
        email: 'karen.hughes.office@gmail.com',
        flag: { t: 'display-name', n: "Your manager's name on a personal Gmail address. Anyone can set any display name." }
      },
      subject: 'Quick favour',
      body: [
        'Hi,',
        "Are you in today? I'm stuck in meetings all afternoon and can't take calls.",
        {
          p: "I need 5 Amazon gift cards at £50 each for a client this afternoon. Can you pick them up on your lunch? I'll pay you back tomorrow.",
          flag: { t: 'payment', n: 'Gift cards are untraceable once the codes are shared. No genuine manager asks staff to buy them.' }
        },
        {
          p: "Scratch off the backs and email me photos of the codes. Please keep it between us for now.",
          flag: { t: 'secrecy', n: '"Keep it between us" and "can\'t take calls" both stop you checking with anyone.' }
        },
        { sig: 'Sent from my iPhone' }
      ],
      lesson: 'No links and no attachments, so nothing for a spam filter to catch. Gift card scams run purely on authority and pressure. Check with the person in a different way, by phone or in person, before you spend a penny.'
    },

    /* ---------- Legitimate ---------- */
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
      id: 'bank-statement',
      phish: false,
      from: { name: 'Westbridge Bank', email: 'statements@westbridgebank.co.uk' },
      subject: 'Your October statement is ready',
      body: [
        'Hello Jamie,',
        'Your statement for your current account ending 4417 is now ready to view.',
        "To see it, log in to the Westbridge app or online banking as you normally would. We haven't included a link, for your security.",
        'Remember: we will never ask you to move money to a safe account, or ask for your full PIN or passcode.',
        { sig: 'Westbridge Bank' }
      ],
      good: [
        "Sent from westbridgebank.co.uk, the bank's own domain.",
        'Uses your name and only the last four digits of your account.',
        "No link at all: it tells you to log in the way you normally would. That's what good banks do."
      ],
      lesson: "Compare this with the fake fraud-team email. A real bank email tells you something, asks nothing, and sends you to the app you already use."
    },
    {
      id: 'gp-appointment',
      phish: false,
      from: { name: 'Riverside Medical Practice', email: 'riverside.practice@nhs.net' },
      subject: 'Appointment reminder: Thursday 10:40',
      body: [
        'Dear Jamie,',
        'This is a reminder of your appointment with Dr Patel on Thursday at 10:40.',
        "If you can't attend, please call the surgery on the usual number so we can offer the slot to someone else.",
        { sig: 'Kind regards,\nReception Team\nRiverside Medical Practice' }
      ],
      good: [
        'Sent from nhs.net, the NHS\'s own email service.',
        'Specific details you can check: a named doctor, a day and a time you booked.',
        'No links, no requests for information, and it asks you to phone the number you already have.'
      ],
      lesson: 'The genuine version of an NHS email. Compare it with the fake "records verification" one: real, specific, and asking nothing of you.'
    },
    {
      id: 'council-bins',
      phish: false,
      from: { name: 'Plymouth City Council', email: 'waste@plymouth.gov.uk' },
      subject: 'Bin collections over the bank holiday',
      body: [
        'Hello,',
        'Because of the bank holiday, collections next week will be one day later than usual. Please put your bins out by 6:30am on your new collection day.',
        { link: 'Check your collection day', href: 'https://www.plymouth.gov.uk/bins-and-recycling' },
        { sig: 'Waste Services\nPlymouth City Council' }
      ],
      good: [
        'Sent from plymouth.gov.uk. Only public bodies can have gov.uk addresses.',
        'The link stays on www.plymouth.gov.uk.',
        "It's information only: no payment, no deadline, no personal details."
      ],
      lesson: 'Legitimate emails can contain links. What matters is where they go, and this one stays on the council\'s own website.'
    },
    {
      id: 'family-photos',
      phish: false,
      from: { name: 'Auntie Jean', email: 'jean.morris58@gmail.com' },
      subject: 'Photos from Sunday',
      body: [
        'Hello love,',
        "Lovely to see you all at Grandad's birthday. Here are the photos I took, sorry some are a bit blurry!",
        { attach: 'IMG_2041.jpg', size: '2.1 MB' },
        { attach: 'IMG_2044.jpg', size: '1.8 MB' },
        'Speak soon, and give the kids a hug from me.',
        { sig: 'Lots of love,\nJean xx' }
      ],
      good: [
        'A Gmail address is normal for family and friends; it\'s only suspicious when it claims to be a company or your boss.',
        "It mentions a real event you'd recognise, in a voice you'd know.",
        'The attachments are ordinary photos (.jpg) that you were expecting.'
      ],
      lesson: "Not everything from a free email address is a scam. The question is always: does this match who it claims to be and what you'd expect? If an email from a relative ever asks for money, ring them first."
    },
    {
      id: 'shop-order',
      phish: false,
      from: { name: 'Pebble & Fern', email: 'orders@pebbleandfern.co.uk' },
      subject: 'Order #PF10482 confirmed',
      body: [
        'Hi Jamie,',
        "Thanks for your order! We're getting it ready now.",
        '1 × Hand-thrown mug (sage)\n1 × Linen tea towel\nTotal: £34.50',
        "We'll email you again with tracking details once it has been posted, usually within 2 working days.",
        { sig: 'Thanks for supporting a small business,\nPebble & Fern' }
      ],
      good: [
        "You might not know this domain, but it matches the shop's name, and you'd recognise the order.",
        'It lists exactly what you bought and asks for nothing.',
        'No payment request: you already paid on their website.'
      ],
      lesson: "An unfamiliar sender isn't automatically a scam. If it matches something you actually did, like an order you placed, it's very likely genuine."
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
      id: 'microsoft-code-real',
      phish: false,
      from: { name: 'Microsoft account team', email: 'account-security-noreply@accountprotection.microsoft.com' },
      subject: 'Microsoft account security code',
      body: [
        'Please use the following security code for the Microsoft account ja**@example.co.uk.',
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
    }
  ]
};
