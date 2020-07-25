const express = require("express");
const router = express.Router();
const log = require("../../../../util/log");
const adminService = require("../../../../modules/admin");
const faqService = require("../../../../modules/faq");

router.get('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            log.info("Attempting to authenticate a user for admin/faq/new, ref:'%s'", jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("Successfully authenticated %s for admin/faq/new, ref:" + jwe.split('.')[4], adminName);

            res.render("./admin/add-faq.ejs", {
                baseurl: req.baseUrl,
                adminName,
            });
        } else {
            log.info("An attempted visit at admin/faq/new without a jwe token, redirecting to admin/login");
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin dashboard, err: " + error.message);
        res.redirect("/admin/login");
    }
});

router.post('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            log.info("Attempting to authenticate a user for admin/faq/new, ref:'%s'", jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("Successfully authenticated %s for admin/info/new, ref:" + jwe.split('.')[4], adminName);

            log.info("Attempting to insert new faq entry..");
            await faqService.insert(req.body.question, req.body.answer);
            log.info("Successfully inserted new faq entry..");

            res.status(200).send("Success.");
        } else {
            log.info("An attempted visit at admin/faq/new without a jwe token, redirecting to admin/login");
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin dashboard, err: " + error.message);
        res.redirect("/admin/login");
    }
});

module.exports = router;
