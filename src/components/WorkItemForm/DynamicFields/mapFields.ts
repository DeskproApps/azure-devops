import { match, P } from "ts-pattern";
import {
  TextField,
  BooleanField,
  DateTimeField,
  DecimalField,
  IdentityField,
  PicklistField,
  TextAreaField,
} from "./fields";
import type {IAzureWorkItemFieldsData} from "../../../types/azure";

const mapFields = (meta?: IAzureWorkItemFieldsData) => {
  return match(meta)
    .with({ type: "boolean" }, () => BooleanField)
    .with({ type: "dateTime" }, () => DateTimeField)
    .with({ type: "string", isIdentity: true }, () => IdentityField)
    .with(P.union(
      { type: "double", isPicklist: false },
      { type: "integer", isPicklist: false },
    ), () => DecimalField)
    .with(P.union(
      { type: "string", isPicklist: true },
      { type: "double", isPicklist: true },
      { type: "integer", isPicklist: true },
    ), () => PicklistField)
    .with({ type: "string", isPicklist: false }, () => TextField)
    .with({ type: "html" }, () => TextAreaField)
    .otherwise(() => null);
};

export { mapFields };
