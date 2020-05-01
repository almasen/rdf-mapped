const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render("login.ejs", {
        baseurl: req.baseUrl,
    });
});

module.exports = router;
