import { Avatar, Tag, RoundedLabelTag, LabelColors } from "@deskpro/deskpro-ui";
import { Stack, useDeskproAppTheme, P1 } from "@deskpro/app-sdk";

import { TwoColumn } from "../TwoColumn";
import { GreyTitle } from "../../styles";
import { useMemo } from "react";
import { IAzureWorkItem } from "../../types/azure/workItem";

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
  const { theme } = useDeskproAppTheme();

  const usedColors = useMemo(() => {
    return new Array(item.fields["System.Tags"]?.split("; ")?.length)
      .fill(1)
      .map(() => colors[Math.floor(Math.random() * colors?.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              item.fields["System.State"] === "New"
                ? theme.colors.green100
                : theme.colors.red100
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
          <Avatar
            size={20}
            imageUrl={item.fields["System.AssignedTo"].imageUrl}
          />
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
                <Tag color={usedColors[k]} label={tag} key={k}></Tag>
              );
            })}
        </Stack>
      </Stack>
    </Stack>
  );
};
