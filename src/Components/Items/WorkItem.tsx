import {
  Checkbox,
  HorizontalDivider,
  Stack,
  H2,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";

import { GreyTitle } from "../../styles";
import { useNavigate } from "react-router-dom";
import { ItemPersistentData } from "./ItemPersistentData";
import { IAzureWorkItem } from "../../types/azure/workItem";
import { useState } from "react";
interface Props {
  item: IAzureWorkItem;
  checkedList: number[];
  setCheckedList: (value: React.SetStateAction<number[]>) => void;
  i: number;
}

export const WorkItem = ({ item, setCheckedList, checkedList, i }: Props) => {
  const [ticketCount, setTicketCount] = useState<number | null>(null);

  const navigate = useNavigate();

  useInitialisedDeskproAppClient((client) => {
    (async () => {
      setTicketCount(
        await client.entityAssociationCountEntities(
          "linkedAzureItem",
          item.id.toString()
        )
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
      <Stack gap={5}>
        <Checkbox
          style={{ margin: "6px" }}
          checked={checkedList.includes(item.id)}
          onChange={() =>
            setCheckedList((prevValue: number[]) => {
              if (prevValue.includes(item.id)) {
                return prevValue.filter((id) => id !== item.id);
              } else {
                return [...prevValue, item.id];
              }
            })
          }
          id="option4"
          size={14}
        />
        <Stack vertical style={{ width: "100%" }} gap={12}>
          <Stack>
            <h1
              style={{
                color: "#3A8DDE",
                fontSize: "12px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/itemdetails/" + item.id)}
            >
              <b>{item.fields["System.Title"]}</b>
            </h1>
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
