# Programming Language API Docs

<a href="docs.html">back to docs</a>

## /api/getAllLanguages - `GET`, `HEAD`
Gets all languages stored in the dataset.

### Query Params
No supported params

### Returns

A JSON array of all languages.

Format: `[{name: string, year: number, creator: string, paradigm: [string], typing: string, logo: string}]`

### Examples
**Request:** `/api/getAllLanguages`

**Response:** `[{name: "exampleScript", year: 2026, ...}, {name: "awfulScript++", year: 1908, ...}, ...]`
