const faqRepo = require("./");

const testHelpers = require("../../test/helpers");

let faq1; let faq2;

beforeEach(() => {
    faq1 = testHelpers.getFAQ1();
    faq2 = testHelpers.getFAQ2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const insertResult = await faqRepo.insert(faq1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.question).toStrictEqual(faq1.question);

    const findResult = await faqRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];

    expect(findRecord.answer).toStrictEqual(faq1.answer);
});

test('finding all works', async () => {
    const insertResult = await faqRepo.insert(faq1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.question).toStrictEqual(faq1.question);
    const insertResult2 = await faqRepo.insert(faq2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.question).toStrictEqual(faq2.question);

    const findResult = await faqRepo.findAll();
    const findRecords = findResult.rows;

    // check if found array has all the inserted items
    const match1 = (e) => {
        return e.answer === faq1.answer;
    };
    const match2 = (e) => {
        return e.answer === faq2.answer;
    };
    expect(findRecords.some(match1)).toBe(true);
    expect(findRecords.some(match2)).toBe(true);

    // and only has them
    findRecords.forEach((e) => {
        expect(e.answer === faq1.answer || e.answer === faq2.answer).toBe(true);
    });
});

test('finding by keyword works', async () => {
    const insertResult = await faqRepo.insert(faq1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.question).toStrictEqual(faq1.question);
    const insertResult2 = await faqRepo.insert(faq2);
    const insertRecord2 = insertResult2.rows[0];
    expect(insertRecord2.question).toStrictEqual(faq2.question);

    const findResult = await faqRepo.findByKeyword(faq1.question.substring(0, 8));
    const findRecord = findResult.rows[0];

    expect(findRecord.answer).toStrictEqual(faq1.answer);
});

test('removing by id works', async () => {
    const insertResult = await faqRepo.insert(faq1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.question).toStrictEqual(faq1.question);

    const deletionResult = await faqRepo.removeById(insertRecord.id);
    const deletedRecord = deletionResult.rows[0];
    expect(deletedRecord.answer).toStrictEqual(faq1.answer);

    const findResult = await faqRepo.findAll();
    const findRecords = findResult.rows;

    expect(findRecords.length).toStrictEqual(0);
});

test('updating works', async () => {
    const insertResult = await faqRepo.insert(faq1);
    const insertRecord = insertResult.rows[0];
    expect(insertRecord.question).toStrictEqual(faq1.question);

    const findResult = await faqRepo.findById(insertRecord.id);
    const findRecord = findResult.rows[0];
    expect(findRecord.answer).toStrictEqual(faq1.answer);

    findRecord.answer = "new ans";
    const updatedResult = await faqRepo.update(findRecord);
    const updatedRecord = updatedResult.rows[0];
    expect(updatedRecord.id).toStrictEqual(findRecord.id);

    const findResult2 = await faqRepo.findById(insertRecord.id);
    const findRecord2 = findResult2.rows[0];
    expect(findRecord2.answer).toStrictEqual("new ans");
});
