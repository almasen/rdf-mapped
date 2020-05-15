const express = require("express");
const router = express.Router();
const faqService = require("../../modules/faq");

router.get('/', async (req, res) => {
    try {
        const faqs = await faqService.fetchAll();
        res.render("faq.ejs", {
            baseurl: req.baseUrl,
            faqs,
        });
    } catch (error) {
        res.render('404.ejs', {
            baseurl: "",
        });
    }
});

module.exports = router;
