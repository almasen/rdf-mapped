const adminRepo = require("../../repositories/admin");
const jose = require("../jose");
const digest = require("../digest");
const config = require("../../config").jose.aud;
const mail = require("../mail");

const bugReports = [];
const contactRequests = [];

const logInAdmin = async (email, password) => {
    const findResult = await adminRepo.findByEmail(email);
    if (findResult.rows.length === 0) {
        throw new Error("Invalid admin email.");
    }
    const admin = findResult.rows[0];
    if (digest.hashPassWithSaltInHex(password, admin.salt) === admin.passwordHash) {
        return jose.signAndEncrypt({
            sub: admin.id.toString(),
            name: admin.username,
            email: email,
        });
    } else {
        throw new Error("Invalid admin password.");
    }
};

/**
 * Attempt to authenticate admin
 * by JWE. Upon successful verification,
 * the admin's (user)name is returned.
 * Otherwise, a JWE or JWT error is thrown.
 * @param {Object} jwe
 * @return {string} name of admin
 */
const authenticateAdmin = (jwe) => {
    return jose.decryptAndVerify(jwe, config).name;
};

const logBugReport = (bugreport) => {
    bugReports.push(bugreport);
};

const logContactRequest = (contactRequest) => {
    contactRequests.push(contactRequest);
};

const sendSummary = () => {
    mail.sendEmail(
        process.env.DEFAULT_EMAIL_ADDRESS,
        process.env.SUMMARY_EMAIL_ADDRESS,
        "Your RDFmapped weekly summary",
        `Hello,\nHere is your rdfmapped.com weekly summary.\n\n` +
        `Number of new bugreports: ${bugReports.length}\nNumber of new contact requests: ${contactRequests.length}\n\n\n` +
        `Bug reports: ${bugReports.toString()}\n\n` +
        `Contact requests: ${contactRequests.toString()}\n\n`,
        `<p>Hello,</p><p>Here is your rdfmapped.com weekly summary.<br></p>` +
        `<p>Number of new bugreports: <b>${bugReports.length}</b></p>` +
        `<p>Number of new contact requests: <b>${contactRequests.length}</b><br></p>` +
        `<p>Bug reports: <code>${JSON.stringify(bugReports)}</code><br></p>` +
        `<p>Contact requests: <code>${JSON.stringify(contactRequests)}</code></p>`);
    bugReports.length = 0;
    contactRequests.length = 0;
};

module.exports = {
    logInAdmin,
    authenticateAdmin,
    logBugReport,
    logContactRequest,
    sendSummary,
};
