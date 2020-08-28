const learningObjectRepo = require("./");

const testHelpers = require("../../test/helpers");

let learningObj1, learningObj2, outdatedLearningObj;

beforeEach(() => {
    learningObj1 = testHelpers.getLearningObject1();
    learningObj2 = testHelpers.getLearningObject2();
    outdatedLearningObj = testHelpers.getOutdatedLearningObject1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    learningObj1.timestamp = (new Date).toUTCString();
    const insertResult = await learningObjectRepo.insert(learningObj1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.urn).toStrictEqual(learningObj1.urn);

    const findResult = await learningObjectRepo.findByURN(learningObj1.urn);
    const findRecord = findResult.rows[0];

    expect(findRecord.data).toStrictEqual(JSON.parse(learningObj1.data));
});

test('finding all works', async () => {
    learningObj1.timestamp = (new Date).toUTCString();
    const insertResult = await learningObjectRepo.insert(learningObj1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.urn).toStrictEqual(learningObj1.urn);

    const findResult = await learningObjectRepo.findAll();
    const findRecords = findResult.rows;

    expect(findRecords[0].data).toStrictEqual(JSON.parse(learningObj1.data));
});

test('removing works', async () => {
    learningObj1.timestamp = (new Date).toUTCString();
    const insertResult = await learningObjectRepo.insert(learningObj1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.urn).toStrictEqual(learningObj1.urn);

    const findResult = await learningObjectRepo.findAll();
    const findRecords = findResult.rows;
    expect(findRecords[0].data).toStrictEqual(JSON.parse(learningObj1.data));

    await learningObjectRepo.removeByURN(learningObj1.urn);

    const findResult2 = await learningObjectRepo.findAll();
    const findRecords2 = findResult2.rows;
    expect(findRecords2.length).toStrictEqual(0);
});

test('updating works', async () => {
    learningObj1.timestamp = (new Date).toUTCString();
    const insertResult = await learningObjectRepo.insert(learningObj1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.urn).toStrictEqual(learningObj1.urn);

    const findResult = await learningObjectRepo.findByURN(learningObj1.urn);
    const findRecord = findResult.rows[0];

    findRecord.data = `{"newData":"newData"}`;

    await learningObjectRepo.update(findRecord);

    const findResult2 = await learningObjectRepo.findByURN(learningObj1.urn);
    const findRecord2 = findResult2.rows[0];
    expect(findRecord2.data).toStrictEqual(JSON.parse(`{"newData":"newData"}`));
});
