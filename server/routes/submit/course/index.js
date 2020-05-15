const express = require("express");
const router = express.Router();
const log = require("../../../util/log");
const courseService = require("../../../modules/course");
const httpUtil = require("../../../util/http");
const digest = require("../../../modules/digest");
const downloadService = require("../../../modules/download");

router.post('/', async (req, res) => {
    log.info("Submitting a new course..");
    try {
        if (digest.hashPassWithSaltInHex(req.body.password, "") !== process.env.SUBMISSION_PASSWORD) {
            log.info("Submission rejected due to invalid password.");
            return httpUtil.sendGenericError(
                {
                    message: "Invalid operation",
                }, res);
        }
        await courseService.addNewCourse(req.body);
        log.info("Successfully added new course with title %s",
            req.body.title);
        downloadService.deleteExportFiles();
        return httpUtil.sendResult({
            status: 200,
            message: "Successfully added new course",
        }, res);
    } catch (error) {
        log.error("Adding new course failed, err: " + error.message);
        return httpUtil.sendGenericError(error, res);
    }
});

module.exports = router;
