import {
  Checkbox,
  HorizontalDivider,
  Stack,
  H2,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";

import { GreyTitle } from "../../styles";
import { ItemPersistentData } from "./ItemPersistentData";
import { IAzureWorkItem } from "../../types/azure/workItem";
import { useState } from "react";
import { useDeskpro } from "../../hooks/deskproContext";
import { LogoAndLinkButton } from "../LogoAndLinkButton";
import { CheckedList } from "../../types/checkedList";
interface Props {
  item: IAzureWorkItem;
  checkedList: CheckedList;
  setCheckedList: (value: React.SetStateAction<CheckedList>) => void;
  i: number;
}

export const WorkItem = ({ item, setCheckedList, checkedList, i }: Props) => {
  const [ticketCount, setTicketCount] = useState<number | null>(null);
  const deskproData = useDeskpro();

  useInitialisedDeskproAppClient((client) => {
    (async () => {
      setTicketCount(
        (
          await client.getState<number>(
            `azure/items/${item.fields["System.TeamProject"]}/${item.id}`
          )
        )[0]?.data ?? 0
      );
    })();
  });

  return (
    <Stack vertical style={{ width: "100%" }}>
      {i !== 0 && (
        <HorizontalDivider
          style={{
            width: "110%",
            color: "#EFF0F0",
            marginBottom: "10px",
            marginLeft: "-10px",
          }}
        />
      )}
      <Stack gap={5} style={{ width: "100%" }}>
        <Checkbox
          style={{ margin: "6px" }}
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
                  `https://dev.azure.com/${deskproData?.settings.organization}/${item.fields["System.TeamProject"]}/_workitems/edit/${item.id}/`
                )
              }
            >
              <b>{item.fields["System.Title"]}</b>
            </h1>
            <LogoAndLinkButton
              organizationId={deskproData?.settings.organization as string}
              itemId={item.id}
              projectId={item.fields["System.TeamProject"]}
            />
          </Stack>
          <ItemPersistentData item={item} />
          <Stack vertical>
            <GreyTitle>Deskpro Tickets</GreyTitle>
            <H2>{ticketCount}</H2>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
