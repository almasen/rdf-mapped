const capability = require("./");

const testHelpers = require("../../test/helpers");

const capabilityRepo = require("../../repositories/capability");
const cache = require("../cache");

jest.mock("../../repositories/capability");
jest.mock("../cache");

let capability1, capability2;

beforeEach(() => {
    capability1 = testHelpers.getCapability1();
    capability2 = testHelpers.getCapability2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("fetching all from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([capability1, capability2]);
    const fetchResult = await capability.fetchAll();
    expect(fetchResult).toStrictEqual([capability1, capability2]);
});

test("fetching all from db works", async () => {
    cache.has.mockReturnValue(false);
    capabilityRepo.findAll.mockResolvedValue({
        rows: [
            {...capability1},
            {...capability2}
        ]
    });
    const fetchResult = await capability.fetchAll();
    expect(fetchResult).toStrictEqual([capability1, capability2]);
});

test("fetching by keyword from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([capability1, capability2]);
    const fetchResult = await capability.fetchByKeyword(capability1.title.substring(0, 9));
    expect(fetchResult.length).toStrictEqual(1);
    expect(fetchResult[0]).toStrictEqual(capability1);
});

test("fetching by keyword from db works", async () => {
    cache.has.mockReturnValue(false);
    capabilityRepo.findByKeyword.mockResolvedValue({
        rows: [
            {...capability1}
        ]
    });
    const fetchResult = await capability.fetchByKeyword(capability1.title.substring(0, 9));
    expect(fetchResult.length).toStrictEqual(1);
    expect(fetchResult[0]).toStrictEqual(capability1);
});

test("fetching by null keyword from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([capability1, capability2]);
    const fetchResult = await capability.fetchByKeyword('');
    expect(fetchResult.length).toStrictEqual(2);
    expect(fetchResult).toStrictEqual([capability1, capability2]);
});

test("fetching by null keyword from db works", async () => {
    cache.has.mockReturnValue(false);
    capabilityRepo.findByKeyword.mockResolvedValue({
        rows: [
            {...capability1},
            {...capability2}
        ]
    });
    const fetchResult = await capability.fetchByKeyword('');
    expect(fetchResult.length).toStrictEqual(2);
    expect(fetchResult).toStrictEqual([capability1, capability2]);
});

test("fetching by id from db works", async () => {
    capabilityRepo.findById.mockResolvedValue({
        rows: [
            {...capability1}
        ]
    });
    const fetchResult = await capability.fetchById();
    expect(fetchResult).toStrictEqual(capability1);
});
