const information = require("./");

const infoRepo = require("../../repositories/information");
const testHelpers = require("../../test/helpers");
const cache = require("../cache");

jest.mock("../../repositories/information");
jest.mock("../cache");

let information1, information2;

beforeEach(() => {
    information1 = testHelpers.getInformation1();
    information2 = testHelpers.getInformation2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("fetching from cache works", async () => {
    cache.has.mockReturnValue(true);
    cache.get.mockReturnValue(information1.content);
    const fetchResult = await information.getInformationData(information1.type)
    expect(fetchResult).toStrictEqual(information1.content);
});

test("fetching from db works", async () => {
    cache.has.mockReturnValue(false);
    infoRepo.findByType.mockResolvedValue({
        rows: [
            { ...information1 }
        ]
    });
    const fetchResult = await information.getInformationData(information1.type)
    expect(fetchResult).toStrictEqual(information1.content);
});

test("updating works", async () => {
    cache.set.mockReturnValue();
    infoRepo.update.mockResolvedValue({
        rows: [
            {
                type: information1.type,
                content: "new content",
            }
        ]
    });
    const updateRecord = await information.updateInformation({
        type: information1.type,
        content: "new content",
    })
    expect(updateRecord.type).toStrictEqual(information1.type);
    expect(updateRecord.content).toStrictEqual("new content");
    expect(cache.set).toHaveBeenCalledTimes(1);
});

