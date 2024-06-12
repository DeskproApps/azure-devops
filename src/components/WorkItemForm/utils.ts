import { createElement } from "react";
import { map, get, set, keys, find, reduce, isEmpty, forEach, isPlainObject } from "lodash";
import { P, match } from "ts-pattern";
import { z } from "zod";
import { Member } from "@deskpro/app-sdk";
import { toMarkdown, toHTML } from "../common/Markdown";
import { getOption, getRequiredFields } from "../../utils";
import type { Dict, Maybe } from "../../types";
import type {
  IAzureUser,
  IAzureWorkItem,
  IAzureIteration,
  IAzureFieldValues,
  IAzureWorkItemTypeFields,
  IAzureWorkItemFieldsData,
} from "../../types/azure";
import type { RequiredValidationSchema, DefaultFormValidationSchema } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeFormValues = (obj: object): Dict<any> => {
  const result: Dict<string> = {};

  if (!isPlainObject(obj) || Array.isArray(obj) || isEmpty(obj)) {
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recurse = (current: any, property: string) => {
    if (isPlainObject(current) && !Array.isArray(current)) {
      forEach(current, (value, key) => {
        const newKey = property ? `${property}.${key}` : key;
        recurse(value, newKey);
      });
    } else {
      result[property] = current;
    }
  };

  recurse(obj, "");

  return result;
};

const defaultValidationSchema = z.object({
  project: z.string().min(1),
  workItemType: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  assignee: z.string().optional(),
  state: z.string().optional(),
  area: z.string().optional(),
  iteration: z.string().optional(),
});

const requiredValidationSchema = z.object({});

const getDefaultInitValues = (
  workItem?: Maybe<IAzureWorkItem>,
): DefaultFormValidationSchema => {
  return {
    project: get(workItem, ["fields", "System.TeamProject"], ""),
    workItemType: get(workItem, ["fields", "System.WorkItemType"], ""),
    title: get(workItem, ["fields", "System.Title"], ""),
    description: toMarkdown(get(workItem, ["fields", "System.Description"], "")),
    assignee: get(workItem, ["fields", "System.AssignedTo", "uniqueName"], ""),
    state: get(workItem, ["fields", "System.State"], ""),
    area: get(workItem, ["fields", "System.AreaPath"], ""),
    iteration: get(workItem, ["fields", "System.IterationPath"], ""),
  };
};

const getDefaultValues = (
  values: DefaultFormValidationSchema,
) => {
  const realValues = {
    "System.Title": values.title,
    "System.Description": toHTML(values.description),
    "System.AssignedTo": values.assignee,
    "System.State": values.state,
    "System.AreaPath": values.area,
    "System.IterationPath": values.iteration,
  };

  return map(keys(realValues), (key) => ({
    op: "add",
    from: null,
    path: `/fields/${key}`,
    value: get(realValues, [key]),
  }));
};

const getRequiredInitValues = (
  workItem?: Maybe<IAzureWorkItem>,
  workItemTypeFields?: IAzureWorkItemTypeFields[],
  workItemFieldsMeta?: IAzureWorkItemFieldsData[],
) => {
  if (!workItem) {
    return {};
  }

  const requiredFields = getRequiredFields(workItemTypeFields || [], workItemFieldsMeta || []);

  const values = reduce(requiredFields, (acc, { field, meta }) => {
    const rawValue = get(workItem, ["fields", field.referenceName]);
    const value = match(meta)
      .with({ type: "boolean" }, () => Boolean(rawValue))
      .with({ type: "dateTime" }, () => new Date(rawValue))
      .with({ type: "string", isIdentity: true }, () => get(rawValue, ["uniqueName"], ""))
      .with(P.union(
        { type: "double", isPicklist: false },
        { type: "integer", isPicklist: false },
      ), () => Number(rawValue))
      .with(P.union(
        { type: "string", isPicklist: true },
        { type: "string", isPicklist: false },
        { type: "double", isPicklist: true },
        { type: "integer", isPicklist: true },
      ), () => rawValue)
      .with({ type: "html" }, () => toMarkdown(rawValue))
      .otherwise(() => null);

    set(acc, [field.referenceName], value);
    return acc;
  }, {});

  return values;
};

const getRequiredValues = (
  values: RequiredValidationSchema,
  workItemFieldsMeta: IAzureWorkItemFieldsData[],
) => {
  const realValues = normalizeFormValues(values);

  return map(keys(realValues), (key) => {
    const meta = find(workItemFieldsMeta, { referenceName: key });
    const rawValue = get(realValues, [key]);
    const value = match(meta)
      .with({ type: "html" }, () => toHTML(rawValue))
      .with({ type: "boolean" }, () => Boolean(rawValue))
      .with(P.union(
        { type: "double", isPicklist: false },
        { type: "integer", isPicklist: false },
      ), () => Number(rawValue))
      .otherwise(() => rawValue);

    return {
      op: "add",
      from: null,
      path: `/fields/${key}`,
      value,
    }
  });
};

const getProjectFromValues = (values: DefaultFormValidationSchema) => {
  return values.project;
};

const getWorkItemTypeFromValues = (values: DefaultFormValidationSchema) => {
  return values.workItemType;
};

const getAreaOptions = (items?: Maybe<IAzureFieldValues["values"]>) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return map(items, (i) => getOption(i.value, i.value));
};

const getUserOptions = (users?: IAzureUser[]) => {
  if (!Array.isArray(users)) {
    return [];
  }

  return users.filter(({ mailAddress }) => Boolean(mailAddress)).map((u) => {
    const user = createElement(Member, {
      key: u.descriptor,
      name: u.mailAddress || u.displayName,
      avatarUrl: get(u, ["_links", "avatar", "href"]),
    });

    return getOption(u.mailAddress, user, u.displayName);
  });
};

const getIterationOptions = (iterations?: IAzureIteration[]) => {
  if (!Array.isArray(iterations)) {
    return [];
  }

  return map(iterations, (i) => getOption(i.path, i.path));
};

export {
  getAreaOptions,
  getUserOptions,
  getDefaultValues,
  getRequiredValues,
  normalizeFormValues,
  getIterationOptions,
  getDefaultInitValues,
  getProjectFromValues,
  getRequiredInitValues,
  defaultValidationSchema,
  requiredValidationSchema,
  getWorkItemTypeFromValues,
};
