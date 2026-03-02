# Programming Language API Docs

<a href="docs.html">back to docs</a>

## /api/addLanguage - `POST`

### Body Params
`name: string` - The name of the language
`year: number` - The year of the language's creation
`creator : string` - The creator of the language
`paradigm: string` - A CSV string of all programming paradigms this language falls under
`typing: string` - Typing system of this language
`logo: string` - A link to a logo for this language

### Returns
A status code and a JSON object containing server info

Format: `{message: string, id?: string}`

### Examples
**Request:** `/api/addLanguage`

**Body:** `{name: "newScript", year: 2026, creator: "Your Name Here!", paradigm: "object-oriented,functional", typing: "dynamic", logo: "logo.com/logo.png"}`

**Response:** `{message: "Created successfully!"}`

<br>

**Request:** `/api/addRating`

**Body:** `{name: "newScript", year: 2026, creator: "Your Name Here!"}`

**Response:** `400 Error: {message: "Required parameters missing: ['paradigm', 'typing', 'logo']", id: "addLanguageMissingParams"}`
