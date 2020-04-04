const db = require("../../database");
const date = require("date-and-time");

const registrationExample1 = {
    email: "test@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
    verificationToken: "123456",
    expiryDate: date.format(
        date.addMinutes(new Date(), 5),
        "YYYY-MM-DD HH:mm:ss", true,
    ),
};

const notification = {
    type: "Cancel",
    message: "Cancel Cancel",
    timestampSent: new Date(),
    senderId: -1,
    receiverIds: [-1],
};

const notificationExample2 = {
    type: "Cancel",
    message: "Cancel Cancel",
    timestampSent: new Date(),
    senderId: -1,
    receiverId: -1,
};

const getNotification = () => ({...notification});

const getNotificationExample2 = () => ({...notificationExample2});

const information = {
    type: "privacyPolicy",
    content: "We won't steal your data!",
};

const getInformation = () => ({...information});

const getRegistrationExample1 = () => ({...registrationExample1});

const registrationExample2 = {
    email: "test2@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
    verificationToken: "123456",
    expiryDate: date.format(
        date.addMinutes(new Date(), 5),
        "YYYY-MM-DD HH:mm:ss", true,
    ),
};

const getRegistrationExample2 = () => ({...registrationExample2});

const registrationExample3 = {
    email: "test3@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
    verificationToken: "123456",
    expiryDate: date.format(
        date.addMinutes(new Date(), 5),
        "YYYY-MM-DD HH:mm:ss", true,
    ),
};

const getRegistrationExample3 = () => ({...registrationExample3});

const registrationExample4 = {
    email: "test4@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
    verificationToken: "123456",
    expiryDate: date.format(
        date.addMinutes(new Date(), 5),
        "YYYY-MM-DD HH:mm:ss", true,
    ),
};

const getRegistrationExample4 = () => ({...registrationExample4});

const registrationExample5 = {
    email: "test4@gmail.com",
    emailFlag: 1,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
    verificationToken: "123456",
    expiryDate: date.format(
        date.addMinutes(new Date(), 5),
        "YYYY-MM-DD HH:mm:ss", true,
    ),
};

const getRegistrationExample5 = () => ({...registrationExample5});

const registrationExample6 = {
    email: "test4@gmail.com",
    emailFlag: 1,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 1,
    verificationToken: "123456",
    expiryDate: date.format(
        date.addMinutes(new Date(), 5),
        "YYYY-MM-DD HH:mm:ss", true,
    ),
};

const getRegistrationExample6 = () => ({...registrationExample6});

const address = {
    address1: "221B Baker St",
    address2: "Marylebone",
    postcode: "NW1 6XE",
    city: "London",
    region: "Greater London",
    lat: 51.523774,
    long: -0.158534,
};

const getAddress = () => ({...address});

const address2 = {
    addressLine1: "221B Baker St",
    addressLine2: "Marylebone",
    postCode: "NW1 6XE",
    townCity: "London",
    countryState: "Greater London",
    lat: 51.523774,
    long: -0.158534,
};

const getAddress2 = () => ({...address2});


const event = {
    name: "event",
    addressId: -1,
    womenOnly: true,
    spots: 3,
    addressVisible: true,
    minimumAge: 16,
    photoId: true,
    physical: true,
    addInfo: true,
    content: "fun event yay",
    date: "2004-10-19 10:23:54",
    userId: -1,
    creationDate: "2019-10-19 10:23:54",
};

