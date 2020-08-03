const express = require("express");
const router = express.Router();
const log = require("../../util/log");
const submissionService = require("../../modules/submission");
const adminService = require("../../modules/admin");

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    log.info("Submission %s: Fetching submission data", id);
    try {
        const submission = await submissionService.fetchById(id);

        let adminUse = false;
        const jwe = req.cookies.jwe;
        if (jwe) {
            try {
                adminService.authenticateAdmin(jwe);
                adminUse = true;
            } catch (error) {
                log.error("Failed admin auth for editing submission, error: " + error.message);
            }
        }

        res.render('submission.ejs', {
            baseurl: req.baseUrl,
            submission,
            adminUse,
            id,
        });
    } catch (error) {
        log.error("Failed rendering submission page, err:" + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

router.get('/:id/:action', async (req, res) => {
    const id = req.params.id;
    const action = req.params.action;
    log.info("Submission %s: Attempting to perform action: %s", id, action);
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            log.info("Attempting to authenticate admin for submission/%s, ref:'%s'", action, jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("Successfully authenticated %s for submission/%s, ref:" + jwe.split('.')[4], adminName, action);

            let adminUseCase = "default";

            switch (action) {
                case "reject":
                    await submissionService.rejectSubmission(id);
                    break;

                case "publish":
                    await submissionService.publishSubmission(id);
                    break;

                case "map":
                    adminUseCase = "map";
                    break;

                default:
                    throw new Error("Unknown admin use case " + action);
                    break;
            }

            const submission = await submissionService.fetchById(id);

            res.render('submission.ejs', {
                baseurl: req.baseUrl,
                submission,
                adminUse: true,
                adminUseCase,
                id,
            });
        } else {
            log.info("An attempted visit at submission(id:%s)/%s without a jwe token, redirecting to admin/login",
                id, action);
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for submission(id:%s)/%s, err: " + error.message,
            id, action);
        res.redirect("/admin/login");
    }
});

module.exports = router;
