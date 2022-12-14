import {
  Button,
  H1,
  H2,
  Input,
  P1,
  Stack,
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
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
          <Stack
            justify="space-between"
            align="center"
            style={{ width: "100%" }}
          >
            <Input value={callbackUrl}></Input>
            <Stack style={{ marginLeft: "12px" }}>
              <CopyToClipboard text={callbackUrl}>
                <Button
                  text="Copy"
                  icon={faCopy}
                  intent="secondary"
                  style={{ padding: "14px", boxShadow: "none" }}
                />
              </CopyToClipboard>
            </Stack>
          </Stack>
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
