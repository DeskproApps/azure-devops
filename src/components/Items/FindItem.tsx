import { useMemo, useState } from "react";
import {
  Search,
  LoadingSpinner,
  HorizontalDivider,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { Button, H1, Stack } from "@deskpro/deskpro-ui";
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
import { WorkItem } from "./WorkItem";
import { Container, Label } from "../common";

export const FindItem = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
  const [selectedProject, setSelectedProject] = useState<string | undefined>();
  const [hasLinkedItems, setHasLinkedItems] = useState<boolean | undefined>();
  const [workItemList, setWorkItemList] = useState<number[] | undefined>(
    undefined
  );
  const [checkedList, setCheckedList] = useState<CheckedList>({});
  const [inputText, setInputText] = useState<string>("");
  const { debouncedValue } = useDebounce(inputText, 300);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Find Items");

    client.deregisterElement("azureEditButton");
    client.deregisterElement("azurePlusButton");
    client.registerElement("azureHomeButton", {
      type: "home_button",
      payload: { type: "changePage", page: "/" },
    });
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

  const workItemsByTitleQuery = useQueryWithClient(
    ["itemsList", context, debouncedValue, selectedProject],
    (client) => getWorkItemListByTitle(
      client,
      context?.settings || {},
      debouncedValue,
      selectedProject as string
    ),
    {
      enabled: !!context && debouncedValue.length > 0 && !!selectedProject,
      onSuccess: async (data) => {
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

  const workItemsQuery = useQueryWithClient(
    ["workItems", context, selectedProject, workItemList],
    (client) =>
      getWorkItemsByIds(
        client,
        context?.settings || {},
        selectedProject as string,
        workItemList as number[]
      ),
    {
      enabled: !!context && workItemList !== undefined && !!selectedProject,
    }
  );

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

  const isLoading = useMemo(() => {
    return typeof hasLinkedItems === "undefined" ||
      workItemsQuery.isLoading ||
      workItemsByTitleQuery.isLoading ||
      (!workItemsQuery.isSuccess && workItemsByTitleQuery.isSuccess);
  }, [
    hasLinkedItems,
    workItemsQuery.isLoading,
    workItemsByTitleQuery.isLoading,
    workItemsQuery.isSuccess,
    workItemsByTitleQuery.isSuccess,
  ]);

  const workItems = workItemsQuery.data?.value ?? [];

  return (
    <>
      <Container>
        <Search
          onChange={setInputText}
          marginBottom={0}
          inputProps={{ placeholder: "Enter item details" }}
        />
        <Label label="Project" required>
          <Dropdown
            value={selectedProject ?? ""}
            onChange={setSelectedProject}
            keyName="name"
            valueName="name"
            data={projectList?.data?.value ?? []}
          />
        </Label>
        <Stack justify="space-between" style={{ marginBottom: 10 }}>
          <Button
            onClick={linkIssue}
            disabled={Object.values(checkedList ?? []).flat().length === 0}
            text="Link Item"
          />
          <Button
            disabled={Object.values(checkedList ?? []).flat().length === 0 && !hasLinkedItems}
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
          />
        </Stack>
      </Container>

      <HorizontalDivider />

      <Container>
        {isLoading ? (
          <LoadingSpinner/>
        ) : workItems?.length !== 0 ? (
            workItems?.map((item: IAzureWorkItem, i: number) => (
              <WorkItem
                item={item}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                key={i}
                i={i}
              />
            ))
        ) : (
          <H1>No Work Items Found</H1>
        )}
      </Container>
    </>
  );
};
