import { Tag, RoundedLabelTag, Stack } from "@deskpro/deskpro-ui";
import {
  Member,
  Property,
  TwoProperties,
} from "@deskpro/app-sdk";
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
  }, [item]);
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
      useErrorBoundary: false,
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
      <TwoProperties
        leftLabel="State"
        leftText={
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
      />
      <TwoProperties
        leftLabel="Area"
        leftText={item.fields["System.AreaPath"]}
        rightLabel="Reason"
        rightText={item.fields["System.Reason"]}
      />
      {assignedTo && (
        <Property
          label="Assignee"
          text={(
            <Member
              name={assignedTo.displayName}
              {...(!avatar.data ? {} : { avatarUrl: `data:image/jpeg;base64,${avatar.data.value}` })}
            />
          )}
        />
      )}
      {item.fields["System.Tags"] && (
        <Property
          label="Tags"
          text={(
            <Stack gap={5} wrap="wrap">
              {item.fields["System.Tags"]
                ?.split("; ")
                ?.map((tag: string, k: number) => (
                  <Tag color={usedColorsTags[k]} label={tag} key={k}></Tag>
                ))}
            </Stack>
          )}
        />
      )}
    </Stack>
  );
};
