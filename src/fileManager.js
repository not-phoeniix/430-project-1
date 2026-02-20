const fs = require("fs");

const fileData = {};

function getMimeType(extension) {
    switch (extension.toLowerCase()) {
        case "js": return "application/js";
        case "html": return "text/html";
        case "css": return "text/css";
        default: return "text/plain";
    }
}

function addDir(dir, rootDir) {
    if (!rootDir) {
        rootDir = dir;
    }

    const options = fs.readdirSync(dir);
    for (const item of options) {
        const fullPath = `${dir}/${item}`;
        const stats = fs.lstatSync(fullPath);

        if (stats.isDirectory()) {
            addDir(fullPath, rootDir);
        } else {
            const split = item.split(".");
            const extension = split.length > 1
                ? split[split.length - 1]
                : null;

            const reqPath = fullPath.replace(rootDir, "");
            fileData[reqPath] = {
                file: fs.readFileSync(fullPath),
                extension,
                mimeType: getMimeType(extension)
            };
        }
    }
}

// preload all files recursively starting from client path
function init(clientPath) {
    addDir(clientPath);
}

function getFileData(requestPath) {
    return fileData[requestPath];
}

module.exports = {
    init,
    getFileData
};
