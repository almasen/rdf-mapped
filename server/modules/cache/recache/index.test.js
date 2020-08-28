const reCache = require("./");

const testHelpers = require("../../../test/helpers");

const courseService = require("../../course");
const videoService = require("../../video");
const cache = require("../");

jest.mock("../");
jest.mock("../../course");
jest.mock("../../video");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("recache works", async () => {
    cache.flush.mockResolvedValue();
    courseService.fetchAll.mockResolvedValue();
    videoService.fetchAll.mockResolvedValue();
    cache.updateAllFromAPI.mockResolvedValue();

    await reCache.recacheAll();

    expect(cache.updateAllFromAPI).toHaveBeenCalledTimes(1);
});

test("logging of recache errors works", async () => {
    cache.flush.mockImplementation(() => {
        throw new Error("some error");
    });
    await reCache.recacheAll();
    expect(cache.flush).toHaveBeenCalledTimes(1);
});
