const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const courseService = require("../../modules/course");

router.get('/:id', async (req, res) => {
    log.info("Course id '%d': Fetching course data", req.params.id);
    try {
        const course = await courseService.getCourse(req.params.id);
        res.render('course.ejs', {
            course,
        });
    } catch (error) {
        log.error("Video id '%d': Failed fetching video data, err: " + error.message, req.params.id);
    }
});

module.exports = router;
