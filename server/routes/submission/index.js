const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const submissionService = require("../../modules/submission");
const capabilityService = require("../../modules/capability");
const categoryService = require("../../modules/category");
const competencyService = require("../../modules/competency");

router.get('/:id', async (req, res) => {
    log.info("Submission %s: Fetching submission data", req.params.id);
    try {
        const submission = await submissionService.fetchById(req.params.id);
        const capability = await capabilityService.fetchById(submission.data.capability);
        const category = await categoryService.fetchById(submission.data.category);
        const competency = await competencyService.fetchById(submission.data.competency);
        submission.data.capabilityTitle = capability.title;
        submission.data.categoryTitle = category.title;
        submission.data.competencyTitle = competency.title;
        res.render('submission.ejs', {
            baseurl: req.baseUrl,
            submission,
        });
    } catch (error) {
        log.error("Failed rendering submission page, err:" + error.message);
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
