const submissionRepo = require("./");

const testHelpers = require("../../test/helpers");

let submission1;

beforeEach(() => {
    submission1 = testHelpers.getSubmission1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    submission1.id = "sub1id12345678";
    const insertResult = await submissionRepo.insert(submission1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(submission1.title);

    const findResult = await submissionRepo.findById(submission1.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.submitter).toStrictEqual(submission1.submitter);
});

test('finding all works', async () => {
    submission1.id = "sub1id12345678";
    const insertResult = await submissionRepo.insert(submission1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(submission1.title);

    const findResult = await submissionRepo.findAll();
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.submitter).toStrictEqual(submission1.submitter);
    expect(findResult.rows.length).toStrictEqual(1);
});

test('removing works', async () => {
    submission1.id = "sub1id12345678";
    const insertResult = await submissionRepo.insert(submission1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(submission1.title);

    const findResult = await submissionRepo.findAll();
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.submitter).toStrictEqual(submission1.submitter);
    expect(findResult.rows.length).toStrictEqual(1);

    await submissionRepo.removeById(submission1.id);

    const findResult2 = await submissionRepo.findAll();
    expect(findResult2.rows.length).toStrictEqual(0);
});

test('updating works', async () => {
    submission1.id = "sub1id12345678";
    const insertResult = await submissionRepo.insert(submission1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(submission1.title);

    const findResult = await submissionRepo.findById(submission1.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.submitter).toStrictEqual(submission1.submitter);

    findRecord.status = "rejected";
    await submissionRepo.update(findRecord);

    const findResult2 = await submissionRepo.findById(submission1.id);
    const findRecord2 = findResult2.rows[0];
    expect(findRecord2.submitter).toStrictEqual(submission1.submitter);
    expect(findRecord2.status).toStrictEqual("rejected");
});
