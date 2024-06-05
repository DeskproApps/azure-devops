import { get, size } from "lodash";
import { getOption } from "./getOption";

const getOptions = <T>(items?: T[], keyName?: keyof T, keyValue?: keyof T) => {
  if (!Array.isArray(items) || !size(items)) {
    return [];
  }

  return items.map((item) => {
    return getOption(get(item, [keyValue || "id"]), get(item, [keyName || "name"]));
  });
};

export { getOptions };
