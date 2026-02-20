async function handleResponse(res) {
    const content = document.querySelector("#content");

    switch (res.status) {
        case 200:
            content.innerHTML = "<p><b>Success!</b></p>"
            break;
        case 201:
            content.innerHTML = "<p><b>Created!</b></p>"
            break;
        case 204:
            content.innerHTML = "<p><b>Updated! (no content)</b></p>";
            break;
        case 400:
            content.innerHTML = "<p><b>Bad request!</b></p>";
            break;
        case 404:
            content.innerHTML = "<p><b>Not found!</b></p>";
            break;
        default:
            content.innerHTML = `<p><b>Error code ${res.status} not implemented by client!</b></p>`;
            break;
    }

    const txt = await res.text();
    console.log(`RESPONSE TEXT: ${txt}`);

    if (txt) {
        content.innerHTML = txt;

        // const data = JSON.parse(txt);

        // if (data.users) {
        //     content.innerHTML += `<p>${JSON.stringify(data.users)}</p>`;
        // }

        // if (data.message) {
        //     content.innerHTML += `<p>Message: ${data.message}</p>`;
        // }
    }
}

async function fetchLanguages(e) {
    const url = document.querySelector("#url-field").value;
    const method = document.querySelector("#method-select").value;

    const res = await fetch(url, { method });

    handleResponse(res);
}

async function searchLanguage(e) {
    const url = e.target.getAttribute("action");
    const method = e.target.getAttribute("method");

    const name = document.querySelector("#language-name-textbox").value;

    const res = await fetch(url + `?name=${name}`, { method });

    handleResponse(res);
}

// async function addUser(e) {
//     // ~~~ assemble body ~~~

//     const bodyObj = {};

//     const name = document.querySelector("#nameField").value;
//     if (name) {
//         bodyObj.name = name;
//     }

//     const age = document.querySelector("#ageField").value;
//     if (age) {
//         bodyObj.age = Number(age);
//     }

//     const bodyStr = JSON.stringify(bodyObj);

//     // ~~~ send fetch ~~~

//     const url = e.target.getAttribute("action");
//     const method = e.target.getAttribute("method");

//     const res = await fetch(url, {
//         method,
//         body: bodyStr,
//         headers: {
//             "Content-Type": "application/json",
//             "Content-Length": bodyStr.length,
//             "Accept": "application/json"
//         },
//     });

//     handleResponse(res);
// }

function init() {
    const languageForm = document.querySelector("#get-languages-form");
    languageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        fetchLanguages(e);
        return false;
    });

    const languageSearchForm = document.querySelector("#search-language-form");
    languageSearchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        searchLanguage(e);
        return false;
    });

    // const userForm = document.querySelector("#userForm");
    // userForm.addEventListener("submit", (e) => {
    //     e.preventDefault();
    //     fetchUsers(e);
    //     return false;
    // });
}

document.addEventListener("DOMContentLoaded", init);
