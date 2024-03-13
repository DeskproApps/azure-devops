import { Checkbox, Stack, H2 } from "@deskpro/deskpro-ui";
import {
  useInitialisedDeskproAppClient,
  useDeskproAppTheme,
} from "@deskpro/app-sdk";

import { GreyTitle } from "../../styles";
import { ItemPersistentData } from "./ItemPersistentData";
import { IAzureWorkItem } from "../../types/azure/workItem";
import { useState } from "react";
import { useDeskpro } from "../../hooks/deskproContext";
import { LogoAndLinkButton } from "../LogoAndLinkButton";
import { CheckedList } from "../../types/checkedList";
import { HorizontalDivider } from "../HorizontalDivider";
import { Settings } from "../../types";
interface Props {
  item: IAzureWorkItem;
  checkedList: CheckedList;
  setCheckedList: (value: React.SetStateAction<CheckedList>) => void;
  i: number;
}

export const WorkItem = ({ item, setCheckedList, checkedList, i }: Props) => {
  const [ticketCount, setTicketCount] = useState<number | null>(null);
  const deskproData = useDeskpro();
  const { theme } = useDeskproAppTheme();

  useInitialisedDeskproAppClient((client) => {
    (async () => {
      setTicketCount(
        (await client.getState<number>(`azure/items/${item.id}`))[0]?.data ?? 0
      );
    })();
  });

  return (
    <Stack vertical style={{ width: "100%" }}>
      {i !== 0 && <HorizontalDivider />}
      <Stack gap={5} style={{ width: "100%" }}>
        <Checkbox
          style={{ margin: "10px" }}
          checked={
            checkedList[item.fields["System.TeamProject"]]?.includes(item.id) ??
            false
          }
          onChange={() =>
            setCheckedList((prevValue: CheckedList) => {
              prevValue[item.fields["System.TeamProject"]] =
                prevValue[item.fields["System.TeamProject"]] ?? [];

              const teamValue = prevValue[item.fields["System.TeamProject"]];

              if (teamValue?.includes(item.id)) {
                prevValue[item.fields["System.TeamProject"]].splice(
                  teamValue.indexOf(item.id),
                  1
                );
              } else {
                teamValue.push(item.id);
              }
              return { ...prevValue };
            })
          }
          id="option4"
          size={14}
        />
        <Stack vertical style={{ width: "100%" }} gap={12}>
          <Stack
            style={{
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <h1
              style={{
                color: "#3A8DDE",
                fontSize: "12px",
                cursor: "pointer",
              }}
              onClick={() =>
                window.open(
                  deskproData?.settings.type === "cloud"
                    ? `https://dev.azure.com/${deskproData?.settings.organization_collection}/${item.fields["System.TeamProject"]}/_workitems/edit/${item.id}/`
                    : `${deskproData?.settings.instance_url}/${deskproData?.settings.organization_collection}/${item.fields["System.TeamProject"]}/_workitems/edit/${item.id}/`
                )
              }
            >
              <b>{item.fields["System.Title"]}</b>
            </h1>
            <LogoAndLinkButton
              settings={deskproData?.settings as Settings}
              itemId={item.id}
              projectId={item.fields["System.TeamProject"]}
            />
          </Stack>
          <ItemPersistentData item={item} />
          <Stack vertical>
            <GreyTitle theme={theme}>Deskpro Tickets</GreyTitle>
            <H2>{ticketCount}</H2>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
