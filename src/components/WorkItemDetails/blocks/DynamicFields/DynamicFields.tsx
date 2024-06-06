import { get, map } from "lodash";
import { P, match } from "ts-pattern";
import { Property } from "@deskpro/app-sdk";
import { getRequiredFields } from "../../../../utils";
import {
  TextField,
  HtmlField,
  BooleanField,
  IdentityField,
  DateTimeField,
} from "./fields";
import type { FC } from "react";
import type {
  IAzureWorkItem,
  IAzureWorkItemFieldsData,
  IAzureWorkItemTypeFields,
} from "../../../../types/azure";

type Props = {
  workItem: IAzureWorkItem;
  fields?: IAzureWorkItemTypeFields[];
  metas?: IAzureWorkItemFieldsData[];
};

const mapFields = (meta: IAzureWorkItemFieldsData) => {
  return match(meta)
    .with({ type: "boolean" }, () => BooleanField)
    .with(P.union(
      { type: "integer" },
      { type: "double" },
    ), () => TextField)
    .with({ type: "html" }, () => HtmlField)
    .with({ type: "dateTime" }, () => DateTimeField)
    .with({ type: "string", isIdentity: true }, () => IdentityField)
    .with({ type: "string", isIdentity: false }, () => TextField)
    .otherwise(() => null);
};

const DynamicFields: FC<Props> = ({ workItem, fields, metas }) => {
  if (!Array.isArray(fields) || !Array.isArray(metas)) {
    return null;
  }

  const requiredFields = getRequiredFields(fields, metas);

  return (
    <>
      {map(requiredFields, ({ field, meta }) => {
        const Field = mapFields(meta);

        if (!Field) {
          return null;
        }

        return (
          <Property
            key={field.referenceName}
            label={field.referenceName}
            text={(
              <Field
                key={field.referenceName}
                field={field}
                meta={meta}
                value={get(workItem.fields, [field.referenceName])}
              />
            )}
          />
        );
      })}
    </>
  );
};

export { DynamicFields };
