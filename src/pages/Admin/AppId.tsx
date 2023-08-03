import {
  Stack,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { Input } from "../../Components/Input";
import { Settings } from "../../types";

export const AppId = () => {
  const [initialAppId, setInitialAppId] = useState<string | null>(null);
  const [appId, setAppId] = useState<string>("");

  const [settings, setSettings] = useState<Settings | null>(null);

  useDeskproAppEvents(
    {
      onAdminSettingsChange: setSettings,
    },
    []
  );

  useEffect(() => {
    if (initialAppId != null || !settings?.app_id) return;

    setInitialAppId(settings?.app_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.app_id]);

  useEffect(() => {
    if (!initialAppId) return;

    setAppId(initialAppId);
  }, [initialAppId]);

  useInitialisedDeskproAppClient(
    (client) => {
      if (!appId) return;

      client.setAdminSetting(appId);
    },
    [appId]
  );

  if (settings?.type !== "cloud") return null;

  return (
    <Stack vertical style={{ width: "100%" }} gap={20}>
      <Input
        name="Azure App Id"
        value={appId}
        onChange={(value) => setAppId(value as string)}
      />
    </Stack>
  );
};
