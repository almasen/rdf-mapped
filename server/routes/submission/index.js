const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const submissionService = require("../../modules/submission");

router.get('/:id', async (req, res) => {
    log.info("Submission %s: Fetching submission data", req.params.id);
    try {
        const submission = await submissionService.fetchById(req.params.id);
        res.render('submission.ejs', {
            baseurl: req.baseUrl,
            submission,
        });
    } catch (error) {
        log.error("Failed rendering submission page, err:" + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
