import { ZodError } from "zod";

export const formatZodError = (error: ZodError) => {
  const formattedErrors: Record<string, any> = {};

  error.issues.forEach((issue) => {
    const path = issue.path;
    const message = issue.message;

    let current = formattedErrors;

    path.forEach((key, index) => {
      if (index === path.length - 1) {
        if (!current[key]) {
          current[key] = [];
        }
        current[key].push(message);
      } else {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    });
  });

  return formattedErrors
};
