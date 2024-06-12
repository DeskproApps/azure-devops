import { TextArea, FieldHint } from "../../../common";
import type { FC } from "react";
import type { DynamicFieldProps } from "../../types";

const TextAreaField: FC<DynamicFieldProps> = ({ field, control }) => {
  return (
    <>
      <TextArea id={field.referenceName} {...control.field}/>
      <FieldHint>Markdown formatting is supported</FieldHint>
    </>
  );
};

export { TextAreaField };
