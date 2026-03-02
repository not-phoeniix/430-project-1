const fs = require("fs");
const { Errors } = require("./errorHandler.js");

function loadClientFile(file) {
    return fs.readFileSync(`${__dirname}/../client/${file}`);
}

const index = loadClientFile("client.html");
const style = loadClientFile("style.css");
const clientScript = loadClientFile("client.js");
const docFiles = {
    "/docs/docs.html": loadClientFile("docs/docs.html"),
    "/docs/addLanguage.html": loadClientFile("docs/addLanguage.html"),
    "/docs/addRating.html": loadClientFile("docs/addRating.html"),
    "/docs/getAllLanguageNames.html": loadClientFile("docs/getAllLanguageNames.html"),
    "/docs/getAllLanguages.html": loadClientFile("docs/getAllLanguages.html"),
    "/docs/getAllRatings.html": loadClientFile("docs/getAllRatings.html"),
    "/docs/getLanguage.html": loadClientFile("docs/getLanguage.html"),
    "/docs/getRating.html": loadClientFile("docs/getRating.html"),
};

function serveFile(req, res, content, mimetype) {
    res.writeHead(200, {
        "Content-Type": mimetype,
        "Content-Length": Buffer.byteLength(content, "utf8")
    });
    res.write(content);
    res.end();
}

function serveIndex(req, res) {
    serveFile(req, res, index, "text/html");
}

function serveDocs(req, res, file) {
    if (!docFiles[file]) {
        throw Errors.NOT_FOUND;
    }

    serveFile(req, res, docFiles[file], "text/html");
}

function serveStyle(req, res) {
    serveFile(req, res, style, "text/css");
}

function serveScript(req, res) {
    serveFile(req, res, clientScript, "application/javascript");
}

module.exports = {
    serveIndex,
    serveDocs,
    serveStyle,
    serveScript
};

