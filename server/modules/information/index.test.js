const testHelpers = require("../../test/helpers");
const informationService = require("./");
const informationRepository = require("../../repositories/information");

jest.mock("../../repositories/information");
jest.mock("../../util");

let information;

beforeEach(() => {
    jest.clearAllMocks();
    information = testHelpers.getInformation();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("creating new information entry works works", async () => {
    informationRepository.insert.mockResolvedValue({
        rows: [{
            ...information,
        }],
    });

    informationRepository.findByType.mockResolvedValue({
        rows: [],
    });

    const informationResult = await informationService.changeInformation(information);

    expect(informationRepository.insert).toHaveBeenCalledTimes(1);
    expect(informationResult.data.information).toMatchObject({
        ...information,
    });
    expect(informationResult.status).toBe(200);
});

test("updating information works", async () => {
    informationRepository.update.mockResolvedValue({
        rows: [{
            ...information,
        }],
    });

    informationRepository.findByType.mockResolvedValue({
        rows: [{
            ...information,
        }],
    });

    const updateInformationResult = await informationService.changeInformation(information);

    expect(informationRepository.update).toHaveBeenCalledTimes(1);
    expect(updateInformationResult.data.information).toMatchObject({
        ...information,
    });
    expect(updateInformationResult.status).toBe(200);
});

test("requesting specific information entry works", async () => {
    informationRepository.findByType.mockResolvedValue({
        rows: [{
            ...information,
        }],
    });

    const getInformationResult = await informationService.getInformationData(information.type);

    expect(informationRepository.findByType).toHaveBeenCalledTimes(1);
    expect(informationRepository.findByType).toHaveBeenCalledWith(information.type);
    expect(getInformationResult.data.information).toMatchObject({
        ...information,
    });
    expect(getInformationResult.status).toBe(200);
});
