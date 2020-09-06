const downloadService = require("./");
const courseService = require("../course");
const videoService = require("../video");

const testHelpers = require("../../test/helpers");

const rimraf = require('rimraf');

jest.mock("../course");
jest.mock("../video");

let course1; let course2; let video1; let video2;

beforeEach(() => {
    course1 = testHelpers.getCourse1();
    course2 = testHelpers.getCourse2();
    video1 = testHelpers.getVideo1();
    video2 = testHelpers.getVideo2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("deleting all export files works", async () => {
    try {
        downloadService.deleteExportFiles();
    } catch (error) {
        fail("Err: " + error.message);
    }
});

test("generating export files works", async () => {
    courseService.fetchAllWithUniqueTitles.mockResolvedValue([course1, course2]);
    videoService.fetchAllWithUniqueTitles.mockResolvedValue([video1, video2]);
    try {
        downloadService.deleteExportFiles();
        await downloadService.generateExportFiles();
        expect(courseService.fetchAllWithUniqueTitles).toHaveBeenCalledTimes(1);
        expect(videoService.fetchAllWithUniqueTitles).toHaveBeenCalledTimes(1);
    } catch (error) {
        fail("Err: " + error.message);
    }
});

test("skipping generation of export files works as intended", async () => {
    courseService.fetchAllWithUniqueTitles.mockResolvedValue([course1, course2]);
    videoService.fetchAllWithUniqueTitles.mockResolvedValue([video1, video2]);
    try {
        downloadService.deleteExportFiles();
        await downloadService.generateExportFiles();
        // second time
        await downloadService.generateExportFiles();

        expect(courseService.fetchAllWithUniqueTitles).toHaveBeenCalledTimes(1);
        expect(videoService.fetchAllWithUniqueTitles).toHaveBeenCalledTimes(1);
    } catch (error) {
        fail("Err: " + error.message);
    }
});

test("skipping generation of select export files works as intended", async () => {
    courseService.fetchAllWithUniqueTitles.mockResolvedValue([course1, course2]);
    videoService.fetchAllWithUniqueTitles.mockResolvedValue([video1, video2]);
    try {
        downloadService.deleteExportFiles();
        await downloadService.generateExportFiles();
        // second time
        rimraf.sync("./exports/*.zip");
        await downloadService.generateExportFiles();

        // third time
        rimraf.sync("./exports/*.json");
        await downloadService.generateExportFiles();

        expect(courseService.fetchAllWithUniqueTitles).toHaveBeenCalledTimes(3);
        expect(videoService.fetchAllWithUniqueTitles).toHaveBeenCalledTimes(3);
    } catch (error) {
        fail("Err: " + error.message);
    }
});
