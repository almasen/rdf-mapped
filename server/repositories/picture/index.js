const db = require("../../database");

// == PICTURE TABLE HANDLING == //

const insert = (picture) => {
    const query = "INSERT INTO picture(picture_location) VALUES ($1) RETURNING *";
    return db.query(query, [picture.pictureLocation]);
};

const findById = (id) => {
    const query = "SELECT * FROM picture WHERE id=$1";
    return db.query(query, [id]);
};

const findByUrl = (url) => {
    const query = "SELECT * FROM picture WHERE picture_location=$1";
    return db.query(query, [url]);
};

const update = (picture) => {
    const query = "UPDATE picture SET picture_location = $2 WHERE id = $1 RETURNING *";
    return db.query(query, [picture.id, picture.pictureLocation]);
};

const removeById = (id) => {
    const query = "DELETE FROM picture WHERE id=$1 RETURNING *";
    return db.query(query, [id]);
};

// == INDIVIDUALS == //

const getIndividualAvatar = (individual) => {
    const query =
        "SELECT p.picture_location FROM individual i " +
        "LEFT JOIN picture p ON p.id = i.picture_id " +
        "WHERE i.id = $1";
    const params = [
        individual.id,
    ];
    return db.query(query, params);
};

const updateIndividualAvatar = (individual, picture) => {
    const query =
        "UPDATE individual SET picture_id = $1 WHERE id = $2 " +
        "RETURNING *";
    const params = [
        picture.id,
        individual.id,
    ];
    return db.query(query, params);
};

// == Organisations == //

const getOrganisationAvatar = (organisation) => {
    const query =
        "SELECT p.picture_location FROM organisation o " +
        "LEFT JOIN picture p ON p.id = o.picture_id " +
        "WHERE o.id = $1 ";
    const params = [
        organisation.id,
    ];
    return db.query(query, params);
};

const updateOrganisationAvatar = (organisation, picture) => {
    const query =
        "UPDATE organisation SET picture_id = $1 WHERE id = $2 " +
        "RETURNING *";
    const params = [
        picture.id,
        organisation.id,
    ];
    return db.query(query, params);
};

// == Events == //

const getEventPicture = (event) => {
    const query =
        "SELECT p.picture_location FROM event e " +
        "LEFT JOIN picture p ON p.id = e.picture_id " +
        "WHERE e.id = $1 ";
    const params = [
        event.id,
    ];
    return db.query(query, params);
};

const updateEventPicture = (event, picture) => {
    const query =
        "UPDATE event SET picture_id = $1 WHERE id = $2 " +
        "RETURNING *";
    const params = [
        picture.id,
        event.id,
    ];
    return db.query(query, params);
};

module.exports = {
    insert,
    findById,
    findByUrl,
    update,
    removeById,

    getIndividualAvatar,
    updateIndividualAvatar,
    getOrganisationAvatar,
    updateOrganisationAvatar,
    getEventPicture,
    updateEventPicture,
};


