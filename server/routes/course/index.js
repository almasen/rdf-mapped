const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const courseService = require("../../modules/course");

router.get('/:id', async (req, res) => {
    log.info("Course %s: Fetching course data", req.params.id);
    try {
        const courseRecord = await courseService.fetchCourseRecord(req.params.id);
        const coursePhaseRecords = await courseService.fetchCoursePhaseRecords(req.params.id);
        const course = await courseService.resolveCourseObject(courseRecord, coursePhaseRecords);
        const similarCourseRecords = await courseService.fetchSimilarCourseRecords(courseRecord, coursePhaseRecords, 5);
        res.render('course.ejs', {
            course,
            similarCourseRecords,
            baseurl: req.baseUrl, // TODO:
        });
    } catch (error) {
        log.error("Course %s: Failed fetching course data, err: " + error.message, req.params.id);
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
