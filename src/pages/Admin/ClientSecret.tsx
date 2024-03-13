import { Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { Input } from "../../Components/Input";
import { Settings } from "../../types";

export const ClientSecret = () => {
  const [initialClientSecret, setInitialClientSecret] = useState<string | null>(
    null
  );
  const [clientSecret, setClientSecret] = useState<string>("");

  const [settings, setSettings] = useState<Settings | null>(null);

  useDeskproAppEvents(
    {
      onAdminSettingsChange: setSettings,
    },
    []
  );

  useEffect(() => {
    if (initialClientSecret != null || !settings?.client_secret) return;

    setInitialClientSecret(settings?.client_secret);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.client_secret]);

  useEffect(() => {
    if (!initialClientSecret) return;

    setClientSecret(initialClientSecret);
  }, [initialClientSecret]);

  useInitialisedDeskproAppClient(
    (client) => {
      if (!clientSecret) return;

      client.setAdminSetting(clientSecret);
    },
    [clientSecret]
  );

  if (settings?.type !== "cloud") return null;

  return (
    <Stack vertical style={{ width: "100%" }} gap={20}>
      <Input
        name="Azure Client Secret"
        value={clientSecret}
        onChange={(value) => setClientSecret(value as string)}
      />
    </Stack>
  );
};
