const express = require("express");
const router = express.Router();
const capabilityService = require("../../modules/capability");
const pagination = require("../../modules/pagination");

router.get('/', async (req, res) => {
    const fetchResult = await capabilityService.fetchByKeyword(req.query.keyword);
    const pageData = pagination.getPageData(req.query.currentPage, req.query.pageSize, fetchResult);
    res.status(200).send({
        pageData,
    });
    // res.render("faq.ejs", {
    //     baseurl: req.baseUrl,
    // });
});

module.exports = router;
