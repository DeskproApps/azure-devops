import { capitalize } from "lodash";
import { Toggle } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { DynamicFieldProps } from "../../types";

const BooleanField: FC<DynamicFieldProps> = ({ control }) => {
  return (
    <Toggle
      label={capitalize(`${Boolean(control.field.value)}`)}
      checked={Boolean(control.field.value)}
      onChange={() => control.field.onChange(!control.field.value)}
    />
  );
};

export { BooleanField };
