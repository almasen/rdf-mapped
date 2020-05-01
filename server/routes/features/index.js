const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    try {
        res.render("features.ejs", {
            baseurl: req.baseUrl,
        });
    } catch (error) {
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
