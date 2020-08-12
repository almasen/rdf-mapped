const express = require("express");
const router = express.Router();
const log = require("../../../../util/log");
const courseService = require("../../../../modules/course");
const videoService = require("../../../../modules/video");
const adminService = require("../../../../modules/admin");
const capabilityService = require("../../../../modules/capability");
const categoryService = require("../../../../modules/category");
const competencyService = require("../../../../modules/competency");
const phaseService = require("../../../../modules/phase");
const filtering = require("../../../../modules/filtering");

router.get('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            const adminName = adminService.authenticateAdmin(jwe);

            const type = req.query.type;
            const id = req.query.id;
            const action = req.query.action;

            let content;

            switch (action) {
                case "edit":
                    break;

                case "duplicate":
                    break;

                case "delete":
                    type === 'course' ?
                        await courseService.deleteCourse(id) :
                        await videoService.deleteVideo(id);
                    return res.redirect(`/admin/content?type=${type}`);
                    break;

                default:
                    throw new Error("Unsupported action /admin/content/edit");
                    break;
            }

            switch (type) {
                case "video":
                    content = await videoService.fetchAndResolveVideo(id);
                    break;

                case "course":
                    content = await courseService.fetchAndResolveCourse(id);
                    break;

                default:
                    throw new Error("Type definition missing from /admin/content/edit");
                    break;
            }

            const capabilities = await capabilityService.fetchAll();
            const categories = await categoryService.fetchAll();
            const categoriesByParents = filtering.groupByParent(categories, "capabilityId");
            const competencies = await competencyService.fetchAll();
            const competenciesByParents = filtering.groupByParent(competencies, "categoryId");
            const phases = await phaseService.fetchAll();

            res.render("./admin/map-content.ejs", {
                baseurl: req.baseUrl,
                adminName,
                content,
                searchUrl: req.originalUrl,
                type,
                action,
                capabilities,
                competencies,
                categories,
                categoriesByParents,
                competenciesByParents,
                phases,
            });
        } else {
            log.info("'%s'-An attempted visit at admin route without a jwe token, redirecting to admin/login", req.ip);
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin route, err: " + error.message);
        res.redirect("/admin/login");
    }
});


router.post('/', async (req, res) => {
    try {
        const jwe = req.cookies.jwe;
        if (jwe) {
            adminService.authenticateAdmin(jwe);

            const type = req.query.type;
            const action = req.query.action;
            const content = {...req.body};
            let id = req.query.id;

            switch (action) {
                case "edit":
                    type === 'course' ?
                        await courseService.updateCourse(content) :
                        await videoService.updateVideo(content);
                    break;

                case "duplicate":
                    type === 'course' ?
                        id = await courseService.addNewCourse(content) :
                        id = await videoService.addNewVideo(content);
                    break;

                default:
                    throw new Error("Unsupported action /admin/content/edit");
                    break;
            }
            res.redirect(`/admin/content/edit?type=${type}&id=${id}&action=${action}`);
        } else {
            log.info("'%s'-An attempted visit at admin route without a jwe token, redirecting to admin/login", req.ip);
            res.redirect("/admin/login");
        }
    } catch (error) {
        log.error("Failed to authenticate for admin route, err: " + error.message);
        res.redirect("/admin/login");
    }
});

module.exports = router;
