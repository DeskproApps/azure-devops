import {
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { Input } from "../../Components/Input";
import { Settings } from "../../types";

export const Organization = () => {
  const [organizationName, setOrganizationName] = useState<string>("");
  const [initialOrgName, setInitialOrgName] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  useDeskproAppEvents(
    {
      onAdminSettingsChange: setSettings,
    },
    []
  );

  useEffect(() => {
    if (initialOrgName != null || !settings?.organization_collection) return;

    setInitialOrgName(settings?.organization_collection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.organization_collection]);

  useEffect(() => {
    if (!initialOrgName) return;

    setOrganizationName(initialOrgName);
  }, [initialOrgName]);

  useInitialisedDeskproAppClient(
    (client) => {
      if (!organizationName) return;

      client.setAdminSetting(organizationName);
    },
    [organizationName]
  );

  if (!settings?.type) return null;

  return (
    <Input
      name="Organization/Collection Name"
      value={organizationName}
      onChange={(value) => setOrganizationName(value as string)}
    />
  );
};
