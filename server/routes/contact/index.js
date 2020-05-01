const express = require("express");
const router = express.Router();
const mail = require("../../modules/mail");
const log = require("../../util/log");

router.get('/', (req, res) => {
    res.render("contact-us.ejs", {
        baseurl: req.baseUrl,
    });
});

router.post('/', (req, res) => {
    log.info("%s: Sending us contact-us message..", req.body.email);
    try {
        mail.sendEmail(
            process.env.EMAIL_ADDRESS,
            req.body.subject,
            `Contact request from ${req.body.email} - ${req.body.name}: ${req.body.message}`,
        );
    } catch (error) {
        log.error("%s: Contact-us failed, err: " + error.message, req.body.email);
    }
});

module.exports = router;
