const db = require("../../database/connection");

const insert = (learningObject) => {
    const query = "INSERT INTO learning_object(urn, timestamp, data) VALUES ($1, $2, $3) " +
    "ON CONFLICT ON CONSTRAINT learning_object_pk " +
    "DO UPDATE SET timestamp = $2, data = $3 " +
    "RETURNING *"; // returns passed learningObject with it's id set to corresponding id in database
    const params = [learningObject.urn, learningObject.timestamp, learningObject.data];
    return db.query(query, params);
};

const findByURN = (urn) => {
    const query = "SELECT * FROM learning_object WHERE urn=$1";
    return db.query(query, [urn]);
};

const findAll = () => {
    const query = "SELECT * FROM learning_object";
    return db.query(query);
};

const update = (learningObject) => {
    const query = "UPDATE learning_object SET timestamp = $2, data = $3 WHERE urn = $1" +
        "RETURNING *"; // returns passed learningObject with it's id set to corresponding id in database
    const params = [learningObject.urn, learningObject.timestamp, learningObject.data];
    return db.query(query, params);
};

const removeByURN = (urn) => {
    const query = "DELETE FROM learning_object WHERE urn=$1 RETURNING *";
    return db.query(query, [urn]);
};

module.exports = {
    insert,
    findByURN,
    findAll,
    update,
    removeByURN,
};
