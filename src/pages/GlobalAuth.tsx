/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  H1,
  H2,
  P1,
  Stack,
  useDeskproAppTheme,
  CopyToClipboardInput,
  useInitialisedDeskproAppClient,
  useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useGlobalAuth } from "../hooks/UseGlobalAuth";
import { useReducer, useState } from "react";
import { Radio } from "@deskpro/deskpro-ui";
import { Input } from "../Components/Input";
import { Settings } from "../types";

const cloudInputs = [
  { name: "app_id", label: "Azure App Id" },
  { name: "client_secret", label: "Azure Client Secret" },
  { name: "organization", label: "Azure Organization Name" },
];

const premiseInputs = [
  { name: "account_name", label: "Azure Account Name" },
  { name: "pat_token", label: "Azure PAT Token" },
  { name: "instance_url", label: "Azure Instance URL" },
];

export const GlobalAuth = () => {
  const { theme } = useDeskproAppTheme();
  const [data, setData] = useState<Settings>({});
  const [completed, setCompleted] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  const { callbackUrl, signIn } = useGlobalAuth(setData, data);

  useDeskproAppEvents(
    {
      onAdminSettingsChange: setSettings,
    },
    []
  );

  useInitialisedDeskproAppClient(
    (client) => {
      console.log(data);
      client.setAdminSetting(JSON.stringify(data));
    },
    [data]
  );

  const testOnPremise = async () => {};
  return (
    <Stack vertical gap={10} style={{ width: "100%" }}>
      {settings?.type === "cloud" && (
        <Stack style={{ width: "100%" }} vertical gap={10}>
          {cloudInputs.map((input) => (
            <Input
              name={input.label}
              value={data[input.name as "type"]}
              onChange={(e) => setData({ ...data, [input.name]: e })}
            />
          ))}
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
      {settings?.type === "premise" && (
        <Stack style={{ width: "100%" }} vertical gap={10}>
          {premiseInputs.map((input) => (
            <Input
              name={input.label}
              value={data[input.name as "type"]}
              onChange={(e) => setData({ ...data, [input.name]: e })}
            />
          ))}
          <Button text="Test" onClick={() => {}} />
        </Stack>
      )}
    </Stack>
  );
};
