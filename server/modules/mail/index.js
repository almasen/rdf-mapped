const nodemailer = require('nodemailer');
const log = require("../../util/log");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Send a custom email asynchronously, returning a promise.
 * The sending of the email is skipped if in .env the
 * SKIP_MAIL_SENDING_FOR_TESTING flag is set to true.
 * @param {string} email
 * @param {string} subject
 * @param {string} text
 * @return {Promise}
 */
const sendEmail = (email, subject, text) => {
    log.info("'%s': Sending email", email);
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: subject,
            text: text,
        };
        if (process.env.SKIP_MAIL_SENDING_FOR_TESTING == true) {
            log.debug("'%s': Skipping email sending", email);
            const result = {
                status: 200,
                info: "testing",
                message: "Email sent to " + email,
            };
            resolve(result);
        } else {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    log.error("'%s': Email sending failed: " + err, email);
                    const result = {
                        status: 500,
                        info: err,
                        message: "Email sending failed to " + email,
                    };
                    resolve(result);
                } else {
                    log.info("'%s': Email sent successfully", email);
                    const result = {
                        status: 200,
                        info: info,
                        message: "Email sent to " + email,
                    };
                    resolve(result);
                }
            });
        }
    });
};

/**
 * Send a bug report email asynchronously to the bug report
 * email address specified in .env. This sets the sender
 * of the email to be the server email address, but the
 * user's email is specified in the body of the email.
 * @param {string} email the user input contact email address
 * @param {string} report the user input bug report
 * @return {Promise}
 */
const sendBugReport = (email, report) => {
    log.info("Sending bug report: '%s'", report);
    const toEmail = process.env.BUG_REPORT_EMAIL_ADDRESS;
    const subject = "Bug Report";
    const text = "Bug report from " + email + ": " + report;
    return sendEmail(toEmail, subject, text);
};

module.exports = {
    sendEmail,
    sendBugReport,
};
