const capabilityRepo = require("./");

const testHelpers = require("../../test/helpers");

let capability1, capability2;

beforeEach(() => {
    capability1 = testHelpers.getCapability1();
    capability2 = testHelpers.getCapability2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const insertResult = await capabilityRepo.insert(capability1);
    const insertRecord = capResult.rows[0];
    expect(capRecord.title).toStrictEqual(capability1.title);
    const findResult = await capabilityRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord).toStrictEqual(insertRecord);
    expect(findRecord.title).toStrictEqual(capability1.title);
});
