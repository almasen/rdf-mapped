/**
 * @module mail
 */
const sgMail = require('@sendgrid/mail');
const log = require("../../util/log");

// Configure interface
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send email asynchronously.
 * Supports both HTML and plain text email bodies.
 * Success or failure is logged.
 * @param {String} from
 * @param {String} to
 * @param {String} subject
 * @param {String} text
 * @param {String} [html=text] text will be used as html body if omitted
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

module.exports = {
    sendEmail,
};
