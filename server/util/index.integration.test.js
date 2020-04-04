const userRepository = require("../repositories/user");
const individualRepository = require("../repositories/individual");
const organisationRepository = require("../repositories/organisation");
const eventRepository = require("../repositories/event");
const addressRepository = require("../repositories/address");
const testHelpers = require("../test/helpers");
const util = require("../util");
const registrationRepository = require("../repositories/registration");

jest.mock("../repositories/user");
jest.mock("../repositories/individual");
jest.mock("../repositories/organisation");
jest.mock("../repositories/event");

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

test("isIndividual fails with invalid userId as expected", async () => {
    userRepository.findById.mockResolvedValue({rows: []});
    expect(util.isIndividual(69000)).rejects.toEqual(new Error("No user with id 69000 exists"));
});

test("isOrganisation fails with invalid userId as expected", async () => {
    userRepository.findById.mockResolvedValue({rows: []});
    expect(util.isOrganisation(69000)).rejects.toEqual(new Error("No user with id 69000 exists"));
});

test("check email fails with invalid user email as expected", async () => {
    userRepository.findByEmail.mockResolvedValue({rows: []});
    const result = await util.checkEmail("email@email.com");
    expect(result.status).toBe(404);
    expect(result.message).toBe("No user with specified email");
});

test("getting individual id from userId works", async () => {
    userRepository.findById.mockResolvedValue({rows: [{}]});
    individualRepository.findByUserID.mockResolvedValue({rows: [{}]});
    individualRepository.getIndividualId.mockResolvedValue({rows: [{id: 69}]});
    const result = await util.getIndividualIdFromUserId(69);
    expect(result).toStrictEqual(69);
});

test("getting individual id from invalid userId fails as expected", async () => {
    userRepository.findById.mockResolvedValue({rows: [{}]});
    individualRepository.findByUserID.mockResolvedValue({rows: []});
    individualRepository.getIndividualId.mockResolvedValue({rows: [{id: 69}]});
    expect(util.getIndividualIdFromUserId(69)).rejects.toEqual(new Error("User is not an individual"));
});

test("checking user id without a specified param returns false as expected", async () => {
    const result = await util.checkUserId(undefined);
    expect(result.status).toBe(400);
    expect(result.message).toBe("No user id was specified");
});

test("checking user id without a non number param returns false as expected", async () => {
    const result = await util.checkUserId("NaN");
    expect(result.status).toBe(400);
    expect(result.message).toBe("ID specified is in wrong format");
});

test("checking user id with an invalid userId returns false as expected", async () => {
    userRepository.findById.mockResolvedValue({rows: []});
    const result = await util.checkUserId(69000);
    expect(result.status).toBe(404);
    expect(result.message).toBe("No user with specified id");
});

test("checking user id with a valid userId returns user as expected", async () => {
    userRepository.findById.mockResolvedValue({rows: [{
        id: 69,
        username: "karma",
    }]});
    const result = await util.checkUserId(69);
    expect(result.status).toBe(200);
    expect(result.message).toBe("Found user with given id");
    expect(result.user.id).toStrictEqual(69);
    expect(result.user.username).toStrictEqual("karma");
});

test("checking user with an invalid userId returns false as expected", async () => {
    userRepository.findById.mockResolvedValue({rows: []});
    const result = await util.checkUser(69000);
    expect(result.status).toBe(404);
    expect(result.message).toBe("No user with specified id");
});

test("checking user with a valid userId but no individual or org record returns an error as expected", async () => {
    userRepository.findById.mockResolvedValue({
        rows: [{
            id: 69,
            username: "karma",
        }],
    });
    individualRepository.findByUserID.mockResolvedValue({rows: []});
    organisationRepository.findByUserID.mockResolvedValue({rows: []});
    const result = await util.checkUser(69);
    expect(result.status).toBe(400);
    expect(result.message).toBe("No individual or organisation is associated with specified user id");
});

