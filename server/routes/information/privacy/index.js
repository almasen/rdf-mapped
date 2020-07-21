const express = require("express");
const router = express.Router();
const informationService = require("../../../modules/information");

router.get('/', async (req, res) => {
    try {
        const privacyInfo = await informationService.getInformationData("privacy");
        res.render("privacy-policy.ejs", {
            baseurl: req.baseUrl,
            privacyInfo,
        });
    } catch (error) {
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
