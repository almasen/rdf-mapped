const octokit = require("./");

const testHelpers = require("../../test/helpers");

const capability = require("../capability");
const category = require("../category");
const competency = require("../competency");
const mail = require("../mail");
const courseService = require("../course");
const videoService = require("../video");
const linkedinApi = require("../linkedin_learning");

jest.createMockFromModule("@octokit/request");

jest.mock("../category");
jest.mock("../competency");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("creating a detailed bugreport issue works", async () => {
    process.env.CREATE_GITHUB_ISSUES = '1';
    await octokit.createBugreportIssue({
        subject: "test1",
        report: "Something is wrong",
        email: "secure@email.com",
        ip: "clientIp",
        name: "privateNaM",
        'g-recaptcha-response': "reCAPTCHAres",
    });
});

test("creating a minimalistic bugreport issue works", async () => {
    process.env.CREATE_GITHUB_ISSUES = '1';
    await octokit.createBugreportIssue({
        report: "Something is wrong",
        originalURL: "/course/1",
    });
});

test("creating a minimalistic feature request issue works", async () => {
    process.env.CREATE_GITHUB_ISSUES = '1';
    await octokit.createFeatureRequestIssue({
        message: "Why can't this site brew my tea?",
        subject: "Complaint!"
    });
});

test("skipping Github issue creation based on environment config", async () => {
    process.env.CREATE_GITHUB_ISSUES = '0';
    await octokit.createFeatureRequestIssue({
        message: "Why can't this site brew my tea?",
        subject: "Complaint!"
    });
});
