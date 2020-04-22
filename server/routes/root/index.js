const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.ejs', {
        name: req.body.name,
        user: req.body.user,
    });
});

module.exports = router;
