import { isEmpty } from "lodash";
import { P5 } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { DynamicFieldProps } from "../../../../../types";

const TextField: FC<DynamicFieldProps> = ({ value }) => (
  <P5>{(!isEmpty(value) || Boolean(value)) ? value : "-"}</P5>
);

export { TextField };
