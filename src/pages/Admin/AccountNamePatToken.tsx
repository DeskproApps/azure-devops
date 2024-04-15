import { Button, H1, Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { Input } from "../../Components/Input";
import { Settings } from "../../types";
import { preInstallGetCurrentUserPremise } from "../../api/preInstallApi";

export const AccountNamePatToken = () => {
  const [accountName, setAccountName] = useState<string>("");
  const [PATToken, setPATToken] = useState<string>("");
  const [initialData, setInitialData] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  const { client } = useDeskproAppClient();

  useDeskproAppEvents(
    {
      onAdminSettingsChange: setSettings,
    },
    []
  );

  useEffect(() => {
    if (initialData != null || !settings?.account_name_pat_token) return;

    setInitialData(settings?.account_name_pat_token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.account_name_pat_token]);

  useEffect(() => {
    if (!initialData) return;

    const splitString = atob(initialData).split(":");

    setPATToken(splitString[1]);

    setAccountName(splitString[0]);
  }, [initialData]);

  useInitialisedDeskproAppClient(
    (client) => {
      if (!accountName || !PATToken) return;

      client.setAdminSetting(btoa(`${accountName}:${PATToken}`));
    },
    [accountName]
  );

  const testOnPremise = async () => {
    if (!client || !settings) return false;

    try {
      await preInstallGetCurrentUserPremise(client, settings);

      return true;
    } catch {
      return false;
    }
  };

  if (settings?.type !== "premise") return null;

  return (
    <Stack vertical style={{ width: "100%" }} gap={20}>
      <Input
        name="Account Name"
        value={accountName}
        onChange={(value) => setAccountName(value as string)}
      />
      <Input
        name="PAT Token"
        value={PATToken}
        onChange={(value) => setPATToken(value as string)}
      />
      <Stack style={{ width: "100%" }} vertical gap={10}>
        <Button
          text="Test"
          onClick={async () => {
            const status = await testOnPremise();

            setCompleted(status);
          }}
        />
        {completed && <H1>Success!</H1>}
      </Stack>
    </Stack>
  );
};
