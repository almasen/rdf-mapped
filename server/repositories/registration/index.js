const db = require("../../database");

const insert = (registration) => {
    const query = "INSERT INTO registration(email, email_flag, id_flag, phone_flag, sign_up_flag, verification_token, expiry_date) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7)" +
        "RETURNING *"; // returns passed registration table with it's id set to corresponding id in database
    const params = [registration.email, registration.emailFlag,
        registration.idFlag, registration.phoneFlag, registration.signUpFlag, registration.verificationToken, registration.expiryDate];
    return db.query(query, params);
};

const update = (registration) => {
    const query = "UPDATE registration SET email_flag = $2, id_flag = $3, phone_flag = $4, " +
    "sign_up_flag = $5, verification_token = $6, expiry_date = $7 " +
        "WHERE email = $1" +
        "RETURNING *"; // returns passed registration with it's id set to corresponding id in database
    const params = [registration.email, registration.emailFlag,
        registration.idFlag, registration.phoneFlag, registration.signUpFlag, registration.verificationToken, registration.expiryDate];
    return db.query(query, params);
};

const findAll = () => {
    const query = "SELECT * FROM registration";
    return db.query(query);
};

const findByEmail = (email) => {
    const query = "SELECT * FROM registration WHERE email=$1";
    return db.query(query, [email]);
};

const updateSignUpFlag = (email) => {
    const query = 'UPDATE \"registration\" SET sign_up_flag = 1 WHERE email = $1 RETURNING *';
    const params = [email];
    return db.query(query, params);
};

const removeByEmail = (email) => {
    const query = 'DELETE FROM \"registration\" WHERE email = $1 RETURNING *';
    const params = [email];
    return db.query(query, params);
};

module.exports = {
    insert,
    update,
    findAll,
    findByEmail,
    updateSignUpFlag,
    removeByEmail,
};
