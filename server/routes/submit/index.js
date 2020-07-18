const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const capabilityService = require("../../modules/capability");
const categoryService = require("../../modules/category");
const competencyService = require("../../modules/competency");
const phaseService = require("../../modules/phase");
const filtering = require("../../modules/filtering");

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
        });
    } catch (error) {
        log.error("Failed rendering content submission page, err:" + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
