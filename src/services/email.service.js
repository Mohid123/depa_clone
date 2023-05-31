const nodemailer = require('nodemailer');
const fs = require('fs');
const util = require('util');
const config = require('../config/config');
const logger = require('../config/logger');
const { Email } = require('../models');

const readFile = util.promisify(fs.readFile);

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Create a email
 * @param {Object} emailBody
 * @returns {Promise<Company>}
 */
const createEmail = async (emailBody) => {
  // Workflow Active step user email
  await sendEmailWithTemplate(
    emailBody.to,
    "Workflow Active User Notify",
    "src/emails/workflow/active-user.template.html",
    emailBody
  );
  // Workflow users notification email
  await sendEmailWithTemplate(
    emailBody.to,
    "Workflow Notification Email",
    "src/emails/workflow/notify-user.template.html",
    {
      name: "Fahad"
    }
  );
  return emailBody;
  // return Company.create(emailBody);
};

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send the email with the template
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmailWithTemplate = async (to, subject, templatePath, replacements) => {
  try {
    // Read the email template file
    const template = await readFile(templatePath, 'utf8');

    // Replace placeholders in the template with actual values
    let emailContent = template;
    for (const key in replacements) {
      const value = replacements[key];
      emailContent = emailContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    // Send the email
    const mailOptions = {
      to: to,
      subject: subject,
      html: emailContent
    };

    const info = await transport.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

/**
 * Query for emails
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEmails = async (filter, options) => {
  const emails = await Email.paginate(filter, options);
  return emails;
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailWithTemplate,
  createEmail,
  queryEmails
};
