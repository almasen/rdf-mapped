const date = require("date-and-time");

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
    sleep,
    getNowInUTCAsString,
    base64ToHex,
};
