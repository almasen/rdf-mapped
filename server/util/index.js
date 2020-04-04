const userRepository = require("../repositories/user");
const individualRepository = require("../repositories/individual");
const organisationRepository = require("../repositories/organisation");
const eventRepository = require("../repositories/event");
const date = require("date-and-time");

const isIndividual = async (userId) => {
    const userResult = await userRepository.findById(userId);
    if (userResult.rows.length === 0) {
        throw Error(`No user with id ${userId} exists`);
    }
    const individualResult = await individualRepository.findByUserID(userId);
    return individualResult.rows.length > 0; // found at least one individual with userId
};

const isOrganisation = async (userId) => {
    const userResult = await userRepository.findById(userId);
    if (userResult.rows.length === 0) {
        throw Error(`No user with id ${userId} exists`);
    }
    const organisationResult = await organisationRepository.findByUserID(userId);
    return organisationResult.rows.length > 0; // found at least one organisation with userId
};

const checkEmail = async (email) => {
    const result = {};
    if (!email) {
        result.status = 400;
        result.message = "No email was specified";
        return result;
    }
    const userResult = await userRepository.findByEmail(email);
    const user = userResult.rows[0];
    if (!user) {
        result.status = 404;
        result.message = "No user with specified email";
        return result;
    }
    result.status = 200;
    result.user = user;
    return result;
};
const getIndividualIdFromUserId = async (userId) => {
    const individualResult = await isIndividual(userId);
    if (individualResult) {
        const individualId = await individualRepository.getIndividualId(userId);

        return individualId.rows[0].id;
    } else {
        throw new Error("User is not an individual");
    }
};
const checkUserId = async (userId) => {
    const result = {};
    if (!userId) {
        result.status = 400;
        result.message = "No user id was specified";
        return result;
    }
    if (isNaN(userId)) {
        result.status = 400;
        result.message = "ID specified is in wrong format";
        return result;
    }
    const userResult = await userRepository.findById(userId);
    const user = userResult.rows[0];
    if (!user) {
        result.status = 404;
        result.message = "No user with specified id";
        return result;
    }
    result.status = 200;
    result.user = user;
    result.message = "Found user with given id";
    return result;
};

const checkUser = async (userId) => {
    const result = {};
    const checkUserIdResult = await checkUserId(userId);
    const user = checkUserIdResult.user;
    if (user) {
        const individualResult = await individualRepository.findByUserID(userId);
        if (individualResult.rows.length>0) {
            const individualLocationResult = await individualRepository.getIndividualLocation(userId);
            if (individualLocationResult.rows.length>0) {
                result.status = 200;
                result.user = individualLocationResult.rows[0];
                return result;
            }
            result.status = 400;
            result.message = "No address associated to individual with specified user id";
            return result;
        }
        const orgResult = await organisationRepository.findByUserID(userId);
        if (orgResult.rows.length>0) {
            const orgLocationResult = await organisationRepository.getOrganisationLocation(userId);
            if (orgLocationResult.rows.length>0) {
                result.status = 200;
                result.user = orgLocationResult.rows[0];
                return result;
            }
            result.status = 400;
            result.message = "No address associated to organisation with specified user id";
            return result;
        }
        result.status = 400;
        result.message = "No individual or organisation is associated with specified user id";
        return result;
    } else {
        return checkUserIdResult;
    }
};

const checkEventId = async (eventId) => {
    const result = {};
    if (!eventId) {
        result.status = 400;
        result.message = "Event ID not defined";
        return result;
    }
    if (isNaN(eventId)) {
        result.status = 400;
        result.message = "ID specified is in wrong format";
        return result;
    }
    const eventResult = await eventRepository.findById(eventId);
    const event = eventResult.rows[0];
    if (!event) {
        result.status = 404;
        result.message = "No event with specified id";
        return result;
    }
    result.status = 200;
    result.event = event;
    result.message = "Found event with given id";
    return result;
};

/**
 * Check if input token is valid compared to
 * tokenResult - result of db query.
 * This requires the token to be of valid format,
 * matching the user specified by the userId in
 * the database and to be not expired.
 * If no token is found for specified user or
 * user is not found, a custom error is returned.
 * @param {object} tokenResult
 * @param {any} inputToken
 * @param {string} tokenVarName variable name of token
 * @return {object} isValidToken, error
 */
const isValidToken = async (tokenResult, inputToken, tokenVarName) => {
    if (tokenResult.rows.length === 0) {
        return ({
            isValidToken: false,
            error: "No token found, or user/email does not exist.",
        });
    }
    const tokenRecord = tokenResult.rows[0];
    if (tokenRecord[tokenVarName] !== inputToken) {
        return ({
            isValidToken: false,
            error: "Invalid token",
        });
    } else if (tokenRecord.expiryDate <= Date.parse(getNowInUTCAsString(0))) {
        return ({
            isValidToken: false,
            error: "Expired token",
        });
    } else {
        return ({
            isValidToken: true,
            error: null,
        });
    }
};

/**
 * Get date in UTC with optional offset in minutes.
 * Set offset to 0 to get Now() in UTC.
 * @param {Number} offsetMinutes offset in minutes
 * @return {String} date in UTC as string
 */
const getNowInUTCAsString = (offsetMinutes) => {
    return date.format(
        date.addMinutes(new Date(), offsetMinutes),
        "YYYY-MM-DD HH:mm:ss", true,
    );
};

/**
 * Sleep n milliseconds.
 * @param {number} ms
 * @return {Promise}
 */
const sleep = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

/**
 * Convert given Base64 string to hex and
 * return result.
 * @param {string} base64String
 * @return {string} in hex
 */
const base64ToHex = (base64String) => {
    const proc = atob(base64String);
    let result = '';
    for (let i = 0; i < proc.length; i++) {
        const hex = proc.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result;
};

module.exports = {
    isIndividual,
    isOrganisation,
    checkUserId,
    checkUser,
    checkEventId,
    checkEmail,
    isValidToken,
    sleep,
    getNowInUTCAsString,
    getIndividualIdFromUserId,
    base64ToHex,
};
