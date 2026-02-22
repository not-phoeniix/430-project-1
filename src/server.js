const http = require("http");
const clientHandler = require("./clientHandler.js");
const apiHandler = require("./apiHandler.js");

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
    notFound: apiHandler.notFound
};

function parseBody(req, res) {
    return new Promise((resolve) => {
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
            const body = JSON.parse(bodyStr);
            resolve(body);
        });
    });
}

async function onRequest(req, res) {
    const protocol = req.connection.encrypted ? "https" : "http";
    const url = new URL(req.url, `${protocol}://${req.headers.host}`);

    req.query = Object.fromEntries(url.searchParams);
    req.acceptedTypes = req.headers.Accept?.split(",") ?? [];

    const route = routes[url.pathname];
    if (!route) {
        routes.notFound(req, res);
    } else {
        if (req.method === "POST") {
            const body = await parseBody(req, res);
            route(req, res, body);
        } else {
            route(req, res);
        }
    }
}

http.createServer(onRequest).listen(PORT, () => {
    console.log(`Listening on 127.0.0.1:${PORT}`);
});
