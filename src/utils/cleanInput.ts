import sanitizeHtml from "sanitize-html";

const cleanInput = (obj: Record<string, any>): Record<string, any> => {
  const clean: Record<string, any> = {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      clean[key] = sanitizeHtml(value, {
        allowedTags: [], 
        allowedAttributes: {}, 
      });
    } else {
      clean[key] = value;
    }
  }

  return clean;
};

export default cleanInput;
