import { DateInput } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { DynamicFieldProps } from "../../types";

const DateTimeField: FC<DynamicFieldProps> = ({ field, control }) => {
  return (
    <DateInput
      id={field.referenceName}
      error={false}
      placeholder="DD/MM/YYYY"
      value={control.field.value as Date}
      onChange={(date: Date[]) => control.field.onChange(date[0])}
    />
  );
};

export { DateTimeField };
