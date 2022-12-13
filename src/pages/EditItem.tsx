import {
  H1,
  Stack,
  useDeskproAppTheme,
  Button,
  LoadingSpinner,
  useDeskproAppClient,
  Input,
  useInitialisedDeskproAppClient,
  useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useForm, Resolver } from "react-hook-form";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, ResolverOptions } from "react-hook-form/dist/types";
import { Tag } from "@deskpro/deskpro-ui";
import { useLocation, useNavigate } from "react-router-dom";

import { Dropdown } from "../Components/Dropdown";
import { RequiredInput } from "../Components/RequiredInput";
import { useDeskpro } from "../hooks/deskproContext";
import {
  getIterationList,
  getProcessById,
  getProjectPropertiesById,
  getTeamFieldValues,
  getUsersList,
  getWorkItemTypeFields,
  getWorkItemFieldsData,
  getWorkItemTypes,
  getWorkItemById,
  getProjectByName,
  editWorkItem,
} from "../api/api";
import { IAzureWorkItemFields, System } from "../types/azure/workItem";
import { workItemFields as workItemFieldsObj } from "../utils/workItemFields";
import { useQueryWithClient } from "../utils/query";
import { IAzureWorkItemFieldsSchema } from "../schema/workItem";
import { colors, toDotList } from "../utils/utils";
import { DateField } from "../Components/DateField";
import { IAzureProject } from "../types/azure/project";
// useForm does not export the types, even zodresolver is doing any any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useCustomResolver: Resolver<any, any> = (
  values: object,
  context: object,
  options: ResolverOptions<FieldValues>
) => {
  const dotList = toDotList(values);

  return zodResolver(IAzureWorkItemFieldsSchema)(dotList, context, options);
};

