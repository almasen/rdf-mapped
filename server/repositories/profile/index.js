const db = require("../../database");

const insert = (profile) => {
    const query = "INSERT INTO profile(individual_id, karma_points, bio, women_only) VALUES ($1, $2, $3, $4)" +
        "RETURNING *"; // returns passed profile with it's id set to corresponding id in database
    const params = [profile.individualId, profile.karmaPoints, profile.bio, profile.womenOnly];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM profile WHERE id=$1";
    return db.query(query, [id]);
};

const findByIndividualId = (individualId) => {
    const query = "SELECT * FROM profile WHERE individual_id=$1";
    return db.query(query, [individualId]);
};

const findAll = () => {
    const query = "SELECT * FROM profile";
    return db.query(query);
};

const updateKarmaPoints = (individualId) => {
    const query = "UPDATE profile SET karma_points = (karma_points + 1) WHERE individual_id = $1 RETURNING *";
    return db.query(query, [individualId]);
};

const update = (profile) => {
    const query = "UPDATE profile SET karma_points = $1, bio = $2, women_only = $3  WHERE id=$4 RETURNING *";
    const params = [
        profile.karmaPoints,
        profile.bio,
        profile.womenOnly,
        profile.id,
    ];
    return db.query(query, params);
};

const removeByIndividualId = (individualId) => {
    const query = "DELETE FROM profile WHERE individual_id=$1 RETURNING *";
    return db.query(query, [individualId]);
};

module.exports = {
    insert,
    findById,
    findAll,
    findByIndividualId,
    update,
    removeByIndividualId,
    updateKarmaPoints,
};
