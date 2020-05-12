const express = require("express");
const router = express.Router();
const log = require("../../../util/log");
const videoService = require("../../../modules/video");
const httpUtil = require("../../../util/http");
const digest = require("../../../modules/digest");

router.post('/', async (req, res) => {
    log.info("Submitting a new video..");
    try {
        if (digest.hashPassWithSaltInHex(req.body.password, "") !== process.env.SUBMISSION_PASSWORD) {
            log.info("Submission rejected due to invalid password.");
            return httpUtil.sendGenericError(
                {
                    message: "Invalid operation",
                }, res);
        }
        await videoService.addNewVideo(req.body.video);
        log.info("Successfully added new video with title %s",
            req.body.video.title);
        return httpUtil.sendResult({
            status: 200,
            message: "Successfully added new video",
        }, res);
    } catch (error) {
        log.error("Adding new video failed, err: " + error.message);
        return httpUtil.sendGenericError(error, res);
    }
});

module.exports = router;
