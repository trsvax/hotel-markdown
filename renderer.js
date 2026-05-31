// @ts-check
// renderer.js — parses form markdown, renders to DOM, wires submit to tube.
// One file. No dependencies. No build step.

(async function () {
  const app = document.getElementById("app");

  // Determine which form to load from URL path
  // Strip base path (GitHub Pages serves from /repo-name/)
  const base = (document.querySelector("base")?.getAttribute("href") || "/").replace(/\/$/, "");
  const raw = location.pathname.replace(/\/$/, "");
  const path = raw === base || raw === "" ? "forms/index" : raw.replace(base + "/", "");
  const mdPath = (path.endsWith(".md") ? path : path + ".md");

  // Fetch the markdown (relative URL — works with <base> tag)
  let md;
  try {
    const resp = await fetch(mdPath);
    if (!resp.ok) throw new Error(`${resp.status}`);
    md = await resp.text();
  } catch (err) {
    app.innerHTML = `<p>Form not found: <code>${mdPath}</code></p>`;
    return;
  }

  // Parse
  const form = parseFormMarkdown(md);
  render(form, app);
})();

/**
 * @typedef {object} FormField
 * @property {string} name
 * @property {string} type
 * @property {string} [area]
 * @property {boolean} [required]
 * @property {number} [min]
 * @property {number} [max]
 * @property {string} [placeholder]
 * @property {string} [help]
 * @property {string[]} [options]
 * @property {string} [default]
 * @property {number} [rows]
 * @property {string} [css]
 */

/**
 * @typedef {object} FormSpec
 * @property {string} title
 * @property {string} [description]
 * @property {string} [tube]
 * @property {string} [formName]
 * @property {string} [css]
 * @property {FormField[]} fields
 */

/**
 * Parse form markdown into a structured spec.
 * @param {string} md
 * @returns {FormSpec}
 */
function parseFormMarkdown(md) {
  // Split frontmatter
  const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const frontmatter = fmMatch ? parseFrontmatter(fmMatch[1]) : {};
  const body = fmMatch ? fmMatch[2] : md;

  // Extract title (first # heading)
  const titleMatch = body.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : "Form";

  // Extract description (text between title and first ## or ```)
  const afterTitle = body.slice((titleMatch?.index || 0) + (titleMatch?.[0]?.length || 0)).trim();
  const descEnd = afterTitle.search(/^(##|```)/m);
  const description = descEnd > 0 ? afterTitle.slice(0, descEnd).trim() : "";

  // Extract global CSS block (first ```css block before any ## field)
  const firstField = body.search(/^## /m);
  const preFields = firstField > 0 ? body.slice(0, firstField) : body;
  const globalCss = extractCss(preFields);

  // Parse fields (## headings)
  const fields = [];
  const fieldRegex = /^## (.+)$/gm;
  let match;
  const fieldStarts = [];

  while ((match = fieldRegex.exec(body)) !== null) {
    fieldStarts.push({ name: match[1], index: match.index + match[0].length });
  }

  for (let i = 0; i < fieldStarts.length; i++) {
    const start = fieldStarts[i].index;
    const end = i + 1 < fieldStarts.length ? fieldStarts[i + 1].index - fieldStarts[i + 1].name.length - 3 : body.length;
    const section = body.slice(start, end).trim();

    // Skip "layout" section
    if (fieldStarts[i].name.toLowerCase() === "layout") continue;

    const field = parseField(fieldStarts[i].name, section);
    if (field.type) fields.push(field);
  }

  return {
    title,
    description,
    tube: frontmatter.tube || "",
    formName: frontmatter.form || "",
    css: globalCss,
    fields,
  };
}

/**
 * Parse a field section.
 * @param {string} name
 * @param {string} section
 * @returns {FormField}
 */
function parseField(name, section) {
  const field = { name, type: "text" };
  const lines = section.split("\n");

  for (const line of lines) {
    const m = line.match(/^- (\w+):\s*(.+)$/);
    if (!m) continue;
    const [, key, value] = m;

    switch (key) {
      case "type": field.type = value; break;
      case "area": field.area = value; break;
      case "required": field.required = value === "true"; break;
      case "min": field.min = parseInt(value); break;
      case "max": field.max = parseInt(value); break;
      case "placeholder": field.placeholder = value; break;
      case "help": field.help = value; break;
      case "default": field.default = value; break;
      case "rows": field.rows = parseInt(value); break;
      case "options":
        field.options = value.replace(/[\[\]]/g, "").split(",").map(s => s.trim());
        break;
    }
  }

  field.css = extractCss(section);
  return field;
}

/**
 * Extract a ```css block from text.
 * @param {string} text
 * @returns {string}
 */
function extractCss(text) {
  const m = text.match(/```css\n([\s\S]*?)```/);
  return m ? m[1].trim() : "";
}

/**
 * Parse YAML-like frontmatter (simple key: value).
 * @param {string} text
 * @returns {Record<string, string>}
 */
function parseFrontmatter(text) {
  const result = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) result[m[1]] = m[2];
  }
  return result;
}

/**
 * Render the form spec into the DOM.
 * @param {FormSpec} spec
 * @param {HTMLElement} container
 */
function render(spec, container) {
  // If no fields, render as a simple page (index/sitemap)
  if (spec.fields.length === 0) {
    renderIndex(spec, container);
    return;
  }

  // Build style
  let css = spec.css || "";
  for (const field of spec.fields) {
    if (field.css) css += "\n" + field.css;
  }

  // Build HTML
  let html = "";
  if (css) html += `<style>${css}</style>`;
  html += `<h1>${spec.title}</h1>`;
  if (spec.description) html += `<p class="description">${spec.description}</p>`;

  html += `<form id="md-form" novalidate>`;

  for (const field of spec.fields) {
    const area = field.area ? ` style="grid-area: ${field.area}"` : "";
    html += `<div class="field field-${field.name}"${area}>`;
    html += `<label for="${field.name}">${field.name}</label>`;
    html += renderInput(field);
    if (field.help) html += `<div class="help">${field.help}</div>`;
    html += `<div class="error" id="error-${field.name}"></div>`;
    html += `</div>`;
  }

  html += `<div class="field" style="grid-area: submit"><button type="submit">Submit</button></div>`;
  html += `</form>`;

  container.innerHTML = html;

  // Wire submit
  document.getElementById("md-form").addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit(spec);
  });
}

