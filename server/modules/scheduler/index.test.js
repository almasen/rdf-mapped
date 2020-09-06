const scheduler = require("./");

const testHelpers = require("../../test/helpers");

const competencyRepo = require("../../repositories/competency");
const cache = require("../cache");
const download = require("../download");
const recache = require("../cache/recache");
const admin = require("../admin");
const config = require("../../config");

jest.mock("../../repositories/competency");
jest.mock("../cache");
jest.mock("../cache/recache");
jest.mock("../download");
jest.mock("../admin");

const {scheduleJob} = jest.createMockFromModule("node-schedule");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});


test("scheduling all tasks works", () => {
    scheduleJob.mockReturnValue();
    process.env.SCHEDULE_RECACHE = '1';
    recache.recacheAll.mockReturnValue();
    download.deleteExportFiles.mockReturnValue();
    admin.sendSummary.mockReturnValue();

    scheduler.scheduleAllTasks();
});

test("scheduling all but recache works", () => {
    scheduleJob.mockReturnValue();
    process.env.SCHEDULE_RECACHE = '0';
    recache.recacheAll.mockReturnValue();
    download.deleteExportFiles.mockReturnValue();
    admin.sendSummary.mockReturnValue();

    scheduler.scheduleAllTasks();
});
