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
 * Converts base64 string to URL safe base64
 * @param {String} base64String
 * @return {String} url safe base64
 */
const base64ToURLSafe = (base64String) => {
    const INVALID_CHARS = {
        '+': '-',
        '/': '_',
        '=': '',
    };
    return base64String.replace(/[+/=]/g, (m) => INVALID_CHARS[m]);
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
    base64ToURLSafe,
    base64ToHex,
};
