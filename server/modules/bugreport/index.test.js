const bugreport = require("./");

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
    adminService.logBugReport.mockResolvedValue();
    octokit.createBugreportIssue.mockResolvedValue();

    await bugreport.processBugReport("/", '123', 'email@email.com', 'report');

    expect(mail.sendEmail).toHaveBeenCalledTimes(1);
    expect(adminService.logBugReport).toHaveBeenCalledTimes(1);
    expect(octokit.createBugreportIssue).toHaveBeenCalledTimes(1);
});