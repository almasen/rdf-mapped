const express = require("express");
const router = express.Router();
const categoryService = require("../../../modules/category");
const pagination = require("../../../modules/pagination");
const log = require("../../../util/log");

router.get('/', async (req, res) => {
    try {
        log.info("API: Fetching categories..");
        const fetchResult = await categoryService.fetchByKeyword(req.query.keyword);
        const pageData = pagination.getPageData(req.query.currentPage, req.query.pageSize, fetchResult);
        res.status(200).send({
            pageData,
        });
    } catch (error) {
        log.error("API: Failed fetching categories, err: " + error.message);
        res.status(404).send(error.message);
    }
});

module.exports = router;
