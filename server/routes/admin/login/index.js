const express = require("express");
const router = express.Router();
const log = require("../../../util/log");
const adminService = require("../../../modules/admin");
const captchaService = require("../../../modules/captcha");

router.get('/', async (req, res) => {
    log.info("'%s'-Rendering admin log-in page..", req.ip);
    try {
        res.render("login.ejs", {
            reCAPTCHASiteKey: process.env.GOOGLE_RECAPTCHA_KEY,
            baseurl: req.baseUrl,
        });
    } catch (error) {
        log.error("Failed rendering admin login page, err: " + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

router.post('/', async (req, res) => {
    log.info("'%s'-%s: Attempting to log-in as admin..", req.ip, req.body.email);
    try {
        const captchaVerified = await captchaService.verifyResponse(req.body['g-recaptcha-response']);
        if (!captchaVerified) {
            throw new Error("Invalid reCAPTCHA");
        }
        const jwe = await adminService.logInAdmin(req.body.email, req.body.password);
        log.info("'%s'-%s: Successfully logged in as admin, redirecting to admin dashboard..", req.ip, req.body.email);
        res.cookie('jwe', jwe, {
            httpOnly: true,
            secure: true,
        });
        res.redirect("/admin");
    } catch (error) {
        log.error("Failed to authenticate on login page, err: " + error.message);
        res.status(400).render("login.ejs", {
            reCAPTCHASiteKey: process.env.GOOGLE_RECAPTCHA_KEY,
            baseurl: req.baseUrl,
            errorMsg: error.message,
        });
    }
});

module.exports = router;
