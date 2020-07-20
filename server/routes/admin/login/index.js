const express = require("express");
const router = express.Router();
const log = require("../../../util/log");
const adminService = require("../../../modules/admin");

router.get('/', async (req, res) => {
    log.info("Rendering admin log-in page..");
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
        const jwe = await adminService.logInAdmin(req.body.email, req.body.password);
        log.info("%s: Successfully logged in as admin, redirecting to admin panel..", req.body.email);
        res.cookie('jwe', jwe, {
            httpOnly: true,
            secure: true,
        });
        res.redirect("/admin/panel");
    } catch (error) {
        log.error("Failed to authenticate on login page, err: " + error.message);
        res.status(400).render("login.ejs", {
            baseurl: req.baseUrl,
            errorMsg: error.message,
        });
    }
});

module.exports = router;
