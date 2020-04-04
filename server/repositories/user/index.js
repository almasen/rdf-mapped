const db = require("../../database");

const insert = (user) => {
    const query = "INSERT INTO \"user\"(email, username, password_hash, verified, salt, date_registered) VALUES ($1, $2, $3, $4, $5, $6)" +
        "RETURNING *"; // returns passed user with it's id set to corresponding id in database
    const params = [user.email, user.username, user.passwordHash, user.verified, user.salt, user.dateRegistered];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM \"user\" WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM \"user\"";
    return db.query(query);
};

const findByEmail = (email) => {
    const query = "SELECT * FROM \"user\" WHERE email=$1";
    return db.query(query, [email]);
};

const findByUsername = (username) => {
    const query = "SELECT * FROM \"user\" WHERE username=$1";
    return db.query(query, [username]);
};

const updatePassword = (userId, hashedPassword, salt) => {
    const query = "UPDATE \"user\" SET password_hash = $1, salt = $2 WHERE id = $3 RETURNING *";
    const params = [hashedPassword, salt, userId];
    return db.query(query, params);
};

const updateVerificationStatus = (userId, isVerified) => {
    const query =
    'UPDATE "user" SET verified = $1 WHERE id = $2 RETURNING *';
    const params = [isVerified, userId];
    return db.query(query, params);
};

const updateUsername = (userId, username) => {
    const query = "UPDATE \"user\" SET username = $1 WHERE id = $2 RETURNING *";
    const params = [username, userId];
    return db.query(query, params);
};

const findIdFromEmail = (email) => {
    const query = "SELECT id FROM \"user\" WHERE email = $1";
    return db.query(query, [email]);
};

const removeUserById = (id) => {
    const query = "DELETE FROM \"user\" WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};
module.exports = {
    insert,
    findById,
    findAll,
    findByEmail,
    findByUsername,
    updatePassword,
    updateVerificationStatus,
    updateUsername,
    findIdFromEmail,
    removeUserById,
};
