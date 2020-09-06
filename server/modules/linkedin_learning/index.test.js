const linkedinLearning = require("./");

const testHelpers = require("../../test/helpers");

const learningObjectRepository = require("../../repositories/learning_object");

jest.mock("../../repositories/learning_object");

const got = require("got");
jest.mock("got");

let learningObject1; let learningObject2; let outdatedLearningObject1; let submission1;

beforeEach(() => {
    learningObject1 = testHelpers.getLearningObject1();
    learningObject2 = testHelpers.getLearningObject2();
    submission1 = testHelpers.getSubmission1();
    outdatedLearningObject1 = testHelpers.getOutdatedLearningObject1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    got.mockReset();
    got.post.mockReset();
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("API token renewal works", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'expiredToken';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'tnahpele';
    got.post.mockResolvedValue({
        statusCode: 200,
        body: {
            access_token: "newToken",
        },
    });

    await linkedinLearning.renewAccessToken();

    expect(got.post).toHaveBeenCalledTimes(1);
    expect(process.env.LINKEDIN_LEARNING_TOKEN).toStrictEqual("newToken");
});

test("attempting API token renewal with invalid secret fails as expected", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'expiredToken';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'notTnahpele';
    got.post.mockResolvedValue({
        statusCode: 401,
        statusMessage: "Unauthorised.",
    });

    await linkedinLearning.renewAccessToken();

    expect(got.post).toHaveBeenCalledTimes(1);
    expect(process.env.LINKEDIN_LEARNING_TOKEN).toStrictEqual("expiredToken");
});

test("attempting API token renewal with an invalid request fails as expected", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'expiredToken';
    process.env.LINKEDIN_LEARNING_ID = undefined;
    process.env.LINKEDIN_LEARNING_SECRET = undefined;
    got.post.mockImplementation(() => {
        throw new Error("Invalid request");
    });

    await linkedinLearning.renewAccessToken();

    expect(got.post).toHaveBeenCalledTimes(1);
    expect(process.env.LINKEDIN_LEARNING_TOKEN).toStrictEqual("expiredToken");
});

test("fetching a LinkedIn Learning learning object works", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'token';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'tnahpele';
    learningObjectRepository.findByURN.mockResolvedValue({
        rows: [],
    });
    got.mockResolvedValue({
        statusCode: 200,
        body: {
            data: "someData",
        },
    });
    learningObjectRepository.insert.mockResolvedValue();

    const fetchedData = await linkedinLearning.fetchLearningObject("urn:li:example42");

    expect(got).toHaveBeenCalledTimes(1);
    expect(learningObjectRepository.insert).toHaveBeenCalledTimes(1);
    expect(fetchedData).toStrictEqual(JSON.parse('{"data": "someData"}'));
});

test("fetching a LinkedIn Learning learning object with outdated DB records works as intended", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'token';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'tnahpele';
    learningObjectRepository.findByURN.mockResolvedValue({
        rows: [
            {...outdatedLearningObject1},
        ],
    });
    got.mockResolvedValue({
        statusCode: 200,
        body: {
            data: "someData",
        },
    });
    learningObjectRepository.insert.mockResolvedValue();

    const fetchedData = await linkedinLearning.fetchLearningObject("urn:li:example42");

    expect(got).toHaveBeenCalledTimes(1);
    expect(learningObjectRepository.insert).toHaveBeenCalledTimes(1);
    expect(fetchedData).toStrictEqual(JSON.parse('{"data": "someData"}'));
});

test("attempting to fetch a LinkedIn Learning learning object with an up to date DB record returns db record as intended", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'token';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'tnahpele';
    learningObject1.timestamp = (new Date).toUTCString();
    learningObjectRepository.findByURN.mockResolvedValue({
        rows: [
            {...learningObject1},
        ],
    });
    got.mockResolvedValue({
        statusCode: 200,
        body: {
            data: "someData",
        },
    });
    learningObjectRepository.insert.mockResolvedValue();

    const fetchedData = await linkedinLearning.fetchLearningObject("urn:li:example42");

    expect(got).toHaveBeenCalledTimes(0);
    expect(learningObjectRepository.insert).toHaveBeenCalledTimes(0);
    expect(fetchedData).toStrictEqual(learningObject1.data);
});

