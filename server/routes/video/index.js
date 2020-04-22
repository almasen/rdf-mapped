const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const videoService = require("../../modules/video");

router.get('/:id', async (req, res) => {
    log.info("Video id '%d': Fetching video data", req.params.id);
    try {
        const video = await videoService.getVideo(req.params.id);
        res.render('video.ejs', {
            video,
            baseurl: req.baseUrl, // TODO:
        });
    } catch (error) {
        log.error("Video id '%d': Failed fetching video data, err: " + error.message, req.params.id);
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
