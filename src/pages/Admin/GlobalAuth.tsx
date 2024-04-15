import {
  CopyToClipboardInput,
  useDeskproAppEvents,
  useDeskproAppTheme,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { H1, H2, P1, Stack, Button } from "@deskpro/deskpro-ui";
import { useState } from "react";
import { useGlobalAuth } from "../../hooks/UseGlobalAuth";
import { AuthTokens, Settings } from "../../types";

export const GlobalAuth = () => {
  const { theme } = useDeskproAppTheme();
  const [data, setData] = useState<AuthTokens>({});
  const [completed, setCompleted] = useState(false);
  const [settings, setSettings] = useState<Settings>({});
  const { callbackUrl, signIn } = useGlobalAuth(setData, settings);

  useDeskproAppEvents(
    {
      onAdminSettingsChange: setSettings,
    },
    []
  );

  useInitialisedDeskproAppClient(
    (client) => {
      client.setAdminSetting(JSON.stringify(data));
    },
    [data, settings]
  );

  return (
    <Stack vertical gap={10} style={{ width: "100%" }}>
      {settings?.type === "cloud" && (
        <Stack style={{ width: "100%" }} vertical gap={10}>
          {callbackUrl && (
            <>
              <H2 style={{ marginBottom: "5px" }}>Callback URL</H2>
              <CopyToClipboardInput value={callbackUrl} />
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
      )}
    </Stack>
  );
};
