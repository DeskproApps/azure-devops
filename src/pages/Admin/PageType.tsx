import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { Stack, Radio } from "@deskpro/deskpro-ui";
import { useState } from "react";

export const PageType = () => {
  const [pageType, setPageType] = useState<string | null>(null);

  useInitialisedDeskproAppClient(
    (client) => {
      if (!pageType) return;

      client.setAdminSetting(pageType);
    },
    [pageType]
  );

  return (
    <Stack gap={10}>
      <Radio
        checked={pageType === "cloud"}
        onChange={() => setPageType("cloud")}
        label="Cloud"
      />
      <Radio
        checked={pageType === "premise"}
        onChange={() => setPageType("premise")}
        label="On Premise"
      />
    </Stack>
  );
};
