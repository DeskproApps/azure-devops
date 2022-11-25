import { Tag, RoundedLabelTag, LabelColors, Avatar } from "@deskpro/deskpro-ui";
import { Stack, P1, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";

import { TwoColumn } from "../TwoColumn";
import { GreyTitle } from "../../styles";
import { useMemo, useState } from "react";
import { IAzureWorkItem } from "../../types/azure/workItem";
import { useDeskpro } from "../../hooks/deskproContext";
import { getAvatar, getStateDefinitionList } from "../../api/api";

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
];

interface Props {
  item: IAzureWorkItem;
}

export const ItemPersistentData = ({ item }: Props) => {
  const deskproData = useDeskpro();

  const [statusColor, setStatusColor] = useState("#808080");
  const [avatar, setAvatar] = useState<string | null>(null);

  const usedColorsTags = useMemo(() => {
    return new Array(item.fields["System.Tags"]?.split("; ")?.length)
      .fill(1)
      .map(() => colors[Math.floor(Math.random() * colors?.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInitialisedDeskproAppClient((client) => {
    (async () => {
      if (!deskproData) return;
      Promise.all([
        (async () => {
          const colorData = await getStateDefinitionList(
            client,
            deskproData.settings,
            item.fields["System.TeamProject"],
            item.fields["System.WorkItemType"]
          );

          setStatusColor(
            "#" +
              colorData?.value
                .find((e) => e.name === item.fields["System.State"])
                ?.color.toUpperCase() ?? "#808080"
          );
        })(),
        (async () => {
          const avatar = await getAvatar(
            client,
            deskproData.settings,
            item.fields["System.AssignedTo"].descriptor
          );

          setAvatar(avatar.value);
        })(),
      ]);
    })();
  });

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
            backgroundColor={statusColor}
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
          {avatar ? (
            <img
              src={`data:image/jpeg;base64,${avatar}`}
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
