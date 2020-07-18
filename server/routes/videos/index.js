const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const videoService = require("../../modules/video");
const pagination = require("../../modules/pagination");

router.get('/', async (req, res) => {
    log.info("Fetching videos with %s filters", JSON.stringify(req.query));
    try {
        const filters = req.query;
        const fetchResult = await videoService.fetchByFilters(filters);
        const pageData = pagination.getPageData(req.query.currentPage, req.query.pageSize, fetchResult);
        const searchUrl = req.baseUrl + "?" +
            "capability=" + (req.query.capability ? req.query.capability : "-1") + "&" +
            "category=" + (req.query.category ? req.query.category : "-1") + "&" +
            "competency=" + (req.query.competency ? req.query.competency : "-1") + "&" +
            "phase=" + (req.query.phase ? req.query.phase : "-1") + "&" +
            (req.query.keyword ? `keyword=${req.query.keyword}&` : "") +
            (req.query.pageSize ? `pageSize=${req.query.pageSize}&` : "") +
            "currentPage=";
        log.info("Fetched & resolved %s videos, returning page %s of %s",
            fetchResult.length, pageData.meta.currentPage, pageData.meta.pageCount);
        res.render('videos.ejs', {
            videos: fetchResult,
            pageData,
            baseurl: req.baseUrl, // TODO: ?
            searchUrl,
        });
    } catch (error) {
        log.error("Failed fetching videos with %s filters, err: " + error.message, req.query);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
