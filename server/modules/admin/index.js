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
    console.log(bugReports.length);
    bugReports.push(bugreport);
    console.log(bugReports.length);
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
        `Number of new bugreports:${bugReports.length}\nNumber of new contact requests\n\n\n` +
        `Bug reports:\n${bugReports.toString()}` +
        `Contact requests:\n${contactRequests.toString()}`);
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
