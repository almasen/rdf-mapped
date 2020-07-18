const express = require("express");
const router = express.Router();
const log = require("../../../util/log");

router.get('/', async (req, res) => {
    // log.info("Rendering admin log-in page..");
    try {
        res.render("login.ejs", {
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
    log.info("%s: Attempting to log-in as admin..", req.body.email);
    try {
        console.log(req.body);
        res.redirect("/admin/panel");
    } catch (error) {
        log.error("Failed rendering admin login page, err: " + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
