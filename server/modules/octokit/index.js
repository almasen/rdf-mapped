/**
 * @module octokit
 */
const {request} = require("@octokit/request");
const log = require("../../util/log");
const digest = require("../digest");

/**
 * Cryptographically anonymise the data of an issue body
 * to ensure privacy of users.
 * Anonymise the following parameters (if present):
 * email, ip, name, reCAPTCHA response.
 * The anonymised data can be used for reference by server
 * admins with the possession of the server's secret.
 * @param {Object} data
 * @return {Object} anonymised data
 */
const anonymiseData = (data) => {
    if (data.email) {
        const anonId = digest.hashPassWithSaltInHex(
            data.email,
            process.env.SERVER_SECRET,
        );
        data.email = anonId;
    }
    if (data.ip) {
        const anonIp = digest.hashPassWithSaltInHex(
            data.ip,
            process.env.SERVER_SECRET,
        );
        data.ip = anonIp;
    }
    if (data.name) {
        const anonName = digest.hashPassWithSaltInHex(
            data.name,
            process.env.SERVER_SECRET,
        );
        data.name = anonName;
    }
    if (data['g-recaptcha-response']) {
        const anonRes = digest.hashPassWithSaltInHex(
            data['g-recaptcha-response'],
            process.env.SERVER_SECRET,
        );
        data['g-recaptcha-response'] = anonRes;
    }
    return data;
};

/**
 * Create markdown formatted issue body string
 * from pretty printed issue data and metadata.
 * @param {Object} data
 * @return {String} markdown formatted issue body
 */
const createIssueBody = (data) => {
    return `### ${data.subject ? data.subject : 'Route ' + data.originalUrl}\n\n` +
        `${data.report ? data.report : data.message}\n\n` +
        'Metadata:\n```yaml\n' +
        JSON.stringify(data, null, 4) +
        '\n```';
};

/**
 * Create bugreport Github issue:
 * Anonymise PII in bugreport, create
 * formatted issue body and post the
 * issue to Github via Github API.
 * @param {Object} bugreport
 */
const createBugreportIssue = async (bugreport) => {
    await createIssue(
        `[bugreport] ${bugreport.subject ? bugreport.subject : 'Auto bugreport for route ' + bugreport.originalUrl}`,
        createIssueBody(anonymiseData(bugreport)),
        "bugreport",
    );
};

/**
 * Create feature request Github issue:
 * Anonymise PII in feature request, create
 * formatted issue body and post the
 * issue to Github via Github API.
 * @param {Object} featureRequest
 */
const createFeatureRequestIssue = async (featureRequest) => {
    await createIssue(
        `[feature request] ${featureRequest.subject}`,
        createIssueBody(anonymiseData(featureRequest)),
        "feature request",
    );
};

/**
 * Create an issue on Github via Github API
 * with given issue title, body and label.
 * @param {String} title
 * @param {String} body
 * @param {String} label
 */
const createIssue = async (title, body, label) => {
    try {
        if (process.env.CREATE_GITHUB_ISSUES === '0') {
            log.info("Skipping creation of Github Issue - %s", title);
            return;
        }
        log.info("Creating Github Issue - %s", title);
        await request("POST /repos/almasen/rdf-mapped/issues", {
            headers: {
                authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
            title,
            body,
            labels: [label],
        });
    } catch (error) {
        log.error("Github Issue creation FAILED, err: " + error.message);
    };
};

module.exports = {
    createBugreportIssue,
    createFeatureRequestIssue,
};
