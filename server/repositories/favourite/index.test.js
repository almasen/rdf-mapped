const userRepository = require("../user");
const individualRepository = require("../individual");
const addressRepository = require("../address");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");
const eventRepository = require("../event");
const favouriteRepository = require("./");

let registrationExample1, userExample1, address, individual, event, favourite;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    userExample1 = testHelpers.getUserExample1();
    address = testHelpers.getAddress();
    individual = testHelpers.getIndividual();
    event = testHelpers.getEvent();
    favourite = testHelpers.getFavourite();
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

    event.addressId =  insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    favourite.eventId = insertEventResult.rows[0].id;
    favourite.individualId = insertIndividualResult.rows[0].id;
    await favouriteRepository.insert(favourite);

    const findResult = await favouriteRepository.find(insertIndividualResult.rows[0].id, insertEventResult.rows[0].id);
    const findAllByIndividualIdResult = await favouriteRepository.findAllByIndividualId(insertIndividualResult.rows[0].id);
    const findAllByEventIdResult = await favouriteRepository.findAllByEventId(insertEventResult.rows[0].id);
    expect(findResult.rows[0]).toMatchObject(favourite);
    expect(findAllByIndividualIdResult.rows).toMatchObject([favourite]);
    expect(findAllByEventIdResult.rows).toMatchObject([favourite]);
});

test('deleting works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    event.addressId =  insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    favourite.eventId = insertEventResult.rows[0].id;
    favourite.individualId = insertIndividualResult.rows[0].id;
    await favouriteRepository.insert(favourite);

    const deleteResult = await favouriteRepository.remove(favourite);

    const findResult = await favouriteRepository.find(insertIndividualResult.rows[0].id, insertEventResult.rows[0].id);
    expect(deleteResult.rows[0]).toMatchObject(favourite);
    expect(findResult.rowCount).toBe(0);
});

test('deleting works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    event.addressId =  insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    favourite.eventId = insertEventResult.rows[0].id;
    favourite.individualId = insertIndividualResult.rows[0].id;
    await favouriteRepository.insert(favourite);

    const deleteResult = await favouriteRepository.removeByEventId(favourite.eventId);

    const findResult = await favouriteRepository.find(insertIndividualResult.rows[0].id, insertEventResult.rows[0].id);
    expect(deleteResult.rows[0]).toMatchObject(favourite);
    expect(findResult.rowCount).toBe(0);
});