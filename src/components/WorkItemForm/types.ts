import { z } from "zod";
import { defaultValidationSchema, requiredValidationSchema } from "./utils";
import type { Dict, Maybe } from "../../types";
import type {
  UseFormStateReturn,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";
import type {
  IAzureProject,
  IAzureWorkItem,
  IAzureWorkItemType,
  IAzureWorkItemInput,
  IAzureWorkItemTypeFields,
  IAzureWorkItemFieldsData,
} from "../../types/azure";

export type DefaultFormValidationSchema = z.infer<typeof defaultValidationSchema>;

export type RequiredValidationSchema = z.infer<typeof requiredValidationSchema>;

export type Props = {
  onSubmit: (
    project: IAzureProject["id"],
    workItemType: IAzureWorkItemType["id"],
    values: IAzureWorkItemInput[],
  ) => Promise<void>;
  onCancel?: () => void;
  error?: Maybe<string|string[]>;
  isEditMode?: boolean;
  workItem?: Maybe<IAzureWorkItem>;
  fields?: IAzureWorkItemTypeFields[];
  meta?: IAzureWorkItemFieldsData[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DynamicFieldProps<T extends Dict<any> = Dict<any>> = {
  field: IAzureWorkItemTypeFields;
  meta: IAzureWorkItemFieldsData;
  control: {
    field: ControllerRenderProps<T>,
    fieldState: ControllerFieldState,
    formState: UseFormStateReturn<T>,
  },
};
