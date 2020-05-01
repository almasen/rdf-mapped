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

const alreadyAuth = {
    status: 200,
    message: "Request is already authenticated.",
    data: {
        alreadyAuthenticated: true,
    },
};

const getMissingVarInRequest = (varName) => {
    return {
        status: 400,
        message: "No " + varName + " specified in incoming request.",
    };
};

const getGenericSuccess = () => ({...genericSuccess});

const getUnauthorised = () => ({...unauthorised});

const getForbidden = () => ({...forbidden});

const getNotFound = () => ({...notFound});

const getIAmATeapot = () => ({...iAmATeapot});

const getAlreadyAuth = () => ({...alreadyAuth});

module.exports = {
    getGenericSuccess,
    getUnauthorised,
    getForbidden,
    getNotFound,
    getIAmATeapot,
    getAlreadyAuth,
    getMissingVarInRequest,
};
