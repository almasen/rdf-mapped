const express = require("express");
const router = express.Router();
const informationService = require("../../../modules/information");

router.get('/', async (req, res) => {
    try {
        const termsInfo = await informationService.getInformationData("terms");
        res.render("terms-and-conditions.ejs", {
            baseurl: req.baseUrl,
            termsInfo,
        });
    } catch (error) {
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
