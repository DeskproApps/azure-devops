import {
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { AnyIcon, Button, H1, H2, Input, Stack } from "@deskpro/deskpro-ui";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProjectList,
  getWorkItemListByTitle,
  getWorkItemsByIds,
} from "../../api/api";
import { IAzureWorkItem } from "../../types/azure/workItem";
import { CheckedList } from "../../types/checkedList";
import useDebounce from "../../utils/debounce";
import { useQueryWithClient } from "../../utils/query";
import { Dropdown } from "../Dropdown";
import { HorizontalDivider } from "../HorizontalDivider";
import { WorkItem } from "./WorkItem";

export const FindItem = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
  const [selectedProject, setSelectedProject] = useState<string | undefined>();
  const [hasLinkedItems, setHasLinkedItems] = useState<boolean | undefined>();
  const [workItemList, setWorkItemList] = useState<number[]>([]);
  const [checkedList, setCheckedList] = useState<CheckedList>({});
  const [inputText, setInputText] = useState<string>("");
  const { debouncedValue } = useDebounce(inputText, 300);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Find Items");

    client.registerElement("azureHomeButton", {
      type: "home_button",
      payload: {
        type: "changePage",
        page: "/",
      },
    });

    client.deregisterElement("azureEditButton");

    client.registerElement("azureRefreshButton", {
      type: "refresh_button",
    });

    client.deregisterElement("azurePlusButton");
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azureHomeButton":
          navigate("/redirect");
      }
    },
  });

  const projectList = useQueryWithClient(
    ["projectList", context],
    (client) => getProjectList(client, context?.settings || {}),
    { enabled: !!context }
  );

  useQueryWithClient(
    ["itemsList", context, debouncedValue, selectedProject],
    (client) =>
      getWorkItemListByTitle(
        client,
        context?.settings || {},
        debouncedValue,
        selectedProject as string
      ),
    {
      enabled: !!context && debouncedValue.length > 0 && !!selectedProject,
      onSuccess: async (data) => {
        console.log(data);
        const values = await client
          ?.getEntityAssociation("linkedAzureItems", context?.data.ticket.id)
          .list();

        data.workItems = data.workItems.filter(
          (item) => !values?.map((e) => Number(e)).includes(item.id)
        );

        setWorkItemList(data.workItems.map((item) => item.id));
      },
    }
  );
  console.log(!!context && debouncedValue.length > 0 && !!selectedProject);
  const workItemsQuery = useQueryWithClient(
    ["workItems", context, selectedProject, workItemList],
    (client) =>
      getWorkItemsByIds(
        client,
        context?.settings || {},
        selectedProject as string,
        workItemList
      ),
    {
      enabled: !!context && workItemList.length > 0 && !!selectedProject,
    }
  );

  console.log(workItemsQuery.data);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!context) return;

      const items = await client
        .getEntityAssociation("linkedAzureItems", context.data.ticket.id)
        .list();

      if (items.length) {
        setHasLinkedItems(true);
        return;
      }
      setHasLinkedItems(false);
    },
    [context]
  );

  const linkIssue = async () => {
    if (!context || !client) return;

    await Promise.all(
      Object.keys(checkedList).map(async (projectId) => {
        return await Promise.all(
          checkedList[projectId].map(async (id) => {
            await client
              .getEntityAssociation("linkedAzureItems", context.data.ticket.id)
              .set(id.toString());

            await client.setState(
              `azure/items/${id}`,
              (((
                await client.getState(`azure/items/${id}`)
              )[0]?.data as number) ?? 0) + 1
            );
          })
        );
      })
    );
    navigate("/");
  };

  if (typeof hasLinkedItems === "undefined" || workItemsQuery.isLoading) {
    return (
      <Stack justify="center" style={{ width: "100%" }}>
        <LoadingSpinner />
      </Stack>
    );
  }

  const workItems = workItemsQuery.data?.value ?? [];

  return (
    <Stack gap={10} style={{ width: "100%", minHeight: "600px" }} vertical>
      <Input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter item details"
        type="text"
        leftIcon={faMagnifyingGlass as AnyIcon}
      />
      <Dropdown
        title={
          (
            <Stack gap={2}>
              <H2>Project</H2>
              <H1 style={{ color: "#F55F67" }}>*</H1>
            </Stack>
          ) as unknown as string
        }
        value={selectedProject ?? ""}
        onChange={(e: string) => setSelectedProject(e)}
        keyName="name"
        valueName="name"
        data={projectList?.data?.value ?? []}
      ></Dropdown>
      {workItems?.length !== 0 ? (
        <Stack vertical gap={6} style={{ width: "100%" }}>
          <Stack vertical style={{ width: "100%" }} gap={5}>
            <Stack
              style={{ width: "100%", justifyContent: "space-between" }}
              gap={5}
            >
              <Button
                onClick={linkIssue}
                disabled={Object.values(checkedList ?? []).flat().length === 0}
                text="Link Item"
              ></Button>
              <Button
                disabled={
                  Object.values(checkedList ?? []).flat().length === 0 &&
                  !hasLinkedItems
                }
                text={hasLinkedItems ? "Cancel" : "Clear"}
                intent="secondary"
                onClick={() => {
                  if (hasLinkedItems) {
                    navigate("/");
                    return;
                  }
                  setCheckedList({});
                  setInputText("");
                }}
              ></Button>
            </Stack>
            <HorizontalDivider />
          </Stack>
          {workItems?.map((item: IAzureWorkItem, i: number) => {
            return (
              <WorkItem
                item={item}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                key={i}
                i={i}
              />
            );
          })}
        </Stack>
      ) : (
        <H1>No Work Items Found</H1>
      )}
    </Stack>
  );
};
