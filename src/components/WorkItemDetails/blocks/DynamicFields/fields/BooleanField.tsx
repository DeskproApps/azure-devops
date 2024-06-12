import { noop, capitalize } from "lodash";
import { Toggle } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { DynamicFieldProps } from "../../../../../types";

const BooleanField: FC<DynamicFieldProps> = ({ value }) => (
  <Toggle
    checked={Boolean(value)}
    onChange={noop}
    label={capitalize(`${Boolean(value)}`)}
  />
);

export { BooleanField };
