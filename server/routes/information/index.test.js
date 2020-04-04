const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/helpers");
const validation = require("../../modules/validation");
const informationService = require("../../modules/information");

jest.mock("../../modules/information");
jest.mock("../../modules/validation");
validation.validateInformation.mockReturnValue({errors: ""});

let information;

beforeEach(() => {
    jest.clearAllMocks();
    process.env.NO_AUTH = 1;
    information = testHelpers.getInformation();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("information fetching endpoint works", async () => {
    informationService.getInformationData.mockResolvedValue({
        status: 200,
        message: "Information entry fetched successfully",
        data: {
            information: information,
        },
    });

    const type = "privacyPolicy";
    const response = await request(app)
        .get(`/information?type=${type}`)
        .send();

    expect(informationService.getInformationData).toHaveBeenCalledTimes(1);
    expect(informationService.getInformationData).toHaveBeenCalledWith(type);
    expect(response.body.data).toMatchObject({
        information: information,
    });
    expect(response.statusCode).toBe(200);
});

test("information fetching logging works", async () => {
    informationService.getInformationData.mockResolvedValue({
        status: 200,
        message: "Information entry fetched successfully",
        data: {
            information: information,
        },
    });

    const type = "privacyPolicy";
    const response = await request(app)
        .get(`/information?type=${type}&userId=69`)
        .send();

    expect(informationService.getInformationData).toHaveBeenCalledTimes(1);
    expect(informationService.getInformationData).toHaveBeenCalledWith(type);
    expect(response.body.data).toMatchObject({
        information: information,
    });
    expect(response.statusCode).toBe(200);
});

test("information fetching without a type is rejected as expected", async () => {
    informationService.getInformationData.mockResolvedValue({
        status: 200,
        message: "Information entry fetched successfully",
        data: {
            information: information,
        },
    });

    const type = "privacyPolicy";
    const response = await request(app)
        .get(`/information?userId=69`)
        .send();

    expect(informationService.getInformationData).toHaveBeenCalledTimes(0);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Type is not specified");
});

test("information fetching logged in in case of a system error returns error message as expected", async () => {
    informationService.getInformationData.mockImplementation(() => {
        throw new Error("Server error");
    });

    const type = "privacyPolicy";
    const response = await request(app)
        .get(`/information?type=${type}&userId=69`)
        .send();

    expect(informationService.getInformationData).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Server error");
});

test("information fetching in case of a system error returns error message as expected", async () => {
    informationService.getInformationData.mockImplementation(() => {
        throw new Error("Server error");
    });

    const type = "privacyPolicy";
    const response = await request(app)
        .get(`/information?type=${type}`)
        .send();

    expect(informationService.getInformationData).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Server error");
});
