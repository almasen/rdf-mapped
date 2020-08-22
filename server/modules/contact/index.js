/**
 * @module contact
 */
const mail = require("../mail");
const admin = require("../admin");
const octokit = require("../octokit");

/**
 * Process contact request submitted by a user
 * on the /contact route: Send the contact request
 * email to admin, log the request via the admin module
 * and create an anonymised issue on Github if the
 * reason of request is either a bugreport or a
 * feature request.
 * @param {String} ip
 * @param {Object} data form data
 */
const processContactRequest = async (ip, data) => {
    const contactRequest = {...data};
    contactRequest.timestamp = (new Date()).toUTCString();
    contactRequest.ip = ip;
    await sendContactRequest(contactRequest);
    admin.logContactRequest(contactRequest);
    switch (contactRequest.reason) {
        case "bugreport":
            octokit.createBugreportIssue(contactRequest);
            break;

        case "feature_request":
            octokit.createFeatureRequestIssue(contactRequest);
            break;

        default:
            break;
    }
};

/**
 * Send a contact request email to the admin email address
 * specified in .env. This sets the sender of the email
 * to be the server email address, but the user's email
 * is specified in the body of the email.
 * @param {Object} contactRequest
 */
const sendContactRequest = async (contactRequest) => {
    await mail.sendEmail(
        process.env.CONTACT_EMAIL_ADDRESS,
        process.env.CONTACT_EMAIL_ADDRESS,
        `[rdfmapped.com] Contact form: ${contactRequest.subject}`,
        `Contact request [${contactRequest.reason}] from ${contactRequest.email} - ${contactRequest.name}:\n${contactRequest.message}`,
        `<h2>Contact request</h2><p>reason: ${contactRequest.reason}</p><p>subject: ${contactRequest.subject}</p>` +
            `<p>email: ${contactRequest.email}</p><p>name: ${contactRequest.email}</p><p>message: ${contactRequest.message}</p>`,
    );
};

module.exports = {
    processContactRequest,
};
