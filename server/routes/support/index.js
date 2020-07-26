const express = require("express");
const router = express.Router();
const faqService = require("../../modules/faq");
const log = require("../../util/log");

router.get('/', async (req, res) => {
    try {
        const faqs = await faqService.fetchAll();
        res.render("support.ejs", {
            baseurl: req.baseUrl,
            faqs,
        });
    } catch (error) {
        log.error("Failed to render FAQs page, err: " + error.message);
        res.status(404).render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
