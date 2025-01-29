import { H2, Stack, Input as InputSDK } from "@deskpro/deskpro-ui";
import { ChangeEvent } from "react";

export const Input = ({
  name,
  onChange,
  value,
  required,
}: {
  name: string;
  onChange: (item?: string) => void;
  value?: string;
  required?: boolean;
}) => (
  <Stack gap={4} vertical style={{ width: "100%" }}>
    <H2 style={{ marginBottom: "5px" }}>
      {name}
      {required && "*"}
    </H2>
    <InputSDK onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} value={value} />
  </Stack>
);
