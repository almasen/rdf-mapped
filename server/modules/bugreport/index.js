const mail = require("../mail");
const adminService = require("../admin");
const log = require("../../util/log");
const octokit = require("../octokit");

const processBugReport = async (originalUrl, ip, email, report) => {
    log.info("Processing bug report for route: '%s'", originalUrl);
    const bugreport = {
        timestamp: (new Date()).toUTCString(),
        originalUrl,
        ip,
        email,
        report,
    };
    await sendBugReport(bugreport);
    adminService.logBugReport(bugreport);
    octokit.createBugreportIssue(bugreport);
};

/**
 * Send a bug report email asynchronously to the bug report
 * email address specified in .env. This sets the sender
 * of the email to be the server email address, but the
 * user's email is specified in the body of the email
 * if they provided one. Furthermore, the admin service
 * is called to log the bug report.
 * @param {Object} bugreport
 */
const sendBugReport = async (bugreport) => {
    await mail.sendEmail(
        process.env.BUG_REPORT_EMAIL_ADDRESS,
        process.env.BUG_REPORT_EMAIL_ADDRESS,
        `[rdfmapped.com] Bug Report for route: ${bugreport.originalUrl}`,
        `Bugreport: ${JSON.stringify(bugreport)}`,
        `<p>Bugreport: <code>${JSON.stringify(bugreport)}</code></p>`);
};

module.exports = {
    processBugReport,
};
