import { Stack, H1 } from "@deskpro/deskpro-ui";
import { IAzureWorkItem, IAzureWorkItemFields } from "../types/azure/workItem";
import { splitArrEvery2 } from "../utils/utils";
import { workItemFields } from "../utils/workItemFields";
import { TwoColumn } from "./TwoColumn";

type Props = {
  data: string[];
  processName: string;
  workItemTypeName: string;
  item: IAzureWorkItem;
  fieldName: string;
};

export const MultipleFields = ({
  data,
  processName,
  workItemTypeName,
  item,
  fieldName,
}: Props) => {
  return (
    <Stack vertical gap={12} style={{ width: "100%" }}>
      <H1>{fieldName}</H1>
      {splitArrEvery2(data).map((field, i) => {
        const fields = workItemFields[processName][workItemTypeName];

        let [leftText, rightText] = field.map(
          (fieldName) =>
            item.fields[
              fields.find((nameAndField) => nameAndField.name === fieldName)
                ?.field as keyof IAzureWorkItemFields
            ] as string
        );

        if (
          isNaN(Number(leftText)) &&
          new Date(leftText).toString() !== "Invalid Date"
        ) {
          leftText = new Date(leftText).toLocaleDateString("en-GB");
        }
        if (
          isNaN(Number(rightText)) &&
          new Date(rightText).toString() !== "Invalid Date"
        ) {
          rightText = new Date(rightText).toLocaleDateString("en-GB");
        }
        return (
          <TwoColumn
            key={i}
            leftLabel={field[0]}
            leftText={
              (leftText?.length > 13
                ? `${leftText.substring(0, 13)}...`
                : leftText) ?? "⠀"
            }
            rightLabel={field[1]}
            rightText={
              (rightText?.length > 13
                ? `${rightText.substring(0, 13)}...`
                : rightText) ?? "⠀"
            }
          />
        );
      })}
    </Stack>
  );
};
