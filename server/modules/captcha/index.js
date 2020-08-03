const got = require('got');

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
