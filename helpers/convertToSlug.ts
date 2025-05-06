import unidecode from "unidecode";

export const convertToSlug = (text: string): string => {
  const unidecodeText = unidecode(text); // Chuyển tiếng Việt có dấu thành không dấu
  const slug = unidecodeText
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // Thay thế khoảng trắng bằng dấu "-"
    .replace(/[^a-z0-9\-]/g, "") // Loại bỏ ký tự đặc biệt
    .replace(/\-+/g, "-");      // Gộp nhiều dấu '-' liền nhau thành 1
  return slug;
};
