const submission = require("./");

const testHelpers = require("../../test/helpers");

const submissionRepo = require("../../repositories/submission");
const capability = require("../capability");
const category = require("../category");
const competency = require("../competency");
const mail = require("../mail");
const courseService = require("../course");
const videoService = require("../video");
const linkedinApi = require("../linkedin_learning");

jest.mock("../../repositories/submission");
jest.mock("../mail");
jest.mock("../course");
jest.mock("../video");
jest.mock("../linkedin_learning");
jest.mock("../capability");
jest.mock("../category");
jest.mock("../competency");

let submission1, submission12, submission2, submission3, submission4, submission5;

beforeEach(() => {
    submission1 = testHelpers.getSubmission1();
    submission12 = testHelpers.getSubmission12();
    submission2 = testHelpers.getSubmission2();
    submission3 = testHelpers.getSubmission3();
    submission4 = testHelpers.getSubmission4();
    submission5 = testHelpers.getSubmission5();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("fetching submission by id works", async () => {
    submissionRepo.findById.mockResolvedValue({
        rows: [
            { ...submission1 },
        ]
    });
    const fetchResult = await submission.fetchById("uniqueID123");
    expect(fetchResult).toStrictEqual(submission1);
});

test("fetching all submissions works", async () => {
    submissionRepo.findAll.mockResolvedValue({
        rows: [
            { ...submission1 },
            { ...submission2 },
        ]
    });
    const fetchResult = await submission.fetchAll();
    expect(fetchResult.length).toStrictEqual(2);
    expect(fetchResult).toStrictEqual([submission1, submission2]);
});

test("inserting a valid new submission works", async () => {
    mail.sendEmail.mockResolvedValue();
    const exampleUrn = "urn:li:example1";
    linkedinApi.fetchURNByContent.mockResolvedValue(exampleUrn);
    submissionRepo.insert.mockResolvedValue({
        rows: [
            {
                status: submission1.status,
                submitter: submission1.submitter,
                data: JSON.parse(submission1.data),
                id: "uniqueID123"
            },
        ]
    });
    submissionRepo.update.mockResolvedValue();

    await submission.insertNewSubmission(
        JSON.parse(submission1.data).type,
        JSON.parse(submission1.data).title,
        JSON.parse(submission1.data).hyperlink,
        submission1.submitter,
    );

    expect(mail.sendEmail).toHaveBeenCalledTimes(1);
    expect(linkedinApi.fetchURNByContent).toHaveBeenCalledTimes(1);
    expect(submissionRepo.insert).toHaveBeenCalledTimes(1);
    expect(submissionRepo.update).toHaveBeenCalledTimes(1);
    const calledWith = {
        status: "pending",
        submitter: submission1.submitter,
        data: JSON.parse(submission1.data),
        id: "uniqueID123",
    };
    calledWith.data.urn = exampleUrn;
    expect(submissionRepo.update).toHaveBeenCalledWith(calledWith);
});

test("inserting a valid new anonymous submission works", async () => {
    mail.sendEmail.mockResolvedValue();
    const exampleUrn = "urn:li:example1";
    linkedinApi.fetchURNByContent.mockResolvedValue(exampleUrn);
    submissionRepo.insert.mockResolvedValue({
        rows: [
            {
                status: submission12.status,
                submitter: submission12.submitter,
                data: JSON.parse(submission12.data),
                id: "uniqueID123"
            },
        ]
    });
    submissionRepo.update.mockResolvedValue();

    await submission.insertNewSubmission(
        JSON.parse(submission12.data).type,
        JSON.parse(submission12.data).title,
        JSON.parse(submission12.data).hyperlink,
        null,
    );

    expect(mail.sendEmail).toHaveBeenCalledTimes(0);
    expect(linkedinApi.fetchURNByContent).toHaveBeenCalledTimes(1);
    expect(submissionRepo.insert).toHaveBeenCalledTimes(1);
    expect(submissionRepo.update).toHaveBeenCalledTimes(1);
    const calledWith = {
        status: "pending",
        submitter: submission12.submitter,
        data: JSON.parse(submission12.data),
        id: "uniqueID123",
    };
    calledWith.data.urn = exampleUrn;
    expect(submissionRepo.update).toHaveBeenCalledWith(calledWith);
});

test("inserting an invalid new submission is marked failed as intended", async () => {
    mail.sendEmail.mockResolvedValue();
    linkedinApi.fetchURNByContent.mockResolvedValue(undefined);
    submissionRepo.insert.mockResolvedValue({
        rows: [
            {
                status: "processing",
                submitter: submission4.submitter,
                data: JSON.parse(submission4.data),
                id: "uniqueID123"
            },
        ]
    });
    submissionRepo.update.mockResolvedValue();

    await submission.insertNewSubmission(
        JSON.parse(submission4.data).type,
        JSON.parse(submission4.data).title,
        JSON.parse(submission4.data).hyperlink,
        null,
    );

    expect(mail.sendEmail).toHaveBeenCalledTimes(0);
    expect(linkedinApi.fetchURNByContent).toHaveBeenCalledTimes(1);
    expect(submissionRepo.insert).toHaveBeenCalledTimes(1);
    expect(submissionRepo.update).toHaveBeenCalledTimes(1);
    const calledWith = {
        status: "failed",
        submitter: submission4.submitter,
        data: JSON.parse(submission4.data),
        id: "uniqueID123",
    };
    expect(submissionRepo.update).toHaveBeenCalledWith(calledWith);
});

test("rejecting submission by id works", async () => {
    submissionRepo.findById.mockResolvedValue({
        rows: [
            { ...submission1 },
        ]
    });
    submissionRepo.update.mockResolvedValue();
    await submission.rejectSubmission("uniqueID123");
    expect(submissionRepo.findById).toHaveBeenCalledTimes(1);
    expect(submissionRepo.update).toHaveBeenCalledTimes(1);
    const calledWith = { ...submission1 };
    calledWith.status = "rejected";
    expect(submissionRepo.update).toHaveBeenCalledWith(calledWith);
});

test("publishing a valid course submission works", async () => {
    courseService.addNewCourse.mockResolvedValue();
    videoService.addNewVideo.mockResolvedValue();
    submissionRepo.findById.mockResolvedValue({
        rows: [
            {
                status: "pending",
                submitter: submission2.submitter,
                data: JSON.parse(submission2.data),
                id: "uniqueID123"
            }
        ]
    });
    submissionRepo.update.mockResolvedValue();

    await submission.publishSubmission("uniqueID123");
    expect(submissionRepo.findById).toHaveBeenCalledTimes(1);
    expect(submissionRepo.update).toHaveBeenCalledTimes(1);
    expect(courseService.addNewCourse).toHaveBeenCalledTimes(1);
    expect(videoService.addNewVideo).toHaveBeenCalledTimes(0);
});

test("publishing a valid video submission works", async () => {
    courseService.addNewCourse.mockResolvedValue();
    videoService.addNewVideo.mockResolvedValue();
    const dbRecord = {
        status: "pending",
        submitter: submission2.submitter,
        data: JSON.parse(submission2.data),
        id: "uniqueID123"
    };
    dbRecord.data.type = "VIDEO";
    submissionRepo.findById.mockResolvedValue({
        rows: [
            { ...dbRecord }
        ]
    });
    submissionRepo.update.mockResolvedValue();

    await submission.publishSubmission("uniqueID123");
    expect(submissionRepo.findById).toHaveBeenCalledTimes(1);
    expect(submissionRepo.update).toHaveBeenCalledTimes(1);
    expect(courseService.addNewCourse).toHaveBeenCalledTimes(0);
    expect(videoService.addNewVideo).toHaveBeenCalledTimes(1);
});

test("mapping a valid submission works", async () => {
    const dbRecord = {
        status: "pending",
        submitter: submission3.submitter,
        data: JSON.parse(submission3.data),
        id: "uniqueID123"
    };
    submissionRepo.findById.mockResolvedValue({
        rows: [
            { ...dbRecord },
        ]
    });
    submissionRepo.update.mockResolvedValue();
    capability.fetchById.mockResolvedValue(testHelpers.getCapability1())
    category.fetchById.mockResolvedValue(testHelpers.getCategory1())
    competency.fetchById.mockResolvedValue(testHelpers.getCompetency1())

    await submission.mapSubmission("uniqueID123", 1, 1, 1, [1, 2]);

    expect(submissionRepo.findById).toHaveBeenCalledTimes(1);
    expect(capability.fetchById).toHaveBeenCalledTimes(1);
    expect(category.fetchById).toHaveBeenCalledTimes(1);
    expect(competency.fetchById).toHaveBeenCalledTimes(1);
    expect(submissionRepo.update).toHaveBeenCalledTimes(1);
});
