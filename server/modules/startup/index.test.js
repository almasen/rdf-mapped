const startup = require("./");

const testHelpers = require("../../test/helpers");

const download = require("../download");
const recache = require("../cache/recache");
const scheduler = require("../scheduler");

jest.mock("../cache/recache");
jest.mock("../download");
jest.mock("../scheduler");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});


test("startup function works", async () => {
    scheduler.scheduleAllTasks.mockReturnValue();
    download.deleteExportFiles.mockReturnValue();
    recache.recacheAll.mockResolvedValue();
    await startup.initialise();
});
