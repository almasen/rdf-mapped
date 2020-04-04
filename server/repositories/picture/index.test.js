const pictureRepository = require("./");
const testHelpers = require("../../test/helpers");

const userRepository = require("../user");
const individualRepository = require("../individual");
const organisationRepository = require("../organisation");
const registrationRepository = require("../registration");
const addressRepository = require("../address");

let pictureExample1;
let pictureExample2;

beforeEach(() => {
    pictureExample1 = testHelpers.getPictureExample1();
    pictureExample2 = testHelpers.getPictureExample2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert picture and findById work', async () => {
    const insertPictureResult = await pictureRepository.insert(pictureExample1);
    const findPictureResult = await pictureRepository.findById(insertPictureResult.rows[0].id);

    expect(insertPictureResult.rows[0]).toMatchObject(findPictureResult.rows[0]);
});

test('insert picture and findByUrl work', async () => {
    const insertPictureResult = await pictureRepository.insert(pictureExample2);
    const findPictureResult = await pictureRepository.findByUrl(insertPictureResult.rows[0].pictureLocation);

    // id agnostic as url may not be unique
    expect(insertPictureResult.rows[0].pictureLocation).toBe(findPictureResult.rows[0].pictureLocation);
});

test('update picture works', async () => {
    const insertPictureResult = await pictureRepository.insert(pictureExample1);
    const findPictureResult = await pictureRepository.findById(insertPictureResult.rows[0].id);
    pictureExample1.pictureLocation = "NewLocation";
    pictureExample1.id = findPictureResult.rows[0].id;
    const updateResult = await pictureRepository.update(pictureExample1);
    const findPictureResultUpdate = await pictureRepository.findById(updateResult.rows[0].id);
    expect(updateResult.rows[0]).toMatchObject(findPictureResultUpdate.rows[0]);
    expect(findPictureResultUpdate.rows[0]).not.toMatchObject(findPictureResult.rows[0]);
    expect(findPictureResultUpdate.rows[0].pictureLocation).toBe("NewLocation");
    expect(findPictureResultUpdate.rows[0].id).toBe(insertPictureResult.rows[0].id);
});

test('delete picture works', async () => {
    const insertPictureResult = await pictureRepository.insert(pictureExample1);
    const id = insertPictureResult.rows[0].id;
    await pictureRepository.findById(id);

    await pictureRepository.removeById(id);
    const findPictureDeleteResult = await pictureRepository.findById(id);

    expect(findPictureDeleteResult.rowCount).toBe(0);
});

let registrationExample1, userExample1, address1, individual;
let registrationExample2, userExample2, address2, organisation;

const generateRegisteredIndividual = async () => {
    registrationExample1 = await testHelpers.getRegistrationExample1();
    userExample1 = await testHelpers.getUserExample1();
    address1 = await testHelpers.getAddress();
    individual = await testHelpers.getIndividual();
    await testHelpers.clearDatabase();

    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address1);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    // individual result object
    return individualRepository.findById(insertIndividualResult.rows[0].id);
};

const generateRegisteredOrganisation = async () => {
    registrationExample2 = testHelpers.getRegistrationExample1();
    userExample2 = testHelpers.getUserExample1();
    address2 = testHelpers.getAddress();
    organisation = testHelpers.getOrganisation();
    await testHelpers.clearDatabase();

    const insertRegistrationResult = await registrationRepository.insert(registrationExample2);
    userExample2.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample2);
    const insertAddressResult = await addressRepository.insert(address2);
    organisation.addressId = insertAddressResult.rows[0].id;
    organisation.userId = insertUserResult.rows[0].id;
    const insertOrganisationResult = await organisationRepository.insert(organisation);
    return organisationRepository.findById(insertOrganisationResult.rows[0].id);
};

test('ensure individual avatar is updated & fetched correctly', async () => {
    // generate individual by registering user
    const individualResult = await generateRegisteredIndividual();
    const individual = individualResult.rows[0];

    const insertPictureResult = await pictureRepository.insert(pictureExample2);
    const picture = insertPictureResult.rows[0];

    // update picture & validate
    const getIndividualUpdateResult = await pictureRepository.updateIndividualAvatar(individual, picture);
    const getIndividualAvatarResult = await pictureRepository.getIndividualAvatar(individual);

    expect(getIndividualUpdateResult.rows[0].pictureId).toBe(picture.id);
    expect(getIndividualAvatarResult.rows[0].pictureLocation).toBe(picture.pictureLocation);
});

test('ensure organisation avatar is updated & fetched correctly', async () => {
    // generate individual by registering user
    const orgResult = await generateRegisteredOrganisation();
    const org = orgResult.rows[0];

    const insertPictureResult = await pictureRepository.insert(pictureExample2);
    const picture = insertPictureResult.rows[0];

    // update picture & validate
    const getOrgUpdateResult = await pictureRepository.updateOrganisationAvatar(org, picture);
    const getOrgAvatarResult = await pictureRepository.getOrganisationAvatar(org);

    expect(getOrgUpdateResult.rows[0].pictureId).toBe(picture.id);
    expect(getOrgAvatarResult.rows[0].pictureLocation).toBe(picture.pictureLocation);
});