/* eslint-disable max-len */
const db = require("../../database/connection");

const clearDatabase = async () => {
    await db.query("DELETE FROM course_phase");
    await db.query("DELETE FROM video_phase");
    await db.query("DELETE FROM course");
    await db.query("DELETE FROM video");
    await db.query("DELETE FROM phase");
    await db.query("DELETE FROM competency");
    await db.query("DELETE FROM category");
    await db.query("DELETE FROM capability");
    await db.query("DELETE FROM information");
    await db.query("DELETE FROM faq");
    await db.query("DELETE FROM learning_object");
    await db.query("DELETE FROM submission");
    await db.query("DELETE FROM admin");
};

const capability1 = {
    title: "Domain A: Knowledge and intellectual abilities",
};

const capability2 = {
    title: "Domain B: Personal effectiveness",
};

const capability3 = {
    title: "Domain C",
};

const capability4 = {
    title: "Domain D",
};

const getCapability1 = () => ({...capability1});
const getCapability2 = () => ({...capability2});
const getCapability3 = () => ({...capability3});
const getCapability4 = () => ({...capability4});

const category1 = {
    title: "A1 Knowledge base",
    capabilityId: -1,
};

const category2 = {
    title: "B1 Second category",
    capabilityId: -1,
};

const getCategory1 = () => ({...category1});

const getCategory2 = () => ({...category2});

const competency1 = {
    title: "A1: 1. Subject knowledge",
    categoryId: -1,
};

const competency2 = {
    title: "B1: 1. Second competency",
    categoryId: -1,
};

const getCompetency1 = () => ({...competency1});

const getCompetency2 = () => ({...competency2});

const phase1 = {
    title: "Phase 1",
};

const getPhase1 = () => ({...phase1});

const phase2 = {
    title: "Phase 2",
};

const getPhase2 = () => ({...phase2});

const phase3 = {
    title: "Phase 3",
};

const getPhase3 = () => ({...phase3});

const phase4 = {
    title: "Phase 4",
};

const getPhase4 = () => ({...phase4});

const phase5 = {
    title: "Phase 5",
};

const getPhase5 = () => ({...phase5});

const course1 = {
    title: "Researcher Development and Doctoral Skills Development",
    hyperlink: "https://www.linkedin.com/learning/academic-research-foundations-quantitative?u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
    urn: "null",
};

const getCourse1 = () => ({...course1});

const course2 = {
    title: "Writing a Research Paper",
    hyperlink: "https://www.linkedin.com/learning/writing-a-research-paper?u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
    urn: "null",
};

const getCourse2 = () => ({...course2});

const course3 = {
    title: "SPSS for Academic Research",
    hyperlink: "https://www.linkedin.com/learning/spss-for-academic-research?u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
    urn: "null",
};

const getCourse3 = () => ({...course3});

const video1 = {
    title: "Research & Development",
    hyperlink: "https://www.linkedin.com/learning/writing-a-research-paper/researching-the-topic?collection=urn%3Ali%3AlearningCollection%3A6605689868850995200&u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
    urn: "null",
};

const getVideo1 = () => ({...video1});

const video2 = {
    title: "Research ethics",
    hyperlink: "https://www.linkedin.com/learning/academic-research-foundations-quantitative/research-ethics?collection=urn%3Ali%3AlearningCollection%3A6605689868850995200&u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
    urn: "null",
};

const getVideo2 = () => ({...video2});

const video3 = {
    title: "Researching the topic",
    hyperlink: "https://www.linkedin.com/learning/writing-a-research-paper/researching-the-topic?collection=urn%3Ali%3AlearningCollection%3A6605689868850995200&u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
    urn: "null",
};

const getVideo3 = () => ({...video3});


const information1 = {
    type: "privacy",
    content: "We don't sell your data.",
};

const getInformation1 = () => ({...information1});

const information2 = {
    type: "accessibility",
    content: "Screen readers are supported",
};

const getInformation2 = () => ({...information2});

const faq1 = {
    question: "Why does this not work?",
    answer: "You are using it the opposite way.",
};

const getFAQ1 = () => ({...faq1});

const faq2 = {
    question: "Do I need a LinkedIn Learning licence?",
    answer: "Yes.",
};

const getFAQ2 = () => ({...faq2});

const learningObject1 = {
    urn: 'urn:li:lyndaCourse:158319',
    data: `{"urn":"urn:li:lyndaCourse:158319","title":{"value":"Writing a Research Paper"},"details":{"urls":{"webLaunch":"https://www.linkedin.com/learning/writing-a-research-paper"},"images":{"primary":"https://cdn.lynda.com/course/158319/158319-636456674755623334-16x9.jpg"},"timeToComplete":{"duration":6962},"descriptionIncludingHtml":{"value":"Have to write a research paper? Learn tips for writing an A+ paper that will wow your professors. In this course, author and Kelley School of Business faculty member Judy Steiner-Williams shows you how to prepare for, and write, polished research papers for high school and college classes. Discover how to brainstorm, select your best ideas, collect and categorize research, and write the paper, while following along with Judy's practical, real-world examples."},"shortDescriptionIncludingHtml":{"value":"Discover how to write research papers for high school and college classes."}}}`,
};

const getLearningObject1 = () => ({...learningObject1});

