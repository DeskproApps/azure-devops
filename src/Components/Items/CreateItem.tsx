import {
  H1,
  Stack,
  useDeskproAppTheme,
  Button,
  LoadingSpinner,
  useDeskproAppClient,
  Input,
  useDeskproAppEvents,
  AnyIcon,
} from "@deskpro/app-sdk";
import { useForm, Resolver } from "react-hook-form";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, ResolverOptions } from "react-hook-form/dist/types";
import { Tag } from "@deskpro/deskpro-ui";
import { useNavigate } from "react-router-dom";

import { Dropdown } from "../Dropdown";
import { RequiredInput } from "../RequiredInput";
import { useDeskpro } from "../../hooks/deskproContext";
import {
  getIterationList,
  getProcessById,
  getProjectPropertiesById,
  getProjectList,
  getTeamFieldValues,
  getUsersList,
  getWorkItemTypeFields,
  getWorkItemFieldsData,
  getWorkItemTypes,
  postWorkItem,
} from "../../api/api";
import { IAzureWorkItemFields } from "../../types/azure/workItem";

import { workItemFields as workItemFieldsObj } from "../../utils/workItemFields";
import { useQueryWithClient } from "../../utils/query";
import { IAzureWorkItemFieldsSchema } from "../../schema/workItem";
import { colors, toDotList } from "../../utils/utils";
import { DateField } from "../DateField";

interface IMappedData {
  op: string;
  path: string;
  value: string;
  from: null;
}
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

