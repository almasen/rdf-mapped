const express = require("express");
const router = express.Router();
const contact = require("../../modules/contact");
const captchaService = require("../../modules/captcha");
const log = require("../../util/log");
const httpUtil = require("../../util/http");

router.get('/', (req, res) => {
    try {
        res.render("contact-us.ejs", {
            baseurl: req.baseUrl,
            reCAPTCHASiteKey: process.env.GOOGLE_RECAPTCHA_KEY,
        });
    } catch (error) {
        log.error("Failed to render contact us page, err: " + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

router.post('/', async (req, res) => {
    log.info("'%s'-%s: Sending us contact-us message..", req.ip, req.body.email);
    try {
        const captchaVerified = await captchaService.verifyResponse(req.body['g-recaptcha-response']);
        if (!captchaVerified) {
            return httpUtil.sendResult({
                status: 400,
                message: "reCAPTCHA verification failed",
            }, res);
        } else {
            await contact.processContactRequest(req.ip, req.body);
            httpUtil.sendGenericSuccess(res);
        }
    } catch (error) {
        log.error("%s: Contact-us failed, err: " + error.message, req.body.email);
    }
});

module.exports = router;
