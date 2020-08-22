/**
 * @module captcha
 */
const got = require('got');

/**
 * Verify reCAPTCHA response via Google reCAPTCHA API.
 * Return true if successfully verified.
 * @param {String} captchaResponse
 * @return {Boolean} true if verified
 */
const verifyResponse = async (captchaResponse) => {
    const {body} = await got.post("https://www.google.com/recaptcha/api/siteverify", {
        responseType: "json",
        searchParams: {
            secret: process.env.GOOGLE_RECAPTCHA_SECRET,
            response: captchaResponse,
        },
    });
    return body.success;
};

module.exports = {
    verifyResponse,
};
