const db = require("../../database");

const insert = (competency) => {
    const query = "INSERT INTO competency(title) VALUES ($1) " +
        "RETURNING *"; // returns passed competency with it's id set to corresponding id in database
    const params = [competency.title];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM competency WHERE id=$1";
    return db.query(query, [id]);
};

const update = (competency) => {
    const query = "UPDATE competency SET title = $2 WHERE id = $1" +
        "RETURNING *"; // returns passed competency with it's id set to corresponding id in database
    const params = [competency.id, competency.title];
    return db.query(query, params);
};

const removeById = (id) => {
    const query = "DELETE FROM competency WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

module.exports = {
    insert,
    findById,
    update,
    removeById,
};
