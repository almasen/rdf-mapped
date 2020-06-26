const got = require("got");
const log = require("../../util/log");

let failedRenewals = 0;

const renewAccessToken = async () => {
    log.info("Linkedin-L API: Attempting to renew access token..");

    try {
        const response = await got.post("https://www.linkedin.com/oauth/v2/accessToken", {
            responseType: "json",
            searchParams: {
                "grant_type": "client_credentials",
                "client_id": process.env.LINKEDIN_LEARNING_ID,
                "client_secret": process.env.LINKEDIN_LEARNING_SECRET,
            },
        });

        if (response.statusCode === 200) {
            process.env.LINKEDIN_LEARNING_TOKEN = response.body.access_token;
            failedRenewals = 0;
            log.info("Linkedin-L API: Successfully renewed access token.");
        } else {
            ++failedRenewals;
            log.error("Linkedin-L API: Failed to renew access token, statusCode: %s, statusMsg: %s",
                response.statusCode, response.statusMessage);
        }
    } catch (error) {
        ++failedRenewals;
        log.error("Linkedin-L API: Failed to POST token renewal endpoint, err:" + error.message);
    }
};

const fetchLearningObject = async (urn) => {
    log.info("Linkedin-L API: Attempting to fetch learning obj(%s)..", urn);

    const meta = [
        "urn",
        "title:(value)",
    ];

    const details = [
        "urls:(webLaunch)",
        "shortDescriptionIncludingHtml:(value)",
        "images:(primary)",
        "descriptionIncludingHtml:(value)",
        "timeToComplete:(duration)",
    ];

    try {
        const response = await got("https://api.linkedin.com/v2/learningAssets/" + urn, {
            responseType: "json",
            headers: {
                Authorization: getOAuthToken(),
            },
            searchParams: {
                "fields": `${meta.join()},details:(${details.join()})`,
                "expandDepth": 1,
            },
            hooks: {
                afterResponse: [
                    async (response, retryWithNewToken) => {
                        if (response.statusCode === 401 && failedRenewals === 0) { // Unauthorized
                            log.error("Linkedin-L API: failed to authenticate for learning asset endpoint. " +
                                "Attempting to retry with a new access token..");
                            await renewAccessToken();

                            // Retry
                            log.info("Linkedin-L API: Retrying with new access token...");
                            return retryWithNewToken();
                        }

                        // No changes otherwise
                        return response;
                    },
                ],
                beforeRetry: [
                    async (options, error, retryCount) => {
                        options.headers.Authorization = getOAuthToken();
                    },
                ],
            },
        });
        if (response.statusCode === 200) {
            log.info("Linkedin-L API: Successfully fetched learning asset.");
            return response.body;
        }
    } catch (error) {
        log.error("Linkedin-L API: Failed to GET learning asset endpoint, err: " + error.message);
    }
};

const getOAuthToken = () => {
    return `Bearer ${process.env.LINKEDIN_LEARNING_TOKEN}`;
};

module.exports = {
    renewAccessToken,
    fetchLearningObject,
};
