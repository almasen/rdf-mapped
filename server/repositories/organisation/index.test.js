const userRepository = require("../user");
const organisationRepository = require("./");
const addressRepository = require("../address");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");

let registration, user, address, organisation;

beforeEach(() => {
    registration = testHelpers.getRegistrationExample1();
    user = testHelpers.getUserExample1();
    address = testHelpers.getAddress();
    organisation = testHelpers.getOrganisation();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert organisation and findById organisation work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    organisation.addressId = insertAddressResult.rows[0].id;
    organisation.userId = insertUserResult.rows[0].id;
    const insertOrganisationResult = await organisationRepository.insert(organisation);
    const findOrganisationResult = await organisationRepository.findById(insertOrganisationResult.rows[0].id);
    expect(insertOrganisationResult.rows[0]).toMatchObject(findOrganisationResult.rows[0]);
});