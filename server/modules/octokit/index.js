const {request} = require("@octokit/request");
const log = require("../../util/log");
const digest = require("../digest");

const anonymiseData = (data) => {
    const anonId = digest.hashPassWithSaltInHex(
        data.email,
        process.env.SERVER_SIG_KEY
    );
    data.email = anonId;
    const anonIp = digest.hashPassWithSaltInHex(
        data.ip,
        process.env.SERVER_SIG_KEY,
    );
    data.ip = anonIp;
    return data;
};

const createIssueBody = (data) => {
    const anonymisedData = anonymiseData(data);
    return '```yaml\n' + JSON.stringify(anonymisedData, null, 4) + '\n```';
};

const createBugreportIssue = async (bugreport) => {
    await createIssue(
        `[bugreport] ${bugreport.title ? bugreport.title : 'Auto bugreport for route ' + bugreport.originalUrl}`,
        createIssueBody(bugreport),
        "bugreport",
    );
};

const createFeatureRequestIssue = async (featureRequest) => {
    // TODO:
};

const createIssue = async (title, body, label) => {
    try {
        log.info("Creating Github Issue - %s", title);
        await request("POST /repos/almasen/rdf-mapped/issues", {
            headers: {
                authorization: `token ${process.env.GITHUB_TOKEN2}`,
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
