const videoRepo = require("../../repositories/video");
const videoPhaseRepo = require("../../repositories/video/phase");
const capabilityRepo = require("../../repositories/capability");
const categoryRepo = require("../../repositories/category");
const competencyRepo = require("../../repositories/competency");
const phaseRepo = require("../../repositories/phase");

const cache = require("../cache");
const filtering = require("../filtering");

const videoService = require("./");

const testHelpers = require("../../test/helpers");
const video = require("../../repositories/video");

jest.mock("../../repositories/video");
jest.mock("../../repositories/video/phase");
jest.mock("../../repositories/capability");
jest.mock("../../repositories/category");
jest.mock("../../repositories/competency");
jest.mock("../../repositories/phase");

jest.mock("../cache");
jest.mock("../filtering");

let video1; let video2; let video3; let capability1; let category1; let competency1; let capability2; let category2; let competency2; let phase1; let phase2;

beforeEach(() => {
    video1 = testHelpers.getVideo1();
    video2 = testHelpers.getVideo2();
    video3 = testHelpers.getVideo3();
    capability1 = testHelpers.getCapability1();
    category1 = testHelpers.getCategory1();
    competency1 = testHelpers.getCompetency1();
    capability2 = testHelpers.getCapability2();
    category2 = testHelpers.getCategory2();
    competency2 = testHelpers.getCompetency2();
    phase1 = testHelpers.getPhase1();
    phase2 = testHelpers.getPhase2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test('fetching similar video objects from cache works', async () => {
    cache.has.mockReturnValue(true);
    video1.phases = [1, 2];
    video2.phases = [1];
    video3.phases = [2, 3];
    video1.id = 1;
    video2.id = 2;
    video3.id = 3;
    cache.get.mockReturnValue([video1, video2, video3]);

    const fetchRecords = await videoService.fetchSimilarVideoRecords({...video1});

    expect(fetchRecords.length).toStrictEqual(1);
    expect(fetchRecords[0]).toStrictEqual(video2);
});

test('fetching similar video objects from database works', async () => {
    cache.has.mockReturnValue(false);
    video1.phases = [1, 2];
    video2.phases = [1];
    video3.phases = [2, 3];
    video1.id = 1;
    video2.id = 2;
    video3.id = 3;
    videoRepo.findByFilters.mockResolvedValue({
        rows: [
            {...video1},
            {...video2},
        ],
    });

    const fetchRecords = await videoService.fetchSimilarVideoRecords({...video1}, 2);

    expect(fetchRecords.length).toStrictEqual(1);
    expect(fetchRecords[0]).toStrictEqual(video2);
});

test('fetching and resolving video object from cache works', async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue({...video1});

    const fetchRecord = await videoService.fetchAndResolveVideo(1);

    expect(fetchRecord.title).toStrictEqual(video1.title);
});

test('attempting to fetch video without cached objects fails as expected', async () => {
    cache.has.mockReturnValue(false);

    try {
        const fetchRecord = await videoService.fetchAndResolveVideo(1);
        fail("should not reach here");
    } catch (error) {
        expect(cache.has).toHaveBeenCalledTimes(1);
    }
});

test('fetching videos based on null filters from cache works', async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([video1, video2, video3]);

    const fetchRecords = await videoService.fetchByFilters({});

    expect(fetchRecords.length).toStrictEqual(3);
    expect(fetchRecords[0]).toStrictEqual(video1);
});

test('fetching videos based on null filters from database works', async () => {
    cache.has.mockReturnValue(false);
    videoRepo.findByFiltersAndKeywordJoint.mockResolvedValue({
        rows: [
            {...video1},
            {...video2},
            {...video3},
        ],
    });

    const fetchRecords = await videoService.fetchByFilters({});

    expect(fetchRecords.length).toStrictEqual(3);
    expect(fetchRecords[0]).toStrictEqual(video1);
});

test('fetching videos based on keyword from cache works', async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([video1, video2, video3]);

    const fetchRecords = await videoService.fetchByFilters({
        capability: -1,
        category: -1,
        competency: -1,
        phase: -1,
        keyword: video1.title,
    });

    expect(fetchRecords.length).toStrictEqual(1);
    expect(fetchRecords[0]).toStrictEqual(video1);
});

test('fetching videos based on custom filters from cache works', async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([video1, video2, video3]);

    const fetchRecords1 = await videoService.fetchByFilters({
        capability: 42,
        category: 58,
        competency: 69,
        phase: 666,
    });

    expect(fetchRecords1.length).toStrictEqual(0);

    video2.capabilityId = 42;
    video2.categoryId = 58;
    video2.competencyId = 69;
    video2.phases = [1, 2, 666, 777];

    const fetchRecords2 = await videoService.fetchByFilters({
        capability: 42,
        category: 58,
        competency: 69,
        phase: 666,
    });

    expect(fetchRecords2.length).toStrictEqual(1);
    expect(fetchRecords2[0]).toStrictEqual(video2);
});