export const CreateItem = () => {
  const navigate = useNavigate();

  const [tags, setTags] = useState<string[]>([]);
  const [tagText, setTagText] = useState<string>("");

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<IAzureWorkItemFields>({
    resolver: useCustomResolver,
  });

  const [project, workItem, user, iteration, areaPath] = watch([
    "System.TeamProject",
    "System.WorkItemType",
    "System.AssignedTo",
    "System.IterationPath",
    "System.AreaPath",
  ]);

  useEffect(() => {
    register("System.TeamProject", { required: true });
    register("System.WorkItemType", { required: true });
  }, [register]);

  const { client } = useDeskproAppClient();
  const { theme } = useDeskproAppTheme();
  const deskproData = useDeskpro();

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azureHomeButton":
          navigate("/redirect");
      }
    },
  });

  const projectList = useQueryWithClient(
    ["projectList", deskproData],
    (client) => getProjectList(client, deskproData?.settings || {}),
    {
      enabled: !!deskproData,
    }
  );

  const specificProject = useQueryWithClient(
    ["specificProject", deskproData, project],
    (client) =>
      getProjectPropertiesById(client, deskproData?.settings || {}, project),
    {
      enabled: !!deskproData && !!project,
    }
  );

  const specificProcess = useQueryWithClient(
    ["specificProcess", deskproData, specificProject],
    (client) =>
      getProcessById(
        client,
        deskproData?.settings || {},
        specificProject?.data?.value.find(
          (e) => e.name === "System.ProcessTemplateType"
        )?.value as string
      ),
    {
      enabled: !!deskproData && !!specificProject.isSuccess,
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
        (workItemType) => workItemType.id === workItem
      )?.name as "Task"
    ];

  const userList = useQueryWithClient(
    ["userList", deskproData],
    (client) => getUsersList(client, deskproData?.settings || {}),
    {
      enabled: !!deskproData && deskproData.settings.type === "cloud",
    }
  );

  const iterationList = useQueryWithClient(
    ["iterationList", deskproData, project],
    (client) => getIterationList(client, deskproData?.settings || {}, project),
    {
      enabled: !!deskproData && !!project,
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

    (
      mappedData.find(
        (e) => e.path === "/fields/System.TeamProject"
      ) as IMappedData
    ).value = projectList.data?.value.find((e) => e.id === project)
      ?.name as string;

    const newItem = await postWorkItem(
      client,
      deskproData.settings,
      project,
      data["System.WorkItemType"],
      mappedData
    );

    await client
      .getEntityAssociation("linkedAzureItems", deskproData.ticket.id)
      .set(newItem.id.toString());

    await client.setState(
      `azure/items/${newItem.id}`,
      (((
        await client.getState(`azure/items/${newItem.id}`)
      )[0]?.data as number) ?? 0) + 1
    );

    navigate(
      `/itemdetails?itemId=${newItem.id}&projectId=${
        (
          mappedData.find(
            (e) => e.path === "/fields/System.TeamProject"
          ) as IMappedData
        ).value
      }`
    );
  };

  const usedColorsTags = useMemo(() => {
    return new Array(tags.length)
      .fill(1)
      .map(() => colors[Math.floor(Math.random() * colors?.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  if (projectList.isLoading) {
    return (
      <Stack justify="center" style={{ width: "100%" }}>
        <LoadingSpinner />
      </Stack>
    );
  }

  const areInitialFieldsLoading = [
    workItemTypeList,
    specificProject,
    specificProcess,
  ].some((query) => query.isLoading);

  const areBaseFieldsLoading = [
    teamFieldValues,
    iterationList,
    specificProcess,
    workItemTypeFields,
    workItemFieldsData,
  ].some((query) => query.isLoading);

  const areBaseFieldsIdle = [
    iterationList,
    specificProcess,
    teamFieldValues,
    workItemTypeFields,
    workItemFieldsData,
  ].some((query) => query.isIdle);

  return (
    <form style={{ width: "100%" }} onSubmit={handleSubmit(submit)}>
      <Stack vertical style={{ width: "100%" }} gap={12}>
        <Dropdown
          title="Project"
          data={projectList.data?.value}
          value={project}
          required
          onChange={(e) =>
            setValue("System.TeamProject" as keyof IAzureWorkItemFields, e)
          }
          error={false}
          keyName="id"
          valueName="name"
        />
        {areInitialFieldsLoading ? (
          <Stack justify="center" style={{ width: "100%" }}>
            <LoadingSpinner />
          </Stack>
        ) : workItemTypeList.isIdle ? (
          <div></div>
        ) : (
          <Stack vertical style={{ width: "100%" }} gap={12}>
            <Dropdown
              title="Work item" //epic, bug, issue etc..
              data={workItemTypeList.data?.value}
              value={workItem}
              required
              onChange={(e) =>
                setValue("System.WorkItemType" as keyof IAzureWorkItemFields, e)
              }
              error={false}
              keyName="id"
              valueName="name"
            />
            {areBaseFieldsIdle ? (
              <div></div>
            ) : areBaseFieldsLoading ? (
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
                {deskproData?.settings.type === "cloud" && (
                  <Dropdown
                    title="Assignee"
                    data={userList.data?.value}
                    value={user}
                    onChange={(e) =>
                      setValue(
                        "System.AssignedTo" as keyof IAzureWorkItemFields,
                        e
                      )
                    }
                    error={false}
                    keyName="displayName"
                    valueName="displayName"
                  />
                )}
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
                              errors?.[
                                field.field as keyof IAzureWorkItemFields
                              ]
                            )}
                            {...register(
                              field.field as keyof IAzureWorkItemFields
                            )}
                            onChange={(e: [Date]) =>
                              setValue(
                                field.field as keyof IAzureWorkItemFields,
                                e[0].toISOString()
                              )
                            }
                          />
                        );
                      }
                      case "plainText":
                      case "integer":
                      case "double": {
                        return (
                          <RequiredInput
                            key={i}
                            title={field.name}
                            error={Boolean(
                              errors?.[
                                field.field as keyof IAzureWorkItemFields
                              ]
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
                          watch(
                            field.field as keyof IAzureWorkItemFields
                          ) as string
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
                  <Stack
                    vertical
                    style={{ color: theme.colors.grey80 }}
                    gap={5}
                  >
                    <H1>Tags</H1>
                    <Stack gap={5} style={{ flexWrap: "wrap" }}>
                      {tags.map((tag, i) => (
                        <Tag
                          closeIcon={faTimes as AnyIcon}
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
                  <Stack
                    gap={5}
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <Button
                      text="Add"
                      icon={faPlus as AnyIcon}
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
                    text={isSubmitting ? "Creating..." : "Create"}
                  ></Button>
                  <Button
                    text="Cancel"
                    onClick={() => navigate("/redirect")}
                    intent="secondary"
                  ></Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </form>
  );
};
