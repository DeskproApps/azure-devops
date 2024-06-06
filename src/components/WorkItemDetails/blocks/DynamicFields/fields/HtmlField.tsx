import { DPNormalize } from "../../../../common";
import type { FC } from "react";
import type { DynamicFieldProps } from "../../../../../types";

const HtmlField: FC<DynamicFieldProps> = ({ value }) => (
  <DPNormalize text={value}/>
);

export { HtmlField };
