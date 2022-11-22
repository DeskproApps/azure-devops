import {
  Input,
  Stack,
  useInitialisedDeskproAppClient,
  Button,
  LoadingSpinner,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import useDebounce from "../../utils/debounce";
import { Dropdown } from "../Dropdown";
import { WorkItem } from "./WorkItem";
import { useDeskpro } from "../../hooks/deskproContext";
import { getProjectList, getWorkItemsByWiql } from "../../api/api";
import { useQueryWithClient } from "../../utils/utils";
import { IAzureWorkItem } from "../../types/azure/workItem";
import { useNavigate } from "react-router-dom";

export const FindItem = () => {
  const navigate = useNavigate();
  const deskproData = useDeskpro();
  const { client } = useDeskproAppClient();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [workItemList, setWorkItemList] = useState<IAzureWorkItem[]>([]);
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const { debouncedValue } = useDebounce(inputText, 300);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Find Items");

    client.registerElement("pipedriveHomeButton", {
      type: "home_button",
      payload: {
        type: "changePage",
        page: "/",
      },
    });

    client.registerElement("pipedriveRefreshButton", {
      type: "refresh_button",
    });
  });

  const projectList = useQueryWithClient(
    ["projectList", deskproData],
    (client) => getProjectList(client, deskproData?.settings || {}),
    { enabled: !!deskproData }
  );

  const workItemListReq = useQueryWithClient(
    ["workItemList", deskproData, selectedProject],
    (client) =>
      getWorkItemsByWiql(
        client,
        deskproData?.settings || {},
        selectedProject as string
      ),
    {
      enabled: !!selectedProject && !!deskproData,
      async onSuccess(data) {
        if (!client || !deskproData) return;

        const values = await client
          .getEntityAssociation("linkedAzureItems", deskproData.ticket.id)
          .list();

        values.forEach((value) => {
          data.value.splice(
            data.value.findIndex(
              (item: IAzureWorkItem) => item.id === Number(value)
            ),
            1
          );
        });

        setWorkItemList(data.value);
      },
    }
  );

  useEffect(() => {
    setWorkItemList(
      workItemListReq?.data?.value?.filter((item: IAzureWorkItem) =>
        item.fields["System.Title"]
          .toLowerCase()
          .includes(debouncedValue.toLowerCase())
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const linkIssue = async () => {
    if (!deskproData || !client) return;

    await Promise.all(
      checkedList.map(async (id) => {
        await client
          ?.getEntityAssociation("linkedAzureItems", deskproData.ticket.id)
          .set(id.toString());

        await client
          ?.getEntityAssociation("linkedAzureItems", id.toString())
          .set(deskproData.ticket.id);
      })
    );

    navigate("/");
  };

  const checkedListLength = checkedList?.length;

  if (projectList.isLoading) {
    return (
      <Stack justify="center" style={{ width: "100%" }}>
        <LoadingSpinner />
      </Stack>
    );
  }
  console.log(workItemListReq.isLoading);
  return (
    <Stack gap={10} style={{ width: "100%" }} vertical>
      <Input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter item details"
        type="text"
        leftIcon={faMagnifyingGlass}
      />
      <Dropdown
        title="Project"
        value={selectedProject ?? ""}
        onChange={(e: string) => setSelectedProject(e)}
        keyName="name"
        valueName="name"
        data={projectList?.data?.value ?? []}
      ></Dropdown>
      <Stack
        vertical
        style={{
          width: "100%",
        }}
      >
        <Button
          onClick={linkIssue}
          disabled={checkedListLength === 0}
          text="Link Issue"
        ></Button>
      </Stack>
      {workItemListReq.isLoading ? (
        <Stack justify="center" style={{ width: "100%" }}>
          <LoadingSpinner />
        </Stack>
      ) : (
        workItemList?.length !== 0 && (
          <Stack vertical style={{ width: "100%" }}>
            {workItemList?.map((item: IAzureWorkItem, i: number) => (
              <WorkItem
                item={item}
                checkedList={checkedList}
                setCheckedList={() => setCheckedList([...checkedList, item.id])}
                key={i}
                i={i}
              />
            ))}
          </Stack>
        )
      )}
    </Stack>
  );
};
