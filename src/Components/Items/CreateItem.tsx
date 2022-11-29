import {
  H1,
  Stack,
  useDeskproAppTheme,
  Button,
  LoadingSpinner,
} from "@deskpro/app-sdk";
import { useForm } from "react-hook-form";
import { LabelButton, LabelButtonFileInput } from "@deskpro/deskpro-ui";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

import { Dropdown } from "../Dropdown";
import { RequiredInput } from "../RequiredInput";
import { useDeskpro } from "../../hooks/deskproContext";
import {
  getIterationList,
  getProcessList,
  getProjectByName,
  getProjectList,
  getUsersList,
  getWorkItemTypes,
  getWorkItemTypeStates,
} from "../../api/api";
import { IAzureWorkItemPost } from "../../types/azure/workItem";

import { workItemFields as workItemFieldsObj } from "../../utils/workItemFields";
import { useQueryWithClient } from "../../utils/query";

export const CreateItem = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IAzureWorkItemPost>();
  const [project, workItem, workItemTypeState, user, iteration] = watch([
    "System.TeamProject",
    "System.WorkItemType",
    "System.State",
    "System.AssignedTo",
    "System.IterationPath",
  ]).map((e) => e as string);

  useEffect(() => {
    register("System.TeamProject", { required: true });
    register("System.WorkItemType", { required: true });
  }, [register]);

  const { theme } = useDeskproAppTheme();
  const deskproData = useDeskpro();

  const projectList = useQueryWithClient(
    ["projectList", deskproData],
    (client) => getProjectList(client, deskproData?.settings || {}),
    {
      enabled: !!deskproData,
    }
  );

  const specificProject = useQueryWithClient(
    ["specificProject", deskproData, project],
    (client) => getProjectByName(client, deskproData?.settings || {}, project),
    {
      enabled: !!deskproData && !!project,
    }
  );

  const userList = useQueryWithClient(
    ["userList", deskproData],
    (client) => getUsersList(client, deskproData?.settings || {}),
    {
      enabled: !!deskproData,
    }
  );

  const processesList = useQueryWithClient(
    ["processesList", deskproData],
    (client) => getProcessList(client, deskproData?.settings || {}),
    { enabled: !!deskproData }
  );

  const process = processesList?.data?.value?.find(
    (process) =>
      process.name ===
      specificProject?.data?.value?.find(
        (project: { name: string; value: string }) =>
          project.name === "System.Process Template"
      )?.value
  );

  const workItemTypeList = useQueryWithClient(
    ["workItemTypeList", deskproData, process?.id],
    (client) =>
      getWorkItemTypes(
        client,
        deskproData?.settings || {},
        process?.id as unknown as string
      ),
    {
      enabled: !!deskproData && !!process?.id,
    }
  );

  const workItemFields =
    workItemFieldsObj?.[process?.name as "Agile" | "Scrum" | "Basic"]?.[
      workItemTypeList?.data?.value?.find(
        (workItemType) => workItemType.name === workItem?.split(".").at(-1)
      )?.name as "Task"
    ];

  const iterationList = useQueryWithClient(
    ["iterationList", deskproData, project],
    (client) => getIterationList(client, deskproData?.settings || {}, project),
    {
      enabled: !!deskproData && !!project,
    }
  );

  const workItemTypeStateList = useQueryWithClient(
    ["workItemTypeStateList", deskproData, process?.id, workItem],
    (client) =>
      getWorkItemTypeStates(
        client,
        deskproData?.settings || {},
        process?.id as unknown as string,
        workItem as string
      ),
    {
      enabled: !!deskproData && !!workItem && !!process?.id,
    }
  );
  //  try this for area https://{account}.visualstudio.com/{Project}/_apis/work/teamsettings/teamfieldvalues?api-version=4.1 https://developercommunity.visualstudio.com/t/rest-api-list-all-area-paths/283008
  const submit = (data: IAzureWorkItemPost) => {
    data;
  };

  if (projectList.isLoading || !projectList.isSuccess) {
    return (
      <Stack justify="center" style={{ width: "100%" }}>
        <LoadingSpinner />
      </Stack>
    );
  }
  const areBaseFieldsLoading = [
    userList,
    workItemTypeStateList,
    iterationList,
    processesList,
  ].some((query) => query.isLoading);

  const areBaseFieldsIdle = [
    userList,
    workItemTypeStateList,
    iterationList,
    processesList,
  ].some((query) => query.isIdle);

  return (
    <form style={{ width: "100%" }} onSubmit={handleSubmit(submit)}>
      <Stack vertical style={{ width: "100%" }} gap={12}>
        <Dropdown
          title="Project"
          data={projectList.data?.value}
          value={project}
          required
          onChange={(e) => setValue("System.TeamProject", e)}
          error={false}
          keyName="id"
          valueName="name"
        />
        {workItemTypeList.isIdle ? (
          <div></div>
        ) : workItemTypeList.isLoading ? (
          <Stack justify="center" style={{ width: "100%" }}>
            <LoadingSpinner />
          </Stack>
        ) : (
          <Stack vertical style={{ width: "100%" }} gap={12}>
            <Dropdown
              title="Work item" //epic, bug, issue etc..
              data={workItemTypeList.data?.value}
              value={workItem}
              required
              onChange={(e) => setValue("System.WorkItemType", e)}
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
                <Dropdown
                  title="Assignee"
                  data={userList.data?.value}
                  value={user}
                  onChange={(e) => setValue("System.AssignedTo", e)}
                  error={false}
                  keyName="descriptor"
                  valueName="displayName"
                />
                <Dropdown
                  title="State"
                  data={workItemTypeStateList.data?.value}
                  value={workItemTypeState}
                  onChange={(e) => setValue("System.State", e)}
                  error={false}
                  keyName="id"
                  valueName="name"
                />
                <Dropdown
                  title="Area"
                  data={[]}
                  value={""}
                  onChange={() => {}}
                  error={false}
                  keyName="id"
                  valueName="name"
                />
                <RequiredInput
                  error={Boolean(errors?.["System.Reason"])}
                  title="Reason"
                  register={register("System.Reason")}
                ></RequiredInput>
                <Dropdown
                  title="Iteration"
                  data={iterationList.data?.value}
                  value={iteration}
                  onChange={(e) => setValue("System.IterationPath", e)}
                  error={false}
                  keyName="id"
                  valueName="name"
                />
                {/* not working fix tags*/}
                <Stack vertical>
                  <div style={{ color: theme.colors.grey80 }}>
                    <H1>Tags</H1>
                  </div>
                  <LabelButton
                    style={{ padding: "0px" }}
                    icon={faPlus}
                    text="Add"
                    minimal
                  >
                    <LabelButtonFileInput
                      accept="image/jpeg, image/jpg, image/pjp, image/pjpeg"
                      onChange={(e) => e}
                    />
                  </LabelButton>
                </Stack>
                <Stack style={{ justifyContent: "space-between" }}>
                  <Button text="Create"></Button>
                  <Button text="Cancel" intent="secondary"></Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </form>
  );
};
