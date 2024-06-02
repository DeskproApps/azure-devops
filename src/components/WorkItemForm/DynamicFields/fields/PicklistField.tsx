import { map } from "lodash";
import { Select } from "@deskpro/app-sdk";
import { getOption } from "../../../../utils";
import { FieldHint } from "../../../common";
import type { FC } from "react";
import type { DynamicFieldProps } from "../../types";

const PicklistField: FC<DynamicFieldProps> = ({ field, control }) => {
  const { field: formControlField } = control;
  const options = map(field?.allowedValues, (value) => getOption(value, value));

  return (
    <>
      <Select
        id={field.referenceName}
        initValue={formControlField.value || ""}
        options={options}
        onChange={formControlField.onChange}
      />
      {Boolean(field?.helpText) && (
        <FieldHint>{field.helpText}</FieldHint>
      )}
    </>
  );
};

export { PicklistField };
