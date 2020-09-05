const phase = require("./");

const testHelpers = require("../../test/helpers");

const phaseRepo = require("../../repositories/phase");
const cache = require("../cache");

jest.mock("../../repositories/phase");
jest.mock("../cache");

let phase1, phase2;

beforeEach(() => {
    phase1 = testHelpers.getPhase1();
    phase2 = testHelpers.getPhase2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("fetching all from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue([phase1, phase2]);
    const fetchResult = await phase.fetchAll();
    expect(fetchResult).toStrictEqual([phase1, phase2]);
});

test("fetching all from db works", async () => {
    cache.has.mockReturnValue(false);
    phaseRepo.findAll.mockResolvedValue({
        rows: [
            { ...phase1 },
            { ...phase2 }
        ]
    });
    const fetchResult = await phase.fetchAll();
    expect(fetchResult).toStrictEqual([phase1, phase2]);
});

test("getting phase array from phase ids works", async () => {
    phaseRepo.findById.mockResolvedValueOnce({
        rows: [
            { ...phase1 },
        ]
    });
    phaseRepo.findById.mockResolvedValueOnce({
        rows: [
            { ...phase2 },
        ]
    });
    const phaseArray = await phase.getPhaseArray([1, 2]);
    expect(phaseArray.length).toStrictEqual(2);
    expect(phaseArray[0]).toStrictEqual(phase1.title);
    expect(phaseArray[1]).toStrictEqual(phase2.title);
});

