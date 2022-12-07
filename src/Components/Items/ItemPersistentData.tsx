import { Tag, RoundedLabelTag, Avatar } from "@deskpro/deskpro-ui";
import { Stack, P1 } from "@deskpro/app-sdk";

import { TwoColumn } from "../TwoColumn";
import { GreyTitle } from "../../styles";
import { useMemo } from "react";
import { IAzureWorkItem } from "../../types/azure/workItem";
import { useDeskpro } from "../../hooks/deskproContext";
import { getAvatar, getStateDefinitionList } from "../../api/api";
import { useQueryWithClient } from "../../utils/query";
import { Settings } from "../../types";
import { colors } from "../../utils/utils";

interface Props {
  item: IAzureWorkItem;
}

export const ItemPersistentData = ({ item }: Props) => {
  const deskproData = useDeskpro();

  const usedColorsTags = useMemo(() => {
    return new Array(item.fields["System.Tags"]?.split("; ")?.length)
      .fill(1)
      .map(() => colors[Math.floor(Math.random() * colors?.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const assignedTo = item.fields["System.AssignedTo"];

  const avatar = useQueryWithClient(
    ["avatar", assignedTo?.descriptor],
    (client) =>
      getAvatar(
        client,
        deskproData?.settings as Settings,
        assignedTo?.descriptor as string
      ),
    {
      enabled: !!deskproData && !!assignedTo,
    }
  );

  const statusColor = useQueryWithClient(
    ["avatar", item.fields["System.TeamProject"]],
    (client) =>
      getStateDefinitionList(
        client,
        deskproData?.settings as Settings,
        item.fields["System.TeamProject"],
        item.fields["System.WorkItemType"]
      ),
    {
      enabled: !!deskproData && !!item.fields,
    }
  );

  return (
    <Stack vertical style={{ width: "100%" }} gap={12}>
      <TwoColumn
        leftLabel="State"
        leftText={
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // I dont need the close icon
          <RoundedLabelTag
            key={1}
            label={item.fields["System.State"]}
            backgroundColor={
              statusColor
                ? "#" +
                  (statusColor.data?.value
                    .find((e) => e.name === item.fields["System.State"])
                    ?.color.toUpperCase() ?? "808080")
                : "#808080"
            }
            textColor="white"
          />
        }
        rightLabel="Iteration"
        rightText={item.fields["System.IterationPath"]}
      ></TwoColumn>
      <TwoColumn
        leftLabel="Area"
        leftText={item.fields["System.AreaPath"]}
        rightLabel="Reason"
        rightText={item.fields["System.Reason"]}
      ></TwoColumn>
      {assignedTo && (
        <Stack vertical>
          <GreyTitle>Assignee</GreyTitle>
          <Stack gap={5} align="center">
            {avatar.data ? (
              <img
                src={`data:image/jpeg;base64,${avatar.data.value}`}
                style={{ width: "20px", height: "20px", borderRadius: "100%" }}
              />
            ) : (
              <Avatar />
            )}
            <P1>{assignedTo.displayName}</P1>
          </Stack>
        </Stack>
      )}
      {item.fields["System.Tags"] && (
        <Stack vertical>
          <GreyTitle>Tags</GreyTitle>
          <Stack gap={5} style={{ marginTop: "2px", flexWrap: "wrap" }}>
            {item.fields["System.Tags"]
              ?.split("; ")
              ?.map((tag: string, k: number) => {
                return (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  // I dont need the close icon
                  <Tag color={usedColorsTags[k]} label={tag} key={k}></Tag>
                );
              })}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
