const express = require("express");
const router = express.Router();
const log = require("../../../util/log");
const courseService = require("../../../modules/course");
const videoService = require("../../../modules/video");
const adminService = require("../../../modules/admin");

router.get('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            const adminName = adminService.authenticateAdmin(jwe);

            const type = req.query.type ? req.query.type : "course";

            let fetchResult;
            if (type === "video") {
                fetchResult = await videoService.fetchAll();
            } else {
                fetchResult = await courseService.fetchAll();
            }

            res.render("./admin/content.ejs", {
                baseurl: req.baseUrl,
                adminName,
                fetchResult,
                searchUrl: req.originalUrl,
                type,
            });
        } else {
            log.info("An attempted visit at admin route without a jwe token, redirecting to admin/login");
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin route, err: " + error.message);
        res.redirect("/admin/login");
    }
});

module.exports = router;
