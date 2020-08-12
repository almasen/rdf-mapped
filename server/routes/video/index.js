const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const videoService = require("../../modules/video");

router.get('/:id', async (req, res) => {
    log.info("'%s'-Video %s: Fetching video data", req.ip, req.params.id);
    try {
        const video = await videoService.fetchAndResolveVideo(req.params.id);
        const similarVideoRecords = await videoService.fetchSimilarVideoRecords(video, 5);
        log.info("'%s'-Video %s: Rendering page %s recommendations ", req.ip, req.params.id, similarVideoRecords.count);
        res.render('video.ejs', {
            video,
            similarVideoRecords,
            baseurl: req.baseUrl,
            originalUrl: req.originalUrl,
            reCAPTCHASiteKey: process.env.GOOGLE_RECAPTCHA_KEY,
        });
    } catch (error) {
        log.error("Video %s: Failed fetching video data, err: " + error.message, req.params.id);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
