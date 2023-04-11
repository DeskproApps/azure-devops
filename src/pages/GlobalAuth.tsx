import {
  Button,
  H1,
  H2,
  P1,
  Stack,
  useDeskproAppTheme,
  CopyToClipboardInput
} from "@deskpro/app-sdk";
import { useGlobalAuth } from "../hooks/UseGlobalAuth";
import { useState } from "react";

export const GlobalAuth = () => {
  const { theme } = useDeskproAppTheme();

  const [completed, setCompleted] = useState(false);

  const { callbackUrl, signIn } = useGlobalAuth();

  return (
    <Stack style={{ width: "100%" }} vertical gap={10}>
      {callbackUrl && (
        <>
          <H2 style={{ marginBottom: "5px" }}>Callback URL</H2>
          <CopyToClipboardInput value={callbackUrl}/>
          <P1
            style={{
              marginBottom: "16px",
              marginTop: "8px",
              color: theme.colors.grey80,
            }}
          >
            The callback URL will be required during Azure app setup
          </P1>
        </>
      )}
      <Button
        text="Sign In"
        onClick={async () => {
          const status = await signIn();
          setCompleted(status);
        }}
      ></Button>
      {completed && <H1>Authorization has been completed</H1>}
    </Stack>
  );
};
