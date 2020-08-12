const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const courseService = require("../../modules/course");

router.get('/:id', async (req, res) => {
    log.info("'%s'-Course %s: Fetching course data", req.ip, req.params.id);
    try {
        const course = await courseService.fetchAndResolveCourse(req.params.id);
        const similarCourseRecords = await courseService.fetchSimilarCourseRecords(course, 5);
        log.info("'%s'-Course %s: Rendering page %s recommendations ", req.ip, req.params.id, similarCourseRecords.count);
        res.render('course.ejs', {
            course,
            similarCourseRecords,
            baseurl: req.baseUrl,
            originalUrl: req.originalUrl,
        });
    } catch (error) {
        log.error("Course %s: Failed fetching course data, err: " + error.message, req.params.id);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
