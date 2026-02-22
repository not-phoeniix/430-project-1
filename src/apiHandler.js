const data = require("./dataset.json");
data.ratings = [];

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
    respond(req, res, 404, {
        message: "The page you are looking for was not found",
        id: "notFound"
    });
}

/**
 * A GET response that responds with all currently stored 
 * language data, always uses code 200
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 */
function getAllLanguages(req, res) {
    respond(req, res, 200, data.languages);
}

/**
 * A GET response that responds with an array of the names 
 * of all currently stored languages, always uses code 200
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 */
function getAllLanguageNames(req, res) {
    respond(req, res, 200, data.languages.map(lang => lang.name));
}

/**
 * A GET response that searches dataset via the "name" query parameter 
 * (case insensitive) and responds with individual language data.
 * Responds with code 200 if found and 404 if not found.
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 */
function getLanguage(req, res) {
    const { name } = req.query;

    // ~~~ error checking ~~~

    if (!name) {
        respond(req, res, 400, {
            message: "Missing required query paramter: 'name'",
            id: "getLanguageInvalidParameters"
        });
        return;
    }

    // ~~~ data handling ~~~

    let content;
    let status;

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
 * A GET response that responds with all currently
 * stored rating data on all languages
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 */
function getAllRatings(req, res) {
    respond(req, res, 200, data.ratings);
}

/**
 * A GET response that searches dataset via the "language" query parameter
 * (case insensitive) and responds with individual rating data.
 * Responds with code 200 if found and 404 if not found.
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 */
function getRating(req, res) {
    const { language } = req.query;

    // ~~~ error checking ~~~

    if (!language) {
        respond(req, res, 400, {
            message: "Missing required query paramter: 'language'",
            id: "getRatingInvalidParameters"
        });
        return;
    }

    // ~~~ data handling ~~~

    let content;
    let status;

    const rating = data.ratings.find(
        (rating) => rating.language.toLowerCase() === language.toLowerCase()
    );
    if (!rating) {
        content = {
            message: `Rating for '${language}' not found!`,
            id: "getRatingNotFound"
        };
        status = 404;
    } else {
        content = rating;
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
    const { name, year, creator, paradigm, typing, logo } = body;

    // ~~~ error checking ~~~

    if (!checkAndRespondMissingParams(
        body,
        ["name", "year", "creator", "paradigm", "typing", "logo"],
        req,
        res,
        "addLanguageMissingParams"
    )) return;

    // ~~~ data handling ~~~

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
 * A POST response that adds a rating to the ratings portion of the data.
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 * @param {{
 *  name: string;
 *  score: number;
 *  comment: string;
 * }} body Request body from the client
 */
function addRating(req, res, body) {
    const { language, score, comment } = body;

    // ~~~ error checking ~~~

    if (!checkAndRespondMissingParams(
        body,
        ["language", "score", "comment"],
        req,
        res,
        "addRatingMissingParams"
    )) return;

    // ~~~ data handling ~~~

    let status;
    let content;

    const langObj = data.languages.find(
        (lang) => lang.name.toLowerCase() === language.toLowerCase()
    );

    if (!langObj) {
        content = {
            message: `Language '${language}' not found in dataset, cannot add rating!`,
            id: "addRatingLangNotFound"
        };
        status = 404;

    } else {
        const ratingIdx = data.ratings.findIndex(rating => rating.language === langObj.name);

        const newRatingData = {
            language: langObj.name,
            score,
            comment,
        };

        if (ratingIdx !== -1) {
            data.ratings[ratingIdx] = newRatingData;

            // no content when updating data
            status = 204;
        } else {
            data.ratings.push(newRatingData);

            content = {
                message: "Created successfully!"
            };
            status = 201;
        }
    }

    respond(req, res, status, content);
}

module.exports = {
    notFound,
    getAllLanguages,
    getAllLanguageNames,
    getLanguage,
    getAllRatings,
    getRating,
    addLanguage,
    addRating
}
