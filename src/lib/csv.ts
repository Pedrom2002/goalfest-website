function escape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(rows: Record<string, unknown>[], headers: string[]): string {
  const headerLine = headers.map(escape).join(",");
  const lines = rows.map((row) => headers.map((h) => escape(row[h])).join(","));
  return [headerLine, ...lines].join("\r\n");
}