test("checking user with a valid userId and individual record but no address returns an error as expected", async () => {
    userRepository.findById.mockResolvedValue({
        rows: [{
            id: 69,
            username: "karma",
        }],
    });
    individualRepository.findByUserID.mockResolvedValue({rows: [{}]});
    individualRepository.getIndividualLocation.mockResolvedValue({rows: []});
    organisationRepository.findByUserID.mockResolvedValue({rows: []});
    const result = await util.checkUser(69);
    expect(result.status).toBe(400);
    expect(result.message).toBe("No address associated to individual with specified user id");
});

test("checking user with a valid userId and organisation record but no address returns an error as expected", async () => {
    userRepository.findById.mockResolvedValue({
        rows: [{
            id: 69,
            username: "karma",
        }],
    });
    individualRepository.findByUserID.mockResolvedValue({rows: []});
    individualRepository.getIndividualLocation.mockResolvedValue({rows: []});
    organisationRepository.findByUserID.mockResolvedValue({rows: [{}]});
    organisationRepository.getOrganisationLocation.mockResolvedValue({rows: []});
    const result = await util.checkUser(69);
    expect(result.status).toBe(400);
    expect(result.message).toBe("No address associated to organisation with specified user id");
});

test("checking user with a valid userId, individual and address record returns true as expected", async () => {
    userRepository.findById.mockResolvedValue({
        rows: [{
            id: 69,
            username: "karma",
        }],
    });
    individualRepository.findByUserID.mockResolvedValue({rows: [{}]});
    individualRepository.getIndividualLocation.mockResolvedValue({
        rows: [{
            id: 1,
        }],
    });
    organisationRepository.findByUserID.mockResolvedValue({rows: []});
    organisationRepository.getOrganisationLocation.mockResolvedValue({rows: []});
    const result = await util.checkUser(69);
    expect(result.status).toBe(200);
    expect(result.user.id).toBe(1);
});

test("checking user with a valid userId, organisation and address record returns true as expected", async () => {
    userRepository.findById.mockResolvedValue({
        rows: [{
            id: 69,
            username: "karma",
        }],
    });
    individualRepository.findByUserID.mockResolvedValue({rows: []});
    individualRepository.getIndividualLocation.mockResolvedValue({
        rows: [{
            id: 1,
        }],
    });
    organisationRepository.findByUserID.mockResolvedValue({rows: [{}]});
    organisationRepository.getOrganisationLocation.mockResolvedValue({
        rows: [{
            id: 1,
        }],
    });
    const result = await util.checkUser(69);
    expect(result.status).toBe(200);
    expect(result.user.id).toBe(1);
});

test("checking event id without a specified param returns false as expected", async () => {
    const result = await util.checkEventId(undefined);
    expect(result.status).toBe(400);
    expect(result.message).toBe("Event ID not defined");
});

test("checking event id with a non numerical param returns false as expected", async () => {
    const result = await util.checkEventId("NaN");
    expect(result.status).toBe(400);
    expect(result.message).toBe("ID specified is in wrong format");
});

test("checking event id with an invalid eventId returns false as expected", async () => {
    eventRepository.findById.mockResolvedValue({rows: []});
    const result = await util.checkEventId(69000);
    expect(result.status).toBe(404);
    expect(result.message).toBe("No event with specified id");
});

test("checking event id with a valid eventId returns true as expected", async () => {
    eventRepository.findById.mockResolvedValue({rows: [{}]});
    const result = await util.checkEventId(69);
    expect(result.status).toBe(200);
    expect(result.message).toBe("Found event with given id");
});

test("checking validity of an expired token returns false as expected", async () => {
    const result = await util.isValidToken(
        {rows: [{
            token: "a",
            expiryDate: Date.parse("2000-06-09 19:10:25-07"),
        }]},
        "a",
        "token",
    );
    expect(result.isValidToken).toBe(false);
    expect(result.error).toBe("Expired token");
});
