const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const courseService = require("../../modules/course");
const videoService = require("../../modules/video");
const submissionService = require("../../modules/submission");
const adminService = require("../../modules/admin");

router.get('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            log.info("'%s'-Attempting to authenticate a user for admin dashboard, ref:'%s'", req.ip, jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("'%s'-Successfully authenticated %s for admin dashboard, ref:" + jwe.split('.')[4], req.ip, adminName);

            // Fetch admin site-statistics
            const courses = await courseService.fetchAll();
            const uniqueCourses = await courseService.fetchAllWithUniqueTitles();
            const videos = await videoService.fetchAll();
            const uniqueVideos = await videoService.fetchAllWithUniqueTitles();
            const submissions = await submissionService.fetchAll();
            res.render("./admin/dashboard.ejs", {
                baseurl: req.baseUrl,
                adminName,
                courses,
                uniqueCourses,
                videos,
                uniqueVideos,
                submissions,
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
