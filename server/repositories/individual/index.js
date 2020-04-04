const db = require("../../database");

const insert = (individual) => {
    const query = "INSERT INTO individual(firstname, lastname, phone, banned, " +
        "user_id, picture_id, address_id, birthday, gender) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)" +
        "RETURNING *"; // returns passed user with it's id set to corresponding id in database
    const params = [individual.firstname, individual.lastname, individual.phone,
        individual.banned, individual.userId, individual.pictureId,
        individual.addressId, individual.birthday, individual.gender,
    ];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM individual WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM individual";
    return db.query(query);
};

const findByUserID = (userId) => {
    const query = "SELECT * FROM individual WHERE user_id=$1";
    return db.query(query, [userId]);
};

const findFavouriteEvents = (userId) => {
    const query = "SELECT id(event) as event_id, name, women_only, spots, address_visible, " +
        "minimum_age, photo_id, physical, add_info, content, date, user_id(event) as event_creator_id, " +
        "address_1, address_2, postcode, city, region, lat, long, " +
        "event_id(favourite) is not null as favourited, " +
        "ARRAY(SELECT user_id from sign_up " +
        "left join individual on id(individual) = individual_id where event_id = id(event)) as volunteers " +
        "FROM event " +
        "LEFT JOIN favourite on event_id(favourite) = id(event) " +
        "INNER JOIN individual on individual_id(favourite) = id(individual) " +
        "INNER JOIN address ON id(address)=address_id(event) " +
        "WHERE user_id(individual)=$1";
    return db.query(query, [userId]);
};

const findGoingEvents = (userId) => {
    const now = new Date();
    const query = "SELECT id(event) as event_id, name, women_only, spots, address_visible, " +
        "minimum_age, photo_id, physical, add_info, content, date, user_id(event) as event_creator_id, " +
        "address_1, address_2, postcode, city, region, lat, long," +
        "ARRAY(SELECT user_id from favourite "+
        "left join individual on id(individual) = individual_id where event_id = id(event)) as favourited, " +
        "ARRAY(SELECT user_id from sign_up " +
        "left join individual on id(individual) = individual_id where event_id = id(event)) as volunteers " +
        "FROM event INNER JOIN sign_up on event_id(sign_up) = id(event) INNER JOIN address ON id(address) = address_id(event) " +
        "INNER JOIN individual ON individual_id(sign_up) = id(individual) " +
        "WHERE user_id(individual) = $1 and confirmed = true AND date >= $2";
    return db.query(query, [userId, now]);
};

const getIndividualId = (userId) =>{
    const query = "SELECT id from individual where user_id = $1";
    return db.query(query, [userId]);
};

const getIndividualLocation = (userId) => {
    const query = "select user_id, id(individual) as individual_id, lat,long "+
    "from individual inner join address on address_id = id(address) where user_id = $1";
    return db.query(query, [userId]);
};

const update = (individual) => {
    const query =
    "UPDATE individual SET firstname = $1, lastname = $2, phone = $3, banned = $4, " +
    "picture_id = $5, address_id = $6, birthday = $7, gender = $8 WHERE id = $9" +
    "RETURNING *"; // returns passed address with it's id set to corresponding id in database
    const params = [
        individual.firstname,
        individual.lastname,
        individual.phone,
        individual.banned,
        individual.pictureId,
        individual.addressId,
        individual.birthday,
        individual.gender,
        individual.id,
    ];
    return db.query(query, params);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM individual WHERE user_id=$1 RETURNING *";
    return db.query(query, [userId]);
};

module.exports = {
    insert,
    findById,
    findAll,
    findByUserID,
    findFavouriteEvents,
    findGoingEvents,
    update,
    getIndividualId,
    getIndividualLocation,
    removeByUserId,
};
