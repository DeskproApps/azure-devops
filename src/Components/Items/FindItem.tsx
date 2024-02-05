import {
  Input,
  Stack,
  useInitialisedDeskproAppClient,
  Button,
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproAppEvents,
  AnyIcon,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import chunk from "lodash.chunk";
import useDebounce from "../../utils/debounce";
import { Dropdown } from "../Dropdown";
import { WorkItem } from "./WorkItem";
import { useDeskpro } from "../../hooks/deskproContext";
import {
  defaultRequest,
  getProjectList,
  getWorkItemListByWiql,
} from "../../api/api";
import { IAzureWorkItem } from "../../types/azure/workItem";
import { useNavigate } from "react-router-dom";
import { useQueryWithClient } from "../../utils/query";
import { HorizontalDivider } from "../HorizontalDivider";
import { CheckedList } from "../../types/checkedList";

export const FindItem = () => {
  const navigate = useNavigate();
  const deskproData = useDeskpro();
  const { client } = useDeskproAppClient();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [hasLinkedItems, setHasLinkedItems] = useState<boolean | undefined>();
  const [originalWorkItemList, setOriginalWorkItemList] = useState<
    IAzureWorkItem[]
  >([]);
  const [workItemList, setWorkItemList] = useState<IAzureWorkItem[]>([]);
  const [checkedList, setCheckedList] = useState<CheckedList>({});
  const [inputText, setInputText] = useState<string>("");
  const { debouncedValue } = useDebounce(inputText, 300);
  const [ran, setRan] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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
    ["projectList", deskproData],
    (client) => getProjectList(client, deskproData?.settings || {}),
    { enabled: !!deskproData }
  );

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproData) return;

      const items = await client
        .getEntityAssociation("linkedAzureItems", deskproData.ticket.id)
        .list();

      if (items.length) {
        setHasLinkedItems(true);
        return;
      }
      setHasLinkedItems(false);
    },
    [deskproData]
  );

  useInitialisedDeskproAppClient(
    (client) => {
      if (!deskproData) return;

      if (!ran && projectList.isSuccess) {
        (async () => {
          const workItems = await Promise.all(
            projectList.data.value.map(async (project) => {
              const itemIds = await getWorkItemListByWiql(
                client,
                deskproData?.settings || {},
                `SELECT * FROM workItems WHERE [System.TeamProject] = "${project.name}"`
              );

              const values = await client
                .getEntityAssociation("linkedAzureItems", deskproData.ticket.id)
                .list();

              itemIds.workItems = itemIds.workItems.filter(
                (item) => !values.map((e) => Number(e)).includes(item.id)
              );

              if (itemIds.workItems.length === 0) return [];

              const chunks = chunk(
                itemIds.workItems.map((wi) => wi.id),
                200
              );

              const allItems = await Promise.all(
                chunks.map(async (wiArr) => {
                  const items = await defaultRequest(
                    client,
                    `/${project.name}/_apis/wit/workitemsbatch?api-version=7.0`,
                    "POST",
                    deskproData?.settings,
                    {
                      ids: wiArr,
                    }
                  );

                  return items.value;
                })
              );
              return allItems.flat();
            })
          );
          setRan(true);
          setLoading(false);
          setOriginalWorkItemList(workItems.flat());
          setWorkItemList(workItems.flat());
        })();
      }

      setWorkItemList(
        originalWorkItemList?.filter((item) =>
          item.fields["System.Title"]
            .toLowerCase()
            .includes(debouncedValue.toLowerCase())
        ) ?? []
      );
    },
    [debouncedValue, ran, projectList.isSuccess]
  );

  const linkIssue = async () => {
    if (!deskproData || !client) return;

    await Promise.all(
      Object.keys(checkedList).map(async (projectId) => {
        return await Promise.all(
          checkedList[projectId].map(async (id) => {
            await client
              .getEntityAssociation("linkedAzureItems", deskproData.ticket.id)
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

  useEffect(() => {
    if (!selectedProject) return;

    setWorkItemList(
      originalWorkItemList.filter(
        (item) => item.fields["System.TeamProject"] === selectedProject
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  if (loading || typeof hasLinkedItems === "undefined") {
    return (
      <Stack justify="center" style={{ width: "100%" }}>
        <LoadingSpinner />
      </Stack>
    );
  }

  return (
    <Stack gap={10} style={{ width: "100%" }} vertical>
      <Input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter item details"
        type="text"
        leftIcon={faMagnifyingGlass as AnyIcon}
      />
      <Dropdown
        title="Project"
        value={selectedProject ?? ""}
        onChange={(e: string) => setSelectedProject(e)}
        keyName="name"
        valueName="name"
        data={projectList?.data?.value ?? []}
      ></Dropdown>
      {workItemList?.length !== 0 && (
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
          {workItemList?.map((item: IAzureWorkItem, i: number) => {
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
      )}
    </Stack>
  );
};
