import {
  H1,
  Stack,
  TextArea as TextAreaUI,
} from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  title: string;
  required?: boolean;
  register: UseFormRegisterReturn;
  type?: string;
}

const TextArea: FC<Props> = ({
  title,
  required,
  register,
}) => {
  const { theme } = useDeskproAppTheme();
  return (
    <Stack vertical style={{ width: "100%", marginTop: "5px" }}>
      <Stack>
        <div style={{ color: theme.colors.grey80 }}>
          <H1>{title}</H1>
        </div>
        {required && (
          <Stack style={{ color: "red" }}>
            <H1>⠀*</H1>
          </Stack>
        )}
      </Stack>
      <TextAreaUI
        variant="inline"
        placeholder="Enter value"
        style={{ minHeight: "100px", alignItems: "flex-start" }}
        {...register}
      />
    </Stack>
  );
};

export { TextArea };
