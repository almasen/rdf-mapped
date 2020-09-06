const responses = require("./responses");

const sendValidationErrors = (validationResult, httpResponse) => {
    return httpResponse.status(400).send({
        message: "Input validation failed",
        errors: validationResult.errors,
    });
};

const sendResult = (result, httpResponse) => {
    return httpResponse.status(result.status)
        .send({message: result.message, data: result.data});
};

const sendGenericError = (error, httpResponse) => httpResponse.status(500).send({message: error.message});

const sendGenericSuccess = (httpResponse) => {
    httpResponse
        .status(responses.getGenericSuccess().status)
        .send({message: responses.getGenericSuccess().message});
};

const sendBuiltInError = (httpError, httpResponse) => httpResponse.status(httpError.status).send({message: httpError.message});

module.exports = {
    sendValidationErrors,
    sendResult,
    sendGenericError,
    sendBuiltInError,
    sendGenericSuccess,
};
