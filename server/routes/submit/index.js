const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const capabilityService = require("../../modules/capability");
const categoryService = require("../../modules/category");
const competencyService = require("../../modules/competency");
const phaseService = require("../../modules/phase");
const filtering = require("../../modules/filtering");
const httpUtil = require("../../util/http");
const downloadService = require("../../modules/download");
const submissionService = require("../../modules/submission");
const captchaService = require("../../modules/captcha");

router.get('/', async (req, res) => {
    try {
        const capabilities = await capabilityService.fetchAll();
        const categories = await categoryService.fetchAll();
        const categoriesByParents = filtering.groupByParent(categories, "capabilityId");
        const competencies = await competencyService.fetchAll();
        const competenciesByParents = filtering.groupByParent(competencies, "categoryId");
        const phases = await phaseService.fetchAll();
        res.render('submit.ejs', {
            baseurl: req.baseUrl,
            capabilities,
            categories,
            competencies,
            phases,
            categoriesByParents,
            competenciesByParents,
            reCAPTCHASiteKey: process.env.GOOGLE_RECAPTCHA_KEY,
        });
    } catch (error) {
        log.error("Failed rendering content submission page, err:" + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

router.post('/', async (req, res) => {
    log.info("Submitting a new %s..", req.body.type);
    try {
        console.log(req.body);
        const captchaVerified = await captchaService.verifyResponse(req.body['g-recaptcha-response']);
        if (!captchaVerified) {
            return httpUtil.sendResult({
                status: 400,
                message: "reCAPTCHA verification failed",
            }, res);
        } else {
            const {type, title, hyperlink, email} = req.body;
            await submissionService.insertNewSubmission(type, title, hyperlink, email);
            downloadService.deleteExportFiles();
            return httpUtil.sendResult({
                status: 200,
                message: "Successfully added a new " + req.body.type,
            }, res);
        }
    } catch (error) {
        log.error("Adding new %s failed, err: " + error.message, req.body.type);
        return httpUtil.sendGenericError(error, res);
    }
});

module.exports = router;
