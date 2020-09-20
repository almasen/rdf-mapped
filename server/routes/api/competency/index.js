const express = require("express");
const router = express.Router();
const competencyService = require("../../../modules/competency");
const pagination = require("../../../modules/pagination");
const log = require("../../../util/log");

router.get('/', async (req, res) => {
    try {
        log.info("'%s'-API: Fetching competencies..", req.ip);
        const fetchResult = await competencyService.fetchByKeyword(req.query.keyword);
        const pageData = pagination.getPageData(req.query.currentPage, req.query.pageSize, fetchResult);
        res.status(200).send({
            pageData,
        });
    } catch (error) {
        log.error("API: Failed fetching competencies, err: " + error.message);
        res.status(404).send({message: error.message});
    }
});

module.exports = router;
