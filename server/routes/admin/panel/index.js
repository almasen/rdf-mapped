const express = require("express");
const router = express.Router();
const log = require("../../../util/log");
const courseService = require("../../../modules/course");
const videoService = require("../../../modules/video");
const submissionService = require("../../../modules/submission");
const adminService = require("../../../modules/admin");

router.get('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            log.info("Attempting to authenticate a user for admin panel, ref:'%s'", jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("Successfully authenticated %s for admin panel, ref:" + jwe.split('.')[4], adminName);

            // Fetch admin site-statistics
            const courses = await courseService.fetchAll();
            const uniqueCourses = await courseService.fetchAllWithUniqueTitles();
            const videos = await videoService.fetchAll();
            const uniqueVideos = await videoService.fetchAllWithUniqueTitles();
            const submissions = await submissionService.fetchAll();
            res.render("admin-panel.ejs", {
                baseurl: req.baseUrl,
                adminName,
                courses,
                uniqueCourses,
                videos,
                uniqueVideos,
                submissions,
            });
        } else {
            log.info("An attempted visit at admin panel without a jwe token, redirecting to admin/login");
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin panel, err: " + error.message);
        res.redirect("/admin/login");
    }
});

module.exports = router;
