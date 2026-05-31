# hotel-markdown

Forms as markdown. One HTML file renders them. No framework, no build step, no server.

**Live:** [blog.trsvax.com/hotel-markdown](http://blog.trsvax.com/hotel-markdown/)

## How it works

1. Write a form as a `.md` file (see `forms/contact.md`)
2. Push to this repo
3. The renderer (`index.html` + `renderer.js`) parses and renders it client-side

## The spec

A form markdown file has:

- **Frontmatter** — `form:` name, `tube:` submit URL
- **Title** — `# heading`
- **Description** — text after the title
- **Global CSS** — a ` ```css ` block before the fields
- **Fields** — `## heading` with list items for constraints
- **Per-field CSS** — a ` ```css ` block after the field's list items

## Field properties

| Property | Description |
|----------|-------------|
| type | text, email, textarea, select, number, tel, url |
| area | CSS grid-area name |
| required | true/false |
| min | minimum length |
| max | maximum length |
| placeholder | input placeholder |
| help | description shown below the field |
| options | [a, b, c] for select fields |
| default | default value |
| rows | textarea rows |

## Run locally

```bash
npx serve .
# open http://localhost:3000/forms/contact
```

## Deploy

Enable GitHub Pages on this repo. Forms are live at `https://yoursite/forms/contact`.

## Submit

Forms POST to the `tube:` URL in frontmatter as JSON. The tube returns 202 Noted.
