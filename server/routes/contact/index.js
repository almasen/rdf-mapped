const express = require("express");
const router = express.Router();
const mail = require("../../modules/mail");
const log = require("../../util/log");

router.get('/', (req, res) => {
    log.error("Failed to render contact us page, err: " + error.message);
    res.render("contact-us.ejs", {
        baseurl: req.baseUrl,
    });
});

router.post('/', (req, res) => {
    log.info("%s: Sending us contact-us message..", req.body.email);
    try {
        mail.sendEmail(
            process.env.CONTACT_EMAIL_ADDRESS,
            process.env.CONTACT_EMAIL_ADDRESS,
            `[rdfmapped.com] Contact form: ${req.body.subject}`,
            `Contact request from ${req.body.email} - ${req.body.name}:\n${req.body.message}`,
        );
    } catch (error) {
        log.error("%s: Contact-us failed, err: " + error.message, req.body.email);
    }
});

module.exports = router;