test('fetching videos based on custom filters from database works', async () => {
    cache.has.mockReturnValue(false);
    videoRepo.findByFiltersAndKeywordJoint.mockResolvedValue({
        rows: [
            {...video1},
        ],
    });

    const fetchRecords = await videoService.fetchByFilters({
        capability: 1,
        category: 1,
        competency: 1,
        phase: 1,
        keyword: video1.title,
    });

    expect(fetchRecords.length).toStrictEqual(1);
    expect(fetchRecords[0]).toStrictEqual(video1);
});

test('fetching all from cache works', async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([video1, video2, video3]);

    const fetchRecords = await videoService.fetchAll();

    expect(fetchRecords.length).toStrictEqual(3);
    expect(fetchRecords[0]).toStrictEqual(video1);
});

test('fetching all from database works', async () => {
    cache.has.mockReturnValue(false);
    videoRepo.findByFiltersAndKeywordJoint.mockResolvedValue({
        rows: [
            {...video1},
            {...video2},
            {...video3},
        ],
    });

    const fetchRecords = await videoService.fetchAll();

    expect(fetchRecords.length).toStrictEqual(3);
    expect(fetchRecords[0]).toStrictEqual(video1);
    expect(videoRepo.findByFiltersAndKeywordJoint).toHaveBeenCalledTimes(1);
});

test('fetching all with unique titles works', async () => {
    cache.has.mockReturnValue(false);
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([video1, video1, video2]);
    filtering.filterAndSortByTitle.mockReturnValue([video1, video2]);

    const fetchRecords = await videoService.fetchAllWithUniqueTitles();

    expect(fetchRecords.length).toStrictEqual(2);
    expect(fetchRecords[0]).toStrictEqual(video1);
    expect(filtering.filterAndSortByTitle).toHaveBeenCalledTimes(1);
});

test('adding a new video with a single phase works', async () => {
    video1.id = 1;
    video1.phases = 1;
    videoRepo.insert.mockResolvedValue({
        rows: [
            {...video1},
        ],
    });
    videoPhaseRepo.insert.mockResolvedValue();
    videoRepo.findByIdWithFullInfo.mockResolvedValue({
        rows: [
            {...video1},
        ],
    });
    cache.set.mockReturnValue();
    cache.updateFromAPI.mockResolvedValue();

    const newVideoId = await videoService.addNewVideo(video1);

    expect(videoPhaseRepo.insert).toHaveBeenCalledTimes(1);
    expect(newVideoId).toStrictEqual(video1.id);
});

test('adding a new video with multiple phases works', async () => {
    video1.id = 1;
    video1.phases = [1, 2];
    videoRepo.insert.mockResolvedValue({
        rows: [
            {...video1},
        ],
    });
    videoPhaseRepo.insert.mockResolvedValue();
    videoRepo.findByIdWithFullInfo.mockResolvedValue({
        rows: [
            {...video1},
        ],
    });
    cache.set.mockReturnValue();
    cache.updateFromAPI.mockResolvedValue();

    const newVideoId = await videoService.addNewVideo(video1);

    expect(videoPhaseRepo.insert).toHaveBeenCalledTimes(2);
    expect(newVideoId).toStrictEqual(video1.id);
});

test('updating a video with a single phase works', async () => {
    video1.id = 1;
    video1.phases = 1;
    videoRepo.update.mockResolvedValue({
        rows: [
            {...video1},
        ],
    });
    videoPhaseRepo.removeByVideoId.mockResolvedValue();
    videoPhaseRepo.insert.mockResolvedValue();
    videoRepo.findByIdWithFullInfo.mockResolvedValue({
        rows: [
            {...video1},
        ],
    });
    cache.get.mockReturnValue([video1]);
    cache.set.mockReturnValue();
    cache.updateFromAPI.mockResolvedValue();

    await videoService.updateVideo(video1);

    expect(videoPhaseRepo.insert).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledTimes(2);
});

test('updating a video with multiple phases works', async () => {
    video1.id = 1;
    video1.phases = [1, 2];
    videoRepo.update.mockResolvedValue({
        rows: [
            {...video1},
        ],
    });
    videoPhaseRepo.removeByVideoId.mockResolvedValue();
    videoPhaseRepo.insert.mockResolvedValue();
    videoRepo.findByIdWithFullInfo.mockResolvedValue({
        rows: [
            {...video1},
        ],
    });
    cache.get.mockReturnValue([video1]);
    cache.set.mockReturnValue();
    cache.updateFromAPI.mockResolvedValue();

    await videoService.updateVideo(video1);

    expect(videoPhaseRepo.insert).toHaveBeenCalledTimes(2);
    expect(cache.set).toHaveBeenCalledTimes(2);
});

test('deleting a video works', async () => {
    video1.id = 1;
    videoRepo.removeById.mockResolvedValue();
    videoPhaseRepo.removeByVideoId.mockResolvedValue();
    cache.get.mockReturnValue([video1]);
    cache.del.mockReturnValue();
    cache.set.mockReturnValue();

    await videoService.deleteVideo(video1.id);

    expect(videoRepo.removeById).toHaveBeenCalledTimes(1);
    expect(videoRepo.removeById).toHaveBeenCalledWith(1);
});
