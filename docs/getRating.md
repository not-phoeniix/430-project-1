# Programming Language API Docs

<a href="docs.html">back to docs</a>

## /api/getRating - `GET`, `HEAD`
Gets the data of a specific rating.

### Query Params
`language` - Name of language to get rating for (case insensitive)

### Returns

A JSON object of a specific language's stored rating.

Format: `{language: string, score: number, comment: string}`

### Examples
**Request:** `/api/getRating?language=exampleScript`

**Response:** `{language: "exampleScript", score: 5, comment: "best language i've ever used :D"}`

<br>

**Request:** `/api/getRating`

**Response:** `400 Error (Missing "language" param)`

<br>

**Request:** `/api/getRating?language=couldntBeFound`

**Response:** `404 Error (Rating for language couldn't be found)`
