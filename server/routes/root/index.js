const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const courseService = require("../../modules/course");
const videoService = require("../../modules/video");

router.get('/', async (req, res) => {
    log.info("Loading home page, fetching all info..");
    try {
        const courses = await courseService.fetchAllWithUniqueTitles();
        const videos = await videoService.fetchAllWithUniqueTitles();
        log.info("Fetched all info, rendering home page..");
        res.render("index.ejs", {
            baseurl: req.path,
            courses,
            videos,
        });
    } catch (error) {
        log.error("CRITICAL: Launching / failed, err: " + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
