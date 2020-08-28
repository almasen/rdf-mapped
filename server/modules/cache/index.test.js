let cache = require("./");

const testHelpers = require("../../test/helpers");

const apiService = require("../linkedin_learning");

let course1, course2, video1, video2;

jest.mock("../linkedin_learning");

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

test("standard cache functionality works", async () => {
    expect(cache.has("a")).toStrictEqual(false);
    cache.set("a", "b");
    expect(cache.has("a")).toStrictEqual(true);
    expect(cache.get("a")).toStrictEqual("b");
    cache.logStats();
    cache.flush();
    expect(cache.has("a")).toStrictEqual(false);
    cache.set("b", "c");
    expect(cache.has("b")).toStrictEqual(true);
    cache.del("b");
    expect(cache.has("b")).toStrictEqual(false);
});

test("updatingFromAPI with all params available works", async () => {
    learningObject = {
        title: {
            value: "fetchedTitle",
        },
        details: {
            urls: {
                webLaunch: "hyperlink",
            },
            descriptionIncludingHtml: "a",
            shortDescriptionIncludingHtml: "b",
            images: {
                primary: "imgLink",
            },
            timeToComplete: "6h",
        }
    }
    apiService.fetchLearningObject.mockResolvedValue(learningObject);

    course1.urn = "urn:li:123"
    course2.urn = "NOURN"
    video1.urn = "urn:li:345"
    video2.urn = "NOURN"

    cache.set("course-1", course1);
    cache.set("video-1", video1);
    cache.set("course-2", course2);
    cache.set("video-2", video2);

    await cache.updateAllFromAPI();

    expect(apiService.fetchLearningObject).toHaveBeenCalledTimes(2);
    expect(cache.get("course-1").title).toStrictEqual("fetchedTitle");
});

test("updatingFromAPI with no params available works", async () => {
    learningObject = {
        title: {
        },
        details: {
            urls: {
            },
            images: {
            }
        }
    }
    apiService.fetchLearningObject.mockResolvedValue(learningObject);

    course1.urn = "urn:li:123"
    course2.urn = "urn:li:234"
    video1.urn = "urn:li:345"
    video2.urn = "urn:li:456"

    cache.set("course-1", course1);
    cache.set("video-1", video1);
    cache.set("course-2", course2);
    cache.set("video-2", video2);

    await cache.updateAllFromAPI();

    expect(apiService.fetchLearningObject).toHaveBeenCalledTimes(4);
    expect(cache.get("course-1").title).toStrictEqual(undefined);
});

test("updating single cached object from API with all params available works", async () => {
    learningObject = {
        title: {
            value: "fetchedTitle",
        },
        details: {
            urls: {
                webLaunch: "hyperlink",
            },
            descriptionIncludingHtml: "a",
            shortDescriptionIncludingHtml: "b",
            images: {
                primary: "imgLink",
            },
            timeToComplete: "6h",
        }
    }
    apiService.fetchLearningObject.mockResolvedValue(learningObject);

    course1.urn = "urn:li:123"
    video1.urn = "urn:li:345"

    cache.set("course-1", course1);
    cache.set("video-1", video1);

    await cache.updateFromAPI("course-1");

    expect(apiService.fetchLearningObject).toHaveBeenCalledTimes(1);
    expect(cache.get("course-1").title).toStrictEqual("fetchedTitle");
});

test("updating single cached object from API with no params available works", async () => {
    learningObject = {
        title: {
            value: "fetchedTitle",
        },
        details: {
            urls: {
                webLaunch: "hyperlink",
            },
            descriptionIncludingHtml: "a",
            shortDescriptionIncludingHtml: "b",
            images: {
                primary: "imgLink",
            },
            timeToComplete: "6h",
        }
    }
    apiService.fetchLearningObject.mockResolvedValue(learningObject);

    course1.urn = "urn:li:123"
    video1.urn = "urn:li:345"

    cache.set("course-1", course1);
    cache.set("video-1", video1);

    await cache.updateFromAPI("video-1");

    expect(apiService.fetchLearningObject).toHaveBeenCalledTimes(1);
    expect(cache.get("video-1").title).toStrictEqual("fetchedTitle");
});
