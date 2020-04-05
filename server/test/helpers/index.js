/* eslint-disable max-len */
const db = require("../../database/connection");

const clearDatabase = async () => {
    await db.query("DELETE FROM course_phase");
    await db.query("DELETE FROM video_phase");
    await db.query("DELETE FROM course");
    await db.query("DELETE FROM video");
    await db.query("DELETE FROM capability");
    await db.query("DELETE FROM category");
    await db.query("DELETE FROM competency");
    await db.query("DELETE FROM phase");
};

const capability1 = {
    title: "Domain A: Knowledge and intellectual abilities",
};

const capability2 = {
    title: "Domain B: Personal effectiveness",
};

const getCapability1 = () => ({...capability1});
const getCapability2 = () => ({...capability2});

const category1 = {
    title: "A1 Knowledge base",
};

const getCategory1 = () => ({...category1});

const competency1 = {
    title: "1. Subject knowledge",
};

const getCompetency1 = () => ({...competency1});

const phase1 = {
    title: "Phase 1",
};

const getPhase1 = () => ({...phase1});

const phase2 = {
    title: "Phase 2",
};

const getPhase2 = () => ({ ...phase2 });

const course1 = {
    title: "Researcher Development and Doctoral Skills Development",
    hyperlink: "https://www.linkedin.com/learning/academic-research-foundations-quantitative?u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
};

const getCourse1 = () => ({ ...course1 });

const video1 = {
    title: "Research & Development",
    hyperlink: "https://www.linkedin.com/learning/writing-a-research-paper/researching-the-topic?collection=urn%3Ali%3AlearningCollection%3A6605689868850995200&u=104",
    capabilityId: -1,
    categoryId: -1,
    competencyId: -1,
    phases: [], // can be multiple IDs
};

const getVideo1 = () => ({ ...video1 });

module.exports = {
    clearDatabase,
    getCapability1,
    getCapability2,
    getCategory1,
    getCompetency1,
    getPhase1,
    getPhase2,
    getCourse1,
    getVideo1,
};
