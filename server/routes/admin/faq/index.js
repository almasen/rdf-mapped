const express = require("express");
const router = express.Router();
const log = require("../../../util/log");
const adminService = require("../../../modules/admin");
const faqService = require("../../../modules/faq");

router.get('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            log.info("Attempting to authenticate a user for admin/faq, ref:'%s'", jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("Successfully authenticated %s for admin/faq, ref:" + jwe.split('.')[4], adminName);

            const faqs = await faqService.fetchAll();

            res.render("./admin/edit-faqs.ejs", {
                baseurl: req.baseUrl,
                adminName,
                faqs,
            });
        } else {
            log.info("An attempted visit at admin/faq without a jwe token, redirecting to admin/login");
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin dashboard, err: " + error.message);
        res.redirect("/admin/login");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            log.info("Attempting to authenticate a user for admin/faq, ref:'%s'", jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("Successfully authenticated %s for admin/faq, ref:" + jwe.split('.')[4], adminName);

            const faq = await faqService.findById(req.params.id);

            res.render("./admin/edit-faq.ejs", {
                baseurl: req.baseUrl,
                adminName,
                faq,
            });
        } else {
            log.info("An attempted visit at admin/faq without a jwe token, redirecting to admin/login");
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
            log.info("Attempting to authenticate a user for admin/faq, ref:'%s'", jwe.split('.')[4]);
            const adminName = adminService.authenticateAdmin(jwe);
            log.info("Successfully authenticated %s for admin/info, ref:" + jwe.split('.')[4], adminName);

            const faq = {...req.body};

            log.info("Attempting to update 'id:%s' faq entry..", faq.id);
            await faqService.update(faq);
            log.info("Successfully updated 'id:%s' faq entry..", faq.id);

            res.status(200).send("Success.");
        } else {
            log.info("An attempted visit at admin/faq without a jwe token, redirecting to admin/login");
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin dashboard, err: " + error.message);
        res.redirect("/admin/login");
    }
});

module.exports = router;
