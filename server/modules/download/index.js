const courseService = require("../course");
const videoService = require("../video");
const fs = require("fs");
const log = require("../../util/log");
const {Parser} = require('json2csv');
const AdmZip = require('adm-zip');

const fields = ['id', 'title', 'hyperlink', 'capabilityTitle', 'capabilityId',
    'categoryTitle', 'categoryId', 'competencyTitle', 'competencyId', 'phases'];
const opts = {fields};

const generateExportFiles = async () => {
    // TODO: check if export is up to date
    if (
        fs.existsSync("./exports/rdf-mapped-combined.json") &&
        fs.existsSync("./exports/rdf-mapped-courses.json") &&
        fs.existsSync("./exports/rdf-mapped-videos.json") &&
        fs.existsSync("./exports/rdf-mapped-courses.csv") &&
        fs.existsSync("./exports/rdf-mapped-videos.csv") &&
        fs.existsSync("./exports/rdf-mapped-combined.zip")
    ) {
        // all export files present
        return;
    }
    const courses = await courseService.fetchAllWithUniqueTitles();
    const videos = await videoService.fetchAllWithUniqueTitles();
    if (!fs.existsSync("./exports/rdf-mapped-combined.json")) {
        log.info("Generating JSON export of course & video data..");
        const exportObject = {
            courses,
            videos,
        };
        fs.writeFileSync("./exports/rdf-mapped-combined.json", JSON.stringify(exportObject));
    }
    if (!fs.existsSync("./exports/rdf-mapped-courses.json")) {
        log.info("Generating JSON export of course data..");
        fs.writeFileSync("./exports/rdf-mapped-courses.json", JSON.stringify(courses));
    }
    if (!fs.existsSync("./exports/rdf-mapped-videos.json")) {
        log.info("Generating JSON export of video data..");
        fs.writeFileSync("./exports/rdf-mapped-videos.json", JSON.stringify(videos));
    }
    if (!fs.existsSync("./exports/rdf-mapped-courses.csv")) {
        log.info("Generating CSV export of course data..");
        const parser = new Parser(opts);
        const csv = parser.parse(courses);
        fs.writeFileSync("./exports/rdf-mapped-courses.csv", csv);
    }
    if (!fs.existsSync("./exports/rdf-mapped-videos.csv")) {
        log.info("Generating CSV export of video data..");
        const parser = new Parser(opts);
        const csv = parser.parse(videos);
        fs.writeFileSync("./exports/rdf-mapped-videos.csv", csv);
    }
    if (!fs.existsSync("./exports/rdf-mapped-combined.zip")) {
        log.info("Generating zipped CSV export of course & video data..");
        const zip = new AdmZip();
        zip.addLocalFile("./exports/rdf-mapped-courses.csv");
        zip.addLocalFile("./exports/rdf-mapped-videos.csv");
        zip.writeZip("./exports/rdf-mapped-combined.zip");
    }
};

module.exports = {
    generateExportFiles,
};
