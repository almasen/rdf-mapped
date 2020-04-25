const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const capabilityService = require("../../modules/capability");
const categoryService = require("../../modules/category");
const competencyService = require("../../modules/competency");
const phaseService = require("../../modules/phase");
const courseService = require("../../modules/course");
const videoService = require("../../modules/video");
const filtering = require("../../modules/filtering");

router.get('/', async (req, res) => {
    log.info("Launching home page, fetching all info..");
    try {
        const capabilities = await capabilityService.fetchAll();
        const categories = await categoryService.fetchAll();
        const categoriesByParents = filtering.groupByParent(categories);
        const competencies = await competencyService.fetchAll();
        const competenciesByParents = filtering.groupByParent(competencies);
        const phases = await phaseService.fetchAll();
        const courses = await courseService.fetchAllWithUniqueTitles();
        const videos = await videoService.fetchAllWithUniqueTitles();
        log.info("Fetched all info, rendering home page..");
        res.render("index.ejs", {
            baseurl: req.path,
            capabilities,
            categories,
            competencies,
            phases,
            courses,
            videos,
            categoriesByParents,
            competenciesByParents,
        });
    } catch (error) {
        log.error("CRITICAL: Launching / failed, err: " + error.message);
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
