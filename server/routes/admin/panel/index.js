const express = require("express");
const router = express.Router();
const log = require("../../../util/log");
const courseService = require("../../../modules/course");
const videoService = require("../../../modules/video");
const submissionService = require("../../../modules/submission");

router.get('/', async (req, res) => {
    // log.info("Rendering admin log-in page..");
    try {
        const courses = await courseService.fetchAll();
        const uniqueCourses = await courseService.fetchAllWithUniqueTitles();
        const videos = await videoService.fetchAll();
        const uniqueVideos = await videoService.fetchAllWithUniqueTitles();
        const submissions = await submissionService.fetchAll();
        res.render("admin-panel.ejs", {
            baseurl: req.baseUrl,
            courses,
            uniqueCourses,
            videos,
            uniqueVideos,
            submissions,
        });
    } catch (error) {
        log.error("Failed rendering admin panel page, err: " + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
