const express = require("express");
const router = express.Router();
const log = require("../../../../util/log");
const adminService = require("../../../../modules/admin");
const informationService = require("../../../../modules/information");

router.get('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            log.info("Attempting to authenticate a user for admin/info, ref:'%s'", jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("Successfully authenticated %s for admin/info, ref:" + jwe.split('.')[4], adminName);

            if (req.query.type) {
                const informationType = req.query.type;
                const informationRecord = await informationService.getInformationData(informationType);

                res.render("./admin/edit-information.ejs", {
                    baseurl: req.baseUrl,
                    adminName,
                    informationRecord,
                    informationType,
                });
            } else {
                res.redirect("/admin");
            }
        } else {
            log.info("An attempted visit at admin/info without a jwe token, redirecting to admin/login");
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin dashboard, err: " + error.message);
        res.redirect("/admin/login");
    }
});

router.post('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            log.info("Attempting to authenticate a user for admin/info, ref:'%s'", jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("Successfully authenticated %s for admin/info, ref:" + jwe.split('.')[4], adminName);

            const type = req.body.type;
            log.info("Attempting to update '%s' information entry..", type);
            const newInfoObject = {
                type,
                content: req.body.updatedInformation,
            };
            await informationService.updateInformation(newInfoObject);
            log.info("Successfully updated '%s' information entry..", type);

            res.status(200).send("Success.");
        } else {
            log.info("An attempted visit at admin/info without a jwe token, redirecting to admin/login");
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin dashboard, err: " + error.message);
        res.redirect("/admin/login");
    }
});

module.exports = router;
