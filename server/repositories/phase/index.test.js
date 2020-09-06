const phaseRepo = require("./");

const testHelpers = require("../../test/helpers");

let phase1;

beforeEach(() => {
    phase1 = testHelpers.getPhase1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const insertResult = await phaseRepo.insert(phase1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(phase1.title);
    const findResult = await phaseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(phase1.title);
});

test('inserting and updating works', async () => {
    const insertResult = await phaseRepo.insert(phase1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(phase1.title);
    const findResult = await phaseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(phase1.title);

    findRecord.title = "new title";

    const updateResult = await phaseRepo.update(findRecord);
    const updateRecord = updateResult.rows[0];
    expect(updateRecord.title).toStrictEqual("new title");

    const findResult2 = await phaseRepo.findById(insertRecord.id);
    const findRecord2 = findResult2.rows[0];
    expect(findRecord2.title).toStrictEqual("new title");
});

test('inserting and deleting works', async () => {
    const insertResult = await phaseRepo.insert(phase1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(phase1.title);
    const findResult = await phaseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(phase1.title);

    const deletionResult = await phaseRepo.removeById(insertRecord.id);
    expect(deletionResult.rows[0]).toStrictEqual(findRecord);

    const findResult2 = await phaseRepo.findById(insertRecord.id);
    expect(findResult2.rows.length).toStrictEqual(0);
});

test('finding all works', async () => {
    const insertResult = await phaseRepo.insert(phase1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(phase1.title);
    const findResult = await phaseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(phase1.title);
    const findAllResult = await phaseRepo.findAll();
    const findAllRecord = findAllResult.rows[0];
    expect(findAllResult.rows.length).toStrictEqual(1);
    expect(findAllRecord.title).toStrictEqual(phase1.title);
});
