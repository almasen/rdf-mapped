const db = require("../../database");

const clearDatabase = async () => {
    await db.query("DELETE FROM capability");
    await db.query("DELETE FROM category");
    await db.query("DELETE FROM competency");
    await db.query("DELETE FROM phase");
    await db.query("DELETE FROM course");
    await db.query("DELETE FROM video");
    await db.query("DELETE FROM course_phase");
    await db.query("DELETE FROM video_phase");
};

const capability1 = {
    title: "Domain A: Knowledge and intellectual abilities",
};

const capability2 = {
    title: "Domain B: Personal effectiveness",
};

const getCapability1 = () => ({...capability1});
const getCapability2 = () => ({ ...capability2 });

module.exports = {
    clearDatabase,
    getCapability1,
    getCapability2,
};
