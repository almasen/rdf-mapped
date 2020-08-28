const contact = require("./");

const testHelpers = require("../../test/helpers");

const adminService = require("../admin");
const mail = require("../mail");
const octokit = require("../octokit");

jest.mock("../mail");
jest.mock("../admin");
jest.mock("../octokit");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("processing bug report works", async () => {
    mail.sendEmail.mockResolvedValue();
    adminService.logContactRequest.mockResolvedValue();
    octokit.createBugreportIssue.mockResolvedValue();
    octokit.createFeatureRequestIssue.mockResolvedValue();

    await contact.processContactRequest('123', {
        reason: "bugreport"
    });
    await contact.processContactRequest('123', {
        reason: "feature_request"
    });
    await contact.processContactRequest('123', {
        reason: "other"
    });

    expect(mail.sendEmail).toHaveBeenCalledTimes(3);
    expect(adminService.logContactRequest).toHaveBeenCalledTimes(3);
    expect(octokit.createBugreportIssue).toHaveBeenCalledTimes(1);
    expect(octokit.createFeatureRequestIssue).toHaveBeenCalledTimes(1);
});