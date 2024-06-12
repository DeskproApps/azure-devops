import { get } from "lodash";
import { Member } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { DynamicFieldProps } from "../../../../../types";

const IdentityField: FC<DynamicFieldProps> = ({ value }) => (
  <Member name={get(value, ["displayName"]) || get(value, ["uniqueName"])}/>
);

export { IdentityField };
