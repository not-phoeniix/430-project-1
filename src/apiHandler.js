const data = require("./dataset.json");

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

function notFound(req, res) {
    const status = 404;
    const content = {
        message: "The page you are looking for was not found",
        id: "notFound"
    };

    respond(req, res, status, content);
}

function getAllLanguages(req, res) {
    const status = 200;
    respond(req, res, status, data.languages);
}

function getLanguage(req, res) {
    let content;
    let status;

    const { name } = req.query;

    const language = data.languages.find(lang => lang.name === name);
    if (!language) {
        content = {
            message: `Language "${name}" not found!`,
            id: "getLanguageNotFound"
        };
        status = 404;
    } else {
        content = language;
        status = 200;
    }

    respond(req, res, status, content);
}

function addLanguage(req, res, body) {
    const { name, year, creator, paradigm, typing, logo } = body;

    let content;
    let status;

    let missingArgs = [];
    if (!name) missingArgs.push("name");
    if (!year) missingArgs.push("year");
    if (!creator) missingArgs.push("creator");
    if (!paradigm) missingArgs.push("paradigm");
    if (!typing) missingArgs.push("typing");
    if (!logo) missingArgs.push("logo");

    if (missingArgs.length > 0) {
        content = {
            message: "Required parameters missing: " + JSON.stringify(missingArgs),
            id: "addLanguageMissingParams"
        };
        status = 400;
    } else {
        const existingIndex = data.languages.findIndex(lang => lang.name.toLowerCase() === name.toLowerCase());
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
    }

    respond(req, res, status, content);
}

module.exports = {
    notFound,
    getAllLanguages,
    getLanguage,
    addLanguage
}
