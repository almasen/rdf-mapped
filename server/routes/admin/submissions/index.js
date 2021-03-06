const express = require("express");
const router = express.Router();
const log = require("../../../util/log");
const submissionService = require("../../../modules/submission");
const adminService = require("../../../modules/admin");

router.get('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            log.info("'%s'-Attempting to authenticate a user for admin dashboard, ref:'%s'", req.ip, jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("'%s'-Successfully authenticated %s for admin dashboard, ref:" + jwe.split('.')[4], req.ip, adminName);

            let submissions = await submissionService.fetchAll();

            const status = req.query.status;
            if (status) {
                submissions = submissions.filter(submission => submission.status === status);
            }

            res.render("./admin/submissions.ejs", {
                baseurl: req.baseUrl,
                adminName,
                submissions,
                status,
            });
        } else {
            log.info("'%s'-An attempted visit at admin dashboard without a jwe token, redirecting to admin/login", req.ip);
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin dashboard, err: " + error.message);
        res.redirect("/admin/login");
    }
});

module.exports = router;
