import { Tag, RoundedLabelTag, LabelColors, Avatar } from "@deskpro/deskpro-ui";
import { Stack, P1 } from "@deskpro/app-sdk";

import { TwoColumn } from "../TwoColumn";
import { GreyTitle } from "../../styles";
import { useMemo } from "react";
import { IAzureWorkItem } from "../../types/azure/workItem";
import { useDeskpro } from "../../hooks/deskproContext";
import { getAvatar, getStateDefinitionList } from "../../api/api";
import { useQueryWithClient } from "../../utils/query";
import { Settings } from "../../types";

const colors: LabelColors[] = [
  {
    textColor: "#4C4F50",
    backgroundColor: "#FDF8F7",
    borderColor: "#EC6C4E",
  },
  {
    backgroundColor: "#F3F9F9",
    borderColor: "#5BB6B1",
    textColor: "#4C4F50",
  },
  {
    borderColor: "#912066",
    backgroundColor: "#F4E9F0",
    textColor: "#4C4F50",
  },
  {
    borderColor: "#F2C94C",
    backgroundColor: "#FEF9E7",
    textColor: "#4C4F50",
  },
];

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

  const avatar = useQueryWithClient(
    ["avatar", item.fields["System.AssignedTo"].descriptor],
    (client) =>
      getAvatar(
        client,
        deskproData?.settings as Settings,
        item.fields["System.AssignedTo"].descriptor
      ),
    {
      enabled: !!deskproData && !!item.fields["System.AssignedTo"].descriptor,
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
                  statusColor.data?.value
                    .find((e) => e.name === item.fields["System.State"])
                    ?.color.toUpperCase()
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
          <P1>{item.fields["System.AssignedTo"].displayName}</P1>
        </Stack>
      </Stack>
      <Stack vertical>
        <GreyTitle>Tags</GreyTitle>
        <Stack gap={5} style={{ marginTop: "2px" }}>
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
    </Stack>
  );
};