test("failure when fetching a LinkedIn Learning learning object returns undefined as expected", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'token';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'tnahpele';
    learningObjectRepository.findByURN.mockResolvedValue({
        rows: [],
    });
    got.mockResolvedValue({
        statusCode: 400,
        body: {
        },
    });
    learningObjectRepository.insert.mockResolvedValue();

    const fetchedData = await linkedinLearning.fetchLearningObject("urn:li:example42");

    expect(got).toHaveBeenCalledTimes(1);
    expect(learningObjectRepository.insert).toHaveBeenCalledTimes(0);
    expect(fetchedData).toStrictEqual(undefined);
});

test("fetching LinkedIn Learning URN by content works", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'token';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'tnahpele';
    got.mockResolvedValue({
        statusCode: 400,
        body: {
            elements: [
                {
                    details: {
                        urls: {
                            webLaunch: "https://rdfmapped.com",
                        },
                    },
                    urn: "rdfmapped.com",
                },
                {
                    details: {
                        urls: {
                            webLaunch: "elephant",
                        },
                    },
                    urn: "tnahpele",
                },
                {
                    details: {
                        urls: {
                            webLaunch: "https://www.linkedin.com/learning/somethingElse",
                        },
                    },
                    urn: "urn:li:example666",
                },
                {
                    details: {
                        urls: {
                            webLaunch: "https://www.linkedin.com/learning/business-development-foundations-researching-market-and-customer-needs",
                        },
                    },
                    urn: "urn:li:example58",
                },
            ],
        },
    });
    learningObjectRepository.insert.mockResolvedValue();

    const foundURN = await linkedinLearning.fetchURNByContent(
        {
            data: JSON.parse(submission1.data),
        },
        "COURSE",
    );

    expect(got).toHaveBeenCalledTimes(1);
    expect(foundURN).toStrictEqual("urn:li:example58");
});

test("failure when fetching LinkedIn Learning URN by content returns undefined as expected", async () => {
    process.env.LINKEDIN_LEARNING_TOKEN = 'token';
    process.env.LINKEDIN_LEARNING_ID = 'elephant';
    process.env.LINKEDIN_LEARNING_SECRET = 'tnahpele';
    got.mockResolvedValue({
        statusCode: 400,
        body: {
            elements: [
                {
                    details: {
                        urls: {
                            webLaunch: "https://rdfmapped.com",
                        },
                    },
                    urn: "rdfmapped.com",
                },
                {
                    details: {
                        urls: {
                            webLaunch: "elephant",
                        },
                    },
                    urn: "tnahpele",
                },
                {
                    details: {
                        urls: {
                            webLaunch: "https://www.linkedin.com/learning/somethingElse",
                        },
                    },
                    urn: "urn:li:example666",
                },
            ],
        },
    });
    learningObjectRepository.insert.mockResolvedValue();

    const foundURN = await linkedinLearning.fetchURNByContent(
        {
            data: JSON.parse(submission1.data),
        },
        "COURSE",
    );

    expect(got).toHaveBeenCalledTimes(1);
    expect(foundURN).toStrictEqual(undefined);
});

// test("creating a minimalistic feature request issue works", async () => {
//     process.env.CREATE_GITHUB_ISSUES = '1';
//     await linkedinLearning.createFeatureRequestIssue({
//         message: "Why can't this site brew my tea?",
//         subject: "Complaint!"
//     });
// });

// test("skipping Github issue creation based on environment config", async () => {
//     process.env.CREATE_GITHUB_ISSUES = '0';
//     await linkedinLearning.createFeatureRequestIssue({
//         message: "Why can't this site brew my tea?",
//         subject: "Complaint!"
//     });
// });
