const addressRepository = require("../../address");
const eventRepository = require("../");
const testHelpers = require("../../../test/helpers");
const userRepository = require("../../user");
const registrationRepository = require("../../registration");
const causeRepository = require("../../cause");
const eventCauseRepository = require("./");

let registrationExample1, address, event, userExample1, causeExample1, eventCauseExample;

beforeEach(() => {
    eventCauseExample = testHelpers.getEventCauseExample1();
    causeExample1 = testHelpers.getCause();
    registrationExample1 = testHelpers.getRegistrationExample1();
    address = testHelpers.getAddress();
    event = testHelpers.getEvent();
    userExample1 = testHelpers.getUserExample1();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert and find works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertAddressResult = await addressRepository.insert(address);
    const insertUserResult = await userRepository.insert(userExample1);
    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    const insertCauseResult = await causeRepository.insert(causeExample1);
    eventCauseExample.eventId = insertEventResult.rows[0].id;
    eventCauseExample.causeId = insertCauseResult.rows[0].id;
    const insertEventCauseResult = await eventCauseRepository.insert(eventCauseExample);
    const findEventCauseResult = await eventCauseRepository.find(eventCauseExample.causeId, eventCauseExample.eventId);
    const findEventCauseByEventId = await eventCauseRepository.findAllByEventId(eventCauseExample.eventId);
    const findEventCauseByCauseId = await eventCauseRepository.findAllByCauseId(eventCauseExample.causeId);

    expect(findEventCauseResult.rows[0]).toMatchObject(insertEventCauseResult.rows[0]);
    expect(findEventCauseByCauseId.rows[0]).toMatchObject(insertEventCauseResult.rows[0]);
    expect(findEventCauseByEventId.rows[0]).toMatchObject(insertEventCauseResult.rows[0]);
});

test('insert and removeByEventId works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertAddressResult = await addressRepository.insert(address);
    const insertUserResult = await userRepository.insert(userExample1);
    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    const insertCauseResult = await causeRepository.insert(causeExample1);
    eventCauseExample.eventId = insertEventResult.rows[0].id;
    eventCauseExample.causeId = insertCauseResult.rows[0].id;
    await eventCauseRepository.insert(eventCauseExample);
    const findEventCauseByEventId = await eventCauseRepository.findAllByEventId(eventCauseExample.eventId);
    expect(findEventCauseByEventId.rowCount).toBe(1);
    await eventCauseRepository.removeByEventId(eventCauseExample.eventId);
    const findEventCauseByEventIdAfterDelete = await eventCauseRepository.findAllByEventId(eventCauseExample.eventId);
    expect(findEventCauseByEventIdAfterDelete.rowCount).toBe(0);
});

test('insert and removeByEventCreatorId works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertAddressResult = await addressRepository.insert(address);
    const insertUserResult = await userRepository.insert(userExample1);
    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    const insertCauseResult = await causeRepository.insert(causeExample1);
    eventCauseExample.eventId = insertEventResult.rows[0].id;
    eventCauseExample.causeId = insertCauseResult.rows[0].id;
    await eventCauseRepository.insert(eventCauseExample);
    const findEventCauseByEventId = await eventCauseRepository.findAllByEventId(eventCauseExample.eventId);
    expect(findEventCauseByEventId.rowCount).toBe(1);
    await eventCauseRepository.removeByEventCreatorId(insertUserResult.rows[0].id);
    const findEventCauseByEventIdAfterDelete = await eventCauseRepository.findAllByEventId(eventCauseExample.eventId);
    expect(findEventCauseByEventIdAfterDelete.rowCount).toBe(0);
});

test('insert and removeByEventId works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertAddressResult = await addressRepository.insert(address);
    const insertUserResult = await userRepository.insert(userExample1);
    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    const insertCauseResult = await causeRepository.insert(causeExample1);
    eventCauseExample.eventId = insertEventResult.rows[0].id;
    eventCauseExample.causeId = insertCauseResult.rows[0].id;
    await eventCauseRepository.insert(eventCauseExample);
    const findEventCauseByEventId = await eventCauseRepository.findAllByEventId(eventCauseExample.eventId);
    expect(findEventCauseByEventId.rowCount).toBe(1);
    await eventCauseRepository.removeByEventId(eventCauseExample.eventId);
    const findEventCauseByEventIdAfterDelete = await eventCauseRepository.findAllByEventId(eventCauseExample.eventId);
    expect(findEventCauseByEventIdAfterDelete.rowCount).toBe(0);
});
