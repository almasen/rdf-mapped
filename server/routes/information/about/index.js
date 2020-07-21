const express = require("express");
const router = express.Router();
const informationService = require("../../../modules/information");

router.get('/', async (req, res) => {
    try {
        const aboutInfo = await informationService.getInformationData("about");
        res.render("about.ejs", {
            baseurl: req.baseUrl,
            aboutInfo,
        });
    } catch (error) {
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;