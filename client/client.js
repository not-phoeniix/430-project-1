async function formFetch({ form, url, method, queryParams, bodyObj, callback }) {
    if (!url) url = form.getAttribute("action");
    if (!method) method = form.getAttribute("method");

    let queryAppend = "";
    if (queryParams) {
        queryAppend = "?";
        for (const param in queryParams) {
            const value = encodeURIComponent(queryParams[param]);
            queryAppend += `${param}=${value}`;
        }
    }

    let bodyStr = undefined;
    if (bodyObj) {
        bodyStr = JSON.stringify(bodyObj);
    }

    const requestData = { method };
    if (bodyStr) {
        requestData.body = bodyStr;
        requestData.headers = {
            "Content-Type": "application/json",
            "Content-Length": bodyStr.length,
            "Accept": "application/json"
        };
    }

    const res = await fetch(url + queryAppend, requestData);

    callback(res);
}

async function handleResponse(res) {
    const serverResponse = document.querySelector(".server-response");

    serverResponse.innerHTML = "";
    serverResponse.innerHTML += `Status: <b>${res.status}</b>`;
    serverResponse.innerHTML += "<br>";
    serverResponse.innerHTML += `Content-Length: <b>${res.headers.get("Content-Length")}</b>`;
    serverResponse.innerHTML += `<br><br>`;

    const txt = await res.text();
    console.log(`RESPONSE TEXT: ${txt}`);

    if (txt) {
        serverResponse.innerHTML += txt;
    }
}

function dataFetch(form) {
    const url = form.querySelector(".url-select").value;
    const method = form.querySelector(".method-select").value;
    formFetch({
        form,
        url,
        method,
        callback: handleResponse
    });
}

function dataSearch(form) {
    const [url, term] = form.querySelector(".url-select").value.split(";");
    const termValue = form.querySelector(".term-field").value;

    const queryParams = {};
    queryParams[term] = termValue;

    formFetch({
        form,
        url,
        queryParams,
        callback: handleResponse
    });
}

function addLanguage(form) {
    // ~~~ assemble body ~~~

    const bodyObj = {};

    const name = form.querySelector(".name-field").value;
    if (name) {
        bodyObj.name = name;
    }

    const year = form.querySelector(".year-field").value;
    if (year) {
        bodyObj.year = Number(year);
    }

    const creator = form.querySelector(".creator-field").value;
    if (creator) {
        bodyObj.creator = creator;
    }

    const typing = form.querySelector(".typing-select").value;
    if (typing) {
        bodyObj.typing = typing;
    }

    const paradigm = form.querySelector(".paradigm-field").value
    if (paradigm) {
        bodyObj.paradigm = paradigm.split(",").map(p => p.trim());
    }

    const logo = form.querySelector(".logo-field").value
    if (logo) {
        bodyObj.logo = logo;
    }

    formFetch({
        form,
        bodyObj,
        callback: handleResponse
    });
}

function addRating(form) {
    const name = form.querySelector(".name-field").value;
    const score = Number(form.querySelector(".rating-field").value);
    const comment = form.querySelector(".comment-field").value;

    formFetch({
        form,
        bodyObj: {
            language: name,
            score,
            comment
        },
        callback: handleResponse
    });
}

function init() {
    function setupForm(selector, callback) {
        const form = document.querySelector(selector);
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            callback(e.target);
            return false;
        });
    }

    setupForm("#get-data-form", dataFetch);
    setupForm("#search-data-form", dataSearch);
    setupForm("#add-language-form", addLanguage);
    setupForm("#add-rating-form", addRating);
}

document.addEventListener("DOMContentLoaded", init);
