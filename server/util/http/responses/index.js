const genericSuccess = {
    status: 200,
    message: "Success.",
};

const unauthorised = {
    status: 401,
    message: "Request is not authorised.",
};

const forbidden = {
    status: 403,
    message: "Invalid permissions.",
};

const notFound = {
    status: 404,
    message: "Requested endpoint is not found.",
};

const iAmATeapot = {
    status: 418,
    message: "I am a teapot.",
};

const getGenericSuccess = () => ({...genericSuccess});

const getUnauthorised = () => ({...unauthorised});

const getForbidden = () => ({...forbidden});

const getNotFound = () => ({...notFound});

const getIAmATeapot = () => ({...iAmATeapot});

module.exports = {
    getGenericSuccess,
    getUnauthorised,
    getForbidden,
    getNotFound,
    getIAmATeapot,
};
