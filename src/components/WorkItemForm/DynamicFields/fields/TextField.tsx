import { useMemo } from "react";
import { map, size } from "lodash";
import { Select } from "@deskpro/app-sdk";
import { getOption } from "../../../../utils";
import { Input } from "../../../common";
import type { FC } from "react";
import type { DynamicFieldProps } from "../../types";

const TextField: FC<DynamicFieldProps> = ({ control, field }) => {
  const options = useMemo(() => {
    return map(field?.allowedValues || [], (value) => getOption(value, value));
  }, [field.allowedValues]);

  return (size(options) > 0)
    ? (
      <Select
        id={field.referenceName}
        options={options}
        initValue={control.field.value || ""}
        onChange={control.field.onChange}
      />
    )
    : (
      <Input type="text" id={field.referenceName} {...control.field} />
    );
};

export { TextField };
