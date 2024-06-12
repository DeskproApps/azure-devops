import type { Maybe } from "../types";

const getError = (error?: Error): Maybe<string> => {
  if (!error?.message) {
    return null;
  }

  try {
    const parsedOne = JSON.parse(error?.message);
    const parsedTwo = JSON.parse(parsedOne?.message);
    return parsedTwo.message;

  } catch (e) {
    return null;
  }
};

export { getError };
