import { map, find, filter } from "lodash";
import { DEFAULT_FIELDS, EXCLUDE_FIELDS } from "../constants";
import type {
  IAzureWorkItemFieldsData,
  IAzureWorkItemTypeFields,
} from "../types/azure";

const isDefault = (referenceName: string) => {
  return Object.values(DEFAULT_FIELDS).includes(referenceName)
};

const isExcluded = (referenceName: string) => {
  return EXCLUDE_FIELDS.includes(referenceName)
};

const filterRequiredFields = (field: IAzureWorkItemTypeFields): boolean => {
  return field.alwaysRequired && !isDefault(field.referenceName) && !isExcluded(field.referenceName)
};

const getRequiredFields = (
  workItemTypeFields: IAzureWorkItemTypeFields[],
  workItemFieldsMeta: IAzureWorkItemFieldsData[],
): Array<{
  field: IAzureWorkItemTypeFields;
  meta: IAzureWorkItemFieldsData;
}> => {
  const requiredFields = filter(workItemTypeFields, filterRequiredFields);

  return map(requiredFields, (field) => {
    const meta = find(workItemFieldsMeta, { referenceName: field.referenceName }) as IAzureWorkItemFieldsData;
    return { field, meta };
  });
};

export { getRequiredFields };
