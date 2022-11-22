import {
  H2,
  Input,
  Stack,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { getWorkItemsByIds } from "../api/api";
import { useDeskpro } from "../hooks/deskproContext";
import { IAzureWorkItem } from "../types/azure/workItem";
import { useQueryWithClient } from "../utils/utils";
import { ItemPersistentData } from "../Components/Items/ItemPersistentData";
import { HorizontalDivider } from "../Components/HorizontalDivider";
import { GreyTitle } from "../styles";

export const Main = () => {
  const navigate = useNavigate();

  const [itemIds, setItemIds] = useState<number[]>([]);
  const [inputText, setInputText] = useState<string>("");

  const deskproUser = useDeskpro();

  useInitialisedDeskproAppClient(
    (client) => {
      if (!deskproUser) return;

      (async () => {
        client.setTitle("Home");

        const items = (
          await client
            .getEntityAssociation("linkedAzureItems", deskproUser.ticket.id)
            .list()
        )?.map((e) => Number(e));

        if (!items || items.length === 0) {
          navigate("/itemmenu");
        }

        setItemIds(items);
      })();
    },
    [deskproUser]
  );

  const tickets = useQueryWithClient<{ value: IAzureWorkItem[] }>(
    ["tickets", deskproUser, itemIds],
    (client) => getWorkItemsByIds(client, deskproUser?.settings || {}, itemIds),
    {
      enabled: !!deskproUser && itemIds.length > 0,
    }
  );

  return (
    <Stack vertical style={{ margin: "5px 8px" }}>
      <Stack gap={5} style={{ width: "100%", marginTop: "5px" }} vertical>
        <Input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          placeholder="Enter item details"
          type="text"
          leftIcon={faMagnifyingGlass}
        />
        <HorizontalDivider />
        {tickets.data?.value.map((item) => (
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
              <H2>{0}</H2>
            </Stack>
            <HorizontalDivider />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
