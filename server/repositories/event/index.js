const db = require("../../database");

const insert = (event) => {
    const query = "INSERT INTO event(name, address_id, women_only, spots, address_visible, minimum_age, " +
        "photo_id, physical, add_info, content, date, user_id, creation_date) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) " +
        "RETURNING *"; // returns passed event with it's id set to corresponding id in database
    const params = [event.name, event.addressId, event.womenOnly, event.spots, event.addressVisible,
        event.minimumAge, event.photoId, event.physical, event.addInfo, event.content, event.date, event.userId,
        event.creationDate,
    ];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT *, " +
        "ARRAY(SELECT user_id from sign_up " +
        "left join individual on id(individual) = individual_id where event_id = id(event)) as volunteers, " +
        "ARRAY(SELECT user_id from favourite "+
        "left join individual on id(individual) = individual_id where event_id = id(event)) as favourited, " +
        "ARRAY(SELECT cause_id from event_cause where event_id = id(event)) as causes " +
        "FROM event WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM event";
    return db.query(query);
};

const findAllByUserId = (userId) => {
    const query = "SELECT * FROM event WHERE user_id=$1";
    return db.query(query, [userId]);
};

const findAllByUserIdWithLocation = (userId) => {
    const query = "SELECT *, id(event) as id, " +
        "ARRAY(SELECT user_id from sign_up left join individual on id(individual) = individual_id " +
        "where event_id = id(event) and confirmed=true) as volunteers, " +
        "ARRAY(SELECT cause_id from event_cause where event_id = id(event)) " +
        "as causes FROM event LEFT JOIN address ON address_id = id(address) WHERE user_id=$1";
    return db.query(query, [userId]);
};

const findAllByUserIdLastMonth = (userId) => {
    const currentDateTime = new Date();
    currentDateTime.setDate(currentDateTime.getDate() - 30);
    const query = "SELECT * FROM event WHERE user_id=$1 AND creation_date>$2";
    return db.query(query, [userId, currentDateTime]);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM event WHERE user_id=$1 RETURNING *";
    return db.query(query, [userId]);
};

const removeById = (id) => {
    const query = "DELETE FROM event WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

const update = (event) => {
    const query = "UPDATE event SET name = $1, address_id = $2, women_only = $3, spots = $4, address_visible = $5, " +
        "minimum_age = $6, photo_id = $7, physical = $8, add_info = $9, content = $10, " +
        "date = $11, user_id = $12, creation_date = $13, picture_id = $14 WHERE id = $15" +
        "RETURNING *"; // returns passed event with it's id set to corresponding id in database
    const params = [event.name, event.addressId, event.womenOnly, event.spots, event.addressVisible,
        event.minimumAge, event.photoId, event.physical, event.addInfo, event.content, event.date, event.userId,
        event.creationDate, event.pictureId, event.id,
    ];
    return db.query(query, params);
};

const findAllWithAllData = (whereClause) => {
    whereClause = whereClause || ""; // if whereClause is not defined, default value is empty string
    const query = "SELECT id(event) as event_id,name,women_only,spots,address_visible,minimum_age,photo_id," +
        "physical,add_info,content,date,user_id as event_creator_id," +
        "address_1,address_2,postcode,city,region,lat,long,"+
        "ARRAY(SELECT user_id from sign_up " +
        "left join individual on id(individual) = individual_id where event_id = id(event)) as volunteers, " +
        "ARRAY(SELECT user_id from favourite "+
        "left join individual on id(individual) = individual_id where event_id = id(event)) as favourited, " +
        "ARRAY(SELECT cause_id from event_cause where event_id = id(event)) as causes " +
        "from event inner join address on id(address) = address_id" + whereClause;
    return db.query(query);
};

module.exports = {
    insert,
    findById,
    findAll,
    update,
    removeByUserId,
    findAllByUserId,
    findAllByUserIdLastMonth,
    findAllWithAllData,
    findAllByUserIdWithLocation,
    removeById,
};
