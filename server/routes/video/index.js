const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const videoService = require("../../modules/video");

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

module.exports = router;