export const EditItem = () => {
  const navigate = useNavigate();

  const [tags, setTags] = useState<string[]>([]);
  const [tagText, setTagText] = useState<string>("");
  const search = useLocation().search;

  const [itemId, projectId] = [
    new URLSearchParams(search).get("itemId"),
    new URLSearchParams(search).get("projectId"),
  ];

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<IAzureWorkItemFields>({
    resolver: useCustomResolver,
  });

  const [project, workItem, user, iteration, areaPath, state] = watch([
    "System.TeamProject",
    "System.WorkItemType",
    "System.AssignedTo",
    "System.IterationPath",
    "System.AreaPath",
    "System.State",
  ]);

  useEffect(() => {
    register("System.TeamProject", { required: true });
    register("System.WorkItemType", { required: true });
  }, [register]);

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("azureEditButton");
    client.deregisterElement("azureMenuButton");
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azureHomeButton":
          navigate(`/redirect`);
          break;
      }
    },
  });

  const { client } = useDeskproAppClient();
  const { theme } = useDeskproAppTheme();
  const deskproData = useDeskpro();

  const fetchedProject = useQueryWithClient(
    ["fetchedProject", deskproData, projectId],
    (client) =>
      getProjectByName(
        client,
        deskproData?.settings || {},
        projectId as string
      ),
    {
      enabled: !!deskproData && !!projectId,
    }
  );

  const projectProperties = useQueryWithClient(
    ["projectProperties", deskproData, projectId],
    (client) =>
      getProjectPropertiesById(
        client,
        deskproData?.settings || {},
        (fetchedProject.data as IAzureProject).id
      ),
    {
      enabled: !!deskproData && !!fetchedProject.isSuccess,
    }
  );

  useQueryWithClient(
    ["item", deskproData],
    (client) =>
      getWorkItemById(
        client,
        deskproData?.settings || {},
        projectId as string,
        Number(itemId) as number
      ),
    {
      enabled: !!deskproData && !!itemId && !!projectId,
      onSuccess(data) {
        const obj: Partial<IAzureWorkItemFields> = {};

        const keys = Object.keys(
          data?.fields
        ) as (keyof IAzureWorkItemFields)[];

        if (!data?.fields) return;

        for (const key of keys) {
          //eslint-disable-next-line
          //@ts-ignore
          obj[key] = !isNaN(data.fields[key] as number)
            ? data.fields[key]?.toString()
            : data.fields[key];
        }

        delete obj["System.CommentCount"];
        delete obj["System.Reason"];

        reset({
          ...obj,
          "System.AssignedTo": (data?.fields["System.AssignedTo"]
            ?.displayName || "") as unknown as System,
        });

        setTags(data?.fields["System.Tags"]?.split(";") || []);
      },
    }
  );

  const specificProcess = useQueryWithClient(
    ["specificProcess", deskproData, projectProperties],
    (client) =>
      getProcessById(
        client,
        deskproData?.settings || {},
        projectProperties?.data?.value.find(
          (e) => e.name === "System.ProcessTemplateType"
        )?.value as string
      ),
    {
      enabled: !!deskproData && !!projectProperties.isSuccess,
    }
  );

  const workItemTypeList = useQueryWithClient(
    ["workItemTypeList", deskproData, specificProcess],
    (client) =>
      getWorkItemTypes(
        client,
        deskproData?.settings || {},
        specificProcess.data?.typeId as string
      ),
    {
      enabled: !!deskproData && !!specificProcess.isSuccess,
    }
  );

  const workItemFields =
    workItemFieldsObj?.[
      specificProcess.data?.name as "Agile" | "Scrum" | "Basic"
    ]?.[
      workItemTypeList?.data?.value?.find(
        (workItemType) => workItemType.name === workItem
      )?.name as "Task"
    ];

  const userList = useQueryWithClient(
    ["userList", deskproData],
    (client) => getUsersList(client, deskproData?.settings || {}),
    {
      enabled: !!deskproData,
    }
  );

  const iterationList = useQueryWithClient(
    ["iterationList", deskproData, project],
    (client) => getIterationList(client, deskproData?.settings || {}, project),
    {
      enabled: !!deskproData && !!project,
      onSuccess(data) {
        setValue(
          "System.IterationPath",
          data.value[0].name as unknown as never
        );
      },
    }
  );

  const workItemFieldsData = useQueryWithClient(
    ["workItemFieldsData", deskproData, project],
    (client) =>
      getWorkItemFieldsData(client, deskproData?.settings || {}, project),
    {
      enabled: !!deskproData && !!project,
    }
  );

  const teamFieldValues = useQueryWithClient(
    ["teamFieldValues", deskproData, project],
    (client) =>
      getTeamFieldValues(client, deskproData?.settings || {}, project),
    {
      enabled: !!deskproData && !!project,
    }
  );

  const workItemTypeFields = useQueryWithClient(
    ["workItemTypeFields", deskproData, project, workItem],
    (client) =>
      getWorkItemTypeFields(
        client,
        deskproData?.settings || {},
        project,
        workItem
      ),
    {
      enabled: !!deskproData && !!project && !!workItem,
    }
  );

  const submit = async (data: IAzureWorkItemFields) => {
    if (!client || !deskproData) return;

    const mappedData = Object.entries(
      toDotList({ ...data, "System.Tags": tags.join("; ") })
    )
      .filter((e) => e[1])
      .map((e) => ({
        op: "add",
        path: "/fields/" + e[0],
        value: e[1] as string,
        from: null,
      }));

    await editWorkItem(
      client,
      deskproData.settings,
      project,
      itemId as string,
      mappedData
    );

    navigate(-1);
  };

  const usedColorsTags = useMemo(() => {
    return new Array(tags.length)
      .fill(1)
      .map(() => colors[Math.floor(Math.random() * colors?.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  const areBaseFieldsLoading = [
    workItemTypeList,
    projectProperties,
    specificProcess,
    teamFieldValues,
    userList,
    iterationList,
    specificProcess,
    workItemTypeFields,
    workItemFieldsData,
  ].some((query) => query.isLoading);

  const [states] = ["System.State"].map((e) => {
    return workItemTypeFields.data?.value
      ?.find((f) => f.referenceName === e)
      ?.allowedValues.map((f) => ({
        name: f,
      }));
  });

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Stack vertical style={{ width: "100%" }} gap={12}>
        {areBaseFieldsLoading ? (
          <Stack justify="center" style={{ width: "100%" }}>
            <LoadingSpinner />
          </Stack>
        ) : (
          <Stack vertical style={{ width: "100%" }} gap={12}>
            <RequiredInput
              title="Title"
              required
              error={Boolean(errors?.["System.Title"])}
              register={register("System.Title", { required: true })}
            ></RequiredInput>
            <Dropdown
              title="Assignee"
              data={userList.data?.value}
              value={user}
              onChange={(e) =>
                setValue("System.AssignedTo" as keyof IAzureWorkItemFields, e)
              }
              error={false}
              keyName="displayName"
              valueName="displayName"
            />
            <Dropdown
              title="Area"
              data={teamFieldValues.data?.values}
              value={areaPath}
              onChange={(e) =>
                setValue("System.AreaPath" as keyof IAzureWorkItemFields, e)
              }
              error={false}
              keyName="value"
              valueName="value"
            />
            <Dropdown
              title="State"
              data={states}
              value={state}
              onChange={(e) =>
                setValue("System.State" as keyof IAzureWorkItemFields, e)
              }
              error={false}
              keyName="name"
              valueName="name"
            />
            <Dropdown
              title="Iteration"
              data={iterationList.data?.value}
              value={iteration}
              onChange={(e) =>
                setValue(
                  "System.IterationPath" as keyof IAzureWorkItemFields,
                  e
                )
              }
              error={false}
              keyName="name"
              valueName="name"
            />
            {workItemFields?.map((field, i) => {
              const fieldData = workItemTypeFields.data?.value?.find(
                (e) => e.referenceName === field.field
              );

              if (!fieldData) return <div></div>;

              if (fieldData?.allowedValues.length === 0) {
                const fieldType = workItemFieldsData.data?.value.find(
                  (fieldData) => fieldData.referenceName === field.field
                )?.type;
                switch (fieldType) {
                  case "dateTime": {
                    return (
                      <DateField
                        key={i}
                        label={field.name}
                        error={Boolean(
                          errors?.[field.field as keyof IAzureWorkItemFields]
                        )}
                        value={watch(field.field as keyof IAzureWorkItemFields)}
                        {...register(field.field as keyof IAzureWorkItemFields)}
                        onChange={(e: [Date]) =>
                          setValue(
                            field.field as keyof IAzureWorkItemFields,
                            e[0].toISOString()
                          )
                        }
                      />
                    );
                  }
                  case "html":
                    return;
                  case "plainText":
                  case "integer":
                  case "double": {
                    return (
                      <RequiredInput
                        key={i}
                        title={field.name}
                        error={Boolean(
                          errors?.[field.field as keyof IAzureWorkItemFields]
                        )}
                        register={register(
                          field.field as keyof IAzureWorkItemFields
                        )}
                        type={
                          ["integer", "double"].includes(fieldType)
                            ? "number"
                            : "title"
                        }
                      />
                    );
                  }
                }
                return (
                  <RequiredInput
                    key={i}
                    title={field.name}
                    error={Boolean(
                      errors?.[field.field as keyof IAzureWorkItemFields]
                    )}
                    register={register(
                      field.field as keyof IAzureWorkItemFields
                    )}
                  ></RequiredInput>
                );
              } else {
                return (
                  <Dropdown
                    key={i}
                    title={field.name}
                    data={fieldData.allowedValues.map((e) => ({ name: e }))}
                    value={
                      watch(field.field as keyof IAzureWorkItemFields) as string
                    }
                    onChange={(e) =>
                      setValue(field.field as keyof IAzureWorkItemFields, e)
                    }
                    error={false}
                    keyName="name"
                    valueName="name"
                  />
                );
              }
            })}
            {/* not working fix tags*/}
            <Stack vertical style={{ width: "100%" }}>
              <Stack vertical style={{ color: theme.colors.grey80 }} gap={5}>
                <H1>Tags</H1>
                <Stack gap={5} style={{ flexWrap: "wrap" }}>
                  {tags.map((tag, i) => (
                    <Tag
                      closeIcon={faTimes}
                      color={usedColorsTags[i]}
                      onCloseClick={() =>
                        setTags((prev) => prev.filter((e) => e !== tag))
                      }
                      label={tag}
                      key={i}
                      withClose
                    ></Tag>
                  ))}
                </Stack>
              </Stack>
              <Stack gap={5} style={{ width: "100%", alignItems: "center" }}>
                <Button
                  text="Add"
                  icon={faPlus}
                  minimal
                  onClick={() => {
                    if (!tagText) return;

                    setTags([...tags, tagText]);
                    setTagText("");
                  }}
                  style={{
                    width: "30%",
                    borderBottom: `1px solid ${theme.colors.grey20}`,
                  }}
                />
                <Input
                  value={tagText}
                  onChange={(e) => setTagText(e.target.value)}
                  variant="inline"
                  placeholder="Enter value"
                  style={{
                    marginBottom: "5px",
                  }}
                />
              </Stack>
            </Stack>
            <Stack
              style={{ justifyContent: "space-between", width: "100%" }}
              gap={5}
            >
              <Button
                type="submit"
                text={isSubmitting ? "Saving..." : "Save"}
              ></Button>
              <Button
                text="Cancel"
                onClick={() => navigate(-1)}
                intent="secondary"
              ></Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </form>
  );
};
