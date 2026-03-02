const fs = require("fs");
const path = require("path");

const DOC_SRC = `${__dirname}/../docs/`;
const DOC_DST = `${__dirname}/../client/docs/`;

const HTML_BASE = (bodyInnerHtml, title) => `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>

<body>
${bodyInnerHtml}
</body>

</html>`;

/**
 * Replaces all inline markdown word-surrounding syntax
 * with their HTML tag counterparts (em, b, code)
 * @param {*} line MD line to format
 * @returns Newly formatted string
 */
function formatInline(line) {
    // regex matching hints acquired from:
    // https://stackoverflow.com/questions/68411373/regex-for-matching-predefined-rules-for-italic-text-formatting

    let formatted = line;

    // replace double asterisks with <b> tag
    formatted = formatted.replace(
        /(\*\*)((?![*\s])(?:[^*]+[^*\s])?)(\*\*)/g,
        "<b>$2</b>"
    );;

    // replace single asterisks with <em> tag
    formatted = formatted.replace(
        /(\*)((?![*\s])(?:[^*]+[^*\s])?)(\*)/g,
        "<em>$2</em>"
    );;

    // replace single asterisks with <em> tag
    formatted = formatted.replace(
        /(`)((?![`\s])(?:[^`]+[^`\s])?)(`)/g,
        "<code>$2</code>"
    );;

    return formatted;
}

/**
 * Converts a markdown string into an html string
 * @param {string} fileStr String of a read markdown file
 * @returns A formatted string of HTML text to be placed on the inside of a body tag
 */
function mdToHtml(fileStr) {
    const lines = fileStr.split("\n");
    let htmlConvert = "";

    // we have a buffer of text to allow us to queue text to be added 
    //   (this also allows multi-line text to be considered one paragraph)
    let textBuffer = [];
    let shouldFlushBuffer = false;
    let tagType = "p";

    // flushes everything in the buffer, adding 
    //   it to the htmlConvert string
    function flushBuffer(insertNewline) {
        let textToAdd = "";
        for (let i = 0; i < textBuffer.length; i++) {
            textToAdd += textBuffer[i].trim();
            if (i != textBuffer.length - 1) {
                textToAdd += " ";
            }
        }

        if (textToAdd) {
            // each line will be indented by 4 spaces and
            //   end with a newline
            htmlConvert += Array(4).fill(" ").join("");
            htmlConvert += `<${tagType}>${textToAdd}</${tagType}>`;
            if (insertNewline) htmlConvert += "\n";
        }

        textBuffer = [];
        tagType = "p";
        shouldFlushBuffer = false;
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // remove all spaces and tabs to check if a line is empty
        const isEmpty = line.replace(/[ ,\t]+/g, "") === "";
        const isFinalLine = i === lines.length - 1;

        if (line.startsWith("# ")) {
            // we flush any previous text when we get to a new header
            flushBuffer();

            textBuffer.push(line.substring(2));
            tagType = "h1";
            shouldFlushBuffer = true;

        } else if (line.startsWith("## ")) {
            // we flush any previous text when we get to a new header
            flushBuffer();

            textBuffer.push(line.substring(3));
            tagType = "h2";
            shouldFlushBuffer = true;

        } else if (line.startsWith("### ")) {
            // we flush any previous text when we get to a new header
            flushBuffer();

            textBuffer.push(line.substring(4));
            tagType = "h3";
            shouldFlushBuffer = true;

        } else {
            if (!isEmpty) {
                textBuffer.push(formatInline(line));
                tagType = "p";
            }

            if (isEmpty || isFinalLine) {
                shouldFlushBuffer = true;
            }
        }

        if (shouldFlushBuffer) {
            flushBuffer(!isFinalLine);
        }
    }

    return htmlConvert;
}

/**
 * Processes a markdown file and writes to a corresponding HTML file
 * @param {string} inFilePath Path of markdown file you'd like to read
 * @param {string} outFilePath Path of HTML file you'd like to write to
 */
function processFile(inFilePath, outFilePath) {
    const fileStats = fs.lstatSync(inFilePath);
    const fileName = path.basename(inFilePath);
    const extension = path.extname(fileName);

    // don't operate on non markdown files
    if (extension.toLowerCase() !== ".md" || !fileStats.isFile()) {
        return;
    }

    // file reading could crash so we'll toss it in a try/catch
    try {
        const fileStr = fs.readFileSync(inFilePath, "utf8");
        const title = fileName.replace(extension, "");
        const bodyInner = mdToHtml(fileStr);
        const htmlStr = HTML_BASE(bodyInner, title);
        fs.writeFileSync(outFilePath, htmlStr);
    } catch (err) {
        console.error(err);
    }
}

/**
 * Processes a directory, processing all markdown files inside (not recursive)
 * @param {*} dir Directory to process
 * @param {*} outDir Out directory to write HTML to
 */
function processDir(dir, outDir) {
    // ensure output dir exists before we write
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }

    // iterate across sub files & directories in current dir
    const subOptions = fs.readdirSync(dir);
    for (const file of subOptions) {
        const inPath = path.join(dir, file);
        const outPath = path.join(outDir, file).replace(/.md$/i, ".html");
        processFile(inPath, outPath);
    }
}

processDir(DOC_SRC, DOC_DST);
