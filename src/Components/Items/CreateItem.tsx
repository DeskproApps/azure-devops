// import {
//   H1,
//   Stack,
//   useDeskproAppTheme,
//   Button,
//   LoadingSpinner,
// } from "@deskpro/app-sdk";
// import { useForm } from "react-hook-form";
// import { LabelButton, LabelButtonFileInput } from "@deskpro/deskpro-ui";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import { useEffect } from "react";

// import { Dropdown } from "../Dropdown";
// import { RequiredInput } from "../RequiredInput";
// import { useDeskpro } from "../../hooks/deskproContext";
// import {
//   getIterationList,
//   getProcessList,
//   getProjectById,
//   getProjectList,
//   getUsersList,
//   getWorkItemTypes,
//   getWorkItemTypeStates,
// } from "../../api/api";
// import { IAzureProject } from "../../types/azure/project";
// import {
//   IAzureWorkItemPost,
//   IAzureWorkItemType,
// } from "../../types/azure/workItem";
// import { IAzureResponse } from "../../types/azure/azure";
// import { IAzureUser } from "../../types/azure/user";
// import { IAzureIteration } from "../../types/azure/iteration";
// import { workItemFields as workItemFieldsObj } from "../../utils/workItemFields";
// import { useQueryWithClient } from "../../utils/query";
// import { defaultInitialData } from "../../utils/utils";

