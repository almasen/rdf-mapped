const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    const status = req.query.status !== undefined ? req.query.status : 500;
    const message = req.query.message !== undefined ? req.query.message : "Unknown system error.";
    if (req.query.data == undefined || req.query.data === "undefined") {
        res.status(status).send({
            message: message,
        });
    } else {
        res.status(status).send({
            message: message,
            data: JSON.parse(req.query.data),
        });
    }
});

module.exports = router;
