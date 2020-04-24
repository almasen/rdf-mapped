const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const videoService = require("../../modules/video");
const pagination = require("../../modules/pagination");

router.get('/:id', async (req, res) => {
    log.info("Video %s: Fetching video data", req.params.id);
    try {
        const videoRecord = await videoService.fetchVideoRecord(req.params.id);
        const videoPhaseRecords = await videoService.fetchVideoPhaseRecords(req.params.id);
        const video = await videoService.resolveVideoObject(videoRecord, videoPhaseRecords);
        const similarVideoRecords = await videoService.fetchSimilarVideoRecords(videoRecord, videoPhaseRecords, 5);
        res.render('video.ejs', {
            video,
            similarVideoRecords,
            baseurl: req.baseUrl, // TODO:
        });
    } catch (error) {
        log.error("Video %s: Failed fetching video data, err: " + error.message, req.params.id);
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

router.get('/', async (req, res) => {
    log.info("Fetching videos with %s filters", req.query);
    try {
        const filters = req.query;
        const fetchResult = await videoService.fetchAndResolveByFilters(filters); // TODO: only resolve paginated data
        const pageData = pagination.getPageData(req.query.currentPage, req.query.pageSize, fetchResult);
        log.info("Fetched & resolved %s videos, returning page %s of %s",
            fetchResult.length, pageData.meta.currentPage, pageData.meta.pageCount);
        res.status(200).send({
            pageData,
        });
    } catch (error) {
        log.error("Failed fetching videos with %s filters, err: " + error.message, req.query);
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
