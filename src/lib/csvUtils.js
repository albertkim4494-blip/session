/**
 * Lightweight RFC 4180 CSV parser/writer. No dependencies.
 */

/**
 * Parse CSV text into headers + rows.
 * Handles quoted fields, escaped quotes (""), newlines within quoted values,
 * UTF-8 BOM, and trailing blank lines.
 * @param {string} text - raw CSV text
 * @returns {{ headers: string[], rows: string[][] }}
 */
export function parseCSV(text) {
  // Strip UTF-8 BOM if present (common in Excel exports)
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          // Escaped quote
          field += '"';
          i += 2;
        } else {
          // End of quoted field
          inQuotes = false;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"' && field.length === 0) {
        inQuotes = true;
        i++;
      } else if (ch === ",") {
        row.push(field);
        field = "";
        i++;
      } else if (ch === "\r") {
        // Handle \r\n or bare \r
        row.push(field);
        field = "";
        // Skip blank rows (trailing newlines)
        if (row.length > 1 || row[0] !== "") rows.push(row);
        row = [];
        i++;
        if (i < text.length && text[i] === "\n") i++;
      } else if (ch === "\n") {
        row.push(field);
        field = "";
        // Skip blank rows (trailing newlines)
        if (row.length > 1 || row[0] !== "") rows.push(row);
        row = [];
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  // Last field/row
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.length > 1 || row[0] !== "") rows.push(row);
  }

  if (rows.length === 0) return { headers: [], rows: [] };

  const headers = rows[0];
  // Normalize row lengths to match header count
  const headerLen = headers.length;
  const dataRows = rows.slice(1).map((r) => {
    if (r.length < headerLen) return [...r, ...Array(headerLen - r.length).fill("")];
    if (r.length > headerLen) return r.slice(0, headerLen);
    return r;
  });
  return { headers, rows: dataRows };
}

/**
 * Generate RFC 4180 compliant CSV string.
 * @param {string[]} headers
 * @param {(string|number|null|undefined)[][]} rows
 * @returns {string}
 */
export function toCSV(headers, rows) {
  const escape = (val) => {
    const s = val == null ? "" : String(val);
    if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(row.map(escape).join(","));
  }
  return lines.join("\n");
}