const learningObject2 = {
    urn: 'urn:li:lyndaCourse:476938',
    data: `{"urn":"urn:li:lyndaCourse:158319","title":{"value":"Writing a Research Paper"},"details":{"urls":{"webLaunch":"https://www.linkedin.com/learning/writing-a-research-paper"},"images":{"primary":"https://cdn.lynda.com/course/158319/158319-636456674755623334-16x9.jpg"},"timeToComplete":{"duration":6962},"descriptionIncludingHtml":{"value":"Have to write a research paper? Learn tips for writing an A+ paper that will wow your professors. In this course, author and Kelley School of Business faculty member Judy Steiner-Williams shows you how to prepare for, and write, polished research papers for high school and college classes. Discover how to brainstorm, select your best ideas, collect and categorize research, and write the paper, while following along with Judy's practical, real-world examples."},"shortDescriptionIncludingHtml":{"value":"Discover how to write research papers for high school and college classes."}}}`,
};

const getLearningObject2 = () => ({...learningObject2});

const outdatedLearningObject1 = {
    urn: 'urn:li:lyndaCourse:476938',
    timestamp: `2020-01-28T11:33:52.000Z`,
    data: `{"urn":"urn:li:lyndaCourse:158319","title":{"value":"Writing a Research Paper"},"details":{"urls":{"webLaunch":"https://www.linkedin.com/learning/writing-a-research-paper"},"images":{"primary":"https://cdn.lynda.com/course/158319/158319-636456674755623334-16x9.jpg"},"timeToComplete":{"duration":6962},"descriptionIncludingHtml":{"value":"Have to write a research paper? Learn tips for writing an A+ paper that will wow your professors. In this course, author and Kelley School of Business faculty member Judy Steiner-Williams shows you how to prepare for, and write, polished research papers for high school and college classes. Discover how to brainstorm, select your best ideas, collect and categorize research, and write the paper, while following along with Judy's practical, real-world examples."},"shortDescriptionIncludingHtml":{"value":"Discover how to write research papers for high school and college classes."}}}`,
};

const getOutdatedLearningObject1 = () => ({...outdatedLearningObject1});

const submission1 = {
    status: 'processing',
    submitter: 'test@test.com',
    data: `{"urn":"urn:li:lyndaCourse:697710","type":"COURSE","title":"Business Development Foundations: Researching Market and Customer Needs","phases":"5","category":"10","hyperlink":"https://www.linkedin.com/learning/business-development-foundations-researching-market-and-customer-needs/welcome?u=104","timestamp":"Sat, 22 Aug 2020 23:30:01 GMT","capability":"4","competency":"48","categoryTitle":"D1: Working with others","capabilityTitle":"D: Engagement, influence and impact","competencyTitle":"Team working"}`,
};

const getSubmission1 = () => ({...submission1});

const submission2 = {
    status: 'pending',
    submitter: 'test@test.com',
    data: `{"urn":"urn:li:lyndaCourse:697710","type":"COURSE","title":"Business Development Foundations: Researching Market and Customer Needs","phases":"5","category":"10","hyperlink":"https://www.linkedin.com/learning/business-development-foundations-researching-market-and-customer-needs/welcome?u=104","timestamp":"Sat, 22 Aug 2020 23:30:01 GMT","capability":"4","competency":"48","categoryTitle":"D1: Working with others","capabilityTitle":"D: Engagement, influence and impact","competencyTitle":"Team working"}`,
};

const getSubmission2 = () => ({...submission2});

const submission3 = {
    status: 'published',
    submitter: 'test@test.com',
    data: `{"urn":"urn:li:lyndaCourse:697710","type":"COURSE","title":"Business Development Foundations: Researching Market and Customer Needs","phases":"5","category":"10","hyperlink":"https://www.linkedin.com/learning/business-development-foundations-researching-market-and-customer-needs/welcome?u=104","timestamp":"Sat, 22 Aug 2020 23:30:01 GMT","capability":"4","competency":"48","categoryTitle":"D1: Working with others","capabilityTitle":"D: Engagement, influence and impact","competencyTitle":"Team working"}`,
};

const getSubmission3 = () => ({...submission3});

const submission4 = {
    status: 'failed',
    submitter: 'anonymous',
    data: `{"type":"COURSE","title":"1111111asdf","hyperlink":"asdfsdf","timestamp":"Sat, 22 Aug 2020 23:29:50 GMT"}`,
};

const getSubmission4 = () => ({...submission4});

const submission5 = {
    status: 'failed',
    submitter: 'anonymous',
    data: `{"type":"COURSE","title":"1111111asdf","hyperlink":"asdfsdf","timestamp":"Sat, 22 Aug 2020 23:29:50 GMT"}`,
};

const getSubmission5 = () => ({...submission5});

const admin1 = {
    email: 'admin@test.com',
    username: 'admin1',
    passwordHash: 'bd25f93e765c380a414d1cb7887a9cfcf5394fbc36443810256df3ce39f7ab32',
    salt: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
};

const getAdmin1 = () => ({...admin1});

const admin2 = {
    email: 'admin2@test.com',
    username: 'admin2',
    passwordHash: 'bd25f93e765c380a414d1cb7887a9cfcf5394fbc36443810256df3ce39f7ab32',
    salt: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
};

const getAdmin2 = () => ({...admin2});

module.exports = {
    clearDatabase,
    getCapability1,
    getCapability2,
    getCapability3,
    getCapability4,
    getCategory1,
    getCategory2,
    getCompetency1,
    getCompetency2,
    getPhase1,
    getPhase2,
    getPhase3,
    getPhase4,
    getPhase5,
    getCourse1,
    getCourse2,
    getCourse3,
    getVideo1,
    getVideo2,
    getVideo3,
    getInformation1,
    getInformation2,
    getFAQ1,
    getFAQ2,
    getLearningObject1,
    getLearningObject2,
    getOutdatedLearningObject1,
    getSubmission1,
    getSubmission2,
    getSubmission3,
    getSubmission4,
    getSubmission5,
    getAdmin1,
    getAdmin2,
};
