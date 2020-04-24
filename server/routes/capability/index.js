const express = require("express");
const router = express.Router();
const capabilityService = require("../../modules/capability");
const pagination = require("../../modules/pagination");
const log = require("../../util/log");

router.get('/', async (req, res) => {
    // res.render("faq.ejs", {
    //     baseurl: req.baseUrl,
    // });
    // log.info("Course %s: Fetching course data", req.params.id);
    try {
        const fetchResult = await capabilityService.fetchByKeyword(req.query.keyword);
        const pageData = pagination.getPageData(req.query.currentPage, req.query.pageSize, fetchResult);
        res.status(200).send({
            pageData,
        });
    } catch (error) {
        // log.error("Course %s: Failed fetching course data, err: " + error.message, req.params.id);
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
