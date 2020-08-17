const sgMail = require('@sendgrid/mail');
const log = require("../../util/log");

// Configure interface
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send email asynchronously.
 * Success or failure is logged.
 * @param {String} from
 * @param {String} to
 * @param {String} subject
 * @param {String} text
 * @param {String} html
 */
const sendEmail = async (from, to, subject, text, html) => {
    log.info("'%s': Sending email to '%s'", from, to);
    try {
        await sgMail.send({
            from: from ? from : process.env.DEFAULT_EMAIL_ADDRESS,
            to,
            subject,
            text,
            html: html ? html : text,
        });
        log.info("'%s': Email sent successfully to '%s'", from, to);
    } catch (error) {
        log.error("'%s': Failed sending email to '%s', err: " +
            error.message, from, to);
    }
};

/**
 * Send a bug report email asynchronously to the bug report
 * email address specified in .env. This sets the sender
 * of the email to be the server email address, but the
 * user's email is specified in the body of the email.
 * @param {string} email the user input contact email address
 * @param {string} originalUrl
 * @param {string} report the user input bug report
 * @return {Promise}
 */
const sendBugReport = async (email, originalUrl, report) => {
    log.info("Sending bug report for route: '%s'", originalUrl);
    const fromToEmail = process.env.BUG_REPORT_EMAIL_ADDRESS;
    const subject = `[rdfmapped.com] Bug Report for route: ${originalUrl}`;
    const text = `Route: ${originalUrl} \nBug report from ${email ? email : "anonymous"}:\n${report}`;
    return sendEmail(fromToEmail, fromToEmail, subject, text);
};

module.exports = {
    sendEmail,
    sendBugReport,
};
