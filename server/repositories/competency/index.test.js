const competencyRepo = require("./");
const categoryRepo = require("../category");
const capabilityRepo = require("../capability");

const testHelpers = require("../../test/helpers");

let capability1, category1, competency1;

beforeEach(() => {
    capability1 = testHelpers.getCapability1();
    category1 = testHelpers.getCategory1();
    competency1 = testHelpers.getCompetency1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertCatResult = await categoryRepo.insert(category1);
    const insertCatRecord = insertCatResult.rows[0];
    competency1.categoryId = insertCatRecord.id;

    const insertResult = await competencyRepo.insert(competency1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(competency1.title);
    const findResult = await competencyRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(competency1.title);
});

test('inserting and updating works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertCatResult = await categoryRepo.insert(category1);
    const insertCatRecord = insertCatResult.rows[0];
    competency1.categoryId = insertCatRecord.id;

    const insertResult = await competencyRepo.insert(competency1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(competency1.title);
    const findResult = await competencyRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(competency1.title);

    findRecord.title = "new title";

    const updateResult = await competencyRepo.update(findRecord);
    const updateRecord = updateResult.rows[0];
    expect(updateRecord.title).toStrictEqual("new title");

    const findResult2 = await competencyRepo.findById(insertRecord.id);
    const findRecord2 = findResult2.rows[0];
    expect(findRecord2.title).toStrictEqual("new title");
});

test('inserting and deleting works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertCatResult = await categoryRepo.insert(category1);
    const insertCatRecord = insertCatResult.rows[0];
    competency1.categoryId = insertCatRecord.id;

    const insertResult = await competencyRepo.insert(competency1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(competency1.title);
    const findResult = await competencyRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(competency1.title);

    const deletionResult = await competencyRepo.removeById(insertRecord.id);
    expect(deletionResult.rows[0]).toStrictEqual(findRecord);

    const findResult2 = await competencyRepo.findById(insertRecord.id);
    expect(findResult2.rows.length).toStrictEqual(0);
});

