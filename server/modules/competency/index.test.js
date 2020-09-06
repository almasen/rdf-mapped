const competency = require("./");

const testHelpers = require("../../test/helpers");

const competencyRepo = require("../../repositories/competency");
const cache = require("../cache");

jest.mock("../../repositories/competency");
jest.mock("../cache");

let competency1; let competency2;

beforeEach(() => {
    competency1 = testHelpers.getCompetency1();
    competency2 = testHelpers.getCompetency2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("fetching all from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([competency1, competency2]);
    const fetchResult = await competency.fetchAll();
    expect(fetchResult).toStrictEqual([competency1, competency2]);
});

test("fetching all from db works", async () => {
    cache.has.mockReturnValue(false);
    competencyRepo.findAll.mockResolvedValue({
        rows: [
            {...competency1},
            {...competency2},
        ],
    });
    const fetchResult = await competency.fetchAll();
    expect(fetchResult).toStrictEqual([competency1, competency2]);
});

test("fetching by keyword from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([competency1, competency2]);
    const fetchResult = await competency.fetchByKeyword(competency1.title.substring(0, 9));
    expect(fetchResult.length).toStrictEqual(1);
    expect(fetchResult[0]).toStrictEqual(competency1);
});

test("fetching by keyword from db works", async () => {
    cache.has.mockReturnValue(false);
    competencyRepo.findByKeyword.mockResolvedValue({
        rows: [
            {...competency1},
        ],
    });
    const fetchResult = await competency.fetchByKeyword(competency1.title.substring(0, 9));
    expect(fetchResult.length).toStrictEqual(1);
    expect(fetchResult[0]).toStrictEqual(competency1);
});

test("fetching by null keyword from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([competency1, competency2]);
    const fetchResult = await competency.fetchByKeyword('');
    expect(fetchResult.length).toStrictEqual(2);
    expect(fetchResult).toStrictEqual([competency1, competency2]);
});

test("fetching by null keyword from db works", async () => {
    cache.has.mockReturnValue(false);
    competencyRepo.findByKeyword.mockResolvedValue({
        rows: [
            {...competency1},
            {...competency2},
        ],
    });
    const fetchResult = await competency.fetchByKeyword('');
    expect(fetchResult.length).toStrictEqual(2);
    expect(fetchResult).toStrictEqual([competency1, competency2]);
});

test("fetching by id from db works", async () => {
    competencyRepo.findById.mockResolvedValue({
        rows: [
            {...competency1},
        ],
    });
    const fetchResult = await competency.fetchById();
    expect(fetchResult).toStrictEqual(competency1);
});

test("fetching all by parent from cache works", async () => {
    competency1.parentId = 1;
    competency2.parentId = 2;
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([competency1, competency2]);
    const fetchResult = await competency.fetchAllByParent(1);
    expect(fetchResult[0]).toStrictEqual(competency1);
    expect(fetchResult.length).toStrictEqual(1);
});

test("fetching all by parent from db works", async () => {
    cache.has.mockReturnValue(false);
    competency1.parentId = 1;
    competency2.parentId = 2;
    competencyRepo.findAllByParent.mockResolvedValue({
        rows: [
            {...competency1},
        ],
    });
    const fetchResult = await competency.fetchAllByParent(1);
    expect(fetchResult[0]).toStrictEqual(competency1);
    expect(fetchResult.length).toStrictEqual(1);
});
