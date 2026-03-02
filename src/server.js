const http = require("http");
const query = require("querystring");
const clientHandler = require("./clientHandler.js");
const apiHandler = require("./apiHandler.js");
const { Errors, handleError } = require("./errorHandler.js");

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const routes = {
    "/": clientHandler.serveIndex,
    "/style.css": clientHandler.serveStyle,
    "/client.js": clientHandler.serveScript,
    "/api/getAllLanguages": apiHandler.getAllLanguages,
    "/api/getAllLanguageNames": apiHandler.getAllLanguageNames,
    "/api/getLanguage": apiHandler.getLanguage,
    "/api/getAllRatings": apiHandler.getAllRatings,
    "/api/getRating": apiHandler.getRating,
    "/api/addLanguage": apiHandler.addLanguage,
    "/api/addRating": apiHandler.addRating,
};

function getRoute(pathname) {
    let route;
    if (pathname.startsWith("/docs/")) {
        route = (req, res) => clientHandler.serveDocs(
            req,
            res,
            pathname
        );
    } else {
        route = routes[pathname];
    }

    return route;
}

/**
 * Takes an incoming request, collects and waits for all 
 * the data to be sent, and parses the body across many 
 * content types into a single JS object
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 */
function parseBody(req, res) {
    return new Promise((resolve, reject) => {
        if (req.method !== "POST") {
            console.error("ERROR: Body cannoy be parsed from a non-POST request!");
            return;
        }

        req.on("error", (err) => {
            console.dir(err);
            res.statusCode = 400;
            res.end();
        });

        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));

        req.on("end", () => {
            const bodyStr = Buffer.concat(chunks).toString();
            let body;

            const contentType = req.headers.get("Content-Type")
            switch (contentType) {
                case "application/json":
                    body = JSON.parse(bodyStr);
                    break;

                case "application/x-www-form-urlencoded":
                    body = query.parse(bodyStr);
                    break;

                default:
                    reject(Errors.INVALID_CONTENT_TYPE);
                    return;
            }

            resolve(body);
        });
    });
}

/**
 * Handler function for every time a request is recieved on the server
 * @param {Request} req Request from client
 * @param {Response} res Response to client
 */
async function onRequest(req, res) {
    const protocol = req.connection.encrypted ? "https" : "http";
    const url = new URL(req.url, `${protocol}://${req.headers.host}`);

    req.query = Object.fromEntries(url.searchParams);
    req.acceptedTypes = req.headers.Accept?.split(",") ?? [];

    const route = getRoute(url.pathname);
    if (!route) {
        handleError(req, res, Errors.NOT_FOUND);
        return;
    }

    try {
        if (req.method === "POST") {
            const body = await parseBody(req, res);
            route(req, res, body);
        } else {
            route(req, res);
        }
    } catch (err) {
        handleError(req, res, err);
    }
}

http.createServer(onRequest).listen(PORT, () => {
    console.log(`Listening on 127.0.0.1:${PORT}`);
});
