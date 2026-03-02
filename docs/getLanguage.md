# Programming Language API Docs

<a href="docs.html">back to docs</a>

## /api/getLanguage - `GET`, `HEAD`
Gets the data of a specific language.

### Query Params
`name` - Name of language to get data for (case insensitive)

### Returns
A JSON object of a specific language stored.

Format: `{name: string, year: number, creator: string, paradigm: [string], typing: string, logo: string}`

### Examples
**Request:** `/api/getLanguage?name=exampleScript`

**Response:** `{name: "exampleScript", year: 2026, ...}`

<br>

**Request:** `/api/getLanguage`

**Response:** `400 Error (Missing "name" param)`

<br>

**Request:** `/api/getLanguage?name=couldntBeFound`

**Response:** `404 Error (Language doens't exist)`
