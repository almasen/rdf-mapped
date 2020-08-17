const mail = require("../mail");
const adminService = require("../admin");
const log = require("../../util/log");

/**
 * Send a bug report email asynchronously to the bug report
 * email address specified in .env. This sets the sender
 * of the email to be the server email address, but the
 * user's email is specified in the body of the email
 * if they provided one. Furthermore, the admin service
 * is called to log the bug report.
 * @param {string} originalUrl
 * @param {string} ip
 * @param {string} email if provided by the user
 * @param {string} report the user input bug report
 */
const sendBugReport = async (originalUrl, ip, email, report) => {
    log.info("Sending bug report for route: '%s'", originalUrl);
    const bugreport = {
        timestamp: (new Date()).toUTCString(),
        originalUrl,
        ip,
        email,
        report,
    };
    adminService.logBugReport(bugreport);
    await mail.sendEmail(
        process.env.BUG_REPORT_EMAIL_ADDRESS,
        process.env.BUG_REPORT_EMAIL_ADDRESS,
        `[rdfmapped.com] Bug Report for route: ${originalUrl}`,
        `Bugreport: ${JSON.stringify(bugreport)}`,
        `<p>Bugreport: <code>${JSON.stringify(bugreport)}</code></p>`);
};

module.exports = {
    sendBugReport,
};
