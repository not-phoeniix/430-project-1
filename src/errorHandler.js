const apiHandler = require("./apiHandler.js");

const Errors = Object.freeze({
    NOT_FOUND: {
        code: 404,
        message: "The page you are looking for was not found",
        id: "notFound"
    },
    INVALID_CONTENT_TYPE: {
        code: 415,
        message: "Content-Type in request header not supported by server!",
        id: "invalidContentType"
    },
    UNKNOWN_INTERNAL_ERROR: {
        code: 500,
        message: "Unknown internal server error",
        id: "unknownInternalError"
    }
});

function handleError(req, res, err) {
    let code = 500;
    let content = {
        message: Errors.UNKNOWN_INTERNAL_ERROR.message,
        id: Errors.UNKNOWN_INTERNAL_ERROR.id,
    };

    if (err && err.code !== undefined && err.message !== undefined && err.id !== undefined) {
        code = err.code;
        content = {
            message: err.message,
            id: err.id,
        };
    }

    apiHandler.respond(req, res, code, content);
}

module.exports = {
    Errors,
    handleError,
};
