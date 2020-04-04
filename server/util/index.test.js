const userRepository = require("../repositories/user");
const individualRepository = require("../repositories/individual");
const addressRepository = require("../repositories/address");
const testHelpers = require("../test/helpers");
const util = require("../util");
const registrationRepository = require("../repositories/registration");

let registrationExample1; let userExample1; let address; let individual;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    userExample1 = testHelpers.getUserExample1();
    address = testHelpers.getAddress();
    individual = testHelpers.getIndividual();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('individuals and organisations correctly identified', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    const isIndividual = await util.isIndividual(individual.userId);
    const isOrganisation = await util.isOrganisation(individual.userId);
    expect(isOrganisation).toBe(false);
    expect(isIndividual).toBe(true);
});