const eventWithData = {
    name: "Event in KCL",
    womenOnly: false,
    spots: 30,
    addressVisible: true,
    minimumAge: 20,
    photoId: false,
    physical: true,
    addInfo: true,
    content: "nunc sit amet metus. Aliquam erat volutpat. Nulla facili",
    date: "2020-04-08T23:00:00.000Z",
    eventCreatorId: 1,
    address1: "uni road",
    address2: "wherever",
    postcode: "SE1 1DR",
    city: "London",
    region: "region",
    lat: 51.511407,
    long: -0.115905,
    distance: 7.399274608089304,
};
const peaceEvent = {
    id: 3,
    name: "Event in KCL",
    addressId: 3,
    womenOnly: false,
    spots: 30,
    addressVisible: true,
    minimumAge: 20,
    photoId: false,
    physical: true,
    addInfo: true,
    content: "nunc sit amet metus. Aliquam erat volutpat. Nulla facili",
    date: "2020-04-08T23:00:00.000Z",
    causeId: 6,
    causeName: "peace",
    causeDescription: "montes, nascetur ridiculus mus. Aenean",
    eventCreatorId: 1,
    address1: "uni road",
    address2: "wherever",
    postcode: "SE1 1DR",
    city: "London",
    region: "region",
    lat: 51.511407,
    long: -0.115905,
    volunteers: [
        1,
        34,
    ],
    going: true,
    spotsRemaining: 28,
    distance: 7.399274608089304,
};
const animalsEvent = {
    id: 1,
    name: "Event in user 1s house",
    addressId: 1,
    womenOnly: false,
    spots: 3,
    addressVisible: true,
    minimumAge: 18,
    photoId: false,
    physical: false,
    addInfo: false,
    content: "event created by user 1 and happening at user 1s house. Distance to user 1 should be 0.",
    date: "2020-04-03T23:00:00.000Z",
    causeId: 1,
    causeName: "animals",
    causeDescription: "Morbi accumsan laoreet ipsum. Curabitur",
    eventCreatorId: 1,
    address1: "pincot road",
    address2: "wherever",
    postcode: "SW19 2LF",
    city: "London",
    region: "region",
    lat: 51.414916,
    long: -0.190487,
    volunteers: [
        1,
        44,
        21,
    ],
    going: true,
    spotsRemaining: 0,
    distance: 0,
};
const getEvent = () => ({...event});
const getEventWithAllData = () => ({...eventWithData});
const getPeaceEvent = () => ({...peaceEvent});
const getAnimalsEvent = () => ({...animalsEvent});

const eventWithBHAddress = {
    name: "event",
    womenOnly: true,
    spots: 3,
    addressVisible: true,
    minimumAge: 16,
    photoId: true,
    physical: true,
    addInfo: true,
    content: "fun event yay",
    date: "2004-10-19 10:23:54",
    userId: -1,
    creationDate: "2019-10-19 10:23:54",
    address: {
        address1: "44-46 Aldwych",
        address2: "Holborn",
        postcode: "WC2B 4LL",
        city: "London",
        region: "United Kingdom",
    },
};

const getEventWithBHAddress = () => ({...eventWithBHAddress});

