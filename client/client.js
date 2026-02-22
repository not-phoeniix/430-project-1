async function formFetch({ form, method, queryParams, bodyObj, callback }) {
    const url = form.getAttribute("action");
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
    const content = document.querySelector("#content");

    content.innerHTML = `<p><b>${res.statusText}</b></p>`;

    const txt = await res.text();
    console.log(`RESPONSE TEXT: ${txt}`);

    if (txt) {
        content.innerHTML += txt;

        // const data = JSON.parse(txt);

        // if (data.users) {
        //     content.innerHTML += `<p>${JSON.stringify(data.users)}</p>`;
        // }

        // if (data.message) {
        //     content.innerHTML += `<p>Message: ${data.message}</p>`;
        // }
    }
}

function fetchAllLanguages(form) {
    const method = form.querySelector(".method-select").value;
    formFetch({
        form,
        method,
        callback: handleResponse
    });
}

function searchLanguage(form) {
    const name = form.querySelector(".name-field").value;
    formFetch({
        form,
        queryParams: { name },
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

    bodyObj.paradigm = [];
    bodyObj.logo = "  ";


    // ~~~ send fetch ~~~

    // const bodyStr = JSON.stringify(bodyObj);

    // const url = form.getAttribute("action");
    // const method = form.getAttribute("method");

    // const res = await fetch(url, {
    //     method,
    //     body: bodyStr,
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Content-Length": bodyStr.length,
    //         "Accept": "application/json"
    //     },
    // });

    formFetch({
        form,
        queryParams: { name },
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
            name,
            rating: { score, comment }
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

    setupForm("#get-languages-form", fetchAllLanguages);
    setupForm("#search-language-form", searchLanguage);
    setupForm("#add-language-form", addLanguage);
    setupForm("#add-rating-form", addRating);
}

document.addEventListener("DOMContentLoaded", init);
