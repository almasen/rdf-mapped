const linkedinLearning = require("./");

const testHelpers = require("../../test/helpers");

const learningObjectRepository = require("../../repositories/learning_object");

jest.mock("../../repositories/learning_object");

let learningObject1, learningObject2, outdatedLearningObject1;

beforeEach(() => {
    linkedinLearning.resetFailedRenewalsCounter();
    learningObject1 = testHelpers.getLearningObject1();
    learningObject2 = testHelpers.getLearningObject2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("API token renewal is automatically attempted when fetching learning object returns 401 once", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'expiredToken';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'tnahpele';
    learningObjectRepository.findByURN.mockResolvedValue({
        rows: [],
    });
    learningObjectRepository.insert.mockResolvedValue();

    const fetchedData = await linkedinLearning.fetchLearningObject("urn:li:example42");
    expect(process.env.LINKEDIN_LEARNING_TOKEN).toStrictEqual("expiredToken");
});

test("API token renewal is no longer attempted when fetching learning object returns 401 multiple times", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'expiredToken';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'tnahpele';
    learningObjectRepository.findByURN.mockResolvedValue({
        rows: [],
    });
    learningObjectRepository.insert.mockResolvedValue();

    await linkedinLearning.fetchLearningObject("urn:li:example42");
    await linkedinLearning.fetchLearningObject("urn:li:example42");
    expect(process.env.LINKEDIN_LEARNING_TOKEN).toStrictEqual("expiredToken");
});

test("API token renewal is automatically attempted when fetching URN returns 401 once", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'expiredToken';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'tnahpele';
    learningObjectRepository.findByURN.mockResolvedValue({
        rows: [],
    });
    learningObjectRepository.insert.mockResolvedValue();

    const fetchedData = await linkedinLearning.fetchURNByContent(learningObject1, "COURSE");
    expect(process.env.LINKEDIN_LEARNING_TOKEN).toStrictEqual("expiredToken");
});

test("API token renewal is no longer attempted when fetching URN returns 401 multiple times", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'expiredToken';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'tnahpele';
    learningObjectRepository.findByURN.mockResolvedValue({
        rows: [],
    });
    learningObjectRepository.insert.mockResolvedValue();

    await linkedinLearning.fetchURNByContent(learningObject1, "COURSE");
    await linkedinLearning.fetchURNByContent(learningObject1, "COURSE");
    expect(process.env.LINKEDIN_LEARNING_TOKEN).toStrictEqual("expiredToken");
});
