const express = require("express");
const router = express.Router();
const informationService = require("../../../modules/information");
const log = require("../../../util/log");

router.get('/', async (req, res) => {
    try {
        const privacyInfo = await informationService.getInformationData("privacy");
        res.render("privacy-policy.ejs", {
            baseurl: req.baseUrl,
            privacyInfo,
        });
    } catch (error) {
        log.error("Failed to render about page, err: " + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
