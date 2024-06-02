import { get, map, find, filter, isNil } from "lodash";
import { Controller } from "react-hook-form";
import { DEFAULT_FIELDS, EXCLUDE_FIELDS } from "../constants";
import { mapFields } from "./mapFields";
import { Label } from "../../common";
import type { FC } from "react";
import type { Control } from "react-hook-form";
import type { IAzureWorkItemFieldsData, IAzureWorkItemTypeFields } from "../../../types/azure";
import type { RequiredValidationSchema } from "../types";

type Props = {
  control: Control<RequiredValidationSchema>,
  workItemTypeFields: IAzureWorkItemTypeFields[];
  workItemFieldsMeta: IAzureWorkItemFieldsData[];
};

const isDefault = (referenceName: string) => {
  return Object.values(DEFAULT_FIELDS).includes(referenceName)
};

const isExcluded = (referenceName: string) => {
  return EXCLUDE_FIELDS.includes(referenceName)
};

const DynamicFields: FC<Props> = ({ control, workItemFieldsMeta, workItemTypeFields }) => {
  const requiredFields = filter(workItemTypeFields, (field) => (
    field.alwaysRequired && !isDefault(field.referenceName) && !isExcluded(field.referenceName)
  ));
  const fields = map(requiredFields, (field) => {
    const meta = find(workItemFieldsMeta, { referenceName: field.referenceName });
    return { field, meta };
  });

  return (
    <>
      {fields.map(({ field, meta }) => {
        if (!field || !meta) {
          return null;
        }

        const FormField = mapFields(meta);

        if (isNil(FormField)) {
          // eslint-disable-next-line no-console
          console.warn(`Couldn't render field view, mapping missing for Azure DevOps field: ${get(field, ["referenceName"])}`);
          return null;
        }

        const formField = (
          <Controller
            name={field.referenceName as never}
            control={control}
            render={(formControl) => (
              <FormField field={field} meta={meta} control={formControl as never}/>
            )}
          />
        );

        return (
          <Label
            key={field.referenceName}
            id={field.referenceName}
            label={field.name}
          >
            {formField}
          </Label>
        );
      })}
    </>
  );
};

export { DynamicFields };
