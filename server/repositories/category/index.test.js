const categoryRepo = require("./");

const testHelpers = require("../../test/helpers");

let category1;

beforeEach(() => {
    category1 = testHelpers.getCategory1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const insertResult = await categoryRepo.insert(category1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(category1.title);
    const findResult = await categoryRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(category1.title);
});

test('inserting and updating works', async () => {
    const insertResult = await categoryRepo.insert(category1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(category1.title);
    const findResult = await categoryRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(category1.title);

    findRecord.title = "new title";

    const updateResult = await categoryRepo.update(findRecord);
    const updateRecord = updateResult.rows[0];
    expect(updateRecord.title).toStrictEqual("new title");

    const findResult2 = await categoryRepo.findById(insertRecord.id);
    const findRecord2 = findResult2.rows[0];
    expect(findRecord2.title).toStrictEqual("new title");
});

test('inserting and deleting works', async () => {
    const insertResult = await categoryRepo.insert(category1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(category1.title);
    const findResult = await categoryRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(category1.title);

    const deletionResult = await categoryRepo.removeById(insertRecord.id);
    expect(deletionResult.rows[0]).toStrictEqual(findRecord);

    const findResult2 = await categoryRepo.findById(insertRecord.id);
    expect(findResult2.rows.length).toStrictEqual(0);
});

