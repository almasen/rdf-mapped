const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const courseService = require("../../modules/course");
const pagination = require("../../modules/pagination");

router.get('/:id', async (req, res) => {
    log.info("Course %s: Fetching course data", req.params.id);
    try {
        const course = await courseService.fetchAndResolveCourse(req.params.id);
        const similarCourseRecords = await courseService.fetchSimilarCourseRecords(course, 5);
        log.info("Course %s: Rendering page %s recommendations ", req.params.id, similarCourseRecords.count);
        res.render('course.ejs', {
            course,
            similarCourseRecords,
            baseurl: req.baseUrl, // TODO: ?
        });
    } catch (error) {
        log.error("Course %s: Failed fetching course data, err: " + error.message, req.params.id);
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

router.get('/', async (req, res) => {
    log.info("Fetching courses with %s filters", JSON.stringify(req.query));
    try {
        const filters = req.query;
        const fetchResult = await courseService.fetchByFilters(filters);
        const pageData = pagination.getPageData(req.query.currentPage, req.query.pageSize, fetchResult);
        const searchUrl = req.baseUrl + "?" +
            "capability=" + (req.query.capability ? req.query.capability : "-1") + "&" +
            "category=" + (req.query.category ? req.query.category : "-1") + "&" +
            "competency=" + (req.query.competency ? req.query.competency : "-1") + "&" +
            "phase=" + (req.query.phase ? req.query.phase : "-1") + "&" +
            (req.query.keyword ? `keyword=${req.query.keyword}&` : "") +
            (req.query.pageSize ? `pageSize=${req.query.pageSize}&` : "") +
            "currentPage=";
        log.info("Fetched & resolved %s courses, returning page %s of %s",
            fetchResult.length, pageData.meta.currentPage, pageData.meta.pageCount);
        res.render('courses.ejs', {
            courses: fetchResult,
            pageData,
            baseurl: req.baseUrl, // TODO: ?
            searchUrl,
        });
    } catch (error) {
        log.error("Failed fetching courses with %s filters, err: " + error.message, req.query);
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
