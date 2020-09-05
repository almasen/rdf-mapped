const faq = require("./");

const faqRepo = require("../../repositories/faq");
const testHelpers = require("../../test/helpers");
const cache = require("../cache");

jest.mock("../../repositories/faq");
jest.mock("../cache");

let faq1, faq2;

beforeEach(() => {
    faq1 = testHelpers.getFAQ1();
    faq2 = testHelpers.getFAQ2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});


test("fetching all works", async () => {
    cache.has.mockReturnValue(false);
    faqRepo.findAll.mockResolvedValue({
        rows: [
            { ...faq1 },
            { ...faq2 },
        ]
    });
    const fetchResult = await faq.fetchAll();
    expect(fetchResult[0]).toStrictEqual(faq1);
    expect(fetchResult.length).toStrictEqual(2);
});

test("fetching all from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([faq1, faq2]);
    const fetchResult = await faq.fetchAll();
    expect(fetchResult[0]).toStrictEqual(faq1);
    expect(fetchResult.length).toStrictEqual(2);
});

test("fetching by id works", async () => {
    faqRepo.findById.mockResolvedValue({
        rows: [
            { ...faq1 },
        ]
    });
    const fetchResult = await faq.findById(1);
    expect(fetchResult.answer).toStrictEqual(faq1.answer);
});

test("fetching by keyword from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([faq1, faq2]);
    const fetchResult = await faq.fetchByKeyword(faq1.question.substring(0, 9));
    expect(fetchResult.length).toStrictEqual(1);
    expect(fetchResult[0]).toStrictEqual(faq1);
});

test("fetching by keyword from db works", async () => {
    cache.has.mockReturnValue(false);
    faqRepo.findByKeyword.mockResolvedValue({
        rows: [
            { ...faq1 }
        ]
    });
    const fetchResult = await faq.fetchByKeyword(faq1.question.substring(0, 9));
    expect(fetchResult.length).toStrictEqual(1);
    expect(fetchResult[0]).toStrictEqual(faq1);
});

test("fetching by null keyword from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([faq1, faq2]);
    const fetchResult = await faq.fetchByKeyword('');
    expect(fetchResult.length).toStrictEqual(2);
    expect(fetchResult).toStrictEqual([faq1, faq2]);
});

test("fetching by null keyword from db works", async () => {
    cache.has.mockReturnValue(false);
    faqRepo.findByKeyword.mockResolvedValue({
        rows: [
            { ...faq1 },
            { ...faq2 }
        ]
    });
    const fetchResult = await faq.fetchByKeyword('');
    expect(fetchResult.length).toStrictEqual(2);
    expect(fetchResult).toStrictEqual([faq1, faq2]);
});

test("inserting and updating works", async () => {
    faqRepo.insert.mockResolvedValue({
        rows: [
            { ...faq1 },
        ]
    });
    faqRepo.update.mockResolvedValue({
        rows: [
            {
                question: faq1.question,
                answer: "new answer",
            },
        ]
    });
    cache.del.mockResolvedValue();
    const insertRecord = await faq.insert(faq1.question, faq1.answer);
    expect(insertRecord.question).toStrictEqual(faq1.question);
    expect(insertRecord.answer).toStrictEqual(faq1.answer);

    const updateRecord = await faq.update(faq1.question, "new answer");
    expect(updateRecord.question).toStrictEqual(faq1.question);
    expect(updateRecord.answer).toStrictEqual("new answer");

    expect(cache.del).toHaveBeenCalledTimes(2);
});

test("inserting and removing works", async () => {
    faqRepo.insert.mockResolvedValue({
        rows: [
            { ...faq1 },
        ]
    });
    faqRepo.removeById.mockResolvedValue();
    cache.del.mockResolvedValue();
    const insertRecord = await faq.insert(faq1.question, faq1.answer);
    expect(insertRecord.question).toStrictEqual(faq1.question);
    expect(insertRecord.answer).toStrictEqual(faq1.answer);

    await faq.remove(1);
    expect(cache.del).toHaveBeenCalledTimes(2);
});
