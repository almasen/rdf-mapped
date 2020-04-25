const express = require("express");
const router = express.Router();
const informationService = require("../../modules/information");

router.get('/', async (req, res) => {
    try {
        const informationData = await informationService.getInformationData("faq");
        res.render("faq.ejs", {
            baseurl: req.baseUrl,
            faqs: informationData.data, // TODO:
        });
    } catch (error) {
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