const userExample1 = {
    email: "test@gmail.com",
    username: "test1",
    passwordHash: "password",
    verified: true,
    salt: "password",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const getUserExample1 = () => ({...userExample1});


const authenticationExample1 = {
    token: "thisIsASecureToken",
    creationDate: "2020-01-10 19:10:25-07",
    userId: -1,
};

const getAuthenticationExample1 = () => ({...authenticationExample1});

const authenticationExample2 = {
    token: "thisIsANonSecureToken",
    creationDate: "2019-12-23 19:10:25-07",
    userId: -1,
};

const getAuthenticationExample2 = () => ({...authenticationExample2});

const userExample2 = {
    email: "test2@gmail.com",
    username: "test2",
    passwordHash: "password",
    verified: true,
    salt: "xlzljlfas",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const getUserExample2 = () => ({...userExample2});

const userExample3 = {
    email: "test3@gmail.com",
    username: "test3",
    passwordHash: "password",
    verified: true,
    salt: "xlzljlfas",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const getUserExample3 = () => ({...userExample3});

const userExample4 = {
    email: "test4@gmail.com",
    username: "test4",
    passwordHash: "bd25f93e765c380a414d1cb7887a9cfcf5394fbc36443810256df3ce39f7ab32",
    verified: false,
    salt: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const getUserExample4 = () => ({...userExample4});

const individual = {

    firstname: "Paul",
    lastname: "Muller",
    phone: "+435958934",
    banned: false,
    userId: -1,
    pictureId: null,
    addressId: -1,
    birthday: "1998-10-09",
    gender: 'M',
};

const getIndividual = () => ({...individual});

const individual2 = {

    firstname: "Paül",
    lastname: "Müller",
    phone: "+435958935",
    banned: true,
    userId: -1,
    pictureId: null,
    addressId: -1,
    birthday: "1998-10-10",
    gender: 'M',
};

const getIndividual2 = () => ({...individual2});

const profile = {
    individualId: -1,
    karmaPoints: 134,
    bio: "tstest xlkhtle",
    womenOnly: false,
};

const getProfile = () => ({...profile});

const organisation = {

    orgName: "Charity",
    orgNumber: "1234AB",
    orgType: "NGO",
    pocFirstname: "Paul",
    pocLastname: "Muller",
    phone: "+945380245",
    banned: false,
    orgRegisterDate: "2016-10-09",
    lowIncome: false,
    exempt: false,
    website: "sten.com",
    bio: "whatever this is",
    pictureId: null,
    userId: -1,
    addressId: -1,
};

const getOrganisation = () => ({...organisation});

const cause = {
    name: "cause1",
    description: "description of cause1",
    title: "test",
};

const getCause = () => ({...cause});

const signUp = {
    individualId: -1,
    eventId: 3,
    confirmed: true,
    attended: false,
};

const getSignUp = () => ({...signUp});

const bugReport = {
    userId: null,
    authToken: null,
    data: {
        email: "test@gmail.com",
        report: "I can't date with this app.",
    },
};

const getBugReport = () => ({...bugReport});

const favourite = {
    individualId: -1,
    eventId: -1,
};

const getFavourite = () => ({...favourite});

const eventWithLocationExample1 = {
    name: "Event in KCL",
    womenOnly: false,
    spots: 30,
    addressvisible: true,
    minimumage: 20,
    photoid: false,
    physical: true,
    addinfo: true,
    content: "nunc sit amet metus. Aliquam erat volutpat. Nulla facili",
    date: "2020-04-08T23:00:00.000Z",
    eventcreatorid: 1,
    address1: "uni road",
    address2: "wherever",
    postcode: "SE1 1DR",
    city: "London",
    region: "region",
    lat: 51.511407,
    long: -0.115905,
    distance: 7.399274608089304,
};

const getEventWithLocationExample1 = () => ({...eventWithLocationExample1});

const eventWithLocationExample2 = {
    name: "Event close to user 1",
    womenOnly: true,
    spots: 20,
    addressvisible: true,
    minimumage: 21,
    photoid: false,
    physical: true,
    addinfo: false,
    content: "risus. Quisque libero lacus, varius et, euismod et, commodo at, libero. Morbi accumsan laoreet",
    date: "2020-07-04T23:00:00.000Z",
    eventcreatorid: 1,
    address1: "nearby road",
    address2: "wherever",
    postcode: "SW19 2LF",
    city: "London",
    region: "region",
    lat: 51.416122,
    long: -0.186641,
    distance: 0.18548890708299523,
};

const getEventWithLocationExample2 = () => ({...eventWithLocationExample2});

const womenOnlyEvent = {
    id: 4,
    name: "Women Only Event",
    addressId: 3,
    womenOnly: true,
    spots: 3,
    addressVisible: true,
    minimumAge: 18,
    photoId: false,
    addInfo: false,
    content: "just doing women stuff",
    date: "2020-03-25T19:10:00.000Z",
    causeId: 1,
    causename: "gardening",
    causedescription: "watering plants and dat",
    eventCreatorId: 1,
    address1: "nearby road",
    address2: null,
    postcode: "whatever",
    city: "London",
    region: null,
    lat: "51.4161220",
    long: "-0.1866410",
};

const getWomenOnlyEvent = () => ({...womenOnlyEvent});

const physicalEvent = {
    id: 5,
    name: "Physical",
    addressId: 3,
    womenOnly: false,
    spots: 3,
    addressVisible: true,
    minimumAge: 18,
    photoId: false,
    physical: true,
    addInfo: false,
    content: "doing stuff that make you sweat",
    date: "2020-03-25T19:10:00.000Z",
    causeId: 1,
    causeName: "gardening",
    causeDescription: "watering plants and dat",
    eventCreatorId: 1,
    address1: "nearby road",
    address2: null,
    postcode: "whatever",
    city: "London",
    region: null,
    lat: "51.4161220",
    long: "-0.1866410",
};

const getPhysicalEvent = () => ({...physicalEvent});

const signedUpUserExample1 = {
    eventId: 1,
    individualId: 1,
    confirmed: true,
    firstname: "fname",
    lastname: "lname",
    userId: 677,
    email: "test@gmail.com",
    username: "test1",
    dateRegistered: "2016-06-22T18:10:25.000Z",
};

const getSignedUpUserExample1 = () => ({...signedUpUserExample1});

const signedUpUserExample2 = {
    eventId: 1,
    individualId: 2,
    confirmed: true,
    firstname: "fname2",
    lastname: "lname2",
    userId: 678,
    email: "test2@gmail.com",
    username: "test2",
    dateRegistered: "2016-06-22T18:10:25.000Z",
};

const getSignedUpUserExample2 = () => ({...signedUpUserExample2});

const resetExample1 = {
    userId: 1,
    passwordToken: "123456",
};

const getResetExample1 = () => ({...resetExample1});

const pictureExample1 = {
    pictureLocation: "/User/Downloads/myImage.png",
};

const pictureExample2 = {
    pictureLocation: "/User/Downloads/myFolder/newImage.png",
};

const getPictureExample1 = () => ({...pictureExample1});

const getPictureExample2 = () => ({...pictureExample2});

const resetExample2 = {
    userId: 1,
    passwordToken: "234567",
};

const getResetExample2 = () => ({...resetExample2});

const eventCauseExample1 = {
    eventId: -1,
    causeId: -1,
};

const getEventCauseExample1 = () => ({...eventCauseExample1});

const complaint = {
    type: "Sten",
    message: "I don't like Sten",
    userId: -1,
};

const getComplaint = () => ({...complaint});

const setting = {
    email: 1,
    notifications: 0,
    userId: -1,
};

const getSetting = () => ({...setting});

const reportUser = {
    type: "Alcoholic",
    message: "He drank too much",
    userReported: -1,
    userReporting: -1,
};

const getReportUser = () => ({...reportUser});

const clearDatabase = async () => {
    await db.query("DELETE FROM notification");
    await db.query("DELETE FROM complaint");
    await db.query("DELETE FROM report_user");
    await db.query("DELETE FROM setting");
    await db.query("DELETE FROM profile");
    await db.query("DELETE FROM sign_up");
    await db.query("DELETE FROM favourite");
    await db.query("DELETE FROM event_cause");
    await db.query("DELETE FROM organisation");
    await db.query("DELETE FROM individual");
    await db.query("DELETE FROM event");
    await db.query("DELETE FROM picture");
    await db.query("DELETE FROM authentication");
    await db.query("DELETE FROM selected_cause");
    await db.query("DELETE FROM reset");
    await db.query("DELETE FROM \"user\"");
    await db.query("DELETE FROM registration");
    await db.query("DELETE FROM cause");
    await db.query("DELETE FROM address");
    await db.query("DELETE FROM information");
};

module.exports = {
    getAddress,
    getAddress2,
    getAuthenticationExample1,
    getAuthenticationExample2,
    getRegistrationExample1,
    getRegistrationExample2,
    getRegistrationExample3,
    getRegistrationExample4,
    getRegistrationExample5,
    getRegistrationExample6,
    getEvent,
    getCause,
    getSignUp,
    getUserExample1,
    getUserExample2,
    getUserExample3,
    getUserExample4,
    getIndividual,
    getIndividual2,
    getProfile,
    getOrganisation,
    getSignedUpUserExample1,
    getSignedUpUserExample2,
    getResetExample1,
    getResetExample2,
    getEventWithLocationExample1,
    getEventWithLocationExample2,
    getWomenOnlyEvent,
    getFavourite,
    getPhysicalEvent,
    clearDatabase,
    getNotification,
    getBugReport,
    getInformation,
    getPictureExample1,
    getPictureExample2,
    getEventCauseExample1,
    getComplaint,
    getSetting,
    getReportUser,
    getEventWithAllData,
    getPeaceEvent,
    getAnimalsEvent,
    getNotificationExample2,
    getEventWithBHAddress,
};
