import { get, size } from "lodash";
import { getOption } from "./getOption";

const getOptions = <T>(items?: T[], key?: keyof T) => {
  if (!Array.isArray(items) || !size(items)) {
    return [];
  }

  return items.map((item) => {
    return getOption(get(item, ["id"]), get(item, [key || "name"]));
  });
};

export { getOptions };
