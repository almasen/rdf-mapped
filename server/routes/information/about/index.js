const express = require("express");
const router = express.Router();
const informationService = require("../../../modules/information");
const log = require("../../../util/log");

router.get('/', async (req, res) => {
    try {
        const aboutInfo = await informationService.getInformationData("about");
        res.render("about.ejs", {
            baseurl: req.baseUrl,
            aboutInfo,
        });
    } catch (error) {
        log.error("Failed to render about page, err: " + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
