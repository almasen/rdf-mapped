const express = require("express");
const router = express.Router();
const log = require("../../../util/log");
const httpUtil = require("../../../util/http");
const downloadService = require("../../../modules/download");
const submissionService = require("../../../modules/submission");

router.post('/', async (req, res) => {
    log.info("Submitting a new video..");
    try {
        await submissionService.insertNewSubmission(req.body);
        downloadService.deleteExportFiles();
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
