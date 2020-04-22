const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render("index.ejs", {
        baseurl: req.path,
    });
});

module.exports = router;
