const userRepository = require("../../user");
const individualRepository = require("../../individual");
const addressRepository = require("../../address");
const testHelpers = require("../../../test/helpers");
const registrationRepository = require("../../registration");
const eventRepository = require("../");
const signupRepository = require("./");

let registrationExample1, userExample1, address, individual, event, signUp;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    userExample1 = testHelpers.getUserExample1();
    address = testHelpers.getAddress();
    individual = testHelpers.getIndividual();
    event = testHelpers.getEvent();
    signUp = testHelpers.getSignUp();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    signUp.eventId = insertEventResult.rows[0].id;
    signUp.individualId = insertIndividualResult.rows[0].id;
    const insertSignupResult = await signupRepository.insert(signUp);

    const findResult = await signupRepository.find(insertIndividualResult.rows[0].id, insertEventResult.rows[0].id);
    const findAllByIndividualIdResult = await signupRepository.findAllByIndividualId(insertIndividualResult.rows[0].id);
    const findAllByEventIdResult = await signupRepository.findAllByEventId(insertEventResult.rows[0].id);
    expect(findResult.rows[0]).toMatchObject(signUp);
    expect(findAllByIndividualIdResult.rows).toMatchObject([signUp]);
    expect(findAllByEventIdResult.rows).toMatchObject([signUp]);
});

test('updating works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    signUp.eventId = insertEventResult.rows[0].id;
    signUp.individualId = insertIndividualResult.rows[0].id;
    await signupRepository.insert(signUp);

    signUp.confirmed = !signUp.confirmed;
    signUp.attended = !signUp.attended;
    await signupRepository.update(signUp);

    const findResult = await signupRepository.find(insertIndividualResult.rows[0].id, insertEventResult.rows[0].id);
    expect(findResult.rows[0]).toMatchObject(signUp);
});
test('inserting and finding users signed up to an event works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    signUp.eventId = insertEventResult.rows[0].id;
    signUp.individualId = insertIndividualResult.rows[0].id;
    const insertSignupResult = await signupRepository.insert(signUp);

    const findResult = await signupRepository.findUsersSignedUp(insertEventResult.rows[0].id);
    expect(findResult.rows[0]).toMatchObject(signUp);
});
