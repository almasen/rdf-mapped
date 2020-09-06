const capabilityRepo = require("./");

const testHelpers = require("../../test/helpers");

let capability1; let capability2; let capability3; let capability4;

beforeEach(() => {
    capability1 = testHelpers.getCapability1();
    capability2 = testHelpers.getCapability2();
    capability3 = testHelpers.getCapability3();
    capability4 = testHelpers.getCapability4();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const insertResult = await capabilityRepo.insert(capability1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(capability1.title);
    const findResult = await capabilityRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(capability1.title);
});

test('inserting and updating works', async () => {
    const insertResult = await capabilityRepo.insert(capability1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(capability1.title);
    const findResult = await capabilityRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(capability1.title);

    findRecord.title = "new title";

    const updateResult = await capabilityRepo.update(findRecord);
    const updateRecord = updateResult.rows[0];
    expect(updateRecord.title).toStrictEqual("new title");

    const findResult2 = await capabilityRepo.findById(insertRecord.id);
    const findRecord2 = findResult2.rows[0];
    expect(findRecord2.title).toStrictEqual("new title");
});

test('inserting and deleting works', async () => {
    const insertResult = await capabilityRepo.insert(capability1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(capability1.title);
    const findResult = await capabilityRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(capability1.title);

    const deletionResult = await capabilityRepo.removeById(insertRecord.id);
    expect(deletionResult.rows[0]).toStrictEqual(findRecord);

    const findResult2 = await capabilityRepo.findById(insertRecord.id);
    expect(findResult2.rows.length).toStrictEqual(0);
});

test('finding all works', async () => {
    const insertResult = await capabilityRepo.insert(capability1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(capability1.title);
    const insertResult2 = await capabilityRepo.insert(capability2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.title).toStrictEqual(capability2.title);


    const findResult = await capabilityRepo.findAll();
    const findRecords = findResult.rows;

    // check if found array has all the inserted items
    const matchTitle1 = (e) => {
        return e.title === capability1.title;
    };
    const matchTitle2 = (e) => {
        return e.title === capability2.title;
    };
    expect(findRecords.some(matchTitle1)).toBe(true);
    expect(findRecords.some(matchTitle2)).toBe(true);

    // and only has them
    findRecords.forEach((e) => {
        expect(e.title === capability1.title || e.title === capability2.title).toBe(true);
    });
});

test('finding by keyword works', async () => {
    const insertResult = await capabilityRepo.insert(capability1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.title).toStrictEqual(capability1.title);
    const insertResult2 = await capabilityRepo.insert(capability2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.title).toStrictEqual(capability2.title);


    const findResult = await capabilityRepo.findByKeyword(capability1.title.substring(0, 6));
    const findRecord = findResult.rows[0];

    expect(findRecord.title === capability1.title).toBe(true);
});

