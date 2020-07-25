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

const sendGenericSuccess = (httpResponse) => httpResponse.status(200).send({message: "Success."});

const sendBuiltInError = (httpError, httpResponse) => httpResponse.status(httpError.status).send({message: httpError.message});

const sendErrorWithRedirect = (status, message, httpResponse, token, data) => {
    httpResponse.redirect("/error/?status=" + status + "&message=" + message + "&token=" + token + "&data=" + data);
};

/**
 * Send a built in error with redirection
 * @param {object} httpError a built in http error object in util/httpErrors
 * @param {object} httpResponse
 * @param {string} token for accessing the redirect route
 */
const sendBuiltInErrorWithRedirect = (httpError, httpResponse, token) => {
    sendErrorWithRedirect(httpError.status, httpError.message, httpResponse, token, JSON.stringify(httpError.data));
};

module.exports = {
    sendValidationErrors,
    sendResult,
    sendGenericError,
    sendBuiltInError,
    sendErrorWithRedirect,
    sendBuiltInErrorWithRedirect,
    sendGenericSuccess,
};