/**
 * Render an input element for a field.
 * @param {FormField} field
 * @returns {string}
 */
function renderInput(field) {
  const req = field.required ? " required" : "";
  const ph = field.placeholder ? ` placeholder="${field.placeholder}"` : "";
  const max = field.max ? ` maxlength="${field.max}"` : "";
  const min = field.min ? ` minlength="${field.min}"` : "";

  switch (field.type) {
    case "textarea":
      const rows = field.rows || 4;
      return `<textarea id="${field.name}" name="${field.name}" rows="${rows}"${req}${ph}${min}${max}></textarea>`;

    case "select":
      let opts = (field.options || []).map(o =>
        `<option value="${o}"${o === field.default ? " selected" : ""}>${o}</option>`
      ).join("");
      return `<select id="${field.name}" name="${field.name}"${req}>${opts}</select>`;

    default:
      return `<input type="${field.type}" id="${field.name}" name="${field.name}"${req}${ph}${max}>`;
  }
}

/**
 * Handle form submission — POST to tube.
 * @param {FormSpec} spec
 */
async function handleSubmit(spec) {
  const form = document.getElementById("md-form");
  const data = Object.fromEntries(new FormData(form));

  // Validate
  let valid = true;
  for (const field of spec.fields) {
    const el = document.getElementById(`error-${field.name}`);
    const value = data[field.name] || "";

    if (field.required && !value) {
      el.textContent = `${field.name} is required`;
      el.style.display = "block";
      valid = false;
    } else if (field.min && value.length < field.min) {
      el.textContent = `At least ${field.min} characters`;
      el.style.display = "block";
      valid = false;
    } else {
      el.style.display = "none";
    }
  }

  if (!valid) return;

  // Submit to tube
  if (spec.tube) {
    try {
      const resp = await fetch(spec.tube, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (resp.ok || resp.status === 202) {
        const app = document.getElementById("app");
        app.innerHTML = `<div class="submitted"><h2>Noted.</h2><p>202</p></div>`;
      }
    } catch (err) {
      console.error("Submit failed:", err);
    }
  }
}

/**
 * Render an index/sitemap page from markdown with links.
 * @param {FormSpec} spec
 * @param {HTMLElement} container
 */
function renderIndex(spec, container) {
  let html = `<h1>${spec.title}</h1>`;
  if (spec.description) {
    // Parse inline links in description
    const desc = spec.description.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2">$1</a>'
    );
    html += `<p class="description">${desc}</p>`;
  }

  // Re-parse the raw markdown for ## headings and list items with links
  // We need the raw body — fetch it again from the parsed description area
  // Actually, let's just re-fetch and do a simple markdown-to-html for index pages
  const base2 = (document.querySelector("base")?.getAttribute("href") || "/").replace(/\/$/, "");
    const raw2 = location.pathname.replace(/\/$/, "");
    const p = raw2 === base2 || raw2 === "" ? "forms/index" : raw2.replace(base2 + "/", "");
    const mdPath = (p.endsWith(".md") ? p : p + ".md");
  fetch(mdPath).then(r => r.text()).then(md => {
    const body = md.replace(/^---[\s\S]*?---\n/, "");
    // Convert ## headings
    let rendered = body.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    // Convert links in list items
    rendered = rendered.replace(/^- \[([^\]]+)\]\(([^)]+)\)$/gm,
      '<li><a href="$2">$1</a></li>');
    // Wrap consecutive <li> in <ul>
    rendered = rendered.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");
    // Convert # heading
    rendered = rendered.replace(/^# (.+)$/m, "<h1>$1</h1>");
    // Convert inline links in paragraphs
    rendered = rendered.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    // Remove empty lines
    rendered = rendered.replace(/^\s*$/gm, "");

    container.innerHTML = `<style>
      ul { list-style: none; padding: 0; }
      li { margin: 0.5rem 0; }
      a { color: #2563eb; text-decoration: none; font-size: 1.1rem; }
      a:hover { text-decoration: underline; }
      h2 { margin-top: 2rem; margin-bottom: 0.5rem; color: #555; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
    </style>${rendered}`;
  });
}
