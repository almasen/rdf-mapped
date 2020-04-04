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

/**
 * Deletes all information about a user.
 * @param {Number} userId of user to delete,
 * Fails if userId is invalid.
 */
const deleteAllInformation = async (userId) => {
    const userIdCheckResponse = await util.checkUserId(userId);
    if (userIdCheckResponse.status !== 200) {
        return userIdCheckResponse;
    }

    await notificationRepository.removeByUserId(userId);
    await eventCauseRepository.removeByEventCreatorId(userId);
    await signUpRepository.removeByEventCreatorId(userId);
    await favouriteRepository.removeByEventCreatorId(userId);
    await eventRepository.removeByUserId(userId);
    await selectedCauseRepository.removeByUserId(userId);
    await complaintRepository.removeByUserId(userId);
    await resetRepository.removeByUserId(userId);
    await reportUserRepository.removeByUserId(userId);
    await settingRepository.removeByUserId(userId);

    const isIndividual = await util.isIndividual(userId);
    if (isIndividual) {
        const findIndividual = await individualRepository.findByUserID(userId);
        const individualId = findIndividual.rows[0].id;
        await profileRepository.removeByIndividualId(individualId);
        await favouriteRepository.removeByIndividualId(individualId);
        await signUpRepository.removeByIndividualId(individualId);
        await individualRepository.removeByUserId(userId);
        await pictureRepository.removeById(findIndividual.pictureId);
    }

    const isOrganisation = await util.isOrganisation(userId);
    if (isOrganisation) {
        const deleteOrg = await orgRepository.removeByUserId(userId);
        await pictureRepository.removeById(deleteOrg.pictureId);
    }


    const findUser = await userRepository.removeUserById(userId);
    const addressId = findUser.addressId;
    const emailUser = findUser.email;

    await registrationRepository.removeByEmail(emailUser);
    await addressRepository.removeById(addressId);

    return ({
        status: 200,
        message: "All User information deleted successfully",
        data: {user: findUser.rows[0]},
    });
};

module.exports = {
    deleteAllInformation,
};
