const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const courseService = require("../../modules/course");

router.get('/:id', async (req, res) => {
    log.info("Course id '%d': Fetching course data", req.params.id);
    try {
        const course = await courseService.getCourse(req.params.id);
        console.log(course);
        res.render('course.ejs', {
            course,
            baseurl: req.baseUrl, // TODO:
        });
    } catch (error) {
        log.error("Course id '%d': Failed fetching course data, err: " + error.message, req.params.id);
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
