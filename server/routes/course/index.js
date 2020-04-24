const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const courseService = require("../../modules/course");
const pagination = require("../../modules/pagination");

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

router.get('/', async (req, res) => {
    log.info("Fetching courses with %s filters", req.query);
    try {
        const filters = req.query;
        const fetchResult = await courseService.fetchAndResolveByFilters(filters); // TODO: only resolve paginated data
        const pageData = pagination.getPageData(req.query.currentPage, req.query.pageSize, fetchResult);
        log.info("Fetched & resolved %s courses, returning page %s of %s",
            fetchResult.length, pageData.meta.currentPage, pageData.meta.pageCount);
        res.status(200).send({
            pageData,
        });
    } catch (error) {
        log.error("Failed fetching courses with %s filters, err: " + error.message, req.query);
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
