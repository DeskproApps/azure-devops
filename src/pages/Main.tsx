import { H2, Stack } from "@deskpro/deskpro-ui";
import {
  IDeskproClient,
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproAppTheme,
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
import { Settings } from "../types";

export const Main = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { theme } = useDeskproAppTheme();
  const [itemIds, setItemIds] = useState<number[]>([]);
  const [linkedCountArr, setLinkedCountArr] = useState<number[]>([]);
  const deskproData = useDeskpro();

  useInitialisedDeskproAppClient(
    (client) => {
      if (!deskproData) return;

      client.setTitle("Work Items");

      client.deregisterElement("azureHomeButton");

      client.deregisterElement("azureMenuButton");

      client.registerElement("azureRefreshButton", {
        type: "refresh_button",
      });

      client.registerElement("azurePlusButton", {
        type: "plus_button",
      });

      client.deregisterElement("azureEditButton");

      (async () => {
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
                `azure/items/${item.id}`
              )
            )[0].data as number;
          })
        );

        setLinkedCountArr(linkedCount);
      },
      async onError() {
        await Promise.all(
          itemIds.map(async (item) => {
            await client
              ?.getEntityAssociation(
                "linkedAzureItems",
                deskproData?.ticket.id as string
              )
              .delete(item.toString());

            await client?.setState(
              `azure/items/${item}`,
              ((
                (await client?.getState(`azure/items/${item}`)) as {
                  data: number;
                }[]
              )[0]?.data ?? 0) - 1
            );
          })
        );
        navigate("/itemmenu");
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
    <Stack vertical style={{ width: "100%" }}>
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
                settings={deskproData?.settings as Settings}
                itemId={item.id}
                projectId={item.fields["System.TeamProject"]}
              />
            </Stack>
            <ItemPersistentData item={item} />
            <Stack vertical>
              <GreyTitle theme={theme}>Deskpro Tickets</GreyTitle>
              <H2>{linkedCountArr[i]}</H2>
            </Stack>
            <HorizontalDivider />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
