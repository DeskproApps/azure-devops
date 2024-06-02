import { createElement } from "react";
import { map, get, keys, isEmpty, forEach, isPlainObject } from "lodash";
import { z } from "zod";
import { Member } from "@deskpro/app-sdk";
import { getOption } from "../../utils";
import type { Dict, Maybe } from "../../types";
import type { IAzureFieldValues, IAzureUser, IAzureIteration, IAzureState } from "../../types/azure";
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

const getDefaultInitValues = (): DefaultFormValidationSchema => {
  return {
    project: "",
    workItemType: "",
    title: "",
    description: "",
    assignee: "",
    state: "",
    area: "",
    iteration: "",
  };
};

const getDefaultValues = (
  values: DefaultFormValidationSchema,
) => {
  const realValues = {
    "System.Title": values.title,
    "System.Description": values.description,
    "System.AssignedTo": values.assignee,
    "System.State": values.state,
    "System.AreaPath": values.area,
    "System.IterationPath": values.iteration, // System.AreaPath\\System.IterationPath
  };

  return map(keys(realValues), (key) => ({
    op: "add",
    from: null,
    path: `/fields/${key}`,
    value: get(realValues, [key]),
  }));
};

const getRequiredValues = (
  values: RequiredValidationSchema,
) => {
  const realValues = normalizeFormValues(values);

  return map(keys(realValues), (key) => ({
    op: "add",
    from: null,
    path: `/fields/${key}`,
    value: get(realValues, [key]),
  }));
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

const getStateOptions = (states?: IAzureState[]) => {
  if (!Array.isArray(states)) {
    return [];
  }

  return map(states, (s) => getOption(s.name, s.name));
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
  getStateOptions,
  getDefaultValues,
  getRequiredValues,
  normalizeFormValues,
  getIterationOptions,
  getDefaultInitValues,
  getProjectFromValues,
  defaultValidationSchema,
  requiredValidationSchema,
  getWorkItemTypeFromValues,
};
