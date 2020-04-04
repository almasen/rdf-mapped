const testHelpers = require("../../test/helpers");
const deletionService = require("./");

const addressRepository = require("../../repositories/address");
const favouriteRepository = require("../../repositories/favourite");
const userRepository = require("../../repositories/user");
const selectedCauseRepository = require("../../repositories/cause/selected");
const signUpRepository = require("../../repositories/event/signup");
const registrationRepository = require("../../repositories/registration");
const individualRepository = require("../../repositories/individual");
const profileRepository = require("../../repositories/profile");
const notificationRepository = require("../../repositories/notification");
const eventRepository = require("../../repositories/event");
const orgRepository = require("../../repositories/organisation");
const pictureRepository = require("../../repositories/picture");
const eventCauseRepository = require("../../repositories/event/cause");
const complaintRepository = require("../../repositories/complaint");
const reportUserRepository = require("../../repositories/report");
const resetRepository = require("../../repositories/reset");
const settingRepository = require("../../repositories/settings");
const util = require("../../util");

jest.mock("../../repositories/address");
jest.mock("../../repositories/favourite");
jest.mock("../../repositories/user");
jest.mock("../../repositories/cause/selected");
jest.mock("../../repositories/event/signup");
jest.mock("../../repositories/registration");
jest.mock("../../repositories/individual");
jest.mock("../../repositories/profile");
jest.mock("../../repositories/notification");
jest.mock("../../repositories/event");
jest.mock("../../repositories/organisation");
jest.mock("../../repositories/picture");
jest.mock("../../repositories/event/cause");
jest.mock("../../repositories/complaint");
jest.mock("../../repositories/report");
jest.mock("../../repositories/reset");
jest.mock("../../repositories/settings");
jest.mock("../../util");

let user; let individual; let organisation;

beforeEach(() => {
    user = testHelpers.getUserExample1();
    individual = testHelpers.getIndividual();
    organisation = testHelpers.getOrganisation();
    jest.clearAllMocks();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("deleting user who is individual works", async () => {
    util.checkUserId.mockResolvedValue({status: 200});
    util.isIndividual.mockResolvedValue(true);
    util.isOrganisation.mockResolvedValue(false);

    individualRepository.findByUserID.mockResolvedValue({
        rows: [{
            ...individual,
            id: 1,
        }],
    });

    userRepository.removeUserById.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });

    const deleteAllInformation = await deletionService.deleteAllInformation(1);

    expect(notificationRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(eventCauseRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(signUpRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(favouriteRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(eventRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(selectedCauseRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(complaintRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(resetRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(reportUserRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(settingRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(pictureRepository.removeById).toHaveBeenCalledTimes(1);
    expect(profileRepository.removeByIndividualId).toHaveBeenCalledTimes(1);
    expect(favouriteRepository.removeByIndividualId).toHaveBeenCalledTimes(1);
    expect(signUpRepository.removeByIndividualId).toHaveBeenCalledTimes(1);
    expect(individualRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(userRepository.removeUserById).toHaveBeenCalledTimes(1);
    expect(registrationRepository.removeByEmail).toHaveBeenCalledTimes(1);
    expect(addressRepository.removeById).toHaveBeenCalledTimes(1);
    expect(individualRepository.findByUserID).toHaveBeenCalledTimes(1);
    expect(userRepository.findById).toHaveBeenCalledTimes(0);
    expect(orgRepository.removeByUserId).toHaveBeenCalledTimes(0);
    expect(deleteAllInformation.data.user).toMatchObject({
        ...user,
        id: 1,
    });
    expect(deleteAllInformation.status).toBe(200);
});

test("deleting user who is org works", async () => {
    util.checkUserId.mockResolvedValue({status: 200});
    util.isIndividual.mockResolvedValue(false);
    util.isOrganisation.mockResolvedValue(true);

    orgRepository.removeByUserId.mockResolvedValue({
        rows: [{
            ...organisation,
            id: 1,
        }],
    });

    userRepository.removeUserById.mockResolvedValue({
        rows: [{
            ...user,
            id: 1,
        }],
    });

    const deleteAllInformation = await deletionService.deleteAllInformation(1);

    expect(notificationRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(eventCauseRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(signUpRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(favouriteRepository.removeByEventCreatorId).toHaveBeenCalledTimes(1);
    expect(eventRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(selectedCauseRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(complaintRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(resetRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(reportUserRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(settingRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(orgRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(pictureRepository.removeById).toHaveBeenCalledTimes(1);
    expect(userRepository.removeUserById).toHaveBeenCalledTimes(1);
    expect(registrationRepository.removeByEmail).toHaveBeenCalledTimes(1);
    expect(addressRepository.removeById).toHaveBeenCalledTimes(1);
    expect(individualRepository.findByUserID).toHaveBeenCalledTimes(0);
    expect(orgRepository.findByUserID).toHaveBeenCalledTimes(0);
    expect(userRepository.findById).toHaveBeenCalledTimes(0);
    expect(orgRepository.removeByUserId).toHaveBeenCalledTimes(1);
    expect(profileRepository.removeByIndividualId).toHaveBeenCalledTimes(0);
    expect(deleteAllInformation.data.user).toMatchObject({
        ...user,
        id: 1,
    });
    expect(deleteAllInformation.status).toBe(200);
});

test("deleting with invalid userId fails as expected", async () => {
    util.checkUserId.mockResolvedValue({status: 400});

    const deleteAllInformation = await deletionService.deleteAllInformation(69000);

    expect(deleteAllInformation.status).toBe(400);
});
