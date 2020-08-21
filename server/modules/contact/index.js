const mail = require("../mail");
const admin = require("../admin");
const octokit = require("../octokit");

const processContactRequest = async (ip, data) => {
    const contactRequest = {...data};
    contactRequest.timestamp = (new Date()).toUTCString();
    contactRequest.ip = ip;
    await sendContactRequest(contactRequest);
    admin.logContactRequest(contactRequest);
    console.log(contactRequest);
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

const sendContactRequest = async (contactRequest) => {
    await mail.sendEmail(
        process.env.CONTACT_EMAIL_ADDRESS,
        process.env.CONTACT_EMAIL_ADDRESS,
        `[rdfmapped.com] Contact form: ${contactRequest.subject}`,
        `Contact request from ${contactRequest.email} - ${contactRequest.name}:\n${contactRequest.message}`,
    );
};

module.exports = {
    processContactRequest,
};
