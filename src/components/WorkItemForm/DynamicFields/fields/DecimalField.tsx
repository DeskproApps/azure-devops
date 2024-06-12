import { Input } from "../../../common";
import type { FC } from "react";
import type { DynamicFieldProps } from "../../types";

const DecimalField: FC<DynamicFieldProps> = ({ control }) => {
  return (
    <Input type="number" {...control.field}/>
  );
};

export { DecimalField };
