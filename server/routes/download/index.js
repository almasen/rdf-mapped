const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const downloadService = require("../../modules/download");

router.get('/', async (req, res) => {
    if (!req.query.content) {
        res.render('download.ejs', {
            baseurl: "",
        });
        return;
    }

    log.info("%s: Downloading '%s' export with filetype '%s'",
        req.baseUrl, req.query.content, req.query.type);
    try {
        await downloadService.generateExportFiles();
        // validate filetype
        switch (req.query.type) {
            case "json":
                // ok
                break;

            case "csv":
                // ok
                break;

            default:
                log.info("%s: Downloading '%s' export rejected for invalid filetype '%s'",
                    req.baseUrl, req.query.content, req.query.type);
                res.render('404.ejs', {
                    baseurl: "",
                });
                return;
        }
        switch (req.query.content) {
            case "courses":
                req.query.type === "json" ?
                    res.download("./exports/rdf-mapped-courses.json") : res.download("./exports/rdf-mapped-courses.csv");
                break;

            case "videos":
                req.query.type === "json" ?
                    res.download("./exports/rdf-mapped-videos.json") : res.download("./exports/rdf-mapped-videos.csv");
                break;

            case "combined":
                req.query.type === "json" ?
                    res.download("./exports/rdf-mapped-combined.json") : res.download("./exports/rdf-mapped-combined.zip");
                break;

            default:
                res.render('404.ejs', {
                    baseurl: "",
                });
                break;
        }
    } catch (error) {
        log.error("%s: Downloading '%s' export with filetype '%s' failed, err:" + error.message,
            req.baseUrl, req.query.content, req.query.type);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
