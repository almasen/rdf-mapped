const db = require("../../database/connection");

const insert = (submission) => {
    const query = "INSERT INTO submission(id, status, submitter, authentication_status, data) VALUES ($1, $2, $3, $4, $5) " +
        "RETURNING *"; // returns passed submission with it's id set to corresponding id in database
    const params = [submission.id, submission.status, submission.submitter, submission.authenticationStatus, submission.data];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM submission WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM submission";
    return db.query(query);
};

const update = (submission) => {
    const query = "UPDATE submission SET status = $2, submitter = $3, authentication_status = $4, data = $5 WHERE id = $1" +
        "RETURNING *"; // returns passed submission with it's id set to corresponding id in database
    const params = [submission.id, submission.status, submission.submitter, submission.authenticationStatus, submission.data];
    return db.query(query, params);
};

const removeById = (id) => {
    const query = "DELETE FROM submission WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

module.exports = {
    insert,
    findById,
    findAll,
    update,
    removeById,
};
