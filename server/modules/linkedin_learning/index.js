const got = require("got");
const log = require("../../util/log");
const {differenceInDays} = require("date-fns");
const config = require("../../config").linkedinLearningAPI;

const learningObjectRepository = require("../../repositories/learning_object");

let failedRenewals = 0;

const renewAccessToken = async () => {
    log.info("LinkedIn-L API: Attempting to renew access token..");

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
            log.info("LinkedIn-L API: Successfully renewed access token.");
        } else {
            ++failedRenewals;
            log.error("LinkedIn-L API: Failed to renew access token, statusCode: %s, statusMsg: %s",
                response.statusCode, response.statusMessage);
        }
    } catch (error) {
        ++failedRenewals;
        log.error("LinkedIn-L API: Failed to POST token renewal endpoint, err:" + error.message);
    }
};

/**
 *
 * @param {String} urn
 * @return {Object} learningObject or undefined
 */
const fetchLearningObject = async (urn) => {
    const findResult = await learningObjectRepository.findByURN(urn);
    if (findResult.rows.length > 0) {
        const lastUpdated = new Date(findResult.rows[0].timestamp);
        if (differenceInDays((new Date()), lastUpdated) < config.ttl) {
            log.info("LinkedIn-L API: Found up to date learning object (%s) in database", urn);
            return findResult.rows[0].data;
        }
        log.info("LinkedIn-L API: Found outdated learning object (%s) in database, re-fetching...", urn);
    }

    log.info("LinkedIn-L API: Attempting to fetch learning obj(%s)..", urn);

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
                "targetLocale.language": "en",
            },
            hooks: {
                afterResponse: [
                    async (response, retryWithNewToken) => {
                        if (response.statusCode === 401 && failedRenewals === 0) { // Unauthorized
                            log.error("LinkedIn-L API: failed to authenticate for learning asset endpoint. " +
                                "Attempting to retry with a new access token..");
                            await renewAccessToken();

                            // Retry
                            log.info("LinkedIn-L API: Retrying with new access token...");
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
            log.info("LinkedIn-L API: Successfully fetched learning asset.");
            await learningObjectRepository.insert({
                urn,
                timestamp: (new Date()).toUTCString(),
                data: JSON.stringify(response.body),
            });
            return response.body;
        }
    } catch (error) {
        log.error("LinkedIn-L API: Failed to GET learning asset (%s) endpoint, err: " + error.message, urn);
    }
};

/**
 * Attempt to fetch matching URN to given learningObject.
 * @param {Object} learningObject must have title & hyperlink
 * @param {String} type one L.Learning obj type COURSE / VIDEO / LEARNING_PATH
 * @return {String} URN or undefined
 */
const fetchURNByContent = async (learningObject, type) => {
    log.info("LinkedIn-L API: Attempting to find matching URN for %s (%s)", type, learningObject.data.title);
    try {
        const response = await got("https://api.linkedin.com/v2/learningAssets", {
            responseType: "json",
            headers: {
                Authorization: getOAuthToken(),
            },
            searchParams: {
                "q": "criteria",
                "start": 0,
                "count": 10,
                "assetRetrievalCriteria.includeRetired": false,
                "assetRetrievalCriteria.expandDepth": 1,
                "assetFilteringCriteria.keyword": learningObject.data.title,
                "assetFilteringCriteria.assetTypes[0]": type,
                "fields": "urn,details:(urls:(webLaunch))",
            },
            hooks: {
                afterResponse: [
                    async (response, retryWithNewToken) => {
                        if (response.statusCode === 401 && failedRenewals === 0) { // Unauthorized
                            log.error("LinkedIn-L API: failed to authenticate for learning asset endpoint. " +
                                "Attempting to retry with a new access token..");
                            await renewAccessToken();

                            // Retry
                            log.info("LinkedIn-L API: Retrying with new access token...");
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
        const elements = response.body.elements;
        for (const e of elements) {
            if (learningObject.data.hyperlink.startsWith(e.details.urls.webLaunch.substring(0, e.details.urls.webLaunch.length -2))) {
                log.info("LinkedIn-L API: Found matching URN for %s (%s) - (%s)", type, learningObject.data.title, e.urn);
                return e.urn;
            }
        }
        log.error("LinkedIn-L API: No matching URN found for %s (%s)", type, learningObject.data.title);
    } catch (error) {
        log.error("LinkedIn-L API: Failed to GET learning assets endpoint, err: " + error.message);
    }
};

const getOAuthToken = () => {
    return `Bearer ${process.env.LINKEDIN_LEARNING_TOKEN}`;
};

module.exports = {
    renewAccessToken,
    fetchLearningObject,
    fetchURNByContent,
};
