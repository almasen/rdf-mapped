const categoryRepo = require("./");
const capabilityRepo = require("../capability");

const testHelpers = require("../../test/helpers");

let capability1, category1, capability2, category2;

beforeEach(() => {
    capability1 = testHelpers.getCapability1();
    category1 = testHelpers.getCategory1();
    capability2 = testHelpers.getCapability2();
    category2 = testHelpers.getCategory2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertResult = await categoryRepo.insert(category1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(category1.title);
    const findResult = await categoryRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(category1.title);
});

test('inserting and updating works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
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
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
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

test('finding all works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertCapResult2 = await capabilityRepo.insert(capability2);
    const insertCapRecord2 = insertCapResult2.rows[0];
    category2.capabilityId = insertCapRecord2.id;
    const insertResult = await categoryRepo.insert(category1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(category1.title);
    const insertResult2 = await categoryRepo.insert(category2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.title).toStrictEqual(category2.title);


    const findResult = await categoryRepo.findAll();
    const findRecords = findResult.rows;

    // check if found array has all the inserted items
    const matchTitle1 = (e) => {
        return e.title === category1.title;
    };
    const matchTitle2 = (e) => {
        return e.title === category2.title;
    };
    expect(findRecords.some(matchTitle1)).toBe(true);
    expect(findRecords.some(matchTitle2)).toBe(true);

    // and only has them
    findRecords.forEach((e) => {
        expect(e.title === category1.title || e.title === category2.title).toBe(true);
    })
});

test('finding by keyword works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertCapResult2 = await capabilityRepo.insert(capability2);
    const insertCapRecord2 = insertCapResult2.rows[0];
    category2.capabilityId = insertCapRecord2.id;
    const insertResult = await categoryRepo.insert(category1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(category1.title);
    const insertResult2 = await categoryRepo.insert(category2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.title).toStrictEqual(category2.title);


    const findResult = await categoryRepo.findByKeyword(category1.title.substring(0, 6));
    const findRecord = findResult.rows[0];

    expect(findRecord.title === category1.title).toBe(true);
});

test('finding all by parent works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertCapResult2 = await capabilityRepo.insert(capability2);
    const insertCapRecord2 = insertCapResult2.rows[0];
    category2.capabilityId = insertCapRecord2.id;
    const insertResult = await categoryRepo.insert(category1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(category1.title);
    const insertResult2 = await categoryRepo.insert(category2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.title).toStrictEqual(category2.title);


    const findResult = await categoryRepo.findAllByParent(category1.capabilityId);
    const findRecord = findResult.rows[0];

    expect(findRecord.title === category1.title).toBe(true);
    expect(findRecord.capabilityId === insertCapRecord.id).toBe(true);
});

test('finding all by parent joint works', async () => {
    const insertCapResult = await capabilityRepo.insert(capability1);
    const insertCapRecord = insertCapResult.rows[0];
    category1.capabilityId = insertCapRecord.id;
    const insertCapResult2 = await capabilityRepo.insert(capability2);
    const insertCapRecord2 = insertCapResult2.rows[0];
    category2.capabilityId = insertCapRecord2.id;
    const insertResult = await categoryRepo.insert(category1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(category1.title);
    const insertResult2 = await categoryRepo.insert(category2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.title).toStrictEqual(category2.title);


    const findResult = await categoryRepo.findAllByParentJoint(category1.capabilityId);
    const findRecord = findResult.rows[0];

    expect(findRecord.title === insertCapRecord.title).toBe(true);
    expect(findRecord.capabilityId === insertCapRecord.id).toBe(true);
});