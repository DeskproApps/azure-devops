import { P5 } from "@deskpro/deskpro-ui";
import { format } from "../../../../../utils/date";
import type { FC } from "react";
import type { DynamicFieldProps } from "../../../../../types";

const DateTimeField: FC<DynamicFieldProps> = ({ value }) => (
  <P5>{format(value) || "-"}</P5>
);

export { DateTimeField };
