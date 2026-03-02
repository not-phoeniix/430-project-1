# Programming Language API Docs

<a href="docs.html">back to docs</a>

## /api/getAllRatings - `GET`, `HEAD`
Gets all stored rating data.

### Query Params
No supported params

### Returns
A JSON array of all ratings stored.

Format: `[{language: string, score: number, comment: string}]`

### Examples
**Request:** `/api/getAllRatings`

**Response:** `[{name: "exampleScript", year: 2026, ...}, {name: "awfulScript++", year: 1908, ...}, ...]`

