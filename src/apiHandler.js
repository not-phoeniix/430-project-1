const data = require("./dataset.json");

/**
 * Sends an API response with JSON data
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 * @param {Number} status Status code for response message
 * @param {Object | undefined} content Optional content object to write in body of response
 */
function respond(req, res, status, content) {
    let str = undefined;
    if (content) {
        str = JSON.stringify(content);
    }

    res.writeHead(status, {
        "Content-Type": "application/json",
        "Content-Length": str ? Buffer.byteLength(str, "utf8") : 0
    });

    // HEAD requests, empty content, and update codes (204) don't get a response body
    if (str !== undefined && req.method !== "HEAD" && status !== 204) {
        res.write(str);
    }

    res.end();
}

/**
 * Checks if any required parameters in request body are missing. 
 * Responds with appropriate status code if any are missing.
 * @param {Object} body 
 * @param {string[]} requiredParams 
 * @param {Request} req 
 * @param {Response} res 
 * @param {string} id 
 * @returns True if all params are valid, false if not
 */
function checkAndRespondMissingParams(body, requiredParams, req, res, errorResponseId) {
    const missingParams = [];

    for (const param of requiredParams) {
        if (body[param] === undefined) {
            missingParams.push(param);
        }
    }

    if (missingParams.length > 0) {
        respond(req, res, 400, {
            message: "Required parameters missing: " + JSON.stringify(missingParams),
            id: errorResponseId
        });
        return false;
    }

    return true;
}

/**
 * Responds with a 404 not found message
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 */
function notFound(req, res) {
    const status = 404;
    const content = {
        message: "The page you are looking for was not found",
        id: "notFound"
    };

    respond(req, res, status, content);
}

/**
 * A GET response that responds with all currently stored 
 * language data, always uses code 200
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 */
function getAllLanguages(req, res) {
    const status = 200;
    respond(req, res, status, data.languages);
}

/**
 * A GET response that searches dataset via the "name" query parameter 
 * (case insensitive) and responds with individual language data.
 * Responds with code 200 if found and 404 if not found.
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 */
function getLanguage(req, res) {
    let content;
    let status;

    // TODO: add a 400 bad request status if name query parameter was never specified
    const { name } = req.query;

    const language = data.languages.find(
        (lang) => lang.name.toLowerCase() === name.toLowerCase()
    );
    if (!language) {
        content = {
            message: `Language '${name}' not found!`,
            id: "getLanguageNotFound"
        };
        status = 404;
    } else {
        content = language;
        status = 200;
    }

    respond(req, res, status, content);
}

/**
 * A POST response that adds/updates a language in the dataset.
 * Invalid arguments respond with 400, A new language responds 
 * with 201, and updating an old language responds with 204.
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 * @param {{
 *  name: string;
 *  year: number;
 *  creator: string;
 *  paradigm: string[];
 *  typing: string;
 *  logo: string;
 * }} body Request body from the client
 */
function addLanguage(req, res, body) {
    const paramsValid = checkAndRespondMissingParams(
        body,
        ["name", "year", "creator", "paradigm", "typing", "logo"],
        req,
        res,
        "addLanguageMissingParams"
    );
    if (!paramsValid) return;

    const { name, year, creator, paradigm, typing, logo } = body;

    let content;
    let status;

    const existingIndex = data.languages.findIndex(
        (lang) => lang.name.toLowerCase() === name.toLowerCase()
    );
    if (existingIndex === -1) {
        // add a new language to array
        data.languages.push({
            name,
            year,
            creator,
            paradigm,
            typing,
            logo
        });

        content = {
            message: "Created successfully!"
        };
        status = 201;

    } else {
        // overwrite data
        data.languages[existingIndex] = {
            ...data.languages[existingIndex],
            year,
            creator,
            paradigm,
            typing,
            logo
        };

        // just return a status code, there's no content
        status = 204;
    }

    respond(req, res, status, content);
}

/**
 * A POST response that adds a rating to a language in the dataset.
 * @param {Request} req 
 * @param {Response} res 
 * @param {{
 *  name: string;
 *  rating: {
 *    score: number;
 *    comment: string;
 *  }
 * }} body 
 */
function addRating(req, res, body) {
    let paramsValid = checkAndRespondMissingParams(
        body,
        ["name", "rating"],
        req,
        res,
        "addRatingMissingParams"
    );
    if (!paramsValid) return;

    const { name, rating } = body;

    let status;
    let content;

    const langIdx = data.languages.findIndex(
        (lang) => lang.name.toLowerCase() === name.toLowerCase()
    );

    if (langIdx === -1) {
        content = {
            message: `Language '${name}' not found, cannot add rating!`,
            id: "addRatingLangNotFound"
        };
        status = 404;

    } else {
        data.languages[langIdx].rating = {
            score: rating.score,
            comment: rating.comment
        };

        // no content when updating data
        status = 204;
    }

    respond(req, res, status, content);
}

module.exports = {
    notFound,
    getAllLanguages,
    getLanguage,
    addLanguage,
    addRating
}
