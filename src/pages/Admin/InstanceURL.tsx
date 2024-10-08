import { H4, P5, Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproAppEvents,
  useDeskproAppTheme,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { Input } from "../../components/Input";
import { Settings } from "../../types";

export const InstanceURL = () => {
  const [initialInstanceUrl, setInitialInstanceUrl] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const [instanceUrl, setInstanceUrl] = useState<string>("");
  const { theme } = useDeskproAppTheme();
  const [settings, setSettings] = useState<Settings | null>(null);

  useDeskproAppEvents(
    {
      onAdminSettingsChange: setSettings,
    },
    []
  );

  useEffect(() => {
    if (initialInstanceUrl != null || !settings?.instance_url) return;

    setInitialInstanceUrl(settings?.instance_url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.instance_url]);

  useEffect(() => {
    if (!initialInstanceUrl) return;

    setInstanceUrl(initialInstanceUrl);
  }, [initialInstanceUrl]);

  useEffect(() => {
    if (!instanceUrl) {
      setError("");

      return;
    }

    /^https?:\/\/.+\..+\w$/.test(instanceUrl)
      ? setError("")
      : setError("Invalid URL");
  }, [instanceUrl]);

  useInitialisedDeskproAppClient(
    (client) => {
      if (!instanceUrl) return;

      client.setAdminSetting(instanceUrl);
    },
    [instanceUrl]
  );

  return (
    <Stack vertical style={{ width: "100%" }} gap={20}>
      <Input
        name="Azure Instance URL (only for On Prem)"
        value={instanceUrl}
        onChange={(value) => setInstanceUrl(value as string)}
      />
      {error
        ? (
          <P5 style={{ color: "red" }}>{error}</P5>
        )
        : (
          <H4 style={{ color: theme.colors.grey40 }}>
            Example: https://azure.deskpro.com
          </H4>
        )}
    </Stack>
  );
};