export const CreateItem = () => {
  return <div></div>;
  // const {
  //   handleSubmit,
  //   register,
  //   formState: { errors },
  //   setValue,
  //   watch,
  // } = useForm<IAzureWorkItemPost>();
  // const [project, workItem, workItemTypeState, user, iteration] = watch([
  //   "System.TeamProject",
  //   "System.WorkItemType",
  //   "System.State",
  //   "System.AssignedTo",
  //   "System.IterationPath",
  // ]).map((e) => e as string);

  // useEffect(() => {
  //   register("System.TeamProject", { required: true });
  //   register("System.WorkItemType", { required: true });
  // }, [register]);

  // const { theme } = useDeskproAppTheme();
  // const deskproData = useDeskpro();

  // const projectList = useQueryWithClient(
  //   ["projectList", deskproData],
  //   (client) => getProjectList(client, deskproData?.settings || {}),
  //   {
  //     enabled: !!deskproData,
  //     ...defaultInitialData,
  //   }
  // );

  // const specificProject = useQueryWithClient(
  //   ["specificProject", deskproData, project],
  //   (client) => getProjectById(client, deskproData?.settings || {}, project),
  //   {
  //     enabled: !!deskproData && !!project,
  //     ...defaultInitialData,
  //   }
  // );

  // const userList = useQueryWithClient(
  //   ["userList", deskproData],
  //   (client) => getUsersList(client, deskproData?.settings || {}),
  //   {
  //     enabled: !!deskproData,
  //     ...defaultInitialData,
  //   }
  // );

  // const processesList = useQueryWithClient(
  //   ["processesList", deskproData],
  //   (client) => getProcessList(client, deskproData?.settings || {}),
  //   { enabled: !!deskproData, ...defaultInitialData }
  // );

  // const process = processesList?.data?.value?.find(
  //   (process) =>
  //     process.name ===
  //     specificProject.data.value.find(
  //       (project: { name: string; value: string }) =>
  //         project.name === "System.Process Template"
  //     )?.value
  // );

  // const workItemTypeList = useQueryWithClient(
  //   ["workItemTypeList", deskproData, process?.id],
  //   (client) =>
  //     getWorkItemTypes(
  //       client,
  //       deskproData?.settings || {},
  //       process?.id as unknown as string
  //     ),
  //   {
  //     enabled: !!deskproData && !!process?.id,
  //     ...defaultInitialData,
  //   }
  // );

  // const workItemFields =
  //   workItemFieldsObj?.[process?.name as "Agile" | "Scrum" | "Basic"]?.[
  //     workItemTypeList?.data?.value?.find(
  //       (workItemType) => workItemType.name === workItem?.split(".").at(-1)
  //     )?.name as "Task"
  //   ];

  // const iterationList = useQueryWithClient(
  //   ["iterationList", deskproData, project],
  //   (client) => getIterationList(client, deskproData?.settings || {}, project),
  //   {
  //     enabled: !!deskproData && !!project,
  //     ...defaultInitialData,
  //   }
  // );

  // const workItemTypeStateList = useQueryWithClient(
  //   ["workItemTypeStateList", deskproData, process?.id, workItem],
  //   (client) =>
  //     getWorkItemTypeStates(
  //       client,
  //       deskproData?.settings || {},
  //       process?.id as unknown as string,
  //       workItem as string
  //     ),
  //   {
  //     enabled: !!deskproData && !!workItem && !!process?.id,
  //     ...defaultInitialData,
  //   }
  // );

  // const submit = (data: IAzureWorkItemPost) => {
  //   data;
  // };

  // if (projectList.isLoading || !projectList.isSuccess) {
  //   return (
  //     <Stack justify="center" style={{ width: "100%" }}>
  //       <LoadingSpinner />
  //     </Stack>
  //   );
  // }
  // console.log(workItemTypeList);
  // return (
  //   <form style={{ width: "100%" }} onSubmit={handleSubmit(submit)}>
  //     <Stack vertical style={{ width: "100%" }} gap={12}>
  //       <Dropdown
  //         title="Project"
  //         data={(projectList.data as IAzureResponse<IAzureProject>).value}
  //         value={project}
  //         required
  //         onChange={(e) => setValue("System.TeamProject", e)}
  //         error={false}
  //         keyName="id"
  //         valueName="name"
  //       />
  //       {!workItemTypeList.isSuccess && !workItemTypeList.isLoading ? (
  //         <div></div>
  //       ) : !workItemTypeList.isSuccess && workItemTypeList.isLoading ? (
  //         <Stack justify="center" style={{ width: "100%" }}>
  //           <LoadingSpinner />
  //         </Stack>
  //       ) : (
  //         <Stack vertical style={{ width: "100%" }} gap={12}>
  //           <Dropdown
  //             title="Work item" //epic, bug, issue etc..
  //             data={
  //               (workItemTypeList.data as IAzureResponse<IAzureWorkItemType>)
  //                 .value
  //             }
  //             value={workItem}
  //             required
  //             onChange={(e) => setValue("System.WorkItemType", e)}
  //             error={false}
  //             keyName="id"
  //             valueName="name"
  //           />
  //           <RequiredInput
  //             title="Title"
  //             required
  //             error={Boolean(errors?.["System.Title"])}
  //             register={register("System.Title", { required: true })}
  //           ></RequiredInput>
  //           <Dropdown
  //             title="Assignee"
  //             data={(userList.data as IAzureResponse<IAzureUser>).value}
  //             value={user}
  //             onChange={(e) => setValue("System.AssignedTo", e)}
  //             error={false}
  //             keyName="descriptor"
  //             valueName="displayName"
  //           />
  //           <Dropdown
  //             title="State"
  //             data={workItemTypeStateList.data.value}
  //             value={workItemTypeState}
  //             onChange={(e) => setValue("System.State", e)}
  //             error={false}
  //             keyName="id"
  //             valueName="name"
  //           />
  //           <Dropdown
  //             title="Area"
  //             data={[]}
  //             value={""}
  //             onChange={() => {}}
  //             error={false}
  //             keyName="id"
  //             valueName="name"
  //           />
  //           <RequiredInput
  //             error={Boolean(errors?.["System.Reason"])}
  //             title="Reason"
  //             register={register("System.Reason")}
  //           ></RequiredInput>
  //           <Dropdown
  //             title="Iteration"
  //             data={
  //               (iterationList.data as IAzureResponse<IAzureIteration>).value
  //             }
  //             value={iteration}
  //             onChange={(e) => setValue("System.IterationPath", e)}
  //             error={false}
  //             keyName="id"
  //             valueName="name"
  //           />
  //           <RequiredInput
  //             error={Boolean(errors?.["Microsoft.VSTS.TCM.ReproSteps"])}
  //             title="Repro Steps"
  //             register={register("Microsoft.VSTS.TCM.ReproSteps")}
  //           ></RequiredInput>
  //           <RequiredInput
  //             error={Boolean(errors?.["Microsoft.VSTS.TCM.SystemInfo"])}
  //             title="System Info"
  //             register={register("Microsoft.VSTS.TCM.SystemInfo")}
  //           ></RequiredInput>
  //           <RequiredInput
  //             error={Boolean(errors?.["Microsoft.VSTS.Scheduling.StoryPoints"])}
  //             title="Story Points"
  //             register={register("Microsoft.VSTS.Scheduling.StoryPoints")}
  //           ></RequiredInput>
  //           <Dropdown
  //             title="Priority"
  //             data={[]}
  //             value={""}
  //             onChange={() => {}}
  //             error={false}
  //             keyName="id"
  //             valueName="name"
  //           />
  //           <Dropdown
  //             title="Severity"
  //             data={[]}
  //             value={""}
  //             onChange={() => {}}
  //             error={false}
  //             keyName="id"
  //             valueName="name"
  //           />
  //           <Dropdown
  //             title="Activity"
  //             data={[]}
  //             value={""}
  //             onChange={() => {}}
  //             error={false}
  //             keyName="id"
  //             valueName="name"
  //           />
  //           {/* Need to be Datepickers */}
  //           <Dropdown
  //             title="Start Date"
  //             data={[]}
  //             value={""}
  //             onChange={() => {}}
  //             error={false}
  //             keyName="id"
  //             valueName="name"
  //           />
  //           <Dropdown
  //             title="Target Date"
  //             data={[]}
  //             value={""}
  //             onChange={() => {}}
  //             error={false}
  //             keyName="id"
  //             valueName="name"
  //           />
  //           <Dropdown
  //             title="Completed"
  //             data={[
  //               {
  //                 id: 0,
  //                 name: "No",
  //               },
  //               {
  //                 id: 1,
  //                 name: "Yes",
  //               },
  //             ]}
  //             value={""}
  //             onChange={() => {}}
  //             error={false}
  //             keyName="id"
  //             valueName="name"
  //           />
  //           <Stack vertical>
  //             <div style={{ color: theme.colors.grey80 }}>
  //               <H1>Tags</H1>
  //             </div>
  //             <LabelButton
  //               style={{ padding: "0px" }}
  //               icon={faPlus}
  //               text="Add"
  //               minimal
  //             >
  //               <LabelButtonFileInput
  //                 accept="image/jpeg, image/jpg, image/pjp, image/pjpeg"
  //                 onChange={(e) => e}
  //               />
  //             </LabelButton>
  //           </Stack>
  //           <Stack style={{ justifyContent: "space-between" }}>
  //             <Button text="Create"></Button>
  //             <Button text="Cancel" intent="secondary"></Button>
  //           </Stack>
  //         </Stack>
  //       )}
  //     </Stack>
  //   </form>
  // );
};
