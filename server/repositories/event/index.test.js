const addressRepository = require("../address");
const eventRepository = require("./");
const testHelpers = require("../../test/helpers");
const userRepository = require("../user");
const registrationRepository = require("../registration");

let registrationExample1, address, event, userExample1;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    address = testHelpers.getAddress();
    event = testHelpers.getEvent();
    userExample1 = testHelpers.getUserExample1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert and findById work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertAddressResult = await addressRepository.insert(address);
    const insertUserResult = await userRepository.insert(userExample1);
    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);
    const findEventResult = await eventRepository.findById(insertEventResult.rows[0].id);
    expect(findEventResult.rows[0]).toMatchObject(insertEventResult.rows[0]);
});

test('events update works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertAddressResult = await addressRepository.insert(address);
    const insertUserResult = await userRepository.insert(userExample1);
    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;

    const insertEventResult = await eventRepository.insert(event);
    const insertedEvent = insertEventResult.rows[0];
    insertedEvent.name = "New name";
    insertedEvent.spots = 5;
    const updateEventResult = await eventRepository.update(insertedEvent);
    expect(updateEventResult.rows[0]).toMatchObject(insertedEvent);
});

test('findAllByUserId works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertAddressResult = await addressRepository.insert(address);
    const insertUserResult = await userRepository.insert(userExample1);
    event.addressId =  insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;

    const insertEventResult1 = await eventRepository.insert(event);
    const insertedEvent1 = insertEventResult1.rows[0];
    const insertEventResult2 = await eventRepository.insert(event);
    const insertedEvent2 = insertEventResult2.rows[0];

    const findAllByUserIdResult = await eventRepository.findAllByUserId(insertUserResult.rows[0].id);
    expect(findAllByUserIdResult.rows).toMatchObject([insertedEvent1, insertedEvent2]);
});

test('findAllByUserIdLastMonth works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertAddressResult = await addressRepository.insert(address);
    const insertUserResult = await userRepository.insert(userExample1);
    event.addressId =  insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    event.creationDate = fiveDaysAgo;
    const insertEventResult1 = await eventRepository.insert(event);
    const insertedEvent1 = insertEventResult1.rows[0];

    const yearAgo = new Date();
    yearAgo.setDate(yearAgo.getDate() - 365);
    event.creationDate = yearAgo;
    await eventRepository.insert(event);

    const findAllByUserIdLastMonthResult = await eventRepository.findAllByUserIdLastMonth(insertUserResult.rows[0].id);
    expect(findAllByUserIdLastMonthResult.rows[0]).toMatchObject(insertedEvent1);
    expect(findAllByUserIdLastMonthResult.rowCount).toBe(1);
});