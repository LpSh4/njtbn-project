export const formatKeywords = (input = "") => {
    return input
        .toLowerCase()
        .replace(/[.,!?:;]/g, "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .join("+");
};