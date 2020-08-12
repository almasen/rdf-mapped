const express = require("express");
const router = express.Router();
const log = require("../../../../util/log");
const adminService = require("../../../../modules/admin");
const faqService = require("../../../../modules/faq");

router.get('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            log.info("'%s'-Attempting to authenticate a user for admin/faq/new, ref:'%s'", req.ip, jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("'%s'-Successfully authenticated %s for admin/faq/new, ref:" + jwe.split('.')[4], req.ip, adminName);

            res.render("./admin/add-faq.ejs", {
                baseurl: req.baseUrl,
                adminName,
            });
        } else {
            log.info("'%s'-An attempted visit at admin/faq/new without a jwe token, redirecting to admin/login", req.ip);
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
            log.info("'%s'-Attempting to authenticate a user for admin/faq/new, ref:'%s'", req.ip, jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("'%s'-Successfully authenticated %s for admin/info/new, ref:" + jwe.split('.')[4], req.ip, adminName);

            log.info("'%s'-Attempting to insert new faq entry..", req.ip);
            await faqService.insert(req.body.question, req.body.answer);
            log.info("'%s'-Successfully inserted new faq entry..", req.ip);

            res.status(200).send("Success.");
        } else {
            log.info("'%s'-An attempted visit at admin/faq/new without a jwe token, redirecting to admin/login", req.ip);
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin dashboard, err: " + error.message);
        res.redirect("/admin/login");
    }
});

module.exports = router;
