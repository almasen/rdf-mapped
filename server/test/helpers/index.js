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
    title: "A2 Second category",
    capabilityId: -1,
};

const getCategory1 = () => ({...category1});

const getCategory2 = () => ({...category2});

const competency1 = {
    title: "1. Subject knowledge",
    categoryId: -1,
};

const competency2 = {
    title: "2. Second competency",
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
};

const getCourse1 = () => ({...course1});

const course2 = {
    title: "Writing a Research Paper",
    hyperlink: "https://www.linkedin.com/learning/writing-a-research-paper?u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
};

const getCourse2 = () => ({...course2});

const course3 = {
    title: "SPSS for Academic Research",
    hyperlink: "https://www.linkedin.com/learning/spss-for-academic-research?u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
};

const getCourse3 = () => ({...course3});

const video1 = {
    title: "Research & Development",
    hyperlink: "https://www.linkedin.com/learning/writing-a-research-paper/researching-the-topic?collection=urn%3Ali%3AlearningCollection%3A6605689868850995200&u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
};

const getVideo1 = () => ({...video1});

const video2 = {
    title: "Research ethics",
    hyperlink: "https://www.linkedin.com/learning/academic-research-foundations-quantitative/research-ethics?collection=urn%3Ali%3AlearningCollection%3A6605689868850995200&u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
};

const getVideo2 = () => ({...video2});

const video3 = {
    title: "Researching the topic",
    hyperlink: "https://www.linkedin.com/learning/writing-a-research-paper/researching-the-topic?collection=urn%3Ali%3AlearningCollection%3A6605689868850995200&u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
};

const getVideo3 = () => ({...video3});


const information = {
    type: "privacyPolicy",
    content: "We don't sell your data.",
};

const getInformation = () => ({...information});

const bugReport = {
    data: {
        email: "test@gmail.com",
        report: "I have an error with a course.",
    },
};

const getBugReport = () => ({...bugReport});

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
    getInformation,
    getBugReport,
};
