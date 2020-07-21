const express = require("express");
const router = express.Router();
const informationService = require("../../../modules/information");

router.get('/', async (req, res) => {
    try {
        const accessibilityInfo = await informationService.getInformationData("accessibility");
        res.render("accessibility-statement.ejs", {
            baseurl: req.baseUrl,
            accessibilityInfo,
        });
    } catch (error) {
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;