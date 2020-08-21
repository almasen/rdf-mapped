const {request} = require("@octokit/request");
const log = require("../../util/log");
const digest = require("../digest");

const anonymiseData = (data) => {
    if (data.email) {
        const anonId = digest.hashPassWithSaltInHex(
            data.email,
            process.env.SERVER_SIG_KEY,
        );
        data.email = anonId;
    }
    if (data.ip) {
        const anonIp = digest.hashPassWithSaltInHex(
            data.ip,
            process.env.SERVER_SIG_KEY,
        );
        data.ip = anonIp;
    }
    if (data.name) {
        const anonName = digest.hashPassWithSaltInHex(
            data.name,
            process.env.SERVER_SIG_KEY,
        );
        data.name = anonName;
    }
    if (data['g-recaptcha-response']) {
        const anonRes = digest.hashPassWithSaltInHex(
            data['g-recaptcha-response'],
            process.env.SERVER_SIG_KEY,
        );
        data['g-recaptcha-response'] = anonRes;
    }
    return data;
};

const createIssueBody = (data) => {
    const anonymisedData = anonymiseData(data);
    return `### ${data.subject ? data.subject : 'Route ' + data.originalUrl}\n\n` +
        `${data.report ? data.report : data.message}\n\n` +
        'Metadata:\n```yaml\n' +
        JSON.stringify(anonymisedData, null, 4) +
        '\n```';
};

const createBugreportIssue = async (bugreport) => {
    await createIssue(
        `[bugreport] ${bugreport.subject ? bugreport.subject : 'Auto bugreport for route ' + bugreport.originalUrl}`,
        createIssueBody(bugreport),
        "bugreport",
    );
};

const createFeatureRequestIssue = async (featureRequest) => {
    await createIssue(
        `[feature request] ${featureRequest.subject}`,
        createIssueBody(featureRequest),
        "feature request",
    );
};

const createIssue = async (title, body, label) => {
    try {
        if (process.env.CREATE_GITHUB_ISSUES == false) {
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
