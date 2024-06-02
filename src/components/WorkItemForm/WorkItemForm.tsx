import { useState, useEffect, useCallback } from "react";
import { has } from "lodash";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@deskpro/deskpro-ui";
import { Select } from "@deskpro/app-sdk";
import { useFormDeps } from "./hooks";
import {
  getDefaultValues,
  getRequiredValues,
  getDefaultInitValues,
  getProjectFromValues,
  defaultValidationSchema,
  getWorkItemTypeFromValues,
} from "./utils";
import { Input, Label, Button, TextArea, ErrorBlock } from "../common";
import { DynamicFields } from "./DynamicFields";
import type { FC } from "react";
import type { IAzureProject, IAzureState, IAzureUser, IAzureWorkItem } from "../../types/azure";
import type { Props, DefaultFormValidationSchema, RequiredValidationSchema } from "./types";

const WorkItemForm: FC<Props> = ({ error, onSubmit, onCancel, isEditMode }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const defaultForm = useForm<DefaultFormValidationSchema>({
    defaultValues: getDefaultInitValues(),
    resolver: zodResolver(defaultValidationSchema),
  });
  const requiredFieldsForm = useForm<RequiredValidationSchema>({
    defaultValues: {},
    shouldUnregister: true,
  });
  const projectId = defaultForm.watch("project");
  const workItemType = defaultForm.watch("workItemType");
  const {
    areaOptions,
    userOptions,
    stateOptions,
    projectOptions,
    iterationOptions,
    workItemTypeFields,
    workItemFieldsMeta,
    workItemTypeOptions,
  } = useFormDeps(projectId, workItemType);

  const onClickSubmit = useCallback(async () => {
    const isValid = await defaultForm.trigger();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    onSubmit(
      getProjectFromValues(defaultForm.getValues()),
      getWorkItemTypeFromValues(defaultForm.getValues()),
      [
        ...getDefaultValues(defaultForm.getValues()),
        ...getRequiredValues(requiredFieldsForm.getValues()),
      ]
    )
      .finally(() => setIsSubmitting(false));
  }, [onSubmit, defaultForm, requiredFieldsForm]);

  /* Reset workItemType if changed project */
  useEffect(() => {
    defaultForm.setValue("workItemType", "");
  }, [projectId, defaultForm]);

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} id="defaultForm">
        {error && <ErrorBlock text={error}/>}

        <Label htmlFor="project" label="Project" required>
          <Select
            id="project"
            initValue={defaultForm.watch("project")}
            options={projectOptions}
            error={has(defaultForm, ["formState", "errors", "project", "message"])}
            onChange={(value) => defaultForm.setValue("project", value as IAzureProject["id"])}
          />
        </Label>

        <Label htmlFor="workItemType" label="Work item" required>
          <Select
            id="workItemType"
            options={workItemTypeOptions}
            initValue={defaultForm.watch("workItemType")}
            error={has(defaultForm, ["formState", "errors", "workItemType", "message"])}
            onChange={(value) => defaultForm.setValue("workItemType", value as IAzureWorkItem["id"])}
          />
        </Label>

        <Label htmlFor="title" label="Title" required>
          <Input
            id="title"
            error={has(defaultForm.formState.errors, ["title", "message"])}
            value={defaultForm.watch("title")}
            {...defaultForm.register("title")}
          />
        </Label>

        <Label htmlFor="description" label="Description">
          <TextArea
            id="description"
            value={defaultForm.watch("description")}
            error={has(defaultForm, ["formState", "errors", "description", "message"])}
            {...defaultForm.register("description")}
          />
        </Label>

        <Label htmlFor="assignee" label="Assignee">
          <Select
            id="assignee"
            showInternalSearch
            options={userOptions}
            initValue={defaultForm.watch("assignee")}
            error={has(defaultForm, ["formState", "errors", "assignee", "message"])}
            onChange={(value) => defaultForm.setValue("assignee", value as IAzureUser["mailAddress"])}
          />
        </Label>

        <Label htmlFor="state" label="State">
          <Select
            id="state"
            options={stateOptions}
            initValue={defaultForm.watch("state")}
            error={has(defaultForm, ["formState", "errors", "state", "message"])}
            onChange={(value) => defaultForm.setValue("state", value as IAzureState["id"])}
          />
        </Label>

        <Label htmlFor="area" label="Area">
          <Select
            id="area"
            options={areaOptions}
            initValue={defaultForm.watch("area")}
            error={has(defaultForm, ["formState", "errors", "area", "message"])}
            onChange={(value) => defaultForm.setValue("area", value as IAzureState["id"])}
          />
        </Label>

        <Label htmlFor="iteration" label="Iteration">
          <Select
            id="iteration"
            options={iterationOptions}
            initValue={defaultForm.watch("iteration")}
            error={has(defaultForm, ["formState", "errors", "iteration", "message"])}
            onChange={(value) => defaultForm.setValue("iteration", value as IAzureState["id"])}
          />
        </Label>
      </form>

      <form onSubmit={(e) => e.preventDefault()} id="requiredFieldsForm">
        <DynamicFields
          control={requiredFieldsForm.control}
          workItemTypeFields={workItemTypeFields}
          workItemFieldsMeta={workItemFieldsMeta}
        />
      </form>

      <Stack justify="space-between">
        <Button
          type="button"
          text={isEditMode ? "Save" : "Create"}
          onClick={onClickSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
        />
        {onCancel && (
          <Button type="button" text="Cancel" intent="tertiary" onClick={onCancel}/>
        )}
      </Stack>
    </>
  );
};

export { WorkItemForm };
