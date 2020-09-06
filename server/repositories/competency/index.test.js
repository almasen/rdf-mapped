const competencyRepo = require("./");
const categoryRepo = require("../category");
const capabilityRepo = require("../capability");

const testHelpers = require("../../test/helpers");
const competency = require("./");

let capability1; let category1; let competency1; let capability2; let category2; let competency2;

beforeEach(() => {
    capability1 = testHelpers.getCapability1();
    category1 = testHelpers.getCategory1();
    competency1 = testHelpers.getCompetency1();
    capability2 = testHelpers.getCapability2();
    category2 = testHelpers.getCategory2();
    competency2 = testHelpers.getCompetency2();
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

test('finding all works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertCatResult = await categoryRepo.insert(category1);
    const insertCatRecord = insertCatResult.rows[0];
    competency1.categoryId = insertCatRecord.id;
    const insertResult = await competencyRepo.insert(competency1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(competency1.title);

    const insertCapResult2 = await capabilityRepo.insert(capability2);
    const insertCapRecord2 = insertCapResult2.rows[0];
    category2.capabilityId = insertCapRecord2.id;
    const insertCatResult2 = await categoryRepo.insert(category2);
    const insertCatRecord2 = insertCatResult2.rows[0];
    competency2.categoryId = insertCatRecord2.id;
    const insertResult2 = await competencyRepo.insert(competency2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.title).toStrictEqual(competency2.title);

    const findResult = await competencyRepo.findAll();
    const findRecords = findResult.rows;

    // check if found array has all the inserted items
    const matchTitle1 = (e) => {
        return e.title === competency1.title;
    };
    const matchTitle2 = (e) => {
        return e.title === competency2.title;
    };
    expect(findRecords.some(matchTitle1)).toBe(true);
    expect(findRecords.some(matchTitle2)).toBe(true);

    // and only has them
    findRecords.forEach((e) => {
        expect(e.title === competency1.title || e.title === competency2.title).toBe(true);
    });
});

test('finding by keyword works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertCatResult = await categoryRepo.insert(category1);
    const insertCatRecord = insertCatResult.rows[0];
    competency1.categoryId = insertCatRecord.id;
    const insertResult = await competencyRepo.insert(competency1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(competency1.title);

    const insertCapResult2 = await capabilityRepo.insert(capability2);
    const insertCapRecord2 = insertCapResult2.rows[0];
    category2.capabilityId = insertCapRecord2.id;
    const insertCatResult2 = await categoryRepo.insert(category2);
    const insertCatRecord2 = insertCatResult2.rows[0];
    competency2.categoryId = insertCatRecord2.id;
    const insertResult2 = await competencyRepo.insert(competency2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.title).toStrictEqual(competency2.title);


    const findResult = await competencyRepo.findByKeyword(competency1.title.substring(0, 6));
    const findRecord = findResult.rows[0];

    expect(findRecord.title === competency1.title).toBe(true);
});

test('finding all by parent works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertCatResult = await categoryRepo.insert(category1);
    const insertCatRecord = insertCatResult.rows[0];
    competency1.categoryId = insertCatRecord.id;
    const insertResult = await competencyRepo.insert(competency1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(competency1.title);

    const insertCapResult2 = await capabilityRepo.insert(capability2);
    const insertCapRecord2 = insertCapResult2.rows[0];
    category2.capabilityId = insertCapRecord2.id;
    const insertCatResult2 = await categoryRepo.insert(category2);
    const insertCatRecord2 = insertCatResult2.rows[0];
    competency2.categoryId = insertCatRecord2.id;
    const insertResult2 = await competencyRepo.insert(competency2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.title).toStrictEqual(competency2.title);


    const findResult = await competencyRepo.findAllByParent(competency1.categoryId);
    const findRecord = findResult.rows[0];

    expect(findRecord.title === competency1.title).toBe(true);
    expect(findRecord.categoryId === insertCatRecord.id).toBe(true);
});

test('finding all by parent joint works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertCatResult = await categoryRepo.insert(category1);
    const insertCatRecord = insertCatResult.rows[0];
    competency1.categoryId = insertCatRecord.id;
    const insertResult = await competencyRepo.insert(competency1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(competency1.title);

    const insertCapResult2 = await capabilityRepo.insert(capability2);
    const insertCapRecord2 = insertCapResult2.rows[0];
    category2.capabilityId = insertCapRecord2.id;
    const insertCatResult2 = await categoryRepo.insert(category2);
    const insertCatRecord2 = insertCatResult2.rows[0];
    competency2.categoryId = insertCatRecord2.id;
    const insertResult2 = await competencyRepo.insert(competency2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.title).toStrictEqual(competency2.title);


    const findResult = await competencyRepo.findAllByParentJoint(competency1.categoryId);
    const findRecord = findResult.rows[0];

    expect(findRecord.title === insertCatRecord.title).toBe(true);
    expect(findRecord.categoryId === insertCatRecord.id).toBe(true);
});
