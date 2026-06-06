# AGENTS.md

Guidance for automated agents working in this repository.

## Don't make assumptions. If you don't know something, say so.

---

## What this is

`hotel-markdown` is a reference implementation: forms described in markdown, rendered by a single HTML file, submitted to a URL. No framework, no build step, no server.

The hotel is fake. The pattern is real. Use this repo as a starting point to build any form-driven application.

---

## The pattern

1. A form is a `.md` file. Headings are fields. Lists are attributes. Code blocks are CSS.
2. One HTML page (`index.html` + `renderer.js`) renders any form markdown file.
3. Submission POSTs to a URL. The response can be anything: a Lambda, an AI mock, a static 202.

---

## How to build a new application from this

Read the forms in `forms/booking/` for a multi-step flow example. Read `forms/contact.md` for a single form. Then:

1. Write your forms as markdown files following the same convention
2. Use the same renderer or write your own
3. Point `tube:` at your backend URL
4. Deploy as static files (GitHub Pages, S3 + CloudFront, anything)

The form markdown is the spec. It describes what fields exist, what they mean, and how they look. AI can read it to:
- Render the form (what the renderer does)
- Mock a backend (read the spec, improvise a response)
- Validate submissions (check if the data matches what the form describes)
- Generate new forms for a different domain

---

## Why markdown

- Readable by humans and AI without tooling
- Editable without breaking syntax
- Diffs are meaningful (line-oriented, one idea per line)
- Embeds real CSS and HTML natively (code blocks)
- No schema migrations when you add an exception or a note
- AI produces it reliably (no syntax errors possible)
- Fewer tokens than JSON for the same information

See: https://github.com/trsvax/theTube-content/blob/main/content/posts/2026/06/markdown-over-json.md

---

## Structure

```
forms/
  index.md              Form directory
  about.md              About page
  contact.md            Single form example
  booking/
    search.md           Multi-step: search → room → guest → payment → confirm
    room.md
    guest.md
    payment.md
    confirm.md
  journal/
    ai-mock-backend.md  Journal entry explaining the AI backend idea

index.html              The renderer (loads renderer.js)
renderer.js             Parses form markdown, builds HTML, handles submission
404.html                Fallback
```

---

## The contract

A form markdown file has:

- **Frontmatter** — `form:` name, `tube:` submit URL, `next:` next form in flow
- **Title** — `# heading` (the form's display name)
- **Description** — prose after the title (explains the form to humans and AI)
- **Global CSS** — a css code block before the fields (layout for the whole form)
- **Fields** — `## heading` per field, list items for attributes
- **Per-field CSS** — a css code block after a field's list items

The field name is the heading. The help text and placeholder carry the meaning. `type` is a rendering hint for the dumb parser (the renderer). AI doesn't need it.

---

## To use this as a seed

```
"Read hotel-markdown. Build me something like this for [your domain]."
```

That's it. AI reads the forms, sees the pattern, generates new forms for your domain. You iterate in markdown. Deploy as static files.

---

_Last updated: 2026-06-06_
