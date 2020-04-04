const validation = require("./index.js");
const testHelpers = require("../../test/helpers");

const event = testHelpers.getEvent();
const address = testHelpers.getAddress();
const notification = testHelpers.getNotification();
const information = testHelpers.getInformation();
const favourite = testHelpers.getFavourite();
const individual = testHelpers.getIndividual();
const notificationExampleTwo = testHelpers.getNotificationExample2();
const signUpExample = testHelpers.getSignUp();

test("correct addresses accepted", () => {
    const correctAddress = {...address};
    expect(validation.validateAddress(correctAddress).errors.length).toBe(0);
});

test("incorrect addresses rejected", () => {
    const incorrectAddress = {...address};
    incorrectAddress.address1 = 15;
    expect(validation.validateAddress(incorrectAddress).errors.length).toBe(1);
    incorrectAddress.lat = -1000;
    expect(validation.validateAddress(incorrectAddress).errors.length).toBe(2);
    delete incorrectAddress.city;
    expect(validation.validateAddress(incorrectAddress).errors.length).toBe(3);
});

test("correct events accepted", () => {
    const correctEvent = {...event};
    expect(validation.validateEvent(correctEvent).errors.length).toBe(0);
});

test("incorrect events rejected", () => {
    const incorrectEvent = {...event};
    incorrectEvent.name = 15;
    expect(validation.validateEvent(incorrectEvent).errors.length).toBe(1);
    incorrectEvent.physical = "what?";
    expect(validation.validateEvent(incorrectEvent).errors.length).toBe(2);
    delete incorrectEvent.womenOnly;
    expect(validation.validateEvent(incorrectEvent).errors.length).toBe(3);
});

test("correct notifications accepted with receiverIDs", () => {
    const correctNotification = {...notification};
    expect(validation.validateNotification(correctNotification).errors.length).toBe(0);
});

test("correct notifications accepted with receiverID", () => {
    const correctNotification = {...notificationExampleTwo};
    expect(validation.validateNotification(correctNotification).errors.length).toBe(0);
});

test("incorrect notifications rejected", () => {
    const incorrectNotification = {...notification};
    incorrectNotification.type = 15;
    expect(validation.validateNotification(incorrectNotification).errors.length).toBe(1);
    incorrectNotification.message = true;
    expect(validation.validateNotification(incorrectNotification).errors.length).toBe(2);
    delete incorrectNotification.senderId;
    expect(validation.validateNotification(incorrectNotification).errors.length).toBe(3);
});

test("correct information accepted", () => {
    const correctInformation = {...information};
    expect(validation.validateInformation(correctInformation).errors.length).toBe(0);
});

test("incorrect information rejected", () => {
    const incorrectInformation = {...information};
    incorrectInformation.type = 15;
    expect(validation.validateInformation(incorrectInformation).errors.length).toBe(1);
    delete incorrectInformation.content;
    expect(validation.validateInformation(incorrectInformation).errors.length).toBe(2);
});

test("correct favourites accepted", () => {
    const correctFavourite = {...favourite};
    expect(validation.validateFavourite(correctFavourite).errors.length).toBe(0);
});

test("incorrect signup rejected", () => {
    const incorrectSignup = {...signUpExample};
    incorrectSignup.attended = "wrlks";
    expect(validation.validateSignup(incorrectSignup).errors.length).toBe(1);
});

test("correct signup accepted", () => {
    const correctSignup = {...signUpExample};
    expect(validation.validateSignup(correctSignup).errors.length).toBe(0);
});

test("incorrect addresses rejected", () => {
    const inCorrectFavourite = {...favourite};
    inCorrectFavourite.eventId = "Fifteen";
    expect(validation.validateFavourite(inCorrectFavourite).errors.length).toBe(1);
    inCorrectFavourite.individualId = null;
    expect(validation.validateFavourite(inCorrectFavourite).errors.length).toBe(2);
});

test("correct individuals accepted", () => {
    const correctIndividual = {...individual};
    expect(validation.validateIndividual(correctIndividual).errors.length).toBe(0);
});

test("incorrect individuals rejected", () => {
    const inCorrectIndividual = {...individual};
    inCorrectIndividual.firstname = 1111;
    expect(validation.validateIndividual(inCorrectIndividual).errors.length).toBe(1);
    inCorrectIndividual.banned = "yes";
    expect(validation.validateIndividual(inCorrectIndividual).errors.length).toBe(2);
});
