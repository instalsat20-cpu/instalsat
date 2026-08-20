const DIACRITICS = /[̀-ͯ]/g;

export function slugifyFilename(filename: string): string {
  const dotIndex = filename.lastIndexOf(".");
  const base = dotIndex > 0 ? filename.slice(0, dotIndex) : filename;

  const slug = base
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "arquivo";
}
