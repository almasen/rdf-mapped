const category = require("./");

const testHelpers = require("../../test/helpers");

const categoryRepo = require("../../repositories/category");
const cache = require("../cache");

jest.mock("../../repositories/category");
jest.mock("../cache");

let category1; let category2;

beforeEach(() => {
    category1 = testHelpers.getCapability1();
    category2 = testHelpers.getCapability2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("fetching all from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([category1, category2]);
    const fetchResult = await category.fetchAll();
    expect(fetchResult).toStrictEqual([category1, category2]);
});

test("fetching all from db works", async () => {
    cache.has.mockReturnValue(false);
    categoryRepo.findAll.mockResolvedValue({
        rows: [
            {...category1},
            {...category2},
        ],
    });
    const fetchResult = await category.fetchAll();
    expect(fetchResult).toStrictEqual([category1, category2]);
});

test("fetching by keyword from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([category1, category2]);
    const fetchResult = await category.fetchByKeyword(category1.title.substring(0, 9));
    expect(fetchResult.length).toStrictEqual(1);
    expect(fetchResult[0]).toStrictEqual(category1);
});

test("fetching by keyword from db works", async () => {
    cache.has.mockReturnValue(false);
    categoryRepo.findByKeyword.mockResolvedValue({
        rows: [
            {...category1},
        ],
    });
    const fetchResult = await category.fetchByKeyword(category1.title.substring(0, 9));
    expect(fetchResult.length).toStrictEqual(1);
    expect(fetchResult[0]).toStrictEqual(category1);
});

test("fetching by null keyword from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([category1, category2]);
    const fetchResult = await category.fetchByKeyword('');
    expect(fetchResult.length).toStrictEqual(2);
    expect(fetchResult).toStrictEqual([category1, category2]);
});

test("fetching by null keyword from db works", async () => {
    cache.has.mockReturnValue(false);
    categoryRepo.findByKeyword.mockResolvedValue({
        rows: [
            {...category1},
            {...category2},
        ],
    });
    const fetchResult = await category.fetchByKeyword('');
    expect(fetchResult.length).toStrictEqual(2);
    expect(fetchResult).toStrictEqual([category1, category2]);
});

test("fetching by id from db works", async () => {
    categoryRepo.findById.mockResolvedValue({
        rows: [
            {...category1},
        ],
    });
    const fetchResult = await category.fetchById();
    expect(fetchResult).toStrictEqual(category1);
});

test("fetching all by parent from cache works", async () => {
    category1.parentId = 1;
    category2.parentId = 2;
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([category1, category2]);
    const fetchResult = await category.fetchAllByParent(1);
    expect(fetchResult[0]).toStrictEqual(category1);
    expect(fetchResult.length).toStrictEqual(1);
});

test("fetching all by parent from db works", async () => {
    cache.has.mockReturnValue(false);
    category1.parentId = 1;
    category2.parentId = 2;
    categoryRepo.findAllByParent.mockResolvedValue({
        rows: [
            {...category1},
        ],
    });
    const fetchResult = await category.fetchAllByParent(1);
    expect(fetchResult[0]).toStrictEqual(category1);
    expect(fetchResult.length).toStrictEqual(1);
});
