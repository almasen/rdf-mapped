const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render("contact-us.ejs", {
        baseurl: req.baseUrl,
    });
});

module.exports = router;
