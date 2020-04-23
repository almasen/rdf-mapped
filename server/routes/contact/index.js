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
    mail.sendEmail(
        process.env.EMAIL_ADDRESS,
        req.body.subject,
        `${req.body.email} - ${req.body.name}: ${req.body.message}`,
    );
});

module.exports = router;
