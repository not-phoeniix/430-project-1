# Programming Language API Docs

<a href="docs.html">back to docs</a>

## /api/addRating - `POST`

### Body Params
`language: string` - The language to add the rating for

`score: number` - The score of the rating

`comment: string` - The detailed comment aspect of the rating

### Returns
A status code and a JSON object containing server info

Format: `{message: string, id?: string}`

### Examples
**Request:** `/api/addRating`

**Body:** `{language: "exampleScript", score: 5, comment: "best language i've ever used :D"}`

**Response:** `{message: "Created successfully!"}`

<br>

**Request:** `/api/addRating`

**Body:** `{language: "exampleScript"}`

**Response:** `400 Error: {message: "Required parameters missing: ['score', 'comment']", id: "addRatingMissingParams"}`

<br>

**Request:** `/api/addRating`

**Body:** `{language: "doesntExist", score: 0, comment: "this language doesnt exist in the dataset"}`

**Response:** `404 Error: {message: "Language 'doesntExist' not found in dataset, cannot add rating!", id: "addRatingLangNotFound"}`
