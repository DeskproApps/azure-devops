import {
  H2,
  IDeskproClient,
  LoadingSpinner,
  Stack,
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getWorkItemListByIds } from "../api/api";
import { useDeskpro } from "../hooks/deskproContext";
import { IAzureWorkItem } from "../types/azure/workItem";
import { ItemPersistentData } from "../Components/Items/ItemPersistentData";
import { HorizontalDivider } from "../Components/HorizontalDivider";
import { GreyTitle } from "../styles";
import { useQueryWithClient } from "../utils/query";
import { IAzureArrayResponse } from "../types/azure/azure";
import { LogoAndLinkButton } from "../Components/LogoAndLinkButton";

export const Main = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const [itemIds, setItemIds] = useState<number[]>([]);
  const [linkedCountArr, setLinkedCountArr] = useState<number[]>([]);
  const deskproData = useDeskpro();

  useInitialisedDeskproAppClient(
    (client) => {
      if (!deskproData) return;

      client.setTitle("Work Items");

      client.deregisterElement("azureHomeButton");

      client.registerElement("azureRefreshButton", {
        type: "refresh_button",
      });

      client.registerElement("azurePlusButton", {
        type: "plus_button",
      });

      (async () => {
        // (
        //   await client
        //     .getEntityAssociation("linkedAzureItems", deskproData.ticket.id)
        //     .list()
        // ).forEach(async (item) => {
        //   await client
        //     .getEntityAssociation("linkedAzureItems", deskproData.ticket.id)
        //     .delete(item);
        // });
        const items = (
          await client
            .getEntityAssociation("linkedAzureItems", deskproData.ticket.id)
            .list()
        )?.map((e) => Number(e));

        if (!items || items.length === 0) {
          navigate("/itemmenu");
        }

        setItemIds(items);
      })();
    },
    [deskproData]
  );

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azurePlusButton":
          navigate("/itemmenu");
          break;
        case "azureHomeButton":
          navigate("/redirect");
      }
    },
  });

  const tickets = useQueryWithClient<IAzureArrayResponse<IAzureWorkItem[]>>(
    ["tickets", deskproData, itemIds],
    (client) =>
      getWorkItemListByIds(client, deskproData?.settings || {}, itemIds),
    {
      enabled: !!deskproData && itemIds.length > 0 && !!client,
      async onSuccess(data) {
        if (!deskproData) return;
        const linkedCount = await Promise.all(
          data.value.map(async (item) => {
            return (
              await (client as IDeskproClient).getState<number>(
                `azure/items/${item.fields["System.TeamProject"]}/${item.id}`
              )
            )[0].data as number;
          })
        );

        setLinkedCountArr(linkedCount);
      },
    }
  );

  if (itemIds.length === 0) {
    return (
      <Stack justify="center" style={{ width: "100%" }}>
        <LoadingSpinner />
      </Stack>
    );
  }

  return (
    <Stack vertical style={{ margin: "5px 8px" }}>
      <Stack gap={5} style={{ width: "100%", marginTop: "5px" }} vertical>
        {tickets.data?.value.map((item, i) => (
          <Stack vertical style={{ width: "100%" }} gap={12} key={i}>
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
                  navigate(
                    `/itemdetails?itemId=${item.id}&projectId=${item.fields["System.TeamProject"]}`
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
              <H2>{linkedCountArr[i]}</H2>
            </Stack>
            <HorizontalDivider />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
