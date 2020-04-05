const courseRepo = require("./");
const capabilityRepo = require("../capability");
const categoryRepo = require("../category");
const competencyRepo = require("../competency");

const testHelpers = require("../../test/helpers");

let course1, capability1, category1, competency1;

beforeEach(() => {
    course1 = testHelpers.getCourse1();
    capability1 = testHelpers.getCapability1();
    category1 = testHelpers.getCategory1();
    competency1 = testHelpers.getCompetency1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const capInsertResult = await capabilityRepo.insert(capability1);
    const catInsertResult = await categoryRepo.insert(category1);
    const compInsertResult = await competencyRepo.insert(competency1);
    const capInsertRecord = await capInsertResult.rows[0];
    const catInsertRecord = await catInsertResult.rows[0];
    const compInsertRecord = await compInsertResult.rows[0];

    course1.capabilityId = capInsertRecord.id;
    course1.categoryId = catInsertRecord.id;
    course1.competencyId = compInsertRecord.id;

    const insertResult = await courseRepo.insert(course1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(course1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);


    const findResult = await courseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(course1.title);
});

test('inserting and updating works', async () => {
    const capInsertResult = await capabilityRepo.insert(capability1);
    const catInsertResult = await categoryRepo.insert(category1);
    const compInsertResult = await competencyRepo.insert(competency1);
    const capInsertRecord = await capInsertResult.rows[0];
    const catInsertRecord = await catInsertResult.rows[0];
    const compInsertRecord = await compInsertResult.rows[0];

    course1.capabilityId = capInsertRecord.id;
    course1.categoryId = catInsertRecord.id;
    course1.competencyId = compInsertRecord.id;

    const insertResult = await courseRepo.insert(course1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(course1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);


    const findResult = await courseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(course1.title);

    findRecord.title = "new title";
    findRecord.hyperlink = "new hyperlink";

    const updateResult = await courseRepo.update(findRecord);
    const updateRecord = updateResult.rows[0];
    expect(updateRecord.title).toStrictEqual("new title");
    expect(updateRecord.hyperlink).toStrictEqual("new hyperlink");

    const findResult2 = await courseRepo.findById(insertRecord.id);
    const findRecord2 = findResult2.rows[0];
    expect(findRecord2.title).toStrictEqual("new title");
    expect(findRecord2.hyperlink).toStrictEqual("new hyperlink");
    // category unchanged
    expect(findRecord2.categoryId).toStrictEqual(insertRecord.categoryId);
});

test('inserting and deleting works', async () => {
    const capInsertResult = await capabilityRepo.insert(capability1);
    const catInsertResult = await categoryRepo.insert(category1);
    const compInsertResult = await competencyRepo.insert(competency1);
    const capInsertRecord = await capInsertResult.rows[0];
    const catInsertRecord = await catInsertResult.rows[0];
    const compInsertRecord = await compInsertResult.rows[0];

    course1.capabilityId = capInsertRecord.id;
    course1.categoryId = catInsertRecord.id;
    course1.competencyId = compInsertRecord.id;

    const insertResult = await courseRepo.insert(course1);
    const insertRecord = insertResult.rows[0];

    expect(insertRecord.title).toStrictEqual(course1.title);
    expect(insertRecord.capabilityId).toStrictEqual(capInsertRecord.id);
    expect(insertRecord.categoryId).toStrictEqual(catInsertRecord.id);
    expect(insertRecord.competencyId).toStrictEqual(compInsertRecord.id);

    const findResult = await courseRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(course1.title);

    const deletionResult = await courseRepo.removeById(insertRecord.id);
    expect(deletionResult.rows[0]).toStrictEqual(findRecord);

    const findResult2 = await courseRepo.findById(insertRecord.id);
    expect(findResult2.rows.length).toStrictEqual(0);
});